import React, { useState } from 'react';
import { SignIn, SignUp } from '@clerk/react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../../components/navigation/Navbar';
import { PageTransition } from '../../components/common/Motion';
import { fadeInUpVariants, staggerContainer, staggerItemVariants } from '../../utils/motion';
import LegacyLogin from '../public/LoginPage';
import LegacyRegister from '../public/RegisterPage';
import api from '../../services/api';
import '../../styles/LoginPage.css';
import '../../styles/ClerkAuth.css';

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.5-3.2 2.2-5 5.5-5s5 1.8 5.5 5" />
      <path d="M15.5 6.5a3 3 0 1 1 0 5.8M17 14c2.2.2 3.5 1.7 4 4" />
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

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 4h8v4c0 3-1.6 5-4 5S8 11 8 8V4z" />
      <path d="M8 6H4v2c0 2.5 1.8 4 4 4M16 6h4v2c0 2.5-1.8 4-4 4M12 13v4M8 20h8M9 17h6" />
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

const clerkAppearance = {
  layout: {
    socialButtonsPlacement: 'top',
    socialButtonsVariant: 'blockButton',
    logoPlacement: 'none',
  },
  variables: {
    colorPrimary: '#b8ff3d',
    colorBackground: 'transparent',
    colorText: '#f5f5f0',
    colorTextSecondary: '#b2b7b3',
    colorInputBackground: 'rgba(0, 0, 0, 0.3)',
    colorInputText: '#ffffff',
    colorTextOnPrimaryBackground: '#090c08',
    colorDanger: '#ff6b6b',
    borderRadius: '8px',
    fontFamily: 'Inter, sans-serif',
    fontFamilyButtons: 'Inter, sans-serif',
  },
  elements: {
    rootBox: 'htg-clerk-root',
    cardBox: 'htg-clerk-card-box',
    card: 'htg-clerk-card',
    header: 'htg-clerk-header',
    headerTitle: 'htg-clerk-header-title',
    headerSubtitle: 'htg-clerk-header-subtitle',
    socialButtonsBlockButton: 'htg-clerk-social-btn',
    socialButtonsBlockButtonText: 'htg-clerk-social-btn-text',
    dividerRow: 'htg-clerk-divider-row',
    dividerLine: 'htg-clerk-divider-line',
    dividerText: 'htg-clerk-divider-text',
    formFieldLabel: 'htg-clerk-label',
    formFieldInput: 'htg-clerk-input',
    formFieldAction: 'htg-clerk-field-action',
    formButtonPrimary: 'htg-clerk-primary-btn',
    footer: 'htg-clerk-footer',
    footerAction: 'htg-clerk-footer-action',
    footerActionText: 'htg-clerk-footer-text',
    footerActionLink: 'htg-clerk-footer-link',
    identityPreview: 'htg-clerk-identity-preview',
    identityPreviewText: 'htg-clerk-identity-text',
    identityPreviewEditButton: 'htg-clerk-identity-edit',
    formFieldSuccessText: 'htg-clerk-success-text',
    formFieldErrorText: 'htg-clerk-error-text',
    alert: 'htg-clerk-alert',
    alertText: 'htg-clerk-alert-text',
  }
};

function IdentityPage({ register = false }) {
  const { identityAuthenticated } = useAuth();
  const location = useLocation();

  if (identityAuthenticated) return <Navigate to="/auth/complete" state={location.state} replace />;

  // Keep the protected destination across Clerk's authentication redirect.
  const from = location.state?.from?.pathname;
  if (from?.startsWith('/') && !from.startsWith('//')) sessionStorage.setItem('htg_auth_return', from);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <PageTransition className="htg-login">
      <div className="htg-login-bg" />
      <div className="htg-login-overlay" />
      <div className="htg-login-grid" />

      <Navbar />

      <main className="htg-login-main">
        {/* Left Section: Welcome & Branding */}
        <motion.section
          className="htg-login-intro"
          variants={fadeInUpVariants}
          initial="initial"
          animate="animate"
        >
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
              <svg className="stat-clock" viewBox="0 0 24 24" aria-hidden="true">
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
        </motion.section>

        {/* Center Section: Glass Card with Clerk Auth */}
        <motion.section
          className="htg-login-card htg-clerk-card-container"
          aria-label="The Tech Mystery authentication"
          variants={fadeInUpVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.35, delay: 0.08 }}
        >
          <div className="login-card-heading">
            <span className="htg-auth-badge">
              {isAdminRoute ? 'ADMIN SOC ACCESS' : register ? 'OPERATIVE REGISTRATION' : 'OPERATIVE ACCESS'}
            </span>
            <h2>
              {isAdminRoute ? (
                <>Admin <span>Access</span></>
              ) : register ? (
                <>Join <span>The Tech Mystery</span></>
              ) : (
                <>Welcome <span>Back</span></>
              )}
            </h2>
            <p>
              {isAdminRoute
                ? 'Authorized organizers sign in to access The Tech Mystery SOC.'
                : register
                ? 'Register your operative credentials to enter the competition.'
                : 'Sign in to continue your journey in The Tech Mystery.'}
            </p>
          </div>

          {register ? (
            <SignUp routing="hash" appearance={clerkAppearance} />
          ) : (
            <SignIn routing="hash" appearance={clerkAppearance} />
          )}
        </motion.section>

        {/* Right Section: Event Highlights */}
        <motion.aside
          className="htg-login-highlights"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {highlights.map(([icon, title, text]) => {
            const I = icon === "trophy" ? TrophyIcon : icon === "team" ? TeamIcon : icon === "learn" ? LearnIcon : ChartIcon;
            return (
              <motion.div
                className="highlight"
                key={title}
                variants={staggerItemVariants}
                whileHover={{ x: 4, transition: { duration: 0.18 } }}
              >
                <div className="highlight-icon"><I /></div>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.aside>
      </main>
    </PageTransition>
  );
}

export function LoginPage() {
  return import.meta.env.VITE_AUTH_PROVIDER === 'clerk' ? <IdentityPage /> : <LegacyLogin />;
}

export function RegisterPage() {
  return import.meta.env.VITE_AUTH_PROVIDER === 'clerk' ? <IdentityPage register /> : <LegacyRegister />;
}

export function AuthCompletePage() {
  const location = useLocation();
  const { loading, identityAuthenticated, user, authError, refreshUser, logout } = useAuth();
  const [mode, setMode] = useState('link');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (loading) {
    return (
      <PageTransition className="htg-login">
        <div className="htg-login-bg" />
        <div className="htg-login-overlay" />
        <div className="htg-login-grid" />
        <Navbar />
        <main className="htg-login-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="htg-login-card" style={{ textAlign: 'center' }}>
            <div className="htg-auth-loading">
              <div className="htg-auth-spinner" />
              <span>Verifying application account…</span>
            </div>
          </div>
        </main>
      </PageTransition>
    );
  }

  if (!identityAuthenticated) return <Navigate to="/login" replace />;

  if (user) {
    const stored = location.state?.from?.pathname || sessionStorage.getItem('htg_auth_return');
    sessionStorage.removeItem('htg_auth_return');
    const destination = stored?.startsWith('/') && !stored.startsWith('//') && !stored.startsWith('/auth/')
      ? stored : user.role === 'ADMIN' ? '/admin/dashboard' : '/portal/dashboard';
    return <Navigate to={destination} replace />;
  }

  const submit = async event => {
    event.preventDefault();
    setBusy(true);
    setError('');
    const data = Object.fromEntries(new FormData(event.currentTarget));
    event.currentTarget.reset();
    try {
      await api.post(`/auth/clerk/${mode}`, data);
      await refreshUser();
    } catch (failure) {
      setError(failure.response?.data?.message || 'Account operation unavailable. Contact an organizer.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageTransition className="htg-login">
      <div className="htg-login-bg" />
      <div className="htg-login-overlay" />
      <div className="htg-login-grid" />
      <Navbar />
      <main className="htg-login-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="htg-login-card" style={{ maxWidth: 540 }}>
          <div className="login-card-heading">
            <span className="htg-auth-badge">IDENTITY SYNCHRONIZATION</span>
            <h2>Complete <span>Account</span></h2>
            <p>Link your operative identity to your The Tech Mystery profile.</p>
          </div>

          {authError === 'CLERK_ACCOUNT_UNLINKED' ? (
            <>
              <p style={{ color: '#c0c5c1', fontSize: '13.5px', lineHeight: 1.5, marginBottom: '20px' }}>
                Link your existing account to preserve your team and history. New participants can register only when event registration is open.
              </p>
              <div className="login-tabs" style={{ marginBottom: '20px' }}>
                <button
                  type="button"
                  className={mode === 'link' ? 'selected' : ''}
                  onClick={() => setMode('link')}
                >
                  Link existing account
                </button>
                <button
                  type="button"
                  className={mode === 'register' ? 'selected' : ''}
                  onClick={() => setMode('register')}
                >
                  New participant
                </button>
              </div>
              <form onSubmit={submit}>
                {mode === 'link' ? (
                  <>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13.5px', fontWeight: 600 }}>
                      Existing email or username
                      <div className="login-input" style={{ marginTop: '6px' }}>
                        <input name="emailOrUsername" autoComplete="username" required placeholder="Enter existing email or username" />
                      </div>
                    </label>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13.5px', fontWeight: 600 }}>
                      Existing password
                      <div className="login-input" style={{ marginTop: '6px' }}>
                        <input name="password" type="password" autoComplete="current-password" required maxLength={256} placeholder="Enter existing password" />
                      </div>
                    </label>
                  </>
                ) : (
                  <>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13.5px', fontWeight: 600 }}>
                      Username
                      <div className="login-input" style={{ marginTop: '6px' }}>
                        <input name="username" pattern="[A-Za-z0-9_-]{3,30}" required placeholder="Choose handle (3-30 chars)" />
                      </div>
                    </label>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13.5px', fontWeight: 600 }}>
                      Full name
                      <div className="login-input" style={{ marginTop: '6px' }}>
                        <input name="fullName" minLength={2} maxLength={100} required placeholder="Enter full name" />
                      </div>
                    </label>
                  </>
                )}
                <button className="login-submit" disabled={busy} style={{ marginTop: '12px' }}>
                  {busy ? 'Verifying…' : mode === 'link' ? 'Link account' : 'Register participant'}
                </button>
              </form>
              <p style={{ color: '#8c938e', fontSize: '12px', marginTop: '16px', lineHeight: 1.4 }}>
                Administrator accounts and recovery cases require organizer-assisted identity verification.
              </p>
            </>
          ) : (
            <>
              <p role="alert" style={{ color: '#ff8595', background: 'rgba(255, 75, 75, 0.12)', border: '1px solid rgba(255, 75, 75, 0.35)', borderRadius: '6px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px' }}>
                Application access could not be verified. Contact an organizer.
              </p>
              <button className="login-submit" onClick={refreshUser}>
                Retry Verification
              </button>
            </>
          )}

          {error && (
            <p role="alert" style={{ color: '#ff8595', background: 'rgba(255, 75, 75, 0.12)', border: '1px solid rgba(255, 75, 75, 0.35)', borderRadius: '6px', padding: '10px 14px', fontSize: '13px', marginTop: '16px' }}>
              {error}
            </p>
          )}

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={logout}
              style={{ background: 'transparent', border: 'none', color: '#b2b7b3', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Sign out
            </button>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
