import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CyberCard } from '../../components/common/CyberCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Users, Layers, QrCode, ScrollText, CheckCircle, ShieldAlert } from 'lucide-react';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard-stats');
        setStats(res.data.data.stats);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner text="POLLING SOC METRICS..." />;

  const metricCards = [
    { label: 'REGISTERED SQUADS', value: stats?.totalTeams || 0, icon: Users, color: 'cyan' },
    { label: 'ACTIVE OPERATIVES', value: stats?.totalUsers || 0, icon: Users, color: 'cyan' },
    { label: 'CHALLENGE LEVELS', value: stats?.totalChallenges || 0, icon: Layers, color: 'orange' },
    { label: 'QUESTION VARIATIONS', value: stats?.totalQuestions || 0, icon: Layers, color: 'orange' },
    { label: 'TOTAL SUBMISSIONS', value: stats?.totalSubmissions || 0, icon: ScrollText, color: 'green' },
    { label: 'OVERALL ACCURACY', value: stats?.accuracyRate || '0%', icon: CheckCircle, color: 'green' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-black text-cyber-text uppercase">
          COMMAND SOC OVERVIEW
        </h1>
        <p className="font-mono text-xs text-cyber-muted mt-1">
          High-level operational intelligence for event administrators.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricCards.map((m, idx) => (
          <CyberCard key={idx} glowColor={m.color}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono text-cyber-muted uppercase tracking-wider">{m.label}</p>
                <p className="text-2xl font-mono font-bold text-cyber-text mt-1">{m.value}</p>
              </div>
              <div className="w-10 h-10 bg-cyber-secondary border border-cyber-border flex items-center justify-center text-cyber-cyan">
                <m.icon className="w-5 h-5" />
              </div>
            </div>
          </CyberCard>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardPage;

