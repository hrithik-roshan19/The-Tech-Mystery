import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { mobileDrawerMotion, navbarMotion } from '../../utils/motion';
import '../../styles/Navbar.css';

/**
 * Standardized The Tech Mystery Navigation Links
 * Exactly 7 links in the required sequence:
 * 1. HOME → /
 * 2. LEADERBOARD → /leaderboard
 * 3. MISSION → /mission
 * 4. CHALLENGES → /challenges
 * 5. QR CHECKPOINT → /qr-checkpoint
 * 6. FINAL FLAG → /final-flag
 * 7. RULES → /rules
 */
const NAVBAR_LINKS = [
  { label: 'HOME', path: ROUTES.HOME },
  { label: 'LEADERBOARD', path: ROUTES.LEADERBOARD },
  { label: 'MISSION', path: ROUTES.MISSION },
  { label: 'CHALLENGES', path: ROUTES.CHALLENGES },
  { label: 'QR CHECKPOINT', path: ROUTES.QR_CHECKPOINT },
  { label: 'FINAL FLAG', path: ROUTES.FINAL_FLAG },
  { label: 'RULES', path: ROUTES.RULES },
];

export const Navbar = ({ activeOverride }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Keyboard accessibility: Escape closes drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  /**
   * Determine if a given link is active based on location path and optional override.
   */
  const checkIsActive = (path, label) => {
    if (activeOverride) {
      return activeOverride.toUpperCase() === label.toUpperCase();
    }
    const currentPath = location.pathname;
    if (path === ROUTES.HOME) {
      return currentPath === '/' || currentPath === '';
    }
    if (path === ROUTES.MISSION) {
      return currentPath === '/mission';
    }
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  return (
    <motion.header
      className="htg-site-navbar site-navbar"
      variants={navbarMotion}
      initial="hidden"
      animate="visible"
    >
      <div className="htg-nav-container nav-container">
        {/* Left — Branding */}
        <Link to={ROUTES.HOME} className="htg-nav-brand nav-brand" aria-label="The Tech Mystery home">
          <span className="htg-nav-brand-title">
            THE TECH <span className="htg-brand-lime">MYSTERY</span>
          </span>
          <span className="htg-nav-brand-sub">CODESPHERE × UTKRISHT 2026</span>
        </Link>

        {/* Center — Navigation Links (All 7 horizontal on desktop) */}
        <nav className="htg-nav-links nav-links" aria-label="Main navigation">
          {NAVBAR_LINKS.map((item) => {
            const isActive = checkIsActive(item.path, item.label);
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`site-navbar__link nav-link ${isActive ? 'active is-active' : ''}`}
              >
                {item.label}
                {isActive && <span className="site-navbar__active-bar" />}
              </Link>
            );
          })}
        </nav>

        {/* Right — Authentication Actions */}
        <div className="htg-nav-actions nav-actions">
          {isAuthenticated ? (
            <>
              {user?.role === 'ADMIN' ? (
                <Link to={ROUTES.ADMIN_DASHBOARD} className="htg-nav-btn htg-nav-btn-dash nav-btn-dash">
                  ADMIN SOC
                </Link>
              ) : (
                <Link to={ROUTES.DASHBOARD} className="htg-nav-btn htg-nav-btn-dash nav-btn-dash">
                  DASHBOARD
                </Link>
              )}
              <button
                type="button"
                className="htg-nav-btn htg-nav-btn-reg nav-btn-register"
                onClick={() => logout && logout()}
              >
                DISCONNECT
              </button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} className="htg-nav-btn htg-nav-btn-login nav-btn-login">
                LOGIN
              </Link>
              <Link to={ROUTES.REGISTER} className="htg-nav-btn htg-nav-btn-reg nav-btn-register">
                REGISTER <span className="htg-btn-arrow" aria-hidden="true">↗</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className={`htg-nav-mobile-toggle ${mobileMenuOpen ? 'is-open' : ''}`}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Navigation Drawer with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="htg-nav-mobile-drawer nav-mobile-drawer"
            variants={mobileDrawerMotion}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ overflow: 'hidden' }}
          >
            {NAVBAR_LINKS.map((item) => {
              const isActive = checkIsActive(item.path, item.label);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`htg-mobile-link ${isActive ? 'active is-active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="htg-mobile-drawer-actions">
              {isAuthenticated ? (
                <>
                  {user?.role === 'ADMIN' ? (
                    <Link
                      to={ROUTES.ADMIN_DASHBOARD}
                      className="htg-nav-btn htg-nav-btn-dash nav-btn-dash"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      ADMIN SOC
                    </Link>
                  ) : (
                    <Link
                      to={ROUTES.DASHBOARD}
                      className="htg-nav-btn htg-nav-btn-dash nav-btn-dash"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      DASHBOARD
                    </Link>
                  )}
                  <button
                    type="button"
                    className="htg-nav-btn htg-nav-btn-reg nav-btn-register"
                    onClick={() => {
                      if (logout) logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    DISCONNECT
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={ROUTES.LOGIN}
                    className="htg-nav-btn htg-nav-btn-login nav-btn-login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    LOGIN
                  </Link>
                  <Link
                    to={ROUTES.REGISTER}
                    className="htg-nav-btn htg-nav-btn-reg nav-btn-register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    REGISTER <span className="htg-btn-arrow" aria-hidden="true">↗</span>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
