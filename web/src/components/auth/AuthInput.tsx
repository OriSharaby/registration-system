import React from "react";
import eyeIcon from "../../assets/eye-icon.png";

type AuthInputProps = {
  type?: "text" | "email" | "password";
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: string;
  iconAlt: string;
  autoComplete?: string;
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  onTogglePasswordVisibility?: () => void;
};

export default function AuthInput({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  icon,
  iconAlt,
  autoComplete,
  showPasswordToggle = false,
  isPasswordVisible = false,
  onTogglePasswordVisibility,
}: AuthInputProps) {
  const resolvedType =
    type === "password"
      ? isPasswordVisible
        ? "text"
        : "password"
      : type;

  return (
    <label className="auth-form__field">
      <span className="auth-form__icon">
        <img src={icon} alt={iconAlt} className="auth-form__icon-img" />
      </span>

      <input
        className="auth-form__input"
        type={resolvedType}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
      />

      {showPasswordToggle && (
        <button
          type="button"
          className="auth-form__password-toggle"
          onClick={onTogglePasswordVisibility}
          aria-label="Toggle password visibility"
        >
          <img
            src={eyeIcon}
            alt="Toggle password visibility"
            className="auth-form__icon-img"
          />
        </button>
      )}
    </label>
  );
}