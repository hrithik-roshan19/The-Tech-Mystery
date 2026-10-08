import React, { useState, useEffect } from 'react';
import { leaderboardService } from '../../services/leaderboard.service';
import { CyberCard } from '../../components/common/CyberCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Trophy, RefreshCw, AlertCircle, Clock } from 'lucide-react';
import { formatScore, formatLevel, formatTimestamp } from '../../utils/formatters';

export const LeaderboardPage = () => {
  const [data, setData] = useState({ leaderboard: [], isFrozen: false });
  const [loading, setLoading] = useState(true);

  const fetchScores = async () => {
    try {
      setLoading(true);
      const res = await leaderboardService.getLeaderboard();
      setData(res.data);
    } catch (err) {
      console.error('Failed to load leaderboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
    const interval = setInterval(fetchScores, 15000); // 15s auto-refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-black text-cyber-text uppercase flex items-center gap-2">
            <Trophy className="w-6 h-6 text-cyber-orange" />
            LIVE GRID LEADERBOARD
          </h1>
          <p className="font-mono text-xs text-cyber-muted mt-1">
            Real-time score standings with millisecond tie-breaker resolution.
          </p>
        </div>

        <button
          onClick={fetchScores}
          className="flex items-center gap-1.5 text-xs font-mono text-cyber-cyan hover:underline bg-cyber-secondary border border-cyber-border px-3 py-1.5 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" /> REFRESH STANDINGS
        </button>
      </div>

      {data.isFrozen && (
        <div className="bg-cyber-warning/10 border border-cyber-warning p-4 text-cyber-warning font-mono text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>
            LEADERBOARD FREEZE ACTIVE // Standings are paused for final stage de-cloaking. Scores continue accumulating invisibly!
          </span>
        </div>
      )}

      {loading && data.leaderboard.length === 0 ? (
        <LoadingSpinner text="AGGREGATING LIVE SCORE TELEMETRY..." />
      ) : (
        <div className="bg-cyber-panel border border-cyber-border overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-cyber-secondary text-cyber-muted border-b border-cyber-border">
                <th className="py-3 px-4 uppercase">RANK</th>
                <th className="py-3 px-4 uppercase">SQUAD NAME</th>
                <th className="py-3 px-4 uppercase">PHASE</th>
                <th className="py-3 px-4 uppercase text-right">TOTAL SCORE</th>
                <th className="py-3 px-4 uppercase text-right">LAST SOLVE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/40">
              {data.leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-cyber-muted">
                    No squads have registered points yet. Be the first to breach Level 1!
                  </td>
                </tr>
              ) : (
                data.leaderboard.map((team) => (
                  <tr
                    key={team.teamId}
                    className={`hover:bg-cyber-secondary/50 transition-colors ${
                      team.rank === 1
                        ? 'bg-cyber-cyan/5 text-cyber-cyan'
                        : team.rank <= 3
                        ? 'text-cyber-text'
                        : 'text-cyber-muted'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold">
                      #{team.rank.toString().padStart(2, '0')}
                    </td>
                    <td className="py-3 px-4 font-bold text-cyber-text">
                      {team.teamName}
                    </td>
                    <td className="py-3 px-4 text-cyber-orange">
                      {formatLevel(team.currentLevel)}
                    </td>
                    <td className="py-3 px-4 font-bold text-right text-cyber-cyan glow-cyan">
                      {formatScore(team.totalScore)} PTS
                    </td>
                    <td className="py-3 px-4 text-right text-cyber-muted text-[11px]">
                      {formatTimestamp(team.lastSolveTimestamp)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
