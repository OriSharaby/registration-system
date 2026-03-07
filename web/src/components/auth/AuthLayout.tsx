import React from "react";

type AuthLayoutProps = {
  hero: React.ReactNode;
  children: React.ReactNode;
};

export default function AuthLayout({ hero, children }: AuthLayoutProps) {
  return (
    <main className="auth-layout">
      <div className="auth-shell">
        {hero}

        <section className="auth-panel" aria-label="Auth form section">
          <div className="auth-panel__content">{children}</div>
        </section>
      </div>
    </main>
  );
}