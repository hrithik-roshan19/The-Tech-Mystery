import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { challengeService } from "../../services/challenge.service";
import { teamService } from "../../services/team.service";
import { ROUTES } from "../../constants/routes";
import Navbar from "../../components/navigation/Navbar";
import {
  Target,
  Users,
  Trophy,
  Key,
  Send,
  QrCode,
  ChevronRight,
  FileText,
  AlertTriangle,
  Check,
  Menu,
  X,
  Flag,
  Sparkles,
} from "lucide-react";
import "../../styles/FinalFlagPage.css";

const navLinks = [
  { label: "MISSION", path: ROUTES.MISSION },
  { label: "HOW IT WORKS", path: "/mission#how-it-works" },
  { label: "CHALLENGES", path: ROUTES.CHALLENGES },
  { label: "QR CHECKPOINT", path: ROUTES.QR_CHECKPOINT },
  { label: "LEADERBOARD", path: ROUTES.LEADERBOARD },
  { label: "FINAL FLAG", path: ROUTES.FINAL_FLAG, active: true },
];


export default function FinalFlagPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [team, setTeam] = useState(null);
  const [flag, setFlag] = useState("");
  const [status, setStatus] = useState("idle"); // idle | checking | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [solveStats, setSolveStats] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const normalizedFlag = useMemo(() => flag.trim(), [flag]);

  const timelineCheckpoints = useMemo(() => {
    const curLevel = team?.currentLevel || 1;
    const stages = [
      { id: "CP-01", name: "Main Gate", level: 1 },
      { id: "CP-02", name: "Central Lawn", level: 2 },
      { id: "CP-03", name: "Library Block", level: 3 },
      { id: "CP-04", name: "CSE Block", level: 4 },
      { id: "CP-09", name: "Final Room", level: 9 },
      { id: "CP-10", name: "Final Flag", level: 10, isTarget: true },
    ];
    return stages.map((cp) => ({
      ...cp,
      solved: !cp.isTarget && Boolean(team && curLevel > cp.level),
      isTarget: Boolean(cp.isTarget),
    }));
  }, [team]);

  // Load team info on mount
  useEffect(() => {
    let isMounted = true;
    async function loadTeam() {
      if (isAuthenticated) {
        try {
          const res = await teamService.getMyTeam();
          if (isMounted && res.success && res.data?.team) {
            const teamData = res.data.team;
            setTeam(teamData);
            if (teamData.currentLevel > 10) {
              setStatus("success");
            }
          }
        } catch {
          // Preview fallback
        }
      }
    }
    loadTeam();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  async function onSubmitFlag(event) {
    event.preventDefault();
    if (!normalizedFlag || status === "checking" || status === "success") return;

    if (!isAuthenticated) {
      setStatus("error");
      setErrorMessage("Please login with your team account to submit the Final Flag.");
      return;
    }

    if (!user?.teamId) {
      setStatus("error");
      setErrorMessage("You must create or join a registered squad before attempting the Final Flag.");
      return;
    }

    if (team && team.currentLevel < 10) {
      setStatus("error");
      setErrorMessage(
        `Your squad is currently at Level ${team.currentLevel}. Clear all previous 9 levels first.`
      );
      return;
    }

    setStatus("checking");
    setErrorMessage("");

    try {
      const result = await challengeService.submitFlag(10, normalizedFlag);
      if (result.success && result.data?.isCorrect) {
        setStatus("success");
        setSolveStats(result.data);
      } else {
        setStatus("error");
        setErrorMessage(
          result.message || "Invalid flag string. Check format HTG{...} and casing."
        );
      }
    } catch (err) {
      const serverMessage =
        err.response?.data?.message || err.message || "Flag verification failed.";
      if (
        serverMessage.toLowerCase().includes("already been solved") ||
        serverMessage.toLowerCase().includes("already solved")
      ) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(serverMessage);
      }
    }
  }

  return (
    <div className="ff-page-wrapper">
      {/* Background layer with campus and grid effects */}
      <div className="ff-bg-canvas" aria-hidden="true">
        <div className="ff-bg-campus" />
        <div className="ff-bg-grid" />
        <div className="ff-bg-vignette" />
        <div className="ff-bg-glow-flag" />
      </div>

      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Container */}
      <main className="ff-content-container">
        {/* Success Modal / Celebration Banner if Solved */}
        {status === "success" && (
          <div className="ff-victory-alert-banner" role="status" aria-live="polite">
            <div className="ff-victory-banner-inner">
              <div className="ff-victory-banner-icon">
                <Sparkles size={24} />
              </div>
              <div className="ff-victory-banner-text">
                <h3>VICTORY CONFIRMED! THE FINAL GATE HAS BEEN BREACHED.</h3>
                <p>
                  Your squad has captured the Master Flag and conquered The Tech Mystery 2026.
                  {solveStats?.pointsAwarded && ` +${solveStats.pointsAwarded} PTS awarded.`}
                </p>
              </div>
              <div className="ff-victory-banner-buttons">
                <Link to={ROUTES.LEADERBOARD} className="ff-btn-banner-lb">
                  VIEW LEADERBOARD →
                </Link>
                <Link to={ROUTES.DASHBOARD} className="ff-btn-banner-dash">
                  PORTAL
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* HERO SECTION */}
        <section className="ff-hero-section">
          {/* Left Column: Heading, Tagline, Description, 3 Stat Cards */}
          <div className="ff-hero-left">
            <div className="ff-hero-badge">
              <span className="ff-badge-flag">⚑</span>
              <span className="ff-badge-text">FINAL CHALLENGE</span>
            </div>

            <h1 className="ff-hero-title">
              <span className="ff-title-white">THE LAST FLAG</span>
              <span className="ff-title-lime">AWAITS</span>
            </h1>

            <p className="ff-hero-subheading">
              YOU'VE SCANNED. YOU'VE SOLVED. NOW CLAIM VICTORY.
            </p>

            <p className="ff-hero-description">
              The final flag is hidden. Only the most persistent, sharpest minds
              and true problem solvers make it here. Find it, capture it, and
              etch your team's name on the leaderboard.
            </p>

            {/* 3 Stat Cards Row */}
            <div className="ff-hero-stats-row">
              <div className="ff-stat-card">
                <div className="ff-stat-icon-wrap">
                  <Target size={20} className="ff-stat-icon" />
                </div>
                <div className="ff-stat-info">
                  <div className="ff-stat-val">Level 10</div>
                  <div className="ff-stat-lbl">Final Challenge</div>
                </div>
              </div>

              <div className="ff-stat-card">
                <div className="ff-stat-icon-wrap">
                  <Users size={20} className="ff-stat-icon" />
                </div>
                <div className="ff-stat-info">
                  <div className="ff-stat-val">1 Flag</div>
                  <div className="ff-stat-lbl">Ultimate Goal</div>
                </div>
              </div>

              <div className="ff-stat-card">
                <div className="ff-stat-icon-wrap">
                  <Trophy size={20} className="ff-stat-icon" />
                </div>
                <div className="ff-stat-info">
                  <div className="ff-stat-val">Maximum Points</div>
                  <div className="ff-stat-lbl ff-stat-pts">500 pts</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Impact Flag & Rocks Artwork */}
          <div className="ff-hero-right">
            <div className="ff-art-frame">
              <img
                src="/final-flag-hero-art.png"
                alt="The Tech Mystery Final Flag artwork on rocky peak"
                className="ff-hero-artwork-img"
              />
            </div>
          </div>
        </section>

        {/* LOWER SECTION: Two Prominent Panels */}
        <section className="ff-lower-grid">
          {/* LEFT PANEL: Submit Final Flag (56%–58% width) */}
          <article className="ff-card-panel ff-panel-submit">
            <div className="ff-submit-card-layout">
              {/* Left Sub-Column: Form & QR scan action */}
              <div className="ff-submit-subcol-form">
                <div className="ff-panel-header">
                  <h2 className="ff-panel-title">
                    Submit <span className="ff-lime-text">Final Flag</span>
                  </h2>
                  <p className="ff-panel-subtitle">
                    Enter the final flag you found after completing all challenges.
                  </p>
                </div>

                <form onSubmit={onSubmitFlag} className="ff-form">
                  <div className={`ff-input-container ${errorMessage ? "has-error" : ""}`}>
                    <Key size={18} className="ff-key-icon" />
                    <input
                      type="text"
                      className="ff-flag-input"
                      placeholder="Enter your flag here (e.g. HTG{...})"
                      value={flag}
                      onChange={(e) => {
                        setFlag(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      disabled={status === "checking" || status === "success"}
                      autoComplete="off"
                      spellCheck="false"
                      aria-label="Final Flag Submission Input"
                    />
                  </div>

                  {errorMessage && (
                    <div className="ff-error-banner" role="alert">
                      <AlertTriangle size={15} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="ff-btn-submit"
                    disabled={status === "checking" || status === "success"}
                  >
                    <Send size={16} className="ff-send-icon" />
                    <span>{status === "checking" ? "Verifying Flag..." : "Submit Flag"}</span>
                  </button>
                </form>

                {/* OR Divider */}
                <div className="ff-or-divider">
                  <div className="ff-divider-line" />
                  <span className="ff-divider-text">OR</span>
                  <div className="ff-divider-line" />
                </div>

                {/* Scan Final Flag QR Action Card */}
                <div
                  className="ff-qr-action-card"
                  onClick={() => navigate(ROUTES.QR_CHECKPOINT)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") navigate(ROUTES.QR_CHECKPOINT);
                  }}
                >
                  <div className="ff-qr-icon-box">
                    <QrCode size={22} className="ff-lime-text" />
                  </div>
                  <div className="ff-qr-copy">
                    <strong className="ff-qr-title">Scan Final Flag QR</strong>
                    <span className="ff-qr-desc">Use camera to scan the final flag</span>
                  </div>
                  <ChevronRight size={20} className="ff-qr-chevron" />
                </div>
              </div>

              {/* Right Sub-Column: Requirements & Important */}
              <div className="ff-submit-subcol-rules">
                {/* Requirements */}
                <div className="ff-rules-block">
                  <div className="ff-rules-heading">
                    <FileText size={16} className="ff-rules-header-icon" />
                    <span>Requirements</span>
                  </div>
                  <ul className="ff-rules-list ff-req-list">
                    <li>
                      <span className="ff-check-bullet">
                        <Check size={11} />
                      </span>
                      <span>Complete all previous checkpoints</span>
                    </li>
                    <li>
                      <span className="ff-check-bullet">
                        <Check size={11} />
                      </span>
                      <span>Solve all required challenges</span>
                    </li>
                    <li>
                      <span className="ff-check-bullet">
                        <Check size={11} />
                      </span>
                      <span>Obtain the final flag</span>
                    </li>
                    <li>
                      <span className="ff-check-bullet">
                        <Check size={11} />
                      </span>
                      <span>Submit to claim victory</span>
                    </li>
                  </ul>
                </div>

                {/* Important */}
                <div className="ff-rules-block">
                  <div className="ff-rules-heading ff-important-heading">
                    <AlertTriangle size={16} className="ff-important-icon" />
                    <span>Important</span>
                  </div>
                  <ul className="ff-rules-list ff-important-list">
                    <li>
                      <span className="ff-dot-bullet">•</span>
                      <span>Flag is case sensitive</span>
                    </li>
                    <li>
                      <span className="ff-dot-bullet">•</span>
                      <span>Ensure the correct format (e.g. HTG&#123;...&#125;)</span>
                    </li>
                    <li>
                      <span className="ff-dot-bullet">•</span>
                      <span>You can submit only once</span>
                    </li>
                    <li>
                      <span className="ff-dot-bullet">•</span>
                      <span>Wrong submission may result in a penalty</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </article>

          {/* RIGHT PANEL: Victory Awaits (42%–44% width) */}
          <article className="ff-card-panel ff-panel-victory">
            <div className="ff-victory-header">
              <div className="ff-trophy-orbit">
                <Trophy size={32} className="ff-trophy-svg" />
              </div>
              <h2 className="ff-victory-title">VICTORY AWAITS</h2>
              <p className="ff-victory-subtitle">
                Be the team that captures the final flag and completes the grid.
              </p>
            </div>

            {/* Checkpoint Progression Timeline */}
            <div className="ff-timeline-container" aria-label="Checkpoint Timeline">
              <div className="ff-timeline-track">
                {timelineCheckpoints.map((cp, idx) => {
                  const isLast = idx === timelineCheckpoints.length - 1;
                  return (
                    <div
                      key={cp.id}
                      className={`ff-timeline-node ${cp.isTarget ? "is-target" : "is-solved"}`}
                    >
                      {/* Connecting Line to next node */}
                      {!isLast && (
                        <div
                          className={`ff-node-connector ${
                            idx === timelineCheckpoints.length - 2 ? "to-target" : ""
                          }`}
                        />
                      )}

                      {/* Circle Indicator */}
                      <div className="ff-node-circle">
                        {cp.isTarget ? (
                          <Flag size={14} className="ff-node-flag-icon" />
                        ) : (
                          <Check size={12} className="ff-node-check-icon" />
                        )}
                      </div>

                      {/* Labels */}
                      <div className="ff-node-labels">
                        <span className="ff-node-id">{cp.id}</span>
                        <span className="ff-node-name">{cp.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quotation */}
            <div className="ff-victory-quote-card">
              <div className="ff-quote-box">
                <span className="ff-quote-mark left">“</span>
                <div className="ff-quote-text-center">
                  <p className="ff-quote-line-1">It's not just a flag.</p>
                  <p className="ff-quote-line-2">It's proof that you conquered the grid.</p>
                </div>
                <span className="ff-quote-mark right">”</span>
              </div>
              <div className="ff-quote-author">— The Tech Mystery 2026</div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
