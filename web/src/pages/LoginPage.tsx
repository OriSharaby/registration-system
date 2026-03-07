import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/auth.css";

import AuthLayout from "../components/auth/AuthLayout";
import AuthHero from "../components/auth/AuthHero";
import AuthInput from "../components/auth/AuthInput";
import AuthDivider from "../components/auth/AuthDivider";
import AuthSocialButtons from "../components/auth/AuthSocialButtons";

import illustration from "../assets/Illustration.png";
import emailIcon from "../assets/email-icon.png";
import lockIcon from "../assets/lock-icon.png";

type LoginFormState = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormState>({
    email: "",
    password: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormInvalid = !formData.email.trim() || !formData.password.trim();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (isFormInvalid) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      toast.success("Login successful!");
      setTimeout(() => navigate("/register"), 700);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLoginClick = (provider: string) => {
    toast.info(`${provider} login coming soon!`);
  };


  return (
    <AuthLayout
      hero={
        <AuthHero
          title="Welcome aboard my friend"
          subtitle="just a couple of clicks and we start"
          illustration={illustration}
          illustrationAlt="Welcome illustration"
        />
      }
    >
      <h1 className="auth-panel__title">Log in</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
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
          autoComplete="current-password"
          showPasswordToggle
          isPasswordVisible={isPasswordVisible}
          onTogglePasswordVisibility={() =>
            setIsPasswordVisible((prev) => !prev)
          }
        />

        <div className="auth-form__forgot-password">
          <a href="#">Forgot password?</a>
        </div>

        <button
          type="submit"
          className="auth-form__submit-button"
          disabled={isSubmitting || isFormInvalid}
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>

        <AuthDivider />

        <AuthSocialButtons
          onGoogleClick={() => handleSocialLoginClick("Google")}
          onFacebookClick={() => handleSocialLoginClick("Facebook")}
        />

        <div className="auth-form__footer">
          <div className="auth-form__footer-text">Have no account yet?</div>
          <Link className="auth-form__register-link" to="/register">
            Register
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}