import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/auth.css";
import { registerUser } from "../services/authApi";

import AuthLayout from "../components/auth/AuthLayout";
import AuthHero from "../components/auth/AuthHero";
import AuthInput from "../components/auth/AuthInput";
import AuthDivider from "../components/auth/AuthDivider";
import AuthSocialButtons from "../components/auth/AuthSocialButtons";

import illustration from "../assets/Illustration.png";
import emailIcon from "../assets/email-icon.png";
import lockIcon from "../assets/lock-icon.png";
import userIcon from "../assets/user-icon.png";


type RegisterFormState = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterFormState>({
    name: "",
    email: "",
    password: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormInvalid =
    !formData.name.trim() ||
    !formData.email.trim() ||
    !formData.password.trim();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (isFormInvalid) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      toast.success(result.toast || result.message || "Registration successful!");
      navigate("/login");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLoginClick = (provider: string) => {
    toast.info(`${provider} signup coming soon!`);
  };


  return (
    <AuthLayout
      hero={
        <AuthHero
          title="Create your account"
          subtitle="just a few details and you are ready to go"
          illustration={illustration}
          illustrationAlt="Register illustration"
        />
      }
    >
      <h1 className="auth-panel__title">Register</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthInput
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          icon={userIcon}
          iconAlt="name icon"
          autoComplete="name"
        />

        <AuthInput
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          icon={emailIcon}
          iconAlt="email icon"
          autoComplete="email"
        />

        <AuthInput
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          icon={lockIcon}
          iconAlt="lock icon"
          autoComplete="new-password"
          showPasswordToggle
          isPasswordVisible={isPasswordVisible}
          onTogglePasswordVisibility={() =>
            setIsPasswordVisible((prev) => !prev)
          }
        />

        <button
          type="submit"
          className="auth-form__submit-button"
          disabled={isSubmitting || isFormInvalid}
        >
          {isSubmitting ? "Creating account..." : "Register"}
        </button>

        <AuthDivider />

        <AuthSocialButtons
          onGoogleClick={() => handleSocialLoginClick("Google")}
          onFacebookClick={() => handleSocialLoginClick("Facebook")}
        />

        <div className="auth-form__footer">
          <div className="auth-form__footer-text">Already have an account?</div>
          <Link className="auth-form__register-link" to="/login">
            Log in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}