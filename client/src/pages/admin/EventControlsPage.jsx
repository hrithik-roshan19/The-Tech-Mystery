import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CyberCard } from '../../components/common/CyberCard';
import { CyberButton } from '../../components/common/CyberButton';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Sliders, Snowflake, Play, Pause, AlertOctagon, Megaphone } from 'lucide-react';

export const EventControlsPage = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState('');

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard-stats');
      setConfig(res.data.data.eventConfig || {});
    } catch (err) {
      console.error('Failed to load event config', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const updateState = async (newState) => {
    try {
      await api.patch('/admin/event-config', { state: newState });
      fetchConfig();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const toggleFreeze = async () => {
    try {
      await api.patch('/admin/event-config', {
        isLeaderboardFrozen: !config.isLeaderboardFrozen,
        frozenAt: !config.isLeaderboardFrozen ? new Date() : null
      });
      fetchConfig();
    } catch (err) {
      alert(err.response?.data?.message || 'Freeze update failed');
    }
  };

  if (loading) return <LoadingSpinner text="SYNCHRONIZING SOC EVENT CONTROLS..." />;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-heading font-black text-cyber-text uppercase">
          EVENT MASTER CONTROLS
        </h1>
        <p className="font-mono text-xs text-cyber-muted mt-1">
          God-mode master switches for event status, scoreboard freeze, and system broadcasts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Event State Controls */}
        <CyberCard title="EVENT LIFECYCLE STATE" glowColor="cyan">
          <div className="space-y-4 font-mono text-xs">
            <p className="text-cyber-muted">
              Current Mode: <strong className="text-cyber-cyan">{config?.state || 'DRAFT'}</strong>
            </p>

            <div className="flex flex-col gap-2">
              <CyberButton
                variant={config?.state === 'LIVE' ? 'green' : 'ghost'}
                size="sm"
                icon={Play}
                onClick={() => updateState('LIVE')}
              >
                ENGAGE EVENT (LIVE)
              </CyberButton>
              <CyberButton
                variant={config?.state === 'PAUSED' ? 'orange' : 'ghost'}
                size="sm"
                icon={Pause}
                onClick={() => updateState('PAUSED')}
              >
                PAUSE ALL NODES (HALT TIMER)
              </CyberButton>
              <CyberButton
                variant={config?.state === 'CONCLUDED' ? 'danger' : 'ghost'}
                size="sm"
                icon={AlertOctagon}
                onClick={() => updateState('CONCLUDED')}
              >
                CONCLUDE & LOCK ALL SUBMISSIONS
              </CyberButton>
            </div>
          </div>
        </CyberCard>

        {/* Leaderboard Freeze */}
        <CyberCard title="LEADERBOARD FREEZE CONTROL" glowColor="orange">
          <div className="space-y-4 font-mono text-xs">
            <p className="text-cyber-muted">
              Status:{' '}
              <strong className={config?.isLeaderboardFrozen ? 'text-cyber-warning' : 'text-cyber-green'}>
                {config?.isLeaderboardFrozen ? 'FROZEN (SCORES CLOAKED)' : 'UNFROZEN (LIVE REAL-TIME)'}
              </strong>
            </p>
            <p className="text-cyber-muted">
              Freezing hides real-time leaderboard movements on public and participant views to build
              suspense during the final 30 minutes. Points continue accumulating invisibly.
            </p>
            <CyberButton
              variant={config?.isLeaderboardFrozen ? 'green' : 'orange'}
              size="md"
              icon={Snowflake}
              onClick={toggleFreeze}
              className="w-full"
            >
              {config?.isLeaderboardFrozen ? 'UNFREEZE SCOREBOARD' : 'FREEZE SCOREBOARD'}
            </CyberButton>
          </div>
        </CyberCard>
      </div>
    </div>
  );
};

export default EventControlsPage;
