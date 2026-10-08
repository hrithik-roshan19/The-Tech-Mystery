import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CyberCard } from '../../components/common/CyberCard';
import { CyberButton } from '../../components/common/CyberButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ShieldAlert, Users } from 'lucide-react';
import { formatScore, formatLevel } from '../../utils/formatters';

export const TeamManagementPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/teams');
      setTeams(res.data.data.teams);
    } catch (err) {
      console.error('Failed to load teams', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleDisqualify = async (teamId) => {
    const reason = prompt('Specify official disqualification justification:');
    if (!reason) return;

    try {
      await api.patch(`/admin/teams/${teamId}/disqualify`, { reason });
      fetchTeams();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  if (loading) return <LoadingSpinner text="FETCHING SQUAD MANIFESTS..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-black text-cyber-text uppercase">
          SQUAD MANAGEMENT
        </h1>
        <p className="font-mono text-xs text-cyber-muted mt-1">
          Inspect registered teams, view join codes, and enforce event rules.
        </p>
      </div>

      <div className="bg-cyber-panel border border-cyber-border overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="bg-cyber-secondary text-cyber-muted border-b border-cyber-border">
              <th className="py-3 px-4">SQUAD</th>
              <th className="py-3 px-4">COMMANDER</th>
              <th className="py-3 px-4">JOIN CODE</th>
              <th className="py-3 px-4">ROSTER</th>
              <th className="py-3 px-4">LEVEL</th>
              <th className="py-3 px-4">SCORE</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-border/40">
            {teams.map((t) => (
              <tr key={t._id} className="hover:bg-cyber-secondary/40">
                <td className="py-3 px-4 font-bold text-cyber-text">{t.name}</td>
                <td className="py-3 px-4 text-cyber-muted">{t.leaderId?.fullName || t.leaderId?.username}</td>
                <td className="py-3 px-4 text-cyber-cyan">{t.joinCode}</td>
                <td className="py-3 px-4">{t.members?.length || 1} / 4</td>
                <td className="py-3 px-4 text-cyber-orange">{formatLevel(t.currentLevel)}</td>
                <td className="py-3 px-4 font-bold text-cyber-cyan">{formatScore(t.totalScore)} PTS</td>
                <td className="py-3 px-4">
                  <StatusBadge
                    status={t.isDisqualified ? 'DISQUALIFIED' : 'ACTIVE'}
                    variant={t.isDisqualified ? 'danger' : 'green'}
                    size="xs"
                  />
                </td>
                <td className="py-3 px-4 text-right">
                  {!t.isDisqualified && (
                    <button
                      onClick={() => handleDisqualify(t._id)}
                      className="text-cyber-danger hover:underline text-[11px]"
                    >
                      DISQUALIFY
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamManagementPage;

