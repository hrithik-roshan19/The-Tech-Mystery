import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/LoginPage.css";
import { authService } from "../../services/auth.service";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import Navbar from "../../components/navigation/Navbar";

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.5-3.2 2.2-5 5.5-5s5 1.8 5.5 5" />
      <path d="M15.5 6.5a3 3 0 1 1 0 5.8M17 14c2.2.2 3.5 1.7 4 4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l7 3v5c0 4.7-3 7.8-7 10-4-2.2-7-5.3-7-10V6l7-3z" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 5.2A10.7 10.7 0 0 0 3 12s3.2 6 9 6a9.7 9.7 0 0 0 3.2-.5M14.1 5.5C18.3 6.6 21 12 21 12s-1 1.9-2.7 3.5" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 4h8v4c0 3-1.6 5-4 5S8 11 8 8V4z" />
      <path d="M8 6H4v2c0 2.5 1.8 4 4 4M16 6h4v2c0 2.5-1.8 4-4 4M12 13v4M8 20h8M9 17h6" />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.5-3.2 2.2-5 5.5-5s5 1.8 5.5 5" />
      <circle cx="17" cy="9" r="2.2" />
      <path d="M16 14c2.7.2 4.2 1.8 4.5 4" />
    </svg>
  );
}

function LearnIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3 9 9-5 9 5-9 5-9-5z" />
      <path d="M7 11v5c2.8 2.5 7.2 2.5 10 0v-5M21 9v6" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 20V10M12 20V5M19 20v-8" />
    </svg>
  );
}

const highlights = [
  ["trophy", "COMPETE", "Test your skills against top teams."],
  ["team", "COLLABORATE", "Work together and solve complex challenges."],
  ["learn", "LEARN", "Build real-world technical skills."],
  ["chart", "CLIMB", "Track your progress on the live leaderboard."],
];

export default function LoginPage() {
  const location = useLocation();
  const [mode, setMode] = useState(() =>
    location.pathname.startsWith("/admin") ? "admin" : "team"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError("Please provide your login credentials.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await authService.login({
        emailOrUsername: identifier.trim(),
        password
      });

      if (res?.data?.user && res?.data?.accessToken) {
        login(res.data.user, res.data.accessToken);
        if (res.data.user.role === "ADMIN") {
          navigate(ROUTES.ADMIN_DASHBOARD);
        } else {
          navigate(ROUTES.DASHBOARD);
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Access Denied: Invalid credentials or network error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="htg-login">
      <div className="htg-login-bg" />
      <div className="htg-login-overlay" />
      <div className="htg-login-grid" />

      <Navbar />

      <main className="htg-login-main">
        <section className="htg-login-intro">
          <p className="login-eyebrow">CODESPHERE CODING CLUB <span>×</span> UTKRISHT 2026</p>
          <h1>THE TECH<br /><span>MYSTERY</span></h1>
          <h2>THE ULTIMATE CAMPUS<br />CAPTURE-THE-FLAG EXPERIENCE.</h2>
          <div className="login-accent" />
          <p className="login-description">
            A team-based challenge combining cybersecurity, cryptography,
            programming, logical reasoning and creative problem solving.
          </p>

          <div className="login-stats">
            <div><UserIcon /><strong>10</strong><small>CHALLENGE<br />LEVELS</small></div>
            <div><TeamIcon /><strong>2–4</strong><small>TEAM<br />MEMBERS</small></div>
            <div>
              <svg className="stat-clock" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7v5l3 2" />
              </svg>
              <strong>90–120</strong>
              <small>MINUTES</small>
            </div>
          </div>

          <div className="login-side-copy">
            <span>PEOPLE</span><span>IDEAS</span><span>TECHNOLOGY</span><span>A STRONGER TOMORROW</span><i />
          </div>
        </section>

        <section className="htg-login-card" aria-label="The Tech Mystery login">
          <div className="login-card-heading">
            <h2>Welcome <span>Back</span></h2>
            <p>Login to continue your journey in The Tech Mystery.</p>
          </div>

          <div className="login-tabs">
            <button
              type="button"
              className={mode === "team" ? "selected" : ""}
              onClick={() => { setMode("team"); setError(""); }}
            >
              <UserIcon /> Team Login
            </button>
            <button
              type="button"
              className={mode === "admin" ? "selected" : ""}
              onClick={() => { setMode("admin"); setError(""); }}
            >
              <ShieldIcon /> Admin Login
            </button>
          </div>

          <form onSubmit={handleLoginSubmit}>
            {error && (
              <div
                style={{
                  color: "#ff6b6b",
                  background: "rgba(255, 75, 75, 0.12)",
                  border: "1px solid rgba(255, 75, 75, 0.35)",
                  borderRadius: "6px",
                  padding: "9px 12px",
                  fontSize: "13px",
                  marginBottom: "16px",
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 1.4,
                  wordBreak: "break-word"
                }}
              >
                {error}
              </div>
            )}

            <label>{mode === "team" ? "Team ID / Email" : "Admin Email"}</label>
            <div className="login-input">
              <MailIcon />
              <input
                type={mode === "team" ? "text" : "email"}
                placeholder={mode === "team" ? "Enter your team ID or email" : "Enter your admin email"}
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <label>Password</label>
            <div className="login-input">
              <LockIcon />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>

            <div className="login-options">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="fake-check" style={{ opacity: remember ? 1 : 0.25 }}>
                  {remember ? "✓" : ""}
                </span>
                Remember me
              </label>
              <a
                href="#forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Please contact the CodeSphere event coordinators or technical team to reset your team credentials.");
                }}
              >
                Forgot password?
              </a>
            </div>

            <button className="login-submit" type="submit" disabled={loading}>
              {loading ? "Authenticating..." : "Login to Dashboard"} <span>→</span>
            </button>

            <div className="login-or"><i /> <span>OR</span> <i /></div>

            <button
              type="button"
              className="google-btn"
              onClick={() => alert("Google SSO is restricted during active live competition. Please use assigned team credentials.")}
            >
              <b>G</b> Continue with Google
            </button>
          </form>

          <p className="register-prompt">
            New to The Tech Mystery? <Link to={ROUTES.REGISTER}>Register your team →</Link>
          </p>
        </section>

        <aside className="htg-login-highlights">
          {highlights.map(([icon, title, text]) => {
            const I = icon === "trophy" ? TrophyIcon : icon === "team" ? TeamIcon : icon === "learn" ? LearnIcon : ChartIcon;
            return (
              <div className="highlight" key={title}>
                <div className="highlight-icon"><I /></div>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            );
          })}
        </aside>
      </main>
    </div>
  );
}
