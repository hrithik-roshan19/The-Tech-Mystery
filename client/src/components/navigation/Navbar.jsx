import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { CyberButton } from '../common/CyberButton';
import { Terminal, Trophy, Shield, Menu, X, LogIn, LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'HOME', path: ROUTES.HOME },
    { label: 'ABOUT', path: ROUTES.ABOUT },
    { label: 'HOW IT WORKS', path: ROUTES.HOW_IT_WORKS },
    { label: 'RULES', path: ROUTES.RULES },
    { label: 'SCHEDULE', path: ROUTES.SCHEDULE },
    { label: 'FAQ', path: ROUTES.FAQ },
    { label: 'LEADERBOARD', path: ROUTES.LEADERBOARD, icon: Trophy },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-cyber-bg/90 backdrop-blur-md border-b border-cyber-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-cyber-cyan/10 border border-cyber-cyan flex items-center justify-center text-cyber-cyan group-hover:shadow-neon-cyan transition-all">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-bold text-lg text-cyber-text tracking-wider block leading-none">
                HACK THE <span className="text-cyber-cyan">GRID</span>
              </span>
              <span className="text-[10px] font-mono text-cyber-muted block uppercase tracking-widest mt-0.5">
                CODESPHERE // TULA'S
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 text-xs font-mono tracking-wider transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-cyber-cyan border-b-2 border-cyber-cyan'
                      : 'text-cyber-muted hover:text-cyber-text'
                  }`}
                >
                  {link.icon && <link.icon className="w-3.5 h-3.5" />}
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Auth Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {isAdmin ? (
                  <Link to={ROUTES.ADMIN_DASHBOARD}>
                    <CyberButton variant="orange" size="sm" icon={Shield}>
                      ADMIN SOC
                    </CyberButton>
                  </Link>
                ) : (
                  <Link to={ROUTES.DASHBOARD}>
                    <CyberButton variant="cyan" size="sm" icon={LayoutDashboard}>
                      PORTAL
                    </CyberButton>
                  </Link>
                )}
                <CyberButton variant="ghost" size="sm" onClick={logout}>
                  DISCONNECT
                </CyberButton>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to={ROUTES.LOGIN}>
                  <CyberButton variant="ghost" size="sm" icon={LogIn}>
                    LOGIN
                  </CyberButton>
                </Link>
                <Link to={ROUTES.REGISTER}>
                  <CyberButton variant="cyan" size="sm">
                    REGISTER
                  </CyberButton>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-cyber-muted hover:text-cyber-cyan p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cyber-panel border-b border-cyber-border px-4 pt-3 pb-6 space-y-3 font-mono text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-cyber-muted hover:text-cyber-cyan border-b border-cyber-border/40"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link to={ROUTES.DASHBOARD} onClick={() => setMobileMenuOpen(false)}>
                  <CyberButton variant="cyan" size="sm" className="w-full">
                    OPEN PORTAL
                  </CyberButton>
                </Link>
                <CyberButton variant="ghost" size="sm" onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full">
                  LOGOUT
                </CyberButton>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)}>
                  <CyberButton variant="ghost" size="sm" className="w-full">
                    LOGIN
                  </CyberButton>
                </Link>
                <Link to={ROUTES.REGISTER} onClick={() => setMobileMenuOpen(false)}>
                  <CyberButton variant="cyan" size="sm" className="w-full">
                    REGISTER
                  </CyberButton>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
