import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import '../../styles/Navbar.css';

/**
 * Standardized Hack the Grid Navigation Links
 * Exactly 7 links in the required sequence:
 * 1. HOME
 * 2. LEADERBOARD
 * 3. MISSION
 * 4. CHALLENGES
 * 5. QR CHECKPOINT
 * 6. FINAL FLAG
 * 7. RULES
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
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * Determine if a given link is active based on location path and optional override.
   * Root route "/" matches strictly exact "/" to avoid highlighting HOME on all subroutes.
   * /mission handles both "/mission" and "/mission#how-it-works".
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
    <header className="htg-site-navbar">
      <div className="htg-nav-container">
        {/* Brand Logo */}
        <Link to={ROUTES.HOME} className="htg-nav-brand" aria-label="Hack the Grid home">
          <span className="htg-nav-brand-title">
            HACK THE <span className="htg-brand-lime">GRID</span>
          </span>
          <span className="htg-nav-brand-sub">CODESPHERE × UTKRISHT 2026</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="htg-nav-links" aria-label="Main navigation">
          {NAVBAR_LINKS.map((item) => {
            const isActive = checkIsActive(item.path, item.label);
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`site-navbar__link ${isActive ? 'active' : ''}`}
              >
                {item.label}
                {isActive && <span className="site-navbar__active-bar" />}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="htg-nav-actions">
          <Link to={ROUTES.DASHBOARD} className="htg-nav-btn htg-nav-btn-dash">
            DASHBOARD
          </Link>
          {isAuthenticated ? (
            <button
              type="button"
              className="htg-nav-btn htg-nav-btn-reg"
              onClick={() => logout && logout()}
            >
              DISCONNECT
            </button>
          ) : (
            <Link to={ROUTES.REGISTER} className="htg-nav-btn htg-nav-btn-reg">
              REGISTER
            </Link>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          className={`htg-nav-mobile-toggle ${mobileMenuOpen ? 'is-open' : ''}`}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="htg-nav-mobile-drawer">
          {NAVBAR_LINKS.map((item) => {
            const isActive = checkIsActive(item.path, item.label);
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`htg-mobile-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="htg-mobile-drawer-actions">
            <Link
              to={ROUTES.DASHBOARD}
              className="htg-nav-btn htg-nav-btn-dash"
              onClick={() => setMobileMenuOpen(false)}
            >
              DASHBOARD
            </Link>
            {isAuthenticated ? (
              <button
                type="button"
                className="htg-nav-btn htg-nav-btn-reg"
                onClick={() => {
                  if (logout) logout();
                  setMobileMenuOpen(false);
                }}
              >
                DISCONNECT
              </button>
            ) : (
              <Link
                to={ROUTES.REGISTER}
                className="htg-nav-btn htg-nav-btn-reg"
                onClick={() => setMobileMenuOpen(false)}
              >
                REGISTER
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
