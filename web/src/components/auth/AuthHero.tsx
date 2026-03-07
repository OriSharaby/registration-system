import logo from "../../assets/Logo.png";

type AuthHeroProps = {
  title: string;
  subtitle: string;
  illustration: string;
  illustrationAlt?: string;
};

export default function AuthHero({
  title,
  subtitle,
  illustration,
  illustrationAlt = "Illustration",
}: AuthHeroProps) {
  return (
    <section className="auth-hero" aria-label="Welcome section">
      <div className="auth-hero__brand">
        <img src={logo} alt="Company logo" className="auth-hero__logo" />
      </div>

      <div className="auth-hero__content">
        <div className="auth-hero__illustration-wrapper">
          <img
            src={illustration}
            alt={illustrationAlt}
            className="auth-hero__illustration"
          />
        </div>

        <div className="auth-hero__text">
          <h2 className="auth-hero__title">{title}</h2>
          <p className="auth-hero__subtitle">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}