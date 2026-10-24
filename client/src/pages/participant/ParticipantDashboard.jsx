import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import { teamService } from "../../services/team.service";
import { challengeService } from "../../services/challenge.service";
import { leaderboardService } from "../../services/leaderboard.service";
import "../../styles/ParticipantDashboard.css";

function StatCard({ icon, value, label, children }) {
  return (
    <article className="pd-stat-card">
      <span className="pd-stat-icon" aria-hidden="true">{icon}</span>
      <div className="pd-stat-main">
        <strong>{value}</strong>
        <span>{label}</span>
        {children}
      </div>
    </article>
  );
}

export default function ParticipantDashboard() {
  const { user, updateTeamMembership, refreshUser } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Live state
  const [team, setTeam] = useState(null);
  const [missionMap, setMissionMap] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [topTeams, setTopTeams] = useState([]);
  const [isLive, setIsLive] = useState(false);

  // Squad formation interactive state
  const [onboardingTab, setOnboardingTab] = useState("create"); // "create" | "join"
  const [createName, setCreateName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);

  const loadLiveData = async () => {
    try {
      // 1. Team data
      if (user?.teamId) {
        const teamRes = await teamService.getMyTeam();
        if (teamRes.success && teamRes.data?.team) {
          setTeam(teamRes.data.team);
          setIsLive(true);
        }
      } else {
        setTeam(null);
      }

      // 2. Mission map & Current Challenge
      if (user?.teamId) {
        const [mapRes, curRes] = await Promise.allSettled([
          challengeService.getMissionMap(),
          challengeService.getCurrentChallenge(),
        ]);

        if (mapRes.status === "fulfilled" && mapRes.value.success && Array.isArray(mapRes.value.data?.missionMap)) {
          setMissionMap(mapRes.value.data.missionMap);
        }
        if (curRes.status === "fulfilled" && curRes.value.success && curRes.value.data?.challenge) {
          setCurrentChallenge(curRes.value.data.challenge);
        }
      } else {
        setMissionMap([]);
        setCurrentChallenge(null);
      }

      // 3. Top 5 Leaderboard
      const lbRes = await leaderboardService.getLeaderboard();
      if (lbRes.success && Array.isArray(lbRes.data?.leaderboard)) {
        setTopTeams(lbRes.data.leaderboard.slice(0, 5));
      }
    } catch (err) {
      console.warn("Participant dashboard live fetch fallback:", err?.message);
    }
  };

  useEffect(() => {
    loadLiveData();
  }, [user]);

  const handleCreateSquad = async (e) => {
    e.preventDefault();
    if (!createName.trim()) return;
    setActionError("");
    setActionSuccess("");
    setActionLoading(true);
    try {
      const res = await teamService.createTeam(createName.trim());
      if (res.success && res.data?.team) {
        setTeam(res.data.team);
        setActionSuccess(`Squad "${res.data.team.name}" initialized successfully! Welcome, Commander.`);
        if (typeof updateTeamMembership === "function") {
          updateTeamMembership(res.data.team._id, "TEAM_LEADER");
        }
        if (typeof refreshUser === "function") {
          await refreshUser();
        }
        setCreateName("");
        await loadLiveData();
      }
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || "Failed to initialize squad.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinSquad = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setActionError("");
    setActionSuccess("");
    setActionLoading(true);
    try {
      const res = await teamService.joinTeam(joinCode.trim());
      if (res.success && res.data?.team) {
        setTeam(res.data.team);
        setActionSuccess(`Successfully joined squad "${res.data.team.name}"!`);
        if (typeof updateTeamMembership === "function") {
          updateTeamMembership(res.data.team._id, "TEAM_MEMBER");
        }
        if (typeof refreshUser === "function") {
          await refreshUser();
        }
        setJoinCode("");
        await loadLiveData();
      }
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || "Failed to join squad.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyJoinCode = () => {
    if (!team?.joinCode) return;
    navigator.clipboard.writeText(team.joinCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const teamDisplayName = team?.name || user?.fullName || user?.username || "Operative";
  const userInitials = teamDisplayName.slice(0, 2).toUpperCase();

  const currentLevelNumber = team?.currentLevel || 1;
  const currentLevelStr = String(currentLevelNumber).padStart(2, "0");
  const totalScore = team?.totalScore ?? 0;
  const solvedCount = Math.max(0, currentLevelNumber - 1);
  const progressPercent = Math.min(100, Math.round((solvedCount / 10) * 100));

  // Real dynamic level display derived from mission map and authoritative team level
  const levelNames = [
    "The Starting Point", "Hidden in Plain Sight", "Lost Transmission",
    "System Breach", "Digital Forensics", "Privilege Escalation",
    "Encrypted Shadows", "The Insider", "Lateral Movement", "The Final Grid"
  ];
  const levelDiffs = ["Easy", "Easy", "Medium", "Medium", "Medium", "Hard", "Hard", "Hard", "Expert", "Expert"];
  const levelIcons = ["⚑", "</>", "♙", "⌘", "⚙", "▤", "›_", "⌁", "♧", "♜"];

  const displayLevels = missionMap.length === 10
    ? missionMap.map((node) => {
        const numStr = String(node.levelNumber).padStart(2, "0");
        const state = node.isSolved ? "done" : node.isCurrent ? "active" : "locked";
        const icon = node.levelNumber === 1 ? "⚑" : node.levelNumber === 2 ? "</>" : node.levelNumber === 10 ? "♜" : "⚙";
        return [numStr, node.title, node.difficulty, state, icon];
      })
    : Array.from({ length: 10 }, (_, i) => {
        const numStr = String(i + 1).padStart(2, "0");
        const isSolved = Boolean(user?.teamId && currentLevelNumber > i + 1);
        const isActive = Boolean(user?.teamId && currentLevelNumber === i + 1);
        const state = isSolved ? "done" : isActive ? "active" : "locked";
        return [numStr, levelNames[i], levelDiffs[i], state, levelIcons[i]];
      });

  const isDashSelected =
    location.pathname === ROUTES.PORTAL_DASHBOARD ||
    location.pathname === "/portal/dashboard" ||
    location.pathname === "/dashboard" ||
    location.pathname === "/portal";

  return (
    <main className="pd-page">
      <div className="pd-background" aria-hidden="true" />
      <header className="pd-topbar">
        <button
          className="pd-menu-button"
          type="button"
          aria-label="Menu"
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          ☰
        </button>
        <Link to={ROUTES.HOME} className="pd-brand">
          <span>THE TECH <b>MYSTERY</b></span>
          <small>CODESPHERE × UTKRISHT 2026</small>
        </Link>
        <div className="pd-topbar-spacer" />
        <button className="pd-notification" type="button" aria-label="Notifications">♧<i>•</i></button>
        <Link to={ROUTES.PROFILE} className="pd-account" style={{ textDecoration: "none" }}>
          <span className="pd-avatar">{userInitials}</span>
          <span><strong>{teamDisplayName}</strong><small>{team ? (user?.role ? user.role.replace('_', ' ') : "Team Leader") : "Unteamed Operative"}</small></span>
          <span className="pd-chevron">⌄</span>
        </Link>
      </header>

      <aside className={`pd-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <nav className="pd-side-nav" aria-label="Participant navigation">
          <Link
            className={isDashSelected ? "selected" : ""}
            to={ROUTES.PORTAL_DASHBOARD}
            onClick={() => setSidebarOpen(false)}
          >
            <span>⌂</span>Dashboard
          </Link>
          <Link
            className={location.pathname === ROUTES.CHALLENGES ? "selected" : ""}
            to={ROUTES.CHALLENGES}
            onClick={() => setSidebarOpen(false)}
          >
            <span>⚑</span>Challenges
          </Link>
          <Link
            className={location.pathname === ROUTES.QR_CHECKPOINT ? "selected" : ""}
            to={ROUTES.QR_CHECKPOINT}
            onClick={() => setSidebarOpen(false)}
          >
            <span>⌁</span>QR Scanner
          </Link>
          <Link
            className={location.pathname === ROUTES.LEADERBOARD ? "selected" : ""}
            to={ROUTES.LEADERBOARD}
            onClick={() => setSidebarOpen(false)}
          >
            <span>▥</span>Leaderboard
          </Link>
          <Link
            className={location.pathname === ROUTES.FINAL_FLAG ? "selected" : ""}
            to={ROUTES.FINAL_FLAG}
            onClick={() => setSidebarOpen(false)}
          >
            <span>✦</span>Final Flag
          </Link>
          <Link
            className={location.pathname === ROUTES.RULES ? "selected" : ""}
            to={ROUTES.RULES}
            onClick={() => setSidebarOpen(false)}
          >
            <span>▤</span>Rules
          </Link>
          <Link
            className={location.pathname === ROUTES.PROFILE ? "selected" : ""}
            to={ROUTES.PROFILE}
            onClick={() => setSidebarOpen(false)}
          >
            <span>◉</span>Profile
          </Link>
        </nav>
        <section className="pd-timer-card">
          <h3><span>◷</span> Event Timer</h3>
          <strong>01:32:15</strong>
          <div className="pd-timer-labels"><span>Hours</span><span>Minutes</span><span>Seconds</span></div>
          <button type="button" className="pd-end-event" disabled>⏻ &nbsp; Event Live</button>
          <small className="pd-demo-note">Live Tournament Session</small>
        </section>
        <blockquote className="pd-sidebar-quote">“ Think.<br />&nbsp; Solve.<br />&nbsp; Capture the Flag. ”<small>— The Tech Mystery 2026</small></blockquote>
      </aside>

      <section className="pd-main">
        <div className="pd-welcome-row">
          <div>
            <p className="pd-welcome-eyebrow">
              PARTICIPANT DASHBOARD{" "}
              <span className="pd-demo-badge" style={{ color: "var(--lime, #b8ff3d)", borderColor: "var(--lime, #b8ff3d)" }}>[● LIVE DATABASE]</span>
            </p>
            <h1>Welcome Back,<br /><span>{teamDisplayName}</span></h1>
            <p className="pd-welcome-subtitle">Keep solving, keep exploring. You're doing great!</p>
          </div>
          <blockquote className="pd-welcome-quote">“ Every challenge you solve brings you closer to mastering the Grid. ”<small>— CodeSphere × UTKRISHT 2026</small></blockquote>
        </div>

        {/* Squad Registration Flow for Unteamed Operatives */}
        {!user?.teamId && (
          <section className="pd-squad-onboarding">
            <div className="pd-squad-onboarding-header">
              <div>
                <h3>SQUAD REGISTRATION <span>// PROTOCOL ACTIVE</span></h3>
                <p>
                  You are not currently part of a registered squad. Form a new operative unit or enlist using your squad's secret join code.
                </p>
              </div>
              <div className="pd-squad-tabs">
                <button
                  type="button"
                  className={`pd-squad-tab-btn ${onboardingTab === 'create' ? 'active' : ''}`}
                  onClick={() => { setOnboardingTab('create'); setActionError(''); setActionSuccess(''); }}
                >
                  + CREATE SQUAD
                </button>
                <button
                  type="button"
                  className={`pd-squad-tab-btn ${onboardingTab === 'join' ? 'active' : ''}`}
                  onClick={() => { setOnboardingTab('join'); setActionError(''); setActionSuccess(''); }}
                >
                  → JOIN EXISTING
                </button>
              </div>
            </div>

            {actionError && (
              <div className="pd-squad-error" role="alert" style={{ marginBottom: "12px" }}>
                <span>⚠</span>
                <span>{actionError}</span>
              </div>
            )}

            {actionSuccess && (
              <div className="pd-squad-success" role="status" style={{ marginBottom: "12px" }}>
                <span>✓</span>
                <span>{actionSuccess}</span>
              </div>
            )}

            {onboardingTab === 'create' ? (
              <form onSubmit={handleCreateSquad} className="pd-squad-form">
                <div className="pd-squad-field">
                  <label htmlFor="create-squad-name">Squad Designation / Team Name</label>
                  <input
                    id="create-squad-name"
                    type="text"
                    required
                    minLength={3}
                    maxLength={40}
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder="e.g. ShadowProtocol"
                    className="pd-squad-input"
                    disabled={actionLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={actionLoading || !createName.trim()}
                  className="pd-squad-submit-btn"
                >
                  {actionLoading ? 'INITIALIZING SQUAD…' : 'INITIALIZE SQUAD →'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleJoinSquad} className="pd-squad-form">
                <div className="pd-squad-field">
                  <label htmlFor="join-squad-code">Secret Invitation Token / Join Code</label>
                  <input
                    id="join-squad-code"
                    type="text"
                    required
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="e.g. HTG-4A9B1C2D..."
                    className="pd-squad-input"
                    disabled={actionLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={actionLoading || !joinCode.trim()}
                  className="pd-squad-submit-btn"
                >
                  {actionLoading ? 'ENLISTING IN SQUAD…' : 'ENLIST IN SQUAD →'}
                </button>
              </form>
            )}
          </section>
        )}

        {/* Squad Dossier for Active Teamed Operatives */}
        {team && (
          <div className="pd-squad-dossier">
            <div className="pd-squad-meta">
              <div className="pd-squad-crest">⬢</div>
              <div className="pd-squad-details">
                <strong>{team.name}</strong>
                <span>
                  Operative Unit • Level {currentLevelNumber} • {team.members?.length || 1} / {team.maxMembers || 4} Operatives Enrolled
                </span>
              </div>
            </div>
            {team.joinCode && (
              <div className="pd-squad-code-box">
                <small>Invite Code:</small>
                <code>{team.joinCode}</code>
                <button
                  type="button"
                  className={`pd-copy-btn ${copiedCode ? 'copied' : ''}`}
                  onClick={handleCopyJoinCode}
                >
                  {copiedCode ? 'COPIED ✓' : 'COPY'}
                </button>
              </div>
            )}
          </div>
        )}

        <div className="pd-stats-grid">
          <StatCard icon="♜" value={`${solvedCount} / 10`} label="Challenges Solved">
            <div className="pd-mini-progress"><i style={{ width: `${progressPercent}%` }} /></div>
          </StatCard>
          <StatCard icon="▥" value={totalScore.toLocaleString()} label="Total Points">
            <small className="pd-positive">Level {currentLevelNumber} Active</small>
          </StatCard>
          <StatCard icon="♧" value={`${team ? (team.members?.length || 1) : 0} / 4`} label="Team Members">
            <div className="pd-member-stack">
              {Array.isArray(team?.members) && team.members.length > 0 ? (
                team.members.map((m, idx) => {
                  const memberName = m.userId?.fullName || m.userId?.username || m.name || `M${idx + 1}`;
                  const initials = memberName.slice(0, 2).toUpperCase();
                  return (
                    <i key={m.userId?._id || m._id || idx} title={memberName}>
                      {initials}
                    </i>
                  );
                })
              ) : (
                <i>{userInitials}</i>
              )}
              {(!team || (team?.members?.length || 1) < 4) && <i title="Open Slot">+</i>}
            </div>
          </StatCard>
          <StatCard icon="◷" value="01:32:15" label="Time Remaining">
            <div className="pd-mini-progress"><i style={{ width: "52%" }} /></div>
          </StatCard>
        </div>

        <div className="pd-content-grid">
          <div className="pd-primary-column">
            <section className="pd-panel pd-current-challenge">
              <div className="pd-panel-heading"><h2>Current Challenge</h2><span className="pd-status">IN PROGRESS</span></div>
              <div className="pd-current-body">
                <span className="pd-current-number">{currentLevelStr}</span>
                <span className="pd-current-symbol">{currentChallenge?.image || "›_"}</span>
                <div className="pd-current-copy">
                  <h3>Level {currentLevelNumber}: {currentChallenge?.title || "Infiltration Node"}</h3>
                  <p>{currentChallenge?.description || "Infiltrate the containment node, verify the checkpoint beacon, and submit the authentic flag to advance."}</p>
                </div>
                <span className={`pd-difficulty ${(currentChallenge?.difficulty || "hard").toLowerCase()}`}>
                  {currentChallenge?.difficulty || "ACTIVE"}
                </span>
              </div>
              <div className="pd-current-actions">
                <Link to="/portal/challenge" className="pd-primary-button">Continue Challenge <span>→</span></Link>
                <Link to={ROUTES.QR_CHECKPOINT} className="pd-secondary-button">Scan QR Station</Link>
              </div>
            </section>

            <section className="pd-panel pd-levels-panel">
              <div className="pd-panel-heading"><h2>Challenge Levels</h2><Link to={ROUTES.CHALLENGES}>View All Challenges →</Link></div>
              <div className="pd-level-grid">
                {displayLevels.map(([number, title, difficulty, state, icon]) => (
                  <Link to={number === "10" ? ROUTES.FINAL_FLAG : ROUTES.CHALLENGES} key={number} className={`pd-level-card ${state}`}>
                    <div className="pd-level-top"><span>{number}</span><b>{icon}</b><i>{state === "done" ? "✓" : state === "active" ? "●" : "♙"}</i></div>
                    <strong>{title}</strong>
                    <small className={`pd-difficulty ${difficulty.toLowerCase()}`}>{difficulty}</small>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <div className="pd-secondary-column">
            <section className="pd-panel pd-progress-panel">
              <h2>Your Progress</h2>
              <div className="pd-progress-content">
                <div className="pd-donut"><div><strong>{progressPercent}%</strong><small>Completed</small></div></div>
                <div className="pd-progress-bars">
                  {[
                    ["Easy (Levels 1–2)", currentLevelNumber > 2 ? "2 / 2" : "1 / 2", currentLevelNumber > 2 ? "100%" : "50%", "easy"],
                    ["Medium (Levels 3–5)", currentLevelNumber > 5 ? "3 / 3" : currentLevelNumber > 3 ? "2 / 3" : "0 / 3", currentLevelNumber > 5 ? "100%" : "67%", "medium"],
                    ["Hard (Levels 6–8)", currentLevelNumber > 8 ? "3 / 3" : currentLevelNumber > 6 ? "1 / 3" : "0 / 3", currentLevelNumber > 8 ? "100%" : "33%", "hard"],
                    ["Expert (Levels 9–10)", currentLevelNumber > 10 ? "2 / 2" : "0 / 2", currentLevelNumber > 10 ? "100%" : "0%", "expert"]
                  ].map(([label, count, width, kind]) => (
                    <div className="pd-progress-row" key={label}>
                      <div><span>{label}</span><small>{count}</small></div>
                      <i className={kind}><b style={{ width }} /></i>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="pd-panel pd-leaderboard-panel">
              <div className="pd-panel-heading"><h2>Leaderboard <small>(Top 5)</small></h2><Link to={ROUTES.LEADERBOARD}>View All →</Link></div>
              <div className="pd-table-head"><span>#</span><span>Team Name</span><span>Points</span></div>
              {topTeams.length > 0 ? (
                topTeams.map((t, idx) => (
                  <div key={t.teamId || idx} className={`pd-rank-row ${t.teamName === teamDisplayName ? "own-team" : ""}`}>
                    <span>{["🥇", "🥈", "🥉", "4", "5"][idx]}</span>
                    <span>{t.teamName}</span>
                    <span>{t.totalScore}</span>
                  </div>
                ))
              ) : (
                <div style={{ padding: "24px 12px", textAlign: "center", color: "var(--text-dim, #7a827e)" }}>
                  <p style={{ margin: "0 0 4px", fontSize: "0.9rem" }}>No squads ranked yet.</p>
                  <small style={{ fontSize: "0.8rem", opacity: 0.8 }}>Leaderboard updates dynamically as teams score points.</small>
                </div>
              )}
            </section>

            <section className="pd-panel pd-activity-panel">
              <div className="pd-panel-heading"><h2>Recent Activity</h2><button type="button">View All →</button></div>
              <div className="pd-activity-list">
                <div style={{ padding: "24px 12px", textAlign: "center", color: "var(--text-dim, #7a827e)" }}>
                  <p style={{ margin: "0 0 4px", fontSize: "0.9rem" }}>No recent squad activity.</p>
                  <small style={{ fontSize: "0.8rem", opacity: 0.8 }}>Live challenge solves and checkpoint scans will record here.</small>
                </div>
              </div>
            </section>
          </div>
        </div>
        <p className="pd-footer-note">THE TECH MYSTERY 2026 <span>•</span> CODESPHERE × UTKRISHT</p>
      </section>
    </main>
  );
}
