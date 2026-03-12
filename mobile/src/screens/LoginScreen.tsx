import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import AuthInput from "../components/auth/AuthInput";
import AuthDivider from "../components/auth/AuthDivider";
import AuthSocialButtons from "../components/auth/AuthSocialButtons";
import { AuthStackParamList } from "../navigation/AuthNavigator";
import { loginUser } from "../services/authApi";

const logo = require("../assets/images/logo.png");
const emailIcon = require("../assets/images/email-icon.png");
const lockIcon = require("../assets/images/lock-icon.png");
const googleIcon = require("../assets/images/google-icon.png");
const facebookIcon = require("../assets/images/facebook-icon.png");

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormInvalid =
    !formData.email.trim() || !formData.password.trim();



  const handleLogin = async () => {
    if (isSubmitting) return;

    if (isFormInvalid) {
      Toast.show({
        type: "error",
        text1: "Please fill in all fields",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      if (result.token) {
        await AsyncStorage.setItem("token", result.token);
      }

      if (result.user?.name) {
        await AsyncStorage.setItem("userName", result.user.name);
      }

      Toast.show({
        type: "success",
        text1: result.message || "Login successful!",
      });

      navigation.navigate("Chat");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: err?.message || "Login failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLoginClick = (provider: string) => {
    Toast.show({
      type: "info",
      text1: `${provider} login coming soon!`,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />

          <Text style={styles.title}>Log in</Text>

          <AuthInput
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, email: text }))
            }
            icon={emailIcon}
          />

          <AuthInput
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, password: text }))
            }
            icon={lockIcon}
            showPasswordToggle
            isPasswordVisible={isPasswordVisible}
            onTogglePasswordVisibility={() =>
              setIsPasswordVisible((prev) => !prev)
            }
          />

          <TouchableOpacity style={styles.forgotWrapper}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.loginButton,
              (isFormInvalid || isSubmitting) && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isFormInvalid || isSubmitting}
          >
            <Text style={styles.loginButtonText}>
              {isSubmitting ? "Logging in..." : "Log in"}
            </Text>
          </TouchableOpacity>

          <AuthDivider />

          <AuthSocialButtons
            googleIcon={googleIcon}
            facebookIcon={facebookIcon}
            onGoogleClick={() => handleSocialLoginClick("Google")}
            onFacebookClick={() => handleSocialLoginClick("Facebook")}
          />

          <Text style={styles.footerText}>Have no account yet?</Text>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 6,
  },
  container: {
    width: "100%",
    maxWidth: 300,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  logo: {
    width: 34,
    height: 34,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#4F5CCF",
    marginBottom: 16,
  },
  forgotWrapper: {
    alignSelf: "flex-end",
    marginTop: -4,
    marginBottom: 10,
  },
  forgotText: {
    fontSize: 10,
    color: "#4F5CCF",
    fontWeight: "500",
  },
  loginButton: {
    height: 34,
    borderRadius: 17,
    backgroundColor: "#3F51B5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  loginButtonDisabled: {
    backgroundColor: "#A9AFE8",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  footerText: {
    textAlign: "center",
    fontSize: 10,
    color: "#777777",
    marginBottom: 8,
    marginTop: 0,
  },
  registerButton: {
    height: 34,
    borderRadius: 17,
    borderWidth: 1.2,
    borderColor: "#4F5CCF",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  registerButtonText: {
    color: "#4F5CCF",
    fontSize: 11,
    fontWeight: "500",
  },
});