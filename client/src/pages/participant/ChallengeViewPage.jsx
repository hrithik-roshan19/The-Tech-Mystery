import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { challengeService } from '../../services/challenge.service';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../../components/navigation/Navbar';
import { CyberCard } from '../../components/common/CyberCard';
import { CyberButton } from '../../components/common/CyberButton';
import { TerminalWindow } from '../../components/common/TerminalWindow';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
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
  HelpCircle,
  RefreshCw,
  Users,
  Radio,
  FileQuestion,
  RotateCcw,
  Clock
} from 'lucide-react';

export const ChallengeViewPage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const targetLevel = params.levelNumber ? parseInt(params.levelNumber, 10) : undefined;

  const [data, setData] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resultMsg, setResultMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [lockedInfo, setLockedInfo] = useState(null);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  const fetchChallenge = useCallback(async () => {
    // If auth state is still resolving, do not fetch yet
    if (authLoading) return;

    // If unauthenticated, do not fire backend call (prevents 401 error and renders State 4 immediately)
    if (!isAuthenticated) {
      setLoading(false);
      setData(null);
      setErrorMsg(null);
      setLockedInfo(null);
      return;
    }

    // If the participant has no squad, avoid firing backend request that triggers 403
    if (user && !user.teamId && user.role !== 'ADMIN') {
      setLoading(false);
      setData(null);
      setErrorMsg(null);
      setLockedInfo(null);
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      setLockedInfo(null);
      setLoadingTimeout(false);
      const res = await challengeService.getCurrentChallenge(targetLevel);
      const payload = res?.data || res;
      setData(payload);
    } catch (err) {
      const errData = err.response?.data?.data;
      if (errData?.isLocked) {
        setLockedInfo(errData);
      }
      const message = err.response?.data?.message || err.message || 'Failed to load active challenge.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, authLoading, targetLevel]);

  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  // Loading safety fallback: after 10s, offer forced reload option
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const handleSubmitAnswer = async (e) => {
    if (e) e.preventDefault();
    const cleanAnswer = String(answer).trim();
    if (!cleanAnswer) return;

    setSubmitting(true);
    setResultMsg(null);
    setErrorMsg(null);

    const levelNumber = data?.levelNumber || targetLevel || 1;
    const questionId = data?.question?._id || null;

    try {
      const res = await challengeService.submitFlag(levelNumber, cleanAnswer, questionId);
      const isLevelComplete = Boolean(res.data?.isLevelComplete);
      const isEventComplete = Boolean(res.data?.isEventComplete);
      const nextQ = res.data?.nextQuestion;
      const nextCpLocation = res.data?.nextLocationName || res.data?.nextCheckpointLocation || res.data?.nextCheckpoint?.name;
      const locInstructions = res.data?.locationInstructions || res.data?.nextCheckpoint?.instructions;

      const pointsWon = res.data?.pointsAwarded;
      const seqNum = res.data?.sequenceNumber;
      const totalQ = res.data?.totalQuestionsInLevel;

      setResultMsg({
        success: true,
        text: res.message || (isLevelComplete
          ? 'Level Complete! All questions conquered.'
          : nextQ
            ? `Correct Answer! +${pointsWon || 100} PTS awarded. Advancing to Question ${seqNum || ''} of ${totalQ || ''}.`
            : 'Correct answer!'),
        pointsAwarded: pointsWon,
        isLevelComplete,
        isEventComplete,
        nextCheckpointLocation: nextCpLocation,
        nextLocationName: nextCpLocation,
        locationInstructions: locInstructions,
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
        // Mark level complete in state so the completion screen stays mounted
        setData((prev) => ({
          ...prev,
          isLevelComplete: true,
          isEventComplete,
          nextCheckpointLocation: nextCpLocation,
          nextLocationName: nextCpLocation,
          locationInstructions: locInstructions,
          solvedCount: (prev?.totalQuestions || prev?.solvedCount || 1)
        }));
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

  // 1. Loading State (Full viewport, cyber styling, high-contrast)
  if (loading || (authLoading && !user)) {
    return (
      <div className="min-h-screen w-full bg-cyber-bg text-cyber-text flex flex-col">
        <Navbar />
        <div className="max-w-4xl w-full mx-auto px-4 py-24 flex-grow flex flex-col items-center justify-center">
          <LoadingSpinner text="DECRYPTING CHALLENGE NODE..." />
          {loadingTimeout && (
            <div className="mt-8 text-center space-y-3 font-mono text-xs max-w-sm">
              <p className="text-cyber-muted">
                Decryption handshake taking longer than expected. The core engine may be sleeping or calibrating.
              </p>
              <div className="flex gap-2 justify-center">
                <CyberButton variant="cyan" size="sm" icon={RefreshCw} onClick={fetchChallenge}>
                  FORCE RECONNECT
                </CyberButton>
                <Link to={ROUTES.LOGIN}>
                  <CyberButton variant="secondary" size="sm" icon={KeyRound}>
                    SIGN IN
                  </CyberButton>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. Authentication Required State (Never silent redirect or hung spinner)
  if (!isAuthenticated && !authLoading) {
    const levelDisplay = targetLevel ? `LEVEL ${targetLevel}` : 'SECTOR ACCESS';
    return (
      <div className="min-h-screen w-full bg-cyber-bg text-cyber-text flex flex-col pb-16">
        <Navbar />
        <main className="max-w-3xl w-full mx-auto px-4 py-12 flex-grow flex items-center justify-center">
          <CyberCard title={`AUTHENTICATION REQUIRED // ${levelDisplay}`} glowColor="cyan" className="w-full">
            <div className="space-y-6 font-mono text-sm">
              <div className="bg-cyber-panel/80 border border-cyber-cyan p-5 text-cyber-text flex items-start gap-4 rounded-none">
                <KeyRound className="w-6 h-6 shrink-0 mt-0.5 text-cyber-cyan" />
                <div className="space-y-1.5">
                  <p className="font-bold uppercase tracking-wider text-base text-white">
                    Operator Telemetry Unverified
                  </p>
                  <p className="text-xs text-cyber-muted leading-relaxed">
                    Challenge terminal decryption nodes require authenticated operative credentials. Log in with your squad credentials or register a squad to begin infiltrating Sector {targetLevel || 'Challenge'} nodes.
                  </p>
                </div>
              </div>

              <div className="bg-cyber-bg/70 border border-cyber-border p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-cyber-cyan font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sequential QR Protocol Overview</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-cyber-muted text-[11px] pl-1">
                  <li>Each sector node is guarded by a physical checkpoint QR beacon on campus.</li>
                  <li>Scan the physical beacon with your squad camera scanner to unlock level questions.</li>
                  <li>Submit flags and problem solutions in sequence to earn bounty points on the live leaderboard.</li>
                </ul>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link to={ROUTES.LOGIN} state={{ from: location }} className="flex-1">
                  <CyberButton variant="cyan" size="lg" icon={KeyRound} className="w-full justify-center">
                    SIGN IN WITH SQUAD ACCOUNT →
                  </CyberButton>
                </Link>
                <Link to={ROUTES.REGISTER} className="flex-1">
                  <CyberButton variant="secondary" size="lg" icon={Users} className="w-full justify-center">
                    REGISTER SQUAD
                  </CyberButton>
                </Link>
                <Link to={ROUTES.CHALLENGES} className="flex-1">
                  <CyberButton variant="secondary" size="lg" className="w-full justify-center">
                    MISSION MAP
                  </CyberButton>
                </Link>
              </div>
            </div>
          </CyberCard>
        </main>
      </div>
    );
  }

  // 2. Unaffiliated Participant / Squad Required State
  if (user && !user.teamId && user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen w-full bg-cyber-bg text-cyber-text flex flex-col pb-16">
        <Navbar />
        <div className="max-w-3xl w-full mx-auto px-4 py-12 flex-grow flex items-center justify-center">
          <CyberCard title="SQUAD FORMATION REQUIRED // SECTOR ACCESS LOCKED" glowColor="orange" className="w-full">
            <div className="space-y-6 font-mono text-sm">
              <div className="bg-cyber-warning/10 border border-cyber-warning p-5 text-cyber-warning flex items-start gap-4 rounded">
                <Users className="w-6 h-6 shrink-0 mt-0.5 text-cyber-warning" />
                <div className="space-y-1">
                  <p className="font-bold uppercase tracking-wider text-base">Squad Affiliation Required</p>
                  <p className="text-xs text-cyber-warning/90 leading-relaxed">
                    Challenge terminals require authenticated squad telemetry. You must create or join a squad before attempting level decryption.
                  </p>
                </div>
              </div>

              <p className="text-cyber-muted text-xs leading-relaxed">
                Form a squad with 2–4 campus operators or join an existing squad using their team join code from the participant command console.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link to={ROUTES.PORTAL_DASHBOARD} className="flex-1">
                  <CyberButton variant="cyan" size="lg" icon={Users} className="w-full justify-center">
                    INITIALIZE / JOIN SQUAD →
                  </CyberButton>
                </Link>
                <Link to={ROUTES.RULES} className="flex-1">
                  <CyberButton variant="secondary" size="lg" className="w-full justify-center">
                    VIEW COMPETITION RULES
                  </CyberButton>
                </Link>
              </div>
            </div>
          </CyberCard>
        </div>
      </div>
    );
  }

  // 3. Physical QR Checkpoint Required / Locked State
  if (lockedInfo?.isLocked) {
    const cp = lockedInfo?.checkpoint;
    const lvl = lockedInfo?.levelNumber || data?.levelNumber || 1;

    return (
      <div className="min-h-screen w-full bg-cyber-bg text-cyber-text flex flex-col pb-16">
        <Navbar />
        <div className="max-w-3xl w-full mx-auto px-4 py-12 space-y-6 flex-grow">
          <CyberCard title={`SECURITY LOCK ACTIVE // LEVEL ${lvl}`} glowColor="orange">
            <div className="space-y-6 font-mono text-sm">
              <div className="bg-cyber-warning/10 border border-cyber-warning p-5 text-cyber-warning flex items-start gap-4 rounded">
                <Lock className="w-6 h-6 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold uppercase tracking-wider text-base">Checkpoint Scan Required</p>
                  <p className="text-xs text-cyber-warning/90 leading-relaxed">
                    Physical checkpoint QR beacon must be authenticated to decrypt this level node.
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

  // 4. Event Lifecycle Standby / Not Live Error State
  const isEventNotLive =
    errorMsg &&
    (/live|maintenance|not started|concluded|closed/i.test(errorMsg));

  if (isEventNotLive && !data) {
    return (
      <div className="min-h-screen w-full bg-cyber-bg text-cyber-text flex flex-col pb-16">
        <Navbar />
        <div className="max-w-3xl w-full mx-auto px-4 py-12 flex-grow flex items-center justify-center">
          <CyberCard title="SYSTEM STANDBY // EVENT LIFECYCLE NOTICE" glowColor="orange" className="w-full">
            <div className="space-y-6 font-mono text-sm">
              <div className="bg-cyber-warning/10 border border-cyber-warning p-5 text-cyber-warning flex items-start gap-4 rounded">
                <Clock className="w-6 h-6 shrink-0 mt-0.5 text-cyber-warning" />
                <div className="space-y-1">
                  <p className="font-bold uppercase tracking-wider text-base">Event Awaiting Official Commencement</p>
                  <p className="text-xs text-cyber-warning/90 leading-relaxed">
                    {errorMsg}
                  </p>
                </div>
              </div>

              <div className="bg-cyber-panel/60 border border-cyber-border p-4 rounded space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-cyber-muted">OPERATIONAL STATUS:</span>
                  <StatusBadge status="REGISTRATION OPEN" variant="orange" size="xs" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-cyber-muted">REQUIRED FOR GAMEPLAY:</span>
                  <StatusBadge status="EVENT LIVE" variant="green" size="xs" />
                </div>
                <p className="text-cyber-muted text-[11px] leading-relaxed pt-1">
                  The challenge network and decryption nodes will activate as soon as event administrators transition the system to LIVE. Monitor campus announcements for the kickoff signal.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <CyberButton
                  variant="cyan"
                  size="lg"
                  icon={RefreshCw}
                  onClick={fetchChallenge}
                  className="flex-1 justify-center"
                >
                  CHECK LIVE STATUS
                </CyberButton>
                <Link to={ROUTES.CHALLENGES} className="flex-1">
                  <CyberButton variant="secondary" size="lg" className="w-full justify-center">
                    VIEW MISSION MAP
                  </CyberButton>
                </Link>
                <Link to={ROUTES.PORTAL_DASHBOARD} className="flex-1">
                  <CyberButton variant="secondary" size="lg" className="w-full justify-center">
                    DASHBOARD
                  </CyberButton>
                </Link>
              </div>
            </div>
          </CyberCard>
        </div>
      </div>
    );
  }

  // 5. Squad Size Requirements Error State
  const isTeamSizeError =
    errorMsg &&
    (/team-size|minimum|size requirement|members/i.test(errorMsg));

  if (isTeamSizeError && !data) {
    return (
      <div className="min-h-screen w-full bg-cyber-bg text-cyber-text flex flex-col pb-16">
        <Navbar />
        <div className="max-w-3xl w-full mx-auto px-4 py-12 flex-grow flex items-center justify-center">
          <CyberCard title="SQUAD VERIFICATION // TEAM SIZE NOTICE" glowColor="orange" className="w-full">
            <div className="space-y-6 font-mono text-sm">
              <div className="bg-cyber-warning/10 border border-cyber-warning p-5 text-cyber-warning flex items-start gap-4 rounded">
                <Users className="w-6 h-6 shrink-0 mt-0.5 text-cyber-warning" />
                <div className="space-y-1">
                  <p className="font-bold uppercase tracking-wider text-base">Minimum Squad Size Not Met</p>
                  <p className="text-xs text-cyber-warning/90 leading-relaxed">
                    {errorMsg}. Each squad must have between 2 and 4 verified team members to begin challenge infiltration.
                  </p>
                </div>
              </div>

              <p className="text-cyber-muted text-xs leading-relaxed">
                Share your squad join code from your squad dashboard with teammates to add them to your roster.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link to={ROUTES.PORTAL_DASHBOARD} className="flex-1">
                  <CyberButton variant="cyan" size="lg" icon={Users} className="w-full justify-center">
                    MANAGE SQUAD ROSTER →
                  </CyberButton>
                </Link>
                <CyberButton
                  variant="secondary"
                  size="lg"
                  icon={RefreshCw}
                  onClick={fetchChallenge}
                  className="flex-1 justify-center"
                >
                  RETRY VERIFICATION
                </CyberButton>
              </div>
            </div>
          </CyberCard>
        </div>
      </div>
    );
  }

  // 6. Generic API / Connection Error State
  if (errorMsg && !data) {
    return (
      <div className="min-h-screen w-full bg-cyber-bg text-cyber-text flex flex-col pb-16">
        <Navbar />
        <div className="max-w-3xl w-full mx-auto px-4 py-12 flex-grow flex items-center justify-center">
          <CyberCard title="TERMINAL LINK EXCEPTION // ACCESS BLOCKED" glowColor="danger" className="w-full">
            <div className="space-y-6 font-mono text-sm">
              <div className="bg-cyber-danger/10 border border-cyber-danger p-5 text-cyber-danger flex items-start gap-4 rounded">
                <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5 text-cyber-danger" />
                <div className="space-y-1">
                  <p className="font-bold uppercase tracking-wider text-base">Decryption Handshake Failed</p>
                  <p className="text-xs text-cyber-danger/90 leading-relaxed break-words font-mono">
                    {errorMsg}
                  </p>
                </div>
              </div>

              <p className="text-cyber-muted text-xs leading-relaxed">
                The terminal could not retrieve the active challenge telemetry. Ensure your squad credentials and network connection are active.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <CyberButton
                  variant="cyan"
                  size="lg"
                  icon={RotateCcw}
                  onClick={fetchChallenge}
                  className="flex-1 justify-center"
                >
                  RETRY CONNECTION
                </CyberButton>
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

  // 7. Victory / Event Conquered State
  if (data?.isEventComplete || (data?.levelNumber && data.levelNumber > 10)) {
    return (
      <div className="min-h-screen w-full bg-cyber-bg text-cyber-text flex flex-col pb-16">
        <Navbar />
        <div className="max-w-3xl w-full mx-auto px-4 py-12 flex-grow flex items-center justify-center">
          <CyberCard title="OPERATION SUCCESS // GRID CONQUERED" glowColor="cyan" className="w-full">
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
              <p className="text-cyber-muted text-xs max-w-md mx-auto leading-relaxed font-mono">
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

  // 8. Level Completed Screen (Reveals admin-controlled next location only after completing current level)
  const isLevelCompleted =
    (!data?.isEventComplete && !resultMsg?.isEventComplete) &&
    (Boolean(resultMsg?.isLevelComplete) || Boolean(data?.isLevelComplete));

  if (isLevelCompleted) {
    const completedLevel = data?.levelNumber || targetLevel || 1;
    const nextLoc =
      resultMsg?.nextLocationName ||
      resultMsg?.nextCheckpointLocation ||
      data?.nextLocationName ||
      data?.nextCheckpointLocation ||
      data?.nextCheckpoint?.locationDescription ||
      data?.nextCheckpoint?.name ||
      null;
    const instructions =
      resultMsg?.locationInstructions ||
      data?.locationInstructions ||
      data?.nextCheckpoint?.instructions;
    const pointsWon = resultMsg?.pointsAwarded;

    return (
      <div className="min-h-screen w-full bg-cyber-bg text-cyber-text flex flex-col pb-16">
        <Navbar />
        <main className="max-w-3xl w-full mx-auto px-4 py-12 flex-grow flex items-center justify-center">
          <CyberCard
            title={`LEVEL ${completedLevel} CONQUERED // CHECKPOINT COMPLETED`}
            glowColor="cyan"
            className="w-full"
          >
            <div className="space-y-6 font-mono text-sm">
              <div className="bg-cyber-green/10 border-2 border-cyber-green p-5 text-cyber-green flex items-start gap-4 rounded-none">
                <CheckCircle2 className="w-7 h-7 shrink-0 mt-0.5 text-cyber-green" />
                <div className="space-y-1.5">
                  <h2 className="font-heading font-black text-lg md:text-xl text-white tracking-wide uppercase">
                    Correct Answer! Checkpoint Completed
                  </h2>
                  <p className="text-xs text-cyber-green/90 leading-relaxed font-mono">
                    All challenges and defense nodes in Level {completedLevel} have been successfully solved by your squad.
                    {pointsWon ? ` +${pointsWon} points awarded to your squad bounty!` : ''}
                  </p>
                </div>
              </div>

              <div className="bg-cyber-panel/90 border-2 border-cyber-cyan p-6 space-y-4 rounded-none shadow-panel-glow">
                <div className="flex items-center gap-2 text-cyber-cyan text-xs font-bold uppercase tracking-widest border-b border-cyber-border pb-2">
                  <MapPin className="w-5 h-5 shrink-0 animate-bounce text-cyber-cyan" />
                  <span>🎯 NEXT LOCATION UNLOCKED</span>
                </div>

                <div className="space-y-2 pl-2">
                  <span className="text-xs uppercase text-cyber-muted block font-semibold">
                    YOUR NEXT LOCATION:
                  </span>
                  <div className="text-xl md:text-2xl font-heading font-black text-white tracking-wide flex items-center gap-2 text-cyber-cyan">
                    📍 {nextLoc ? nextLoc : (
                      <span className="text-amber-400 font-sans text-base">
                        Location not configured <em className="text-xs text-amber-200/80">(Coordinates pending from event staff)</em>
                      </span>
                    )}
                  </div>
                </div>

                {instructions && (
                  <div className="bg-cyber-bg/80 border-l-2 border-cyber-cyan p-3 text-xs text-cyber-muted font-mono whitespace-pre-wrap ml-2">
                    <span className="text-[10px] text-cyber-cyan uppercase font-bold block mb-1">
                      LOCATION INSTRUCTIONS & GUIDANCE:
                    </span>
                    {instructions}
                  </div>
                )}

                <div className="pt-2 text-xs text-cyber-muted border-t border-cyber-border/70 space-y-1">
                  <p className="text-white font-semibold flex items-center gap-2">
                    <Radio className="w-4 h-4 text-cyber-cyan" />
                    <span>Proceed to this location and scan its QR code to continue to the next level.</span>
                  </p>
                  <p className="text-[11px] text-cyber-muted">
                    Level {completedLevel + 1} remains locked until your squad arrives at this station and authenticates the physical QR beacon.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link to={completedLevel + 1 > 10 ? ROUTES.FINAL_FLAG : ROUTES.QR_CHECKPOINT} className="flex-1">
                  <CyberButton variant="cyan" size="lg" icon={QrCode} className="w-full justify-center">
                    NAVIGATE TO NEXT LOCATION →
                  </CyberButton>
                </Link>
                <Link to={ROUTES.PORTAL_DASHBOARD} className="flex-1">
                  <CyberButton variant="secondary" size="lg" className="w-full justify-center">
                    RETURN TO DASHBOARD
                  </CyberButton>
                </Link>
                <Link to={ROUTES.LEADERBOARD} className="flex-1">
                  <CyberButton variant="secondary" size="lg" icon={Trophy} className="w-full justify-center">
                    LEADERBOARD
                  </CyberButton>
                </Link>
              </div>
            </div>
          </CyberCard>
        </main>
      </div>
    );
  }

  const { challenge, question, teamChallenge, levelNumber, sequenceNumber, totalQuestions, solvedCount, emptyReason } = data || {};

  // 8. No Questions Configured State
  if (!question || emptyReason) {
    return (
      <div className="min-h-screen w-full bg-cyber-bg text-cyber-text flex flex-col pb-16">
        <Navbar />
        <div className="max-w-3xl w-full mx-auto px-4 py-12 flex-grow flex items-center justify-center">
          <CyberCard title={`SECTOR NODE // LEVEL ${levelNumber || 1}`} glowColor="orange" className="w-full">
            <div className="space-y-4 font-mono text-sm py-4">
              <div className="bg-cyber-warning/10 border border-cyber-warning p-5 text-cyber-warning flex items-start gap-3 rounded">
                <FileQuestion className="w-6 h-6 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-base">No Questions Configured For This Level</p>
                  <p className="text-xs text-cyber-warning/90 leading-relaxed">
                    {emptyReason || 'Organizer question bank is awaiting deployment for this level node. Contact event administrators or monitor campus broadcasts.'}
                  </p>
                </div>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Link to={ROUTES.PORTAL_DASHBOARD} className="flex-1">
                  <CyberButton variant="secondary" size="md" className="w-full justify-center">
                    ← BACK TO DASHBOARD
                  </CyberButton>
                </Link>
                <Link to={ROUTES.QR_CHECKPOINT} className="flex-1">
                  <CyberButton variant="cyan" size="md" className="w-full justify-center">
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

  // 9. Active Question & Submission Interface State
  return (
    <div className="min-h-screen w-full bg-cyber-bg text-cyber-text flex flex-col pb-16">
      <Navbar />

      <main className="max-w-4xl w-full mx-auto px-4 py-8 space-y-6 flex-grow">
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
        <div className="bg-cyber-panel border border-cyber-border p-5 rounded-none flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-panel-glow">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={`LEVEL ${levelNumber}`} variant="orange" size="xs" />
              {challenge?.category && (
                <StatusBadge status={challenge.category} variant="cyan" size="xs" />
              )}
              {question?.difficulty && (
                <StatusBadge status={question.difficulty} variant="secondary" size="xs" />
              )}
              <span className="bg-cyber-bg border border-cyber-border text-cyber-muted px-2 py-0.5 text-[11px] font-mono rounded-none">
                QUESTION {sequenceNumber || 1} OF {totalQuestions || 1}
              </span>
              {solvedCount !== undefined && solvedCount > 0 && (
                <span className="bg-cyber-green/10 text-cyber-green border border-cyber-green/40 px-2 py-0.5 text-[11px] font-mono rounded-none">
                  {solvedCount} SOLVED
                </span>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-heading font-black text-white uppercase tracking-wide">
              {question.title || `Challenge ${levelNumber}`}
            </h1>
          </div>

          <div className="text-right font-mono bg-cyber-bg/60 border border-cyber-border px-4 py-2.5 rounded-none shrink-0">
            <span className="text-[10px] text-cyber-muted uppercase block">BOUNTY REWARD</span>
            <span className="text-xl md:text-2xl font-bold text-cyber-cyan">
              +{question.points || challenge?.points || 100} PTS
            </span>
          </div>
        </div>

        {/* Level Complete / Next Checkpoint Banner */}
        {resultMsg?.isLevelComplete && resultMsg?.nextCheckpointLocation && (
          <div className="bg-cyber-cyan/10 border-2 border-cyber-cyan p-5 rounded-none font-mono space-y-2 animate-pulse">
            <div className="flex items-center gap-2 text-cyber-cyan font-bold text-sm uppercase tracking-wider">
              <MapPin className="w-5 h-5 shrink-0" />
              <span>🎯 NEXT LOCATION UNLOCKED</span>
            </div>
            <div className="text-lg font-bold text-white pl-7">
              📍 NEXT CHECKPOINT: {resultMsg.nextCheckpointLocation}
            </div>
            <p className="text-xs text-cyber-muted pl-7">
              Level {levelNumber} conquered! Proceed to the physical beacon above and scan to unlock Level {levelNumber + 1}.
            </p>
            <div className="pl-7 pt-2">
              <Link to={levelNumber + 1 > 10 ? ROUTES.FINAL_FLAG : ROUTES.QR_CHECKPOINT}>
                <CyberButton variant="cyan" size="sm" icon={QrCode}>
                  NAVIGATE TO NEXT LOCATION →
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
              <div className="text-cyber-text whitespace-pre-wrap break-words leading-relaxed bg-black/40 p-4 border border-cyber-border rounded-none overflow-x-auto">
                {question.prompt || 'No question prompt available.'}
              </div>
            </div>

            {question.instructions && (
              <div className="bg-cyber-panel/40 border-l-2 border-cyber-cyan p-3.5 text-xs text-cyber-muted">
                <span className="font-bold text-cyber-cyan uppercase block mb-1">INSTRUCTIONS / CONSTRAINTS:</span>
                <p className="whitespace-pre-wrap break-words">{question.instructions}</p>
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
                      className="inline-flex items-center gap-1.5 bg-cyber-secondary border border-cyber-border px-3 py-1.5 text-xs text-cyber-cyan hover:border-cyber-cyan font-mono rounded-none transition-colors"
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
                className={`p-4 border rounded-none flex items-start gap-3 ${
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

            {/* Locked notice when questions remain */}
            {resultMsg?.success && !resultMsg?.isLevelComplete && (
              <div className="bg-cyber-warning/10 border border-cyber-warning p-4 rounded text-xs text-cyber-warning font-mono space-y-1">
                <div className="flex items-center gap-2 font-bold uppercase">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>NEXT CHECKPOINT (LEVEL {levelNumber + 1}) LOCKED</span>
                </div>
                <p className="text-cyber-warning/90 leading-relaxed text-[11px]">
                  Checkpoint Level {levelNumber + 1} is locked. Solve your assigned challenge question in Level {levelNumber} to unlock the next campus QR station.
                </p>
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
                        className={`flex items-center gap-3 p-3 rounded-none border text-left transition-all ${
                          isSelected
                            ? 'bg-cyber-cyan/20 border-cyber-cyan text-white shadow-sm'
                            : 'bg-cyber-bg/70 border-cyber-border text-cyber-muted hover:border-cyber-cyan/50 hover:text-white'
                        }`}
                      >
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-none text-xs font-bold shrink-0 ${
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
                    className="flex-grow bg-cyber-bg border border-cyber-border focus:border-cyber-cyan text-cyber-text px-4 py-2.5 outline-none font-mono text-sm rounded-none"
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
                        ? 'Select an option above or enter option (A, B, C, D)'
                        : question.isCaseSensitive
                        ? 'Enter exact answer (case-sensitive)'
                        : 'Enter answer (case-insensitive)'
                    }
                    className="flex-grow bg-cyber-bg border border-cyber-border focus:border-cyber-cyan text-cyber-text px-4 py-2.5 outline-none font-mono text-sm rounded-none"
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
      </main>
    </div>
  );
};

export default function ChallengeViewPageWrapper(props) {
  return (
    <ErrorBoundary title="CHALLENGE TERMINAL EXCEPTION // CONTAINED">
      <ChallengeViewPage {...props} />
    </ErrorBoundary>
  );
}
