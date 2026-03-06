import { Link } from "react-router-dom";
import "../styles/auth.css";

export default function RegisterPage() {
  return (
    <div className="authPage">
      <div className="simpleCard">
        <h1>Register</h1>
        <p>Placeholder page. We’ll build it next.</p>
        <Link to="/login">Back to login</Link>
      </div>
    </div>
  );
}