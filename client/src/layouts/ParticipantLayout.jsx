import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { teamService } from '../services/team.service';
import HUDHeader from '../components/hud/HUDHeader';
import ScanlineOverlay from '../components/hud/ScanlineOverlay';
import { ROUTES } from '../constants/routes';
import { LayoutDashboard, Map, Terminal, QrCode, Trophy, Users, Award, LogOut } from 'lucide-react';

export const ParticipantLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        if (user?.teamId) {
          const res = await teamService.getMyTeam();
          setTeam(res.data.team);
        }
      } catch (err) {
        console.error('Failed to load team context', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [user]);

  const navItems = [
    { label: 'DASHBOARD', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'MISSION MAP', path: ROUTES.MISSION_MAP, icon: Map },
    { label: 'ACTIVE CHALLENGE', path: ROUTES.CHALLENGE, icon: Terminal },
    { label: 'QR SCANNER', path: ROUTES.CHECKPOINT, icon: QrCode },
    { label: 'LEADERBOARD', path: ROUTES.LEADERBOARD, icon: Trophy },
    { label: 'TEAM PROFILE', path: ROUTES.TEAM_PROFILE, icon: Users },
    { label: 'MASTER FLAG', path: ROUTES.MASTER_FLAG, icon: Award },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cyber-bg text-cyber-text relative">
      <ScanlineOverlay />

      {/* Top Fixed Telemetry HUD */}
      <HUDHeader
        team={team}
        currentLevel={team?.currentLevel || 1}
        totalScore={team?.totalScore || 0}
      />

      {/* Secondary Tactical Nav Bar */}
      <nav className="bg-cyber-secondary border-b border-cyber-border px-4 py-2 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto">
          <div className="flex items-center space-x-1 sm:space-x-4 min-w-max">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === ROUTES.DASHBOARD}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-xs font-mono tracking-wider transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-cyber-panel text-cyber-cyan border-b-2 border-cyber-cyan font-bold'
                      : 'text-cyber-muted hover:text-cyber-text hover:bg-cyber-panel/50'
                  }`
                }
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </NavLink>
            ))}
          </div>

          <button
            onClick={() => {
              logout();
              navigate(ROUTES.HOME);
            }}
            className="flex items-center gap-1.5 text-xs font-mono text-cyber-danger hover:text-red-400 px-3 py-1.5 min-w-max"
          >
            <LogOut className="w-3.5 h-3.5" />
            ABORT SESSION
          </button>
        </div>
      </nav>

      {/* Main Tactical Viewport */}
      <main className="flex-grow z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <Outlet context={{ team, refreshTeam: () => teamService.getMyTeam().then(r => setTeam(r.data.team)) }} />
      </main>
    </div>
  );
};

export default ParticipantLayout;

