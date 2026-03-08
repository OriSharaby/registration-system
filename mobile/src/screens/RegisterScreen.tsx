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
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import AuthInput from "../components/auth/AuthInput";
import AuthDivider from "../components/auth/AuthDivider";
import AuthSocialButtons from "../components/auth/AuthSocialButtons";
import { AuthStackParamList } from "../navigation/AuthNavigator";
import { registerUser } from "../services/authApi";

const logo = require("../assets/images/logo.png");
const userIcon = require("../assets/images/user-icon.png");
const emailIcon = require("../assets/images/email-icon.png");
const lockIcon = require("../assets/images/lock-icon.png");
const googleIcon = require("../assets/images/google-icon.png");
const facebookIcon = require("../assets/images/facebook-icon.png");

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormInvalid =
    !formData.name.trim() ||
    !formData.email.trim() ||
    !formData.password.trim();

  const handleSubmit = async () => {
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
      const result = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      Toast.show({
        type: "success",
        text1: result.toast || result.message || "Registration successful!",
      });

      navigation.navigate("Login");

    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Registration failed";

      Toast.show({
        type: "error",
        text1: message,
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialRegisterClick = (provider: string) => {
    Toast.show({
      type: "info",
      text1: `${provider} signup coming soon!`,
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

          <Text style={styles.title}>Register</Text>

          <AuthInput
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, name: text }))
            }
            icon={userIcon}
          />

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

          <TouchableOpacity
            style={[
              styles.registerButton,
              (isFormInvalid || isSubmitting) && styles.registerButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isFormInvalid || isSubmitting}
          >
            <Text style={styles.registerButtonText}>
              {isSubmitting ? "Creating account..." : "Register"}
            </Text>
          </TouchableOpacity>

          <AuthDivider />

          <AuthSocialButtons
            googleIcon={googleIcon}
            facebookIcon={facebookIcon}
            onGoogleClick={() => handleSocialRegisterClick("Google")}
            onFacebookClick={() => handleSocialRegisterClick("Facebook")}
          />

          <Text style={styles.footerText}>Already have an account?</Text>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginButtonText}>Log in</Text>
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
  registerButton: {
    height: 34,
    borderRadius: 17,
    backgroundColor: "#3F51B5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  registerButtonDisabled: {
    backgroundColor: "#A9AFE8",
  },
  registerButtonText: {
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
  loginButton: {
    height: 34,
    borderRadius: 17,
    borderWidth: 1.2,
    borderColor: "#4F5CCF",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loginButtonText: {
    color: "#4F5CCF",
    fontSize: 11,
    fontWeight: "500",
  },
});