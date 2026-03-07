import googleIcon from "../../assets/Google.png";
import facebookIcon from "../../assets/Facebook.png";

type AuthSocialButtonsProps = {
  onGoogleClick: () => void;
  onFacebookClick: () => void;
};

export default function AuthSocialButtons({
  onGoogleClick,
  onFacebookClick,
}: AuthSocialButtonsProps) {
  return (
    <div className="auth-form__socials">
      <button
        type="button"
        className="auth-form__social-button"
        onClick={onGoogleClick}
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
        onClick={onFacebookClick}
      >
        <img
          src={facebookIcon}
          alt="Facebook"
          className="auth-form__social-icon"
        />
        Facebook
      </button>
    </div>
  );
}