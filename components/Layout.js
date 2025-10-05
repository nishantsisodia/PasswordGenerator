"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("theme") || "light"
      : "light"
  );

  useEffect(() => {
    async function me() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setUser(data.user);
      } catch (e) {
        setUser(null);
      }
    }
    me();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  async function logout() {
    await fetch("/api/auth/logout");
    setUser(null);
    // reload to clear any state
    window.location.href = "/";
  }

  return (
    <div className="app">
      <header className="header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Logo />
        </div>
        <nav className="nav">
          {user ? (
            <>
              <Link href="/">Home</Link>
              <Link href="/vault">Vault</Link>
              <button className="btn ghost" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/signup">Sign up</Link>
              <Link href="/login">Login</Link>
            </>
          )}
          <button
            className="btn"
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </nav>
      </header>
      <main className="container">{children}</main>
      <footer className="footer">
        Built for assignment — client-side encryption
      </footer>
    </div>
  );
}
