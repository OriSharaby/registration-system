import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";
import "../styles/auth.css";
import { FcGoogle } from "react-icons/fc";

type LoginState = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const navigate = useNavigate();

  const [data, setData] = useState<LoginState>({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setBusy(true);
    try {
      // TODO: פה נחבר את ה-API שלך
      toast.success("Login successful!");
      setTimeout(() => navigate("/register"), 700); // סתם דוגמה לניווט
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const social = (provider: string) => {
    toast.info(`${provider} login coming soon!`);
  };

  return (
    <div className="authPage">
      <div className="authCard">
        {/* LEFT */}
        <section className="authLeft">
          <div className="brand">
            <div className="brandBox">S</div>
          </div>

          <div className="leftCenter">
            {/* כרגע placeholder לאיור. בהמשך נחבר תמונה מה-assets */}
            <div className="illuFrame">
              <div className="illuCircle" />
            </div>
          </div>

          <div className="leftText">
            <h2>Welcome aboard my friend</h2>
            <p>just a couple of clicks and we start</p>
          </div>
        </section>

        {/* RIGHT */}
        <section className="authRight">
          <div className="rightInner">
            <h1 className="title">Log in</h1>

            <form className="form" onSubmit={onSubmit}>
              <label className="field">
                <span className="icon">
                  <FaEnvelope />
                </span>
                <input
                  className="input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={data.email}
                  onChange={onChange}
                  autoComplete="email"
                />
              </label>

              <label className="field">
                <span className="icon">
                  <FaLock />
                </span>
                <input
                  className="input"
                  type={show ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={data.password}
                  onChange={onChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="eye"
                  onClick={() => setShow((v) => !v)}
                  aria-label="Toggle password"
                >
                  {show ? <FaEyeSlash /> : <FaEye />}
                </button>
              </label>

              <div className="forgot">
                <a href="#">Forgot password?</a>
              </div>

              <button className="primary" disabled={busy}>
                {busy ? "Logging in..." : "Log in"}
              </button>

              <div className="divider">
                <span />
                <b>Or</b>
                <span />
              </div>

              <div className="socialRow">
                <button
                  type="button"
                  className="social"
                  onClick={() => social("Google")}
                >
                  <FcGoogle size={18} />
                  Google
                </button>
                <button
                  type="button"
                  className="social"
                  onClick={() => social("Facebook")}
                >
                  <FaFacebook size={18} color="#1877F2" />
                  Facebook
                </button>
              </div>

              <div className="bottom">
                <div className="muted">Have no account yet?</div>
                <Link className="secondary" to="/register">
                  Register
                </Link>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}