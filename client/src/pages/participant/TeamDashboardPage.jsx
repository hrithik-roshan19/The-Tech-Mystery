import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { teamService } from '../../services/team.service';
import { ROUTES } from '../../constants/routes';
import { CyberButton } from '../../components/common/CyberButton';
import { CyberCard } from '../../components/common/CyberCard';
import { TerminalWindow } from '../../components/common/TerminalWindow';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Users, Plus, Key, ArrowRight, Shield, Target, QrCode } from 'lucide-react';
import { formatScore, formatLevel } from '../../utils/formatters';

export const TeamDashboardPage = () => {
  const { team, refreshTeam } = useOutletContext() || {};
  const { user, updateTeamMembership } = useAuth();

  const [teamName, setTeamName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const res = await teamService.createTeam(teamName);
      updateTeamMembership(res.data.team._id, 'TEAM_LEADER');
      if (refreshTeam) await refreshTeam();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const res = await teamService.joinTeam(joinCode);
      updateTeamMembership(res.data.team._id, 'TEAM_MEMBER');
      if (refreshTeam) await refreshTeam();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // If user has no team registered, render squad formation cockpit
  if (!user?.teamId) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-heading font-black text-cyber-text uppercase">
            OPERATIVE DEPLOYMENT // <span className="text-cyber-cyan">SQUAD REQUIRED</span>
          </h1>
          <p className="font-mono text-xs text-cyber-muted">
            To access the grid, you must initialize a new squad or enter a team join code.
          </p>
        </div>

        {error && (
          <div className="bg-cyber-danger/10 border border-cyber-danger p-3 text-cyber-danger font-mono text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CyberCard title="INITIALIZE NEW SQUAD" subtitle="BECOME SQUAD COMMANDER" glowColor="cyan">
            <form onSubmit={handleCreateTeam} className="space-y-4 font-mono text-xs">
              <p className="text-cyber-muted">
                Create a team unit. You will receive an exclusive join code to enlist 1–3 additional operatives.
              </p>
              <div>
                <label className="block text-cyber-muted mb-1">SQUAD DESIGNATION</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. ShadowProtocol"
                  className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan text-cyber-text px-3 py-2 outline-none"
                />
              </div>
              <CyberButton type="submit" variant="cyan" size="md" disabled={loading} className="w-full" icon={Plus}>
                INITIALIZE SQUAD
              </CyberButton>
            </form>
          </CyberCard>

          <CyberCard title="JOIN EXISTING SQUAD" subtitle="ENLIST WITH JOIN CODE" glowColor="green">
            <form onSubmit={handleJoinTeam} className="space-y-4 font-mono text-xs">
              <p className="text-cyber-muted">
                Enter the secret invitation token provided by your squad leader.
              </p>
              <div>
                <label className="block text-cyber-muted mb-1">TEAM JOIN CODE</label>
                <input
                  type="text"
                  required
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="HTG-XXXXXX"
                  className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-green text-cyber-text px-3 py-2 outline-none uppercase"
                />
              </div>
              <CyberButton type="submit" variant="green" size="md" disabled={loading} className="w-full" icon={Key}>
                JOIN SQUAD
              </CyberButton>
            </form>
          </CyberCard>
        </div>
      </div>
    );
  }

  // Active Squad Dashboard
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-cyber-panel border border-cyber-border p-6">
        <div>
          <span className="text-[10px] font-mono text-cyber-cyan tracking-widest uppercase">TACTICAL DASHBOARD</span>
          <h1 className="text-2xl font-heading font-black text-cyber-text uppercase">
            UNIT: {team?.name}
          </h1>
          <p className="font-mono text-xs text-cyber-muted mt-1">
            Current Stage: <span className="text-cyber-orange font-bold">{formatLevel(team?.currentLevel || 1)}</span> • 
            Accumulated Score: <span className="text-cyber-cyan font-bold">{formatScore(team?.totalScore || 0)} PTS</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to={ROUTES.CHECKPOINT}>
            <CyberButton variant="cyan" size="md" icon={QrCode}>
              SCAN QR CHECKPOINT
            </CyberButton>
          </Link>
          <Link to={ROUTES.CHALLENGE}>
            <CyberButton variant="green" size="md" icon={Target}>
              GO TO ACTIVE CHALLENGE
            </CyberButton>
          </Link>
          <Link to={ROUTES.CHALLENGES}>
            <CyberButton variant="ghost" size="md" icon={Target}>
              CHALLENGE LEVELS
            </CyberButton>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Squad Telemetry */}
        <CyberCard title="SQUAD MANIFEST" glowColor="cyan">
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-cyber-border">
              <span className="text-cyber-muted">JOIN CODE:</span>
              <span className="text-cyber-cyan font-bold tracking-widest">{team?.joinCode}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-cyber-border">
              <span className="text-cyber-muted">OPERATIVES:</span>
              <span>{team?.members?.length || 1} / {team?.maxMembers || 4}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-cyber-muted">STATUS:</span>
              <StatusBadge status="ACTIVE IN GRID" variant="green" size="xs" />
            </div>
          </div>
        </CyberCard>

        {/* Current Objective */}
        <CyberCard title="MISSION DIRECTIVE" glowColor="orange" className="md:col-span-2">
          <div className="space-y-3 font-mono text-xs">
            <p className="text-cyber-text">
              Proceed to campus beacon corresponding to <span className="text-cyber-orange font-bold">{formatLevel(team?.currentLevel || 1)}</span>.
            </p>
            <p className="text-cyber-muted">
              Scan the physical checkpoint QR to authenticate your location and unlock your squad's assigned cipher node.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link to={ROUTES.MISSION_MAP} className="inline-flex items-center gap-1.5 text-cyber-cyan hover:underline text-xs">
                Inspect campus mission map <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to={ROUTES.CHALLENGES} className="inline-flex items-center gap-1.5 text-cyber-green hover:underline text-xs">
                View Challenge Levels <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </CyberCard>
      </div>
    </div>
  );
};

export default TeamDashboardPage;

