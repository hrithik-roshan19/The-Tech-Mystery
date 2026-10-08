import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatTimestamp, formatLevel } from '../../utils/formatters';

export const SubmissionLogsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/submissions');
      setSubmissions(res.data.data.submissions);
    } catch (err) {
      console.error('Failed to load submission logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) return <LoadingSpinner text="FETCHING SUBMISSION AUDIT TRAIL..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-black text-cyber-text uppercase">
          SUBMISSION AUDIT LOGS
        </h1>
        <p className="font-mono text-xs text-cyber-muted mt-1">
          Immutable forensic log of all flag verification attempts across squads.
        </p>
      </div>

      <div className="bg-cyber-panel border border-cyber-border overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="bg-cyber-secondary text-cyber-muted border-b border-cyber-border">
              <th className="py-3 px-4">TIMESTAMP</th>
              <th className="py-3 px-4">SQUAD</th>
              <th className="py-3 px-4">OPERATIVE</th>
              <th className="py-3 px-4">STAGE</th>
              <th className="py-3 px-4">SUBMITTED VALUE</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4">ORIGIN IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-border/40">
            {submissions.map((s) => (
              <tr key={s._id} className="hover:bg-cyber-secondary/40">
                <td className="py-3 px-4 text-cyber-muted">{formatTimestamp(s.submittedAt)}</td>
                <td className="py-3 px-4 font-bold text-cyber-text">{s.teamId?.name || 'Unknown Squad'}</td>
                <td className="py-3 px-4 text-cyber-muted">{s.userId?.username || 'operative'}</td>
                <td className="py-3 px-4 text-cyber-orange">{formatLevel(s.levelNumber)}</td>
                <td className="py-3 px-4 text-cyber-cyan max-w-xs truncate">{s.submittedAnswer}</td>
                <td className="py-3 px-4">
                  <StatusBadge
                    status={s.status}
                    variant={s.isCorrect ? 'green' : 'danger'}
                    size="xs"
                  />
                </td>
                <td className="py-3 px-4 text-cyber-muted text-[11px]">{s.ipAddress || '127.0.0.1'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmissionLogsPage;

