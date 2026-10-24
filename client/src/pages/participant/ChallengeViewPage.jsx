import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { challengeService } from '../../services/challenge.service';
import { ROUTES } from '../../constants/routes';
import Navbar from '../../components/navigation/Navbar';
import { CyberCard } from '../../components/common/CyberCard';
import { CyberButton } from '../../components/common/CyberButton';
import { TerminalWindow } from '../../components/common/TerminalWindow';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ShieldCheck,
  AlertTriangle,
  KeyRound,
  CheckCircle2,
  Lock,
  ArrowRight,
  MapPin,
  Trophy,
  Sparkles,
  QrCode,
  Send,
  HelpCircle
} from 'lucide-react';

export const ChallengeViewPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resultMsg, setResultMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [lockedInfo, setLockedInfo] = useState(null);

  const fetchChallenge = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      setLockedInfo(null);
      const res = await challengeService.getCurrentChallenge();
      setData(res.data);
    } catch (err) {
      const errData = err.response?.data?.data;
      if (errData?.isLocked) {
        setLockedInfo(errData);
      }
      setErrorMsg(err.response?.data?.message || 'Failed to load active challenge.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  const handleSubmitAnswer = async (e) => {
    if (e) e.preventDefault();
    const cleanAnswer = String(answer).trim();
    if (!cleanAnswer) return;

    setSubmitting(true);
    setResultMsg(null);
    setErrorMsg(null);

    const levelNumber = data?.levelNumber || 1;
    const questionId = data?.question?._id || null;

    try {
      const res = await challengeService.submitFlag(levelNumber, cleanAnswer, questionId);
      const isLevelComplete = Boolean(res.data?.isLevelComplete);
      const isEventComplete = Boolean(res.data?.isEventComplete);
      const nextQ = res.data?.nextQuestion;
      const nextCpLocation = res.data?.nextCheckpointLocation || res.data?.nextCheckpoint?.name;

      setResultMsg({
        success: true,
        text: res.message || (isLevelComplete ? 'Level completed! All questions conquered.' : 'Correct answer!'),
        pointsAwarded: res.data?.pointsAwarded,
        isLevelComplete,
        isEventComplete,
        nextCheckpointLocation: nextCpLocation,
        attemptsRemaining: res.data?.attemptsRemaining,
        maxAttempts: res.data?.maxAttempts
      });

      setAnswer('');

      // If more questions exist in this level, update view to next question
      if (nextQ) {
        setData((prev) => ({
          ...prev,
          question: nextQ,
          sequenceNumber: res.data?.sequenceNumber || ((prev?.sequenceNumber || 1) + 1),
          solvedCount: res.data?.solvedQuestionsCount || ((prev?.solvedCount || 0) + 1),
          teamChallenge: {
            ...(prev?.teamChallenge || {}),
            attemptsCount: 0
          }
        }));
      } else if (isLevelComplete) {
        // Refresh full challenge data to load next level state
        setTimeout(() => fetchChallenge(), 3000);
      }
    } catch (err) {
      const errData = err.response?.data?.data;
      setResultMsg({
        success: false,
        text: err.response?.data?.message || 'Incorrect answer. Try again.',
        attemptsRemaining: errData?.attemptsRemaining,
        maxAttempts: errData?.maxAttempts
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-bg text-cyber-text">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
          <LoadingSpinner text="DECRYPTING CHALLENGE NODE..." />
        </div>
      </div>
    );
  }

  // 1. Physical QR Checkpoint Required / Locked State
  if (lockedInfo || (errorMsg && !data)) {
    const cp = lockedInfo?.checkpoint;
    const lvl = lockedInfo?.levelNumber || data?.levelNumber || 1;

    return (
      <div className="min-h-screen bg-cyber-bg text-cyber-text">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
          <CyberCard title={`SECURITY LOCK ACTIVE // LEVEL ${lvl}`} glowColor="orange">
            <div className="space-y-6 font-mono text-sm">
              <div className="bg-cyber-warning/10 border border-cyber-warning p-5 text-cyber-warning flex items-start gap-4 rounded">
                <Lock className="w-6 h-6 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold uppercase tracking-wider text-base">Checkpoint Scan Required</p>
                  <p className="text-xs text-cyber-warning/90 leading-relaxed">
                    Physical checkpoint QR must be scanned to unlock this level challenge.
                  </p>
                </div>
              </div>

              {cp && (
                <div className="bg-cyber-panel/60 border border-cyber-border p-4 rounded space-y-2">
                  <div className="flex items-center gap-2 text-cyber-cyan text-xs font-bold uppercase tracking-wider">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>Station Location Beacon</span>
                  </div>
                  <div className="text-base font-bold text-white pl-6">
                    {cp.name}
                  </div>
                  {cp.locationDescription && (
                    <div className="text-xs text-cyber-muted pl-6">
                      📍 {cp.locationDescription}
                    </div>
                  )}
                  {cp.code && (
                    <div className="text-[11px] text-cyber-muted pl-6 font-mono">
                      BEACON CODE: {cp.code}
                    </div>
                  )}
                </div>
              )}

              <p className="text-cyber-muted text-xs leading-relaxed">
                Locate the physical QR station beacon on campus and authenticate with your scanner camera to unlock access to the cipher node.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link to={ROUTES.QR_CHECKPOINT} className="flex-1">
                  <CyberButton variant="orange" size="lg" icon={QrCode} className="w-full justify-center">
                    OPEN QR SCANNER →
                  </CyberButton>
                </Link>
                <Link to={ROUTES.PORTAL_DASHBOARD} className="flex-1">
                  <CyberButton variant="secondary" size="lg" className="w-full justify-center">
                    RETURN TO DASHBOARD
                  </CyberButton>
                </Link>
              </div>
            </div>
          </CyberCard>
        </div>
      </div>
    );
  }

  // 2. Victory / Event Conquered State
  if (data?.isEventComplete || (data?.levelNumber && data.levelNumber > 10)) {
    return (
      <div className="min-h-screen bg-cyber-bg text-cyber-text">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-12">
          <CyberCard title="OPERATION SUCCESS // GRID CONQUERED" glowColor="cyan">
            <div className="text-center py-8 space-y-6">
              <div className="inline-flex p-4 rounded-full bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan animate-pulse">
                <Trophy className="w-16 h-16" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-heading font-black text-white uppercase tracking-wider">
                  ALL CHALLENGES CONQUERED
                </h1>
                <p className="text-cyber-cyan font-mono text-sm">
                  Your squad has infiltrated all 10 defense sectors of The Grid.
                </p>
              </div>
              <p className="text-cyber-muted text-xs max-w-md mx-auto leading-relaxed">
                Congratulations on completing the sequential grid trials! Verify your final standings on the live leaderboard and retrieve your victory token.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                <Link to={ROUTES.FINAL_FLAG}>
                  <CyberButton variant="cyan" size="lg" icon={Sparkles}>
                    SUBMIT FINAL FLAG →
                  </CyberButton>
                </Link>
                <Link to={ROUTES.LEADERBOARD}>
                  <CyberButton variant="secondary" size="lg">
                    VIEW LEADERBOARD
                  </CyberButton>
                </Link>
              </div>
            </div>
          </CyberCard>
        </div>
      </div>
    );
  }

  const { challenge, question, teamChallenge, levelNumber, sequenceNumber, totalQuestions, solvedCount, emptyReason } = data || {};

  // 3. No Questions Configured State
  if (!question || emptyReason) {
    return (
      <div className="min-h-screen bg-cyber-bg text-cyber-text">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-12">
          <CyberCard title={`SECTOR NODE // LEVEL ${levelNumber || 1}`} glowColor="orange">
            <div className="space-y-4 font-mono text-sm py-4">
              <div className="bg-cyber-warning/10 border border-cyber-warning p-5 text-cyber-warning flex items-start gap-3 rounded">
                <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-base">No questions are configured for this level</p>
                  <p className="text-xs text-cyber-warning/90">
                    Organizer question bank is awaiting deployment for this level node. Contact event administrators or monitor announcements.
                  </p>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <Link to={ROUTES.PORTAL_DASHBOARD}>
                  <CyberButton variant="secondary" size="md">
                    ← BACK TO DASHBOARD
                  </CyberButton>
                </Link>
                <Link to={ROUTES.QR_CHECKPOINT}>
                  <CyberButton variant="cyan" size="md">
                    VIEW QR STATIONS
                  </CyberButton>
                </Link>
              </div>
            </div>
          </CyberCard>
        </div>
      </div>
    );
  }

  const attemptsLogged = teamChallenge?.attemptsCount || 0;
  const maxAttemptsAllowed = question?.attempts || 3;
  const attemptsRemaining = Math.max(0, maxAttemptsAllowed - attemptsLogged);

  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text pb-16">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs font-mono text-cyber-muted">
          <div className="flex items-center gap-2">
            <Link to={ROUTES.PORTAL_DASHBOARD} className="hover:text-cyber-cyan transition-colors">
              DASHBOARD
            </Link>
            <span>/</span>
            <span className="text-cyber-cyan">LEVEL {levelNumber}</span>
          </div>
          <Link to={ROUTES.QR_CHECKPOINT} className="flex items-center gap-1.5 hover:text-cyber-cyan transition-colors">
            <QrCode className="w-3.5 h-3.5" />
            <span>QR STATIONS</span>
          </Link>
        </div>

        {/* Level & Question Header Bar */}
        <div className="bg-cyber-panel border border-cyber-border p-5 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={`LEVEL ${levelNumber}`} variant="orange" size="xs" />
              {challenge?.category && (
                <StatusBadge status={challenge.category} variant="cyan" size="xs" />
              )}
              {question?.difficulty && (
                <StatusBadge status={question.difficulty} variant="secondary" size="xs" />
              )}
              <span className="bg-cyber-bg border border-cyber-border text-cyber-muted px-2 py-0.5 text-[11px] font-mono rounded">
                QUESTION {sequenceNumber || 1} OF {totalQuestions || 1}
              </span>
              {solvedCount !== undefined && solvedCount > 0 && (
                <span className="bg-cyber-green/10 text-cyber-green border border-cyber-green/40 px-2 py-0.5 text-[11px] font-mono rounded">
                  {solvedCount} SOLVED
                </span>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-heading font-black text-white uppercase tracking-wide">
              {question.title}
            </h1>
          </div>

          <div className="text-right font-mono bg-cyber-bg/60 border border-cyber-border px-4 py-2.5 rounded shrink-0">
            <span className="text-[10px] text-cyber-muted uppercase block">BOUNTY REWARD</span>
            <span className="text-xl md:text-2xl font-bold text-cyber-cyan">
              +{question.points || challenge?.points || 100} PTS
            </span>
          </div>
        </div>

        {/* Level Complete / Next Checkpoint Banner */}
        {resultMsg?.isLevelComplete && resultMsg?.nextCheckpointLocation && (
          <div className="bg-cyber-cyan/10 border-2 border-cyber-cyan p-5 rounded-lg font-mono space-y-2 animate-pulse">
            <div className="flex items-center gap-2 text-cyber-cyan font-bold text-sm uppercase tracking-wider">
              <MapPin className="w-5 h-5 shrink-0" />
              <span>LEVEL CONQUERED — NEXT CHECKPOINT UNLOCKED</span>
            </div>
            <div className="text-lg font-bold text-white pl-7">
              📍 NEXT CHECKPOINT: {resultMsg.nextCheckpointLocation}
            </div>
            <p className="text-xs text-cyber-muted pl-7">
              All questions in Level {levelNumber} have been solved. Proceed to the physical beacon above and scan to unlock Level {levelNumber + 1}.
            </p>
            <div className="pl-7 pt-2">
              <Link to={ROUTES.QR_CHECKPOINT}>
                <CyberButton variant="cyan" size="sm" icon={QrCode}>
                  OPEN QR SCANNER →
                </CyberButton>
              </Link>
            </div>
          </div>
        )}

        {/* Question Terminal Window */}
        <TerminalWindow title={`TERMINAL // LEVEL ${levelNumber} // QUESTION ${sequenceNumber || 1}`}>
          <div className="space-y-5 font-mono text-xs md:text-sm">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-cyber-muted mb-2 font-bold">
                PROBLEM STATEMENT:
              </p>
              <div className="text-cyber-text whitespace-pre-wrap leading-relaxed bg-black/40 p-4 border border-cyber-border rounded">
                {question.prompt}
              </div>
            </div>

            {question.instructions && (
              <div className="bg-cyber-panel/40 border-l-2 border-cyber-cyan p-3.5 text-xs text-cyber-muted">
                <span className="font-bold text-cyber-cyan uppercase block mb-1">INSTRUCTIONS / CONSTRAINTS:</span>
                <p className="whitespace-pre-wrap">{question.instructions}</p>
              </div>
            )}

            {question.assetUrls && question.assetUrls.length > 0 && (
              <div className="pt-2 border-t border-cyber-border/60">
                <p className="text-cyber-muted text-[11px] uppercase tracking-wider mb-2 font-bold">
                  ATTACHED ARTIFACTS:
                </p>
                <div className="flex flex-wrap gap-2">
                  {question.assetUrls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 bg-cyber-secondary border border-cyber-border px-3 py-1.5 text-xs text-cyber-cyan hover:border-cyber-cyan font-mono rounded transition-colors"
                    >
                      <span>ATTACHMENT_{i + 1}</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TerminalWindow>

        {/* Answer Submission Interface */}
        <CyberCard title="RESPONSE TRANSMISSION INTERFACE" glowColor="cyan">
          <form onSubmit={handleSubmitAnswer} className="space-y-4 font-mono text-xs">
            {/* Feedback Alert */}
            {resultMsg && (
              <div
                className={`p-4 border rounded flex items-start gap-3 ${
                  resultMsg.success
                    ? 'bg-cyber-green/10 border-cyber-green text-cyber-green'
                    : 'bg-cyber-danger/10 border-cyber-danger text-cyber-danger'
                }`}
                role="alert"
              >
                {resultMsg.success ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="font-bold text-sm">{resultMsg.text}</div>
                  {resultMsg.success && resultMsg.pointsAwarded !== undefined && (
                    <div className="text-xs">
                      +{resultMsg.pointsAwarded} points added to squad score!
                    </div>
                  )}
                  {!resultMsg.success && resultMsg.attemptsRemaining !== undefined && (
                    <div className="text-xs opacity-90">
                      Remaining attempts: {resultMsg.attemptsRemaining} of {resultMsg.maxAttempts || maxAttemptsAllowed}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Multiple Choice Options Selector */}
            {question.type === 'Multiple Choice' && Array.isArray(question.options) && question.options.length > 0 && (
              <div className="space-y-2">
                <label className="block text-cyber-muted uppercase tracking-wider text-[11px] font-bold">
                  SELECT OPTION:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {question.options.map((opt, optIdx) => {
                    const isSelected = answer === opt;
                    const letter = String.fromCharCode(65 + optIdx);
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => setAnswer(opt)}
                        className={`flex items-center gap-3 p-3 rounded border text-left transition-all ${
                          isSelected
                            ? 'bg-cyber-cyan/20 border-cyber-cyan text-white shadow-sm'
                            : 'bg-cyber-bg/70 border-cyber-border text-cyber-muted hover:border-cyber-border/80 hover:text-white'
                        }`}
                      >
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 ${
                            isSelected
                              ? 'bg-cyber-cyan text-black'
                              : 'bg-cyber-panel border border-cyber-border text-cyber-muted'
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="text-xs md:text-sm">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Answer Input Field */}
            <div>
              <label className="block text-cyber-muted mb-1.5 uppercase tracking-wider text-[11px] font-bold">
                {question.type === 'Numeric Answer'
                  ? 'ENTER NUMERIC VALUE:'
                  : question.type === 'Multiple Choice'
                  ? 'CONFIRM SELECTED OPTION / ANSWER:'
                  : question.type === 'Flag'
                  ? 'ENTER CAPTURED FLAG (FORMAT: HTG{...}):'
                  : 'ENTER ANSWER STRING:'}
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                {question.type === 'Numeric Answer' ? (
                  <input
                    type="number"
                    step="any"
                    required
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="e.g. 42"
                    className="flex-grow bg-cyber-bg border border-cyber-border focus:border-cyber-cyan text-cyber-text px-4 py-2.5 outline-none font-mono text-sm rounded"
                  />
                ) : (
                  <input
                    type="text"
                    required
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder={
                      question.type === 'Flag'
                        ? 'HTG{captured_flag_string}'
                        : question.type === 'Multiple Choice'
                        ? 'Select an option above or type answer'
                        : question.isCaseSensitive
                        ? 'Enter exact answer (case-sensitive)'
                        : 'Enter answer (case-insensitive)'
                    }
                    className="flex-grow bg-cyber-bg border border-cyber-border focus:border-cyber-cyan text-cyber-text px-4 py-2.5 outline-none font-mono text-sm rounded"
                  />
                )}

                <CyberButton
                  type="submit"
                  variant="cyan"
                  size="md"
                  disabled={submitting || !answer.trim()}
                  icon={Send}
                  className="shrink-0"
                >
                  {submitting ? 'TRANSMITTING...' : 'SUBMIT ANSWER'}
                </CyberButton>
              </div>
            </div>

            {/* Meta & Anti-Brute-Force Information */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-cyber-muted text-[11px] pt-1 gap-1 border-t border-cyber-border/40">
              <div className="flex items-center gap-3">
                <span>Attempts: {attemptsLogged} / {maxAttemptsAllowed}</span>
                <span>•</span>
                <span>Type: {question.type || 'Flag'}</span>
              </div>
              <span className="text-cyber-muted/80">Rate-limited anti-brute-force defense active</span>
            </div>
          </form>
        </CyberCard>
      </div>
    </div>
  );
};

export default ChallengeViewPage;
