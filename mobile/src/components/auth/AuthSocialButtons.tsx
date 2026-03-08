import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

type AuthSocialButtonsProps = {
  onGoogleClick: () => void;
  onFacebookClick: () => void;
  googleIcon: any;
  facebookIcon: any;
};

export default function AuthSocialButtons({
  onGoogleClick,
  onFacebookClick,
  googleIcon,
  facebookIcon,
}: AuthSocialButtonsProps) {
  return (
    <View style={styles.socialRow}>
      <TouchableOpacity style={styles.socialButton} onPress={onGoogleClick}>
        <Image source={googleIcon} style={styles.socialIcon} />
        <Text style={styles.socialButtonText}>Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton} onPress={onFacebookClick}>
        <Image source={facebookIcon} style={styles.socialIcon} />
        <Text style={styles.socialButtonText}>Facebook</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  socialRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },
  socialButton: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: "#4F5CCF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  socialIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  socialButtonText: {
    color: "#4F5CCF",
    fontSize: 13,
    fontWeight: "500",
  },
});