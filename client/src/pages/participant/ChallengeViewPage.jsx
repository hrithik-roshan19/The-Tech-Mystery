import React, { useState, useEffect } from 'react';
import { challengeService } from '../../services/challenge.service';
import { CyberCard } from '../../components/common/CyberCard';
import { CyberButton } from '../../components/common/CyberButton';
import { TerminalWindow } from '../../components/common/TerminalWindow';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ShieldCheck, AlertTriangle, KeyRound, CheckCircle2, Lock } from 'lucide-react';

export const ChallengeViewPage = () => {
  const [data, setData] = useState(null);
  const [flag, setFlag] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resultMsg, setResultMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchChallenge = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await challengeService.getCurrentChallenge();
      setData(res.data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to load active challenge.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenge();
  }, []);

  const handleSubmitFlag = async (e) => {
    e.preventDefault();
    if (!flag.trim()) return;

    setSubmitting(true);
    setResultMsg(null);
    setErrorMsg(null);

    try {
      const res = await challengeService.submitFlag(data.levelNumber, flag);
      setResultMsg({
        success: true,
        text: res.message || 'FLAG ACCEPTED! Level conquered.'
      });
      setFlag('');
      // Reload next challenge
      setTimeout(() => fetchChallenge(), 2000);
    } catch (err) {
      setResultMsg({
        success: false,
        text: err.response?.data?.message || 'Incorrect flag. Access denied.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="DECRYPTING CHALLENGE NODE..." />;

  if (errorMsg && !data) {
    return (
      <CyberCard title="CHALLENGE ACCESS LOCKED" glowColor="orange">
        <div className="space-y-4 font-mono text-xs">
          <div className="bg-cyber-warning/10 border border-cyber-warning p-4 text-cyber-warning flex items-start gap-3">
            <Lock className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold">SECURITY LOCK ACTIVE</p>
              <p className="mt-1">{errorMsg}</p>
            </div>
          </div>
          <p className="text-cyber-muted">
            If this level requires a physical QR checkpoint scan, locate the campus checkpoint marker
            and authenticate via the QR Scanner before accessing the challenge prompt.
          </p>
        </div>
      </CyberCard>
    );
  }

  const { challenge, question, teamChallenge, levelNumber } = data || {};

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cyber-panel border border-cyber-border p-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={`LEVEL ${levelNumber}`} variant="orange" size="xs" />
            <StatusBadge status={challenge?.category} variant="cyan" size="xs" />
          </div>
          <h1 className="text-2xl font-heading font-black text-cyber-text uppercase">
            {question?.title || challenge?.title}
          </h1>
        </div>
        <div className="text-right font-mono">
          <span className="text-[10px] text-cyber-muted uppercase block">BOUNTY VALUE</span>
          <span className="text-2xl font-bold text-cyber-cyan glow-cyan">{challenge?.points} PTS</span>
        </div>
      </div>

      {/* Terminal Challenge Prompt */}
      <TerminalWindow title={`CIPHER-NODE // LEVEL ${levelNumber}`}>
        <div className="space-y-4">
          <p className="whitespace-pre-wrap">{question?.prompt}</p>

          {question?.assetUrls && question.assetUrls.length > 0 && (
            <div className="pt-4 border-t border-cyber-border">
              <p className="text-cyber-muted text-xs uppercase mb-2">ATTACHED ARTIFACTS:</p>
              <div className="flex flex-wrap gap-2">
                {question.assetUrls.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-cyber-secondary border border-cyber-border px-3 py-1 text-xs text-cyber-cyan hover:border-cyber-cyan font-mono"
                  >
                    ARTIFACT_{i + 1}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </TerminalWindow>

      {/* Submission Module */}
      <CyberCard title="FLAG SUBMISSION INTERFACE" glowColor="cyan">
        <form onSubmit={handleSubmitFlag} className="space-y-4 font-mono text-xs">
          {resultMsg && (
            <div
              className={`p-3 border flex items-center gap-2 ${
                resultMsg.success
                  ? 'bg-cyber-green/10 border-cyber-green text-cyber-green'
                  : 'bg-cyber-danger/10 border-cyber-danger text-cyber-danger'
              }`}
            >
              {resultMsg.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              <span>{resultMsg.text}</span>
            </div>
          )}

          <div>
            <label className="block text-cyber-muted mb-1 uppercase tracking-wider">
              ENTER CAPTURED FLAG (FORMAT: HTG&#123;...&#125;)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                placeholder="HTG{example_captured_flag_string}"
                className="flex-grow bg-cyber-bg border border-cyber-border focus:border-cyber-cyan text-cyber-text px-4 py-2.5 outline-none font-mono text-sm"
              />
              <CyberButton
                type="submit"
                variant="cyan"
                size="md"
                disabled={submitting}
                icon={KeyRound}
                className="shrink-0"
              >
                {submitting ? 'VALIDATING...' : 'SUBMIT FLAG'}
              </CyberButton>
            </div>
          </div>

          <div className="flex items-center justify-between text-cyber-muted text-[11px] pt-1">
            <span>Attempts logged: {teamChallenge?.attemptsCount || 0}</span>
            <span>Rate-limited anti-brute-force defense active</span>
          </div>
        </form>
      </CyberCard>
    </div>
  );
};

export default ChallengeViewPage;

