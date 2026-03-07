import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/auth.css";
import googleIcon from "../assets/Google.png";
import facebookIcon from "../assets/Facebook.png";
import illustration from "../assets/Illustration.png";
import logo from "../assets/Logo.png";
import emailIcon from "../assets/email-icon.png";
import lockIcon from "../assets/lock-icon.png";
import eyeIcon from "../assets/eye-icon.png";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
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
    <main className="auth-layout">
      <div className="auth-shell">
        <section className="auth-hero" aria-label="Welcome section">
          <div className="auth-hero__brand">
            <img src={logo} alt="Company logo" className="auth-hero__logo" />
          </div>

          <div className="auth-hero__content">
            <div className="auth-hero__illustration-wrapper">
              <img
                src={illustration}
                alt="Welcome illustration"
                className="auth-hero__illustration"
              />
            </div>

            <div className="auth-hero__text">
              <h2 className="auth-hero__title">Welcome aboard my friend</h2>
              <p className="auth-hero__subtitle">
                just a couple of clicks and we start
              </p>
            </div>
          </div>
        </section>

        <section className="auth-panel" aria-label="Login form section">
          <div className="auth-panel__content">
            <h1 className="auth-panel__title">Log in</h1>

            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="auth-form__field">
                <span className="auth-form__icon">
                  <img src={emailIcon} alt="email icon" className="auth-form__icon-img" />
                </span>
                <input
                  className="auth-form__input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                />
              </label>

              <label className="auth-form__field">
                <span className="auth-form__icon">
                  <img src={lockIcon} alt="lock icon" className="auth-form__icon-img" />
                </span>
                <input
                  className="auth-form__input"
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-form__password-toggle"
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                  aria-label="Toggle password visibility"
                >
                  <img
                    src={eyeIcon}
                    alt="toggle password visibility"
                    className="auth-form__icon-img"
                  />                </button>
              </label>

              <div className="auth-form__forgot-password">
                <a href="#">Forgot password?</a>
              </div>

              <button className="auth-form__submit-button" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Log in"}
              </button>

              <div className="auth-form__divider">
                <span />
                <b>Or</b>
                <span />
              </div>

              <div className="auth-form__socials">
                <button
                  type="button"
                  // disabled={}
                  className="auth-form__social-button"
                  onClick={() => handleSocialLoginClick("Google")}
                >
                  <img
                    src={googleIcon}
                    alt="Google"
                    className="auth-form__social-icon"
                  />
                  Google
                </button>

                <button
                  type="button"
                  className="auth-form__social-button"
                  onClick={() => handleSocialLoginClick("Facebook")}
                >
                  <img
                    src={facebookIcon}
                    alt="Facebook"
                    className="auth-form__social-icon"
                  />
                  Facebook
                </button>
              </div>

              <div className="auth-form__footer">
                <div className="auth-form__footer-text">Have no account yet?</div>
                <Link className="auth-form__register-link" to="/register">
                  Register
                </Link>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}