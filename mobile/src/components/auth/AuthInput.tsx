import React, { useState } from "react";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const eyeIcon = require("../../assets/images/eye-icon.png");

type AuthInputProps = {
  type?: "text" | "email" | "password";
  name: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: any;
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  onTogglePasswordVisibility?: () => void;
  disabled?: boolean;
};

export default function AuthInput({
  type = "text",
  placeholder,
  value,
  onChangeText,
  icon,
  showPasswordToggle = false,
  isPasswordVisible = false,
  onTogglePasswordVisibility,
  disabled = false,
}: AuthInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const secureTextEntry = type === "password" ? !isPasswordVisible : false;

  const fieldStyles = [
    styles.field,
    isFocused && styles.fieldFocused,
    disabled && styles.fieldDisabled,
  ];

  const inputStyles = [
    styles.input,
    disabled && styles.inputDisabled,
  ];

  const iconStyles = [
    styles.icon,
    disabled && styles.iconDisabled,
  ];

  return (
    <View style={fieldStyles}>
      <Image source={icon} style={iconStyles} />

      <TextInput
        style={inputStyles}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={disabled ? "#C5C5C5" : "#9A9A9A"}
        editable={!disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {showPasswordToggle && (
        <TouchableOpacity
          onPress={onTogglePasswordVisibility}
          style={styles.passwordToggle}
          disabled={disabled}
        >
          <Image source={eyeIcon} style={iconStyles} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 32,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
  },
  fieldFocused: {
    borderColor: "#6A78E6",
    shadowColor: "#6A78E6",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 1,
  },
  fieldDisabled: {
    backgroundColor: "#F7F7F7",
    borderColor: "#E6E6E6",
  },
  icon: {
    width: 12,
    height: 12,
    tintColor: "#8E8E8E",
  },
  iconDisabled: {
    tintColor: "#C5C5C5",
  },
  input: {
    flex: 1,
    fontSize: 10,
    marginLeft: 8,
    color: "#333333",
    paddingVertical: 0,
  },
  inputDisabled: {
    color: "#C5C5C5",
  },
  passwordToggle: {
    marginLeft: 8,
  },
});