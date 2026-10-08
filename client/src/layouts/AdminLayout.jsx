import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ScanlineOverlay from '../components/hud/ScanlineOverlay';
import { ROUTES } from '../constants/routes';
import { Shield, Users, Layers, QrCode, ScrollText, Sliders, LogOut, ArrowLeft } from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminNav = [
    { label: 'OVERVIEW', path: ROUTES.ADMIN_DASHBOARD, icon: Shield },
    { label: 'TEAMS', path: ROUTES.ADMIN_TEAMS, icon: Users },
    { label: 'CHALLENGES & POOL', path: ROUTES.ADMIN_CHALLENGES, icon: Layers },
    { label: 'QR CHECKPOINTS', path: ROUTES.ADMIN_CHECKPOINTS, icon: QrCode },
    { label: 'SUBMISSIONS AUDIT', path: ROUTES.ADMIN_SUBMISSIONS, icon: ScrollText },
    { label: 'EVENT CONTROLS', path: ROUTES.ADMIN_CONTROLS, icon: Sliders },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cyber-bg text-cyber-text relative">
      <ScanlineOverlay />

      {/* Admin Top Banner */}
      <header className="bg-cyber-secondary border-b border-cyber-border px-6 py-3 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyber-orange/15 border border-cyber-orange flex items-center justify-center text-cyber-orange">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-sm tracking-wide text-cyber-text">
              HTG COMMAND SOC <span className="text-cyber-orange">// GOD-MODE</span>
            </h1>
            <p className="text-[10px] font-mono text-cyber-muted">ADMINISTRATIVE CONTROL CONSOLE</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-1.5 text-cyber-muted hover:text-cyber-cyan"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            PUBLIC SITE
          </Link>
          <button
            onClick={() => {
              logout();
              navigate(ROUTES.LOGIN);
            }}
            className="flex items-center gap-1.5 text-cyber-danger hover:text-red-400"
          >
            <LogOut className="w-3.5 h-3.5" />
            EXIT SOC
          </button>
        </div>
      </header>

      {/* Admin Workspace Layout */}
      <div className="flex-grow flex flex-col md:flex-row z-10">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-cyber-panel border-r border-cyber-border p-4">
          <nav className="space-y-1">
            {adminNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === ROUTES.ADMIN_DASHBOARD}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono tracking-wider transition-colors ${
                    isActive
                      ? 'bg-cyber-cyan/15 text-cyber-cyan border-l-2 border-cyber-cyan font-bold'
                      : 'text-cyber-muted hover:text-cyber-text hover:bg-cyber-secondary'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Dynamic Viewport */}
        <main className="flex-grow p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

