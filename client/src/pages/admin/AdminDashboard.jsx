import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/navigation/AdminSidebar";
import { ROUTES } from "../../constants/routes";
import { adminService } from "../../services/admin.service";
import { ErrorBoundary } from "../../components/common/ErrorBoundary";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/AdminDashboard.css";

export function AdminDashboard() {
  const { user, isAuthenticated, loading: authLoading, authError } = useAuth();
  const consecutiveAuthFailures = useRef(0);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [menu, setMenu] = useState(false);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggling, setToggling] = useState(false);

  // Live state
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalParticipants: 0,
    totalChallenges: 10,
    totalQuestions: 17,
    totalSubmissions: 0,
    correctSubmissions: 0,
    totalScans: 0,
    activeCheckpoints: 10,
    accuracyRate: "0%",
    levelProgress: [
      ["Level 01", 0],
      ["Level 02", 0],
      ["Level 03", 0],
      ["Level 04", 0],
      ["Level 05", 0],
    ],
    recentActivity: [],
  });

  const [eventConfig, setEventConfig] = useState({
    state: "DRAFT",
    registrationOpen: true,
    qrCheckpoints: true,
    hintsEnabled: true,
  });

  const [teams, setTeams] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);

  const isLive = eventConfig.state === "LIVE";
  const eventStateBadge = isLive
    ? "EVENT LIVE"
    : eventConfig.state === "PAUSED"
    ? "EVENT PAUSED"
    : eventConfig.state === "REGISTRATION_OPEN"
    ? "REGISTRATION OPEN"
    : eventConfig.state === "REGISTRATION_CLOSED"
    ? "REGISTRATION CLOSED"
    : eventConfig.state === "CONCLUDED"
    ? "EVENT CONCLUDED"
    : "EVENT DRAFT";

  const eventStateSubtitle = isLive
    ? "TEAMS SUBMITTING"
    : eventConfig.state === "PAUSED"
    ? "SUBMISSIONS PAUSED"
    : eventConfig.state === "REGISTRATION_OPEN"
    ? "REGISTRATION ACTIVE"
    : "GAMEPLAY LOCKED";

  const toggleButtonLabel = toggling
    ? "Updating..."
    : isLive
    ? "Pause Event"
    : eventConfig.state === "PAUSED"
    ? "Resume Event"
    : "Start Event (Go Live)";

  const loadDashboardData = useCallback(async () => {
    if (authLoading || !isAuthenticated) {
      return;
    }
    try {
      setError(null);
      const getSubsPromise = typeof adminService.getSubmissions === "function"
        ? adminService.getSubmissions({ limit: 5 })
        : typeof adminService.getSubmissionLogs === "function"
        ? adminService.getSubmissionLogs({ limit: 5 })
        : Promise.resolve({ data: { submissions: [] } });

      const [statsRes, teamsRes, subsRes] = await Promise.allSettled([
        adminService.getDashboardStats(),
        adminService.getAllTeams(),
        getSubsPromise,
      ]);

      const isAuthFail = (r) =>
        r.status === "rejected" &&
        (r.reason?.isAuthError ||
          r.reason?.code === "ERR_AUTH_TOKEN_UNAVAILABLE" ||
          r.reason?.response?.status === 401 ||
          r.reason?.response?.status === 403);

      const hasAuthError = isAuthFail(statsRes) || isAuthFail(teamsRes) || isAuthFail(subsRes);

      if (hasAuthError) {
        consecutiveAuthFailures.current += 1;
        setError("Administrative session unauthenticated or token expired. Polling paused. Refresh or log in again.");
      } else if (
        statsRes.status === "fulfilled" ||
        teamsRes.status === "fulfilled" ||
        subsRes.status === "fulfilled"
      ) {
        consecutiveAuthFailures.current = 0;
      }

      if (statsRes.status === "fulfilled" && statsRes.value) {
        const raw = statsRes.value;
        const d = raw?.data?.data?.stats ? raw.data.data : raw?.data?.stats ? raw.data : raw?.stats ? raw : raw?.data || raw;
        if (d?.stats) {
          setStats((prev) => ({
            ...prev,
            ...d.stats,
            levelProgress: Array.isArray(d.stats.levelProgress) ? d.stats.levelProgress : prev.levelProgress,
            recentActivity: Array.isArray(d.stats.recentActivity) ? d.stats.recentActivity : [],
          }));
        }
        const cfg = d?.eventConfig || d?.config || raw?.data?.eventConfig || raw?.eventConfig;
        if (cfg) {
          setEventConfig(cfg);
        }
      } else if (statsRes.status === "rejected") {
        console.warn("Stats telemetry sync notice:", statsRes.reason);
      }

      if (teamsRes.status === "fulfilled" && teamsRes.value) {
        const rawT = teamsRes.value;
        const tData = rawT?.data?.teams ? rawT.data : rawT?.teams ? rawT : rawT?.data || rawT;
        const apiTeams = Array.isArray(tData?.teams) ? tData.teams : Array.isArray(tData) ? tData : [];
        if (apiTeams.length > 0 || Array.isArray(tData?.teams)) {
          setTeams(
            apiTeams.map((t) => [
              t?.name || "Unnamed Team",
              t?.joinCode || (t?._id ? String(t._id).slice(-6).toUpperCase() : "------"),
              Array.isArray(t?.members) ? t.members.length : (Number(t?.members) || 0),
              Number(t?.totalScore) || 0,
              Math.max(0, (Number(t?.currentLevel) || 1) - 1),
              t?.isDisqualified
                ? "Disqualified"
                : (typeof t?.status === "string" && t.status.trim()
                    ? (t.status.trim().charAt(0).toUpperCase() + t.status.trim().slice(1).toLowerCase())
                    : "Pending"),
              t?._id || "",
            ])
          );
        }
      } else if (teamsRes.status === "rejected") {
        console.warn("Teams telemetry sync notice:", teamsRes.reason);
      }

      if (subsRes.status === "fulfilled" && subsRes.value) {
        const rawS = subsRes.value;
        const sData = rawS?.data?.submissions ? rawS.data : rawS?.submissions ? rawS : rawS?.data || rawS;
        const apiSubs = Array.isArray(sData?.submissions) ? sData.submissions : Array.isArray(sData) ? sData : [];
        if (apiSubs.length > 0 || Array.isArray(sData?.submissions)) {
          setRecentSubmissions(apiSubs);
        }
      } else if (subsRes.status === "rejected") {
        console.warn("Submissions telemetry sync notice:", subsRes.reason);
      }

      // If all three telemetry calls failed and not already flagged as auth failure
      if (
        !hasAuthError &&
        statsRes.status === "rejected" &&
        teamsRes.status === "rejected" &&
        subsRes.status === "rejected"
      ) {
        setError("Unable to connect to telemetry service. Backend may be offline or calibrating.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to synchronize dashboard telemetry.");
    } finally {
      setLoading(false);
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    loadDashboardData();
    const interval = setInterval(() => {
      if (consecutiveAuthFailures.current < 2) {
        loadDashboardData();
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [authLoading, isAuthenticated, loadDashboardData]);

  const handleToggleEvent = async () => {
    if (toggling) return;
    setToggling(true);
    const nextState = isLive ? "PAUSED" : "LIVE";
    try {
      const res = await adminService.updateEventConfig({ state: nextState });
      const updated = res?.data?.config || res?.data?.eventConfig;
      if (updated) {
        setEventConfig(updated);
      } else {
        setEventConfig((prev) => ({ ...prev, state: nextState }));
      }
      setNotice(`Event status transitioned to ${nextState}.`);
      loadDashboardData();
    } catch (err) {
      setNotice(`Failed to update event state: ${err?.response?.data?.message || err.message}`);
    } finally {
      setToggling(false);
    }
  };

  const filtered = useMemo(
    () =>
      teams.filter(
        (t) =>
          (t[0] + " " + t[1]).toLowerCase().includes(query.toLowerCase()) &&
          (filter === "All" || t[5] === filter)
      ),
    [teams, query, filter]
  );

  if (authLoading) {
    return (
      <div className="ad-shell" style={{ display: "flex", minHeight: "100vh", background: "#080b0a" }}>
        <AdminSidebar
          teamsCount={stats.totalTeams}
          submissionsCount={stats.totalSubmissions}
          mobileOpen={menu}
          onCloseMobile={() => setMenu(false)}
        />
        <main className="ad-main" style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "36px 32px",
              background: "rgba(5, 12, 13, 0.85)",
              border: "1px solid rgba(184, 255, 61, 0.3)",
              borderRadius: "12px",
              color: "#e8f7c9",
              fontFamily: "monospace",
              gap: "14px",
              maxWidth: "420px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                border: "3px solid rgba(184, 255, 61, 0.2)",
                borderTopColor: "var(--htg-lime, #b8ff3d)",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <span style={{ fontSize: "13px", letterSpacing: "1.4px", fontWeight: "700" }}>
              INITIALIZING CYBERSOC ADMIN CONSOLE...
            </span>
            <small style={{ color: "#8a968c", fontSize: "11px" }}>
              Validating cryptographic security credentials and permissions
            </small>
          </div>
        </main>
      </div>
    );
  }

  if (!authLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
    return (
      <div className="ad-shell" style={{ display: "flex", minHeight: "100vh", background: "#080b0a" }}>
        <AdminSidebar
          teamsCount={0}
          submissionsCount={0}
          mobileOpen={menu}
          onCloseMobile={() => setMenu(false)}
        />
        <main className="ad-main" style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "36px 32px",
              background: "rgba(5, 12, 13, 0.85)",
              border: "1px solid rgba(255, 77, 100, 0.3)",
              borderRadius: "12px",
              color: "#ff8595",
              fontFamily: "monospace",
              gap: "14px",
              maxWidth: "460px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "32px" }}>🔒</div>
            <span style={{ fontSize: "14px", letterSpacing: "1.4px", fontWeight: "700", color: "#ff8595" }}>
              ADMINISTRATIVE PRIVILEGES REQUIRED
            </span>
            <p style={{ color: "#8a968c", fontSize: "12px", margin: "4px 0 16px", lineHeight: "1.5" }}>
              You must be authenticated with an active administrator account to access the CyberSOC Mission Control.
            </p>
            <Link
              to={ROUTES.ADMIN_LOGIN}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 20px",
                background: "rgba(184, 255, 61, 0.15)",
                border: "1px solid var(--htg-lime, #b8ff3d)",
                borderRadius: "6px",
                color: "var(--htg-lime, #b8ff3d)",
                fontSize: "12px",
                fontWeight: "700",
                textDecoration: "none",
                letterSpacing: "1px"
              }}
            >
              LOG IN AS ADMINISTRATOR →
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="ad-shell">
      <AdminSidebar
        teamsCount={stats.totalTeams}
        submissionsCount={stats.totalSubmissions}
        mobileOpen={menu}
        onCloseMobile={() => setMenu(false)}
      />

      <main className="ad-main">
        <header className="ad-topbar">
          <button
            className="ad-menu-button"
            onClick={() => setMenu(!menu)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className="ad-crumb">
            ADMIN CONSOLE <i>/</i> <b>OVERVIEW</b>
          </div>
          <div className="ad-top-right">
            <span>
              <i className="ad-dot" /> REAL-TIME TELEMETRY
            </span>
            <button
              onClick={() => {
                consecutiveAuthFailures.current = 0;
                loadDashboardData();
                setNotice("Dashboard data refreshed from database.");
              }}
              aria-label="Refresh Data"
              title="Refresh"
            >
              ↻
            </button>
            <Link to={ROUTES.HOME}>View website ↗</Link>
          </div>
        </header>

        <div className="ad-content">
          <section className="ad-hero-banner">
            <div>
              <p className="ad-eyebrow">TULA'S UNIVERSITY · UTKRISHT 2026</p>
              <p className="ad-welcome">WELCOME BACK,</p>
              <h1>
                Admin <em>Mission Control.</em>
              </h1>
              <p className="ad-hero-copy">
                Authoritative event administration, live telemetry, and team progress monitor.
              </p>
            </div>
            <div className="ad-event-pill">
              <i className={`ad-dot ${isLive ? "" : "off"}`} />
              {eventStateBadge}{" "}
              <small>{eventStateSubtitle}</small>
            </div>
          </section>

          {loading && stats.totalTeams === 0 && !error && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "28px 20px",
                margin: "12px 0 20px",
                background: "rgba(5, 12, 13, 0.7)",
                border: "1px solid rgba(184, 255, 61, 0.25)",
                borderRadius: "10px",
                color: "#e8f7c9",
                fontFamily: "monospace",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  border: "2px solid rgba(184, 255, 61, 0.2)",
                  borderTopColor: "var(--htg-lime, #b8ff3d)",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <span style={{ fontSize: "12px", letterSpacing: "1.2px", fontWeight: "700" }}>
                SYNCHRONIZING SOC COMMAND TELEMETRY...
              </span>
              <small style={{ color: "#8a968c", fontSize: "11px" }}>
                Connecting to authoritative database and event controls
              </small>
            </div>
          )}

          {notice && (
            <div className="ad-notice">
              {notice}
              <button onClick={() => setNotice("")} aria-label="Dismiss notice">
                ×
              </button>
            </div>
          )}

          {error && (
            <div
              className="ad-notice error"
              style={{
                borderColor: "#ff6b6b",
                color: "#ff8585",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
              role="alert"
            >
              <span>⚠️ {error}</span>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => {
                    consecutiveAuthFailures.current = 0;
                    loadDashboardData();
                  }}
                  style={{
                    background: "rgba(255, 107, 107, 0.2)",
                    border: "1px solid #ff6b6b",
                    color: "#ff8585",
                    borderRadius: "4px",
                    padding: "2px 8px",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                  aria-label="Retry loading dashboard"
                >
                  Retry ↻
                </button>
                <button onClick={() => setError(null)} aria-label="Dismiss error">
                  ×
                </button>
              </div>
            </div>
          )}

          <section className="ad-metrics">
            {[
              ["REGISTERED TEAMS", stats.totalTeams, `${stats.totalTeams} currently registered`, "♧"],
              ["TOTAL PARTICIPANTS", stats.totalParticipants || stats.totalUsers || 0, "Registered team members", "♙"],
              ["FLAGS CAPTURED", stats.correctSubmissions, `${stats.accuracyRate} solve accuracy`, "⚑"],
              ["ACTIVE CHECKPOINTS", stats.activeCheckpoints, "Configured on campus", "◷"],
            ].map((m, i) => (
              <article className="ad-metric" key={m[0]}>
                <div>
                  <span>{m[0]}</span>
                  <b>{m[3]}</b>
                </div>
                <strong>{m[1]}</strong>
                <p>{m[2]}</p>
                {i < 3 && (
                  <div className="ad-bars">
                    {[10, 15, 20, 25, 30, 35, 40, 45].map((v, j) => (
                      <i key={j} style={{ height: (stats.correctSubmissions > 0 ? v : 10) + "%" }} />
                    ))}
                  </div>
                )}
                {i === 3 && (
                  <Link
                    to={ROUTES.ADMIN_SUBMISSIONS}
                    className="ad-mini-button"
                    style={{ textDecoration: "none", display: "inline-block", textAlign: "center" }}
                  >
                    Review submissions ↗
                  </Link>
                )}
              </article>
            ))}
          </section>

          <section className="ad-panels ad-dashboard-panels">
            <article className="ad-panel ad-chart-panel">
              <div className="ad-panel-title">
                <div>
                  <p className="ad-eyebrow">LIVE EVENT PULSE</p>
                  <h2>Challenge activity</h2>
                </div>
                <span className="ad-pill">● LIVE TELEMETRY</span>
              </div>
              <div className="ad-legend">
                <span>🟩 Accepted flags: {stats.correctSubmissions}</span>
                <span>▫ Total submissions: {stats.totalSubmissions}</span>
                <b>
                  {stats.correctSubmissions} <small>SOLVED</small>
                </b>
              </div>
              <div className="ad-chart">
                {stats.totalSubmissions === 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "200px", color: "#8a968c", textAlign: "center", padding: "1rem" }}>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 500 }}>No submissions recorded yet.</p>
                    <small style={{ fontSize: "12px", color: "#647466", marginTop: "4px" }}>Telemetry will plot solve velocity in real time once teams begin submitting flags.</small>
                  </div>
                ) : (
                  <div className="ad-plot">
                    <div className="ad-lines">
                      {[0, 1, 2, 3, 4].map((n) => (
                        <i key={n} />
                      ))}
                    </div>
                    <svg viewBox="0 0 700 210" preserveAspectRatio="none" aria-label="Challenge activity chart">
                      <defs>
                        <linearGradient id="adFill" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#b8ff3d" stopOpacity=".25" />
                          <stop offset="100%" stopColor="#b8ff3d" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0 200 L700 200 Z" fill="url(#adFill)" />
                      <path d="M0 200 L700 200" fill="none" stroke="#b8ff3d" strokeWidth="2" />
                    </svg>
                  </div>
                )}
              </div>
            </article>

            <article className="ad-panel ad-level-panel">
              <div className="ad-panel-title">
                <div>
                  <p className="ad-eyebrow">MISSION PROGRESS</p>
                  <h2>Level progress</h2>
                </div>
                <b className="ad-level-percent">
                  {stats.totalTeams > 0 && Array.isArray(stats.levelProgress) && stats.levelProgress.length > 0
                    ? `${Math.round(
                        (stats.levelProgress.reduce((acc, curr) => acc + (Array.isArray(curr) ? (Number(curr[1]) || 0) : 0), 0) /
                          Math.max(1, stats.levelProgress.length * 100)) *
                          100
                      )}%`
                    : "0%"}
                </b>
              </div>
              <div className="ad-level-overview">
                <div className="ad-ring" aria-label="Average level completion">
                  <span>
                    {stats.totalTeams > 0 && Array.isArray(stats.levelProgress)
                      ? `${stats.levelProgress.filter((p) => Array.isArray(p) && Number(p[1]) > 0).length}/10`
                      : "0/10"}
                  </span>
                </div>
                <div className="ad-level-rows">
                  {(Array.isArray(stats.levelProgress) ? stats.levelProgress : []).slice(0, 5).map((item, idx) => {
                    const [lvl, pct] = Array.isArray(item) ? item : [`Level ${String(idx + 1).padStart(2, "0")}`, 0];
                    const numPct = Number(pct) || 0;
                    return (
                      <div className="ad-level-row" key={lvl || idx}>
                        <span>{lvl}</span>
                        <div>
                          <i style={{ width: `${Math.min(100, Math.max(0, numPct))}%` }} />
                        </div>
                        <small>{numPct}%</small>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Link to={ROUTES.ADMIN_CHALLENGES} className="ad-level-link">
                View all 10 levels ↗
              </Link>
            </article>

            <article className="ad-panel ad-control-panel">
              <div className="ad-panel-title">
                <div>
                  <p className="ad-eyebrow">CONTROL ROOM</p>
                  <h2>Event controls</h2>
                </div>
                <b className="ad-control-icon">◉</b>
              </div>
              <div className="ad-live-card">
                <i className={`ad-dot ${isLive ? "" : "off"}`} />
                <div>
                  <b>{eventStateBadge}</b>
                  <small>
                    {isLive
                      ? "Teams can submit flags & scan QRs"
                      : "Submissions temporarily halted"}
                  </small>
                </div>
              </div>
              <button
                className={`ad-toggle ${isLive ? "live" : "paused"}`}
                onClick={handleToggleEvent}
                disabled={toggling}
              >
                {toggleButtonLabel}{" "}
                <span>↗</span>
              </button>
              {[
                ["Registration", eventConfig.registrationOpen ? "Open" : "Closed"],
                ["QR Checkpoints", eventConfig.qrCheckpoints ? "Active" : "Disabled"],
                ["Hint System", eventConfig.hintsEnabled ? "Enabled" : "Disabled"],
              ].map(([x, stateLabel]) => (
                <div className="ad-control-row" key={x}>
                  <span>{x}</span>
                  <label className={stateLabel === "Open" || stateLabel === "Active" || stateLabel === "Enabled" ? "live" : "paused"}>
                    ● {stateLabel}
                  </label>
                </div>
              ))}
              <p className="ad-footer-note" style={{ color: "#8a968c" }}>
                Connected to backend EventConfig API.
              </p>
            </article>
          </section>

          <section className="ad-panels ad-lower">
            <article className="ad-panel ad-teams-panel">
              <div className="ad-panel-title">
                <div>
                  <p className="ad-eyebrow">PARTICIPANT MONITOR</p>
                  <h2>Team overview</h2>
                </div>
                <Link to={ROUTES.ADMIN_TEAMS}>Manage teams ↗</Link>
              </div>
              <div className="ad-tools">
                <label>
                  ⌕{" "}
                  <input
                    placeholder="Search team or code..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option>All</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Disqualified</option>
                </select>
              </div>
              <div className="ad-table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>TEAM</th>
                      <th>JOIN CODE</th>
                      <th>SOLVED</th>
                      <th>POINTS</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((t, idx) => {
                      const teamName = String(t?.[0] || "Unnamed Team");
                      const initial = teamName.trim().charAt(0).toUpperCase() || "T";
                      const joinCode = String(t?.[1] || "TEAM-??");
                      const scoreFormatted = Number(t?.[3] || 0).toLocaleString();
                      const currentLvl = Math.max(0, Number(t?.[4]) || 0);
                      const statusLabel = String(t?.[5] || "Active");
                      const rowKey = t?.[6] || joinCode || idx;

                      const statusBadgeClass =
                        statusLabel === "Disqualified"
                          ? "review"
                          : statusLabel === "Pending"
                          ? "pending"
                          : "";

                      return (
                        <tr key={rowKey}>
                          <td>
                            <i className="ad-team-mark">{initial}</i>
                            <b>{teamName}</b>
                          </td>
                          <td>{joinCode}</td>
                          <td>{currentLvl}/10</td>
                          <td className="ad-points">{scoreFormatted}</td>
                          <td>
                            <span
                              className={`ad-status ${statusBadgeClass}`}
                              style={
                                statusLabel === "Pending"
                                  ? {
                                      color: "#facc15",
                                      borderColor: "rgba(250, 204, 21, 0.4)",
                                      background: "rgba(250, 204, 21, 0.1)",
                                    }
                                  : undefined
                              }
                            >
                              {statusLabel}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {!filtered.length && (
                  <div style={{ textAlign: "center", padding: "2rem 1rem", color: "#8a968c" }}>
                    <p style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 500, color: "#f5f5f0" }}>
                      No teams have registered yet.
                    </p>
                    <small style={{ fontSize: "12px", color: "#8a968c" }}>
                      Teams will appear here automatically upon participant registration.
                    </small>
                  </div>
                )}
              </div>
              <div className="ad-table-foot">
                Showing {filtered.length} registered team(s){" "}
                <Link to={ROUTES.ADMIN_TEAMS}>View all teams ↗</Link>
              </div>
            </article>

            <article className="ad-panel ad-submissions-panel">
              <div className="ad-panel-title">
                <div>
                  <p className="ad-eyebrow">ANSWER VALIDATION</p>
                  <h2>Recent submissions</h2>
                </div>
                <Link to={ROUTES.ADMIN_SUBMISSIONS}>View all ↗</Link>
              </div>
              <div className="ad-submission-list">
                {recentSubmissions && recentSubmissions.length > 0 ? (
                  recentSubmissions.filter(Boolean).map((s, i) => {
                    const resultText = s?.result || (s?.isCorrect ? "Correct" : "Incorrect");
                    const resultClassModifier = String(resultText).toLowerCase().replace(/[^a-z0-9_-]/g, "-");
                    const teamName = s?.team || s?.teamId?.name || "Team";
                    const lvl = s?.level ?? s?.levelNumber ?? "-";
                    const timeStr = s?.submittedAt || s?.date || "Recently";

                    return (
                      <div className="ad-submission-row" key={s?.id || s?._id || i}>
                        <span className="ad-sub-num">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <b>{teamName}</b>
                          <small>
                            Level {lvl} · {timeStr}
                          </small>
                        </div>
                        <span
                          className={`ad-result ad-result--${resultClassModifier}`}
                        >
                          {resultText}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: "center", padding: "2rem 1rem", color: "#8a968c" }}>
                    <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#f5f5f0" }}>No submissions yet.</p>
                    <small style={{ fontSize: "12px" }}>Incoming challenge answers will appear here in real time.</small>
                  </div>
                )}
              </div>
            </article>

            <article className="ad-panel ad-activity-panel">
              <div className="ad-panel-title">
                <div>
                  <p className="ad-eyebrow">SYSTEM FEED</p>
                  <h2>Recent activity</h2>
                </div>
                <Link to={ROUTES.ADMIN_SECURITY_LOGS}>View logs ↗</Link>
              </div>
              <div className="ad-activity-list">
                {Array.isArray(stats?.recentActivity) && stats.recentActivity.length > 0 ? (
                  stats.recentActivity.filter(Boolean).map((a, idx) => (
                    <div className="ad-activity" key={`${a?.time || "act"}-${idx}`}>
                      <i className={a?.type === "success" ? "ok" : "info"} />
                      <div>
                        <b>{a?.title || "Activity"}</b>
                        <p>{a?.detail || ""}</p>
                        <small>{a?.time || "Just now"}</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: "center", padding: "2rem 1rem", color: "#8a968c" }}>
                    <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#f5f5f0" }}>No recent activity.</p>
                    <small style={{ fontSize: "12px" }}>Real-time team milestones will stream here.</small>
                  </div>
                )}
              </div>
              <Link className="ad-activity-foot" to={ROUTES.ADMIN_SECURITY_LOGS}>
                Open security logs <span>↗</span>
              </Link>
            </article>
          </section>

          <section className="ad-quick-actions">
            <Link to={ROUTES.ADMIN_QUESTIONS}>
              <b>▤</b>
              <span>
                <strong>Manage Questions</strong>
                <small>Create, edit and organize challenge pools</small>
              </span>
              <i>›</i>
            </Link>
            <Link to={ROUTES.ADMIN_CHECKPOINTS}>
              <b>▦</b>
              <span>
                <strong>QR Checkpoints</strong>
                <small>Inspect and verify physical beacons</small>
              </span>
              <i>›</i>
            </Link>
            <Link to={ROUTES.ADMIN_LEADERBOARD}>
              <b>♜</b>
              <span>
                <strong>View Leaderboard</strong>
                <small>Review authoritative standings</small>
              </span>
              <i>›</i>
            </Link>
            <Link to={ROUTES.ADMIN_EVENT_CONTROL}>
              <b>▥</b>
              <span>
                <strong>Event Control</strong>
                <small>Manage tournament configuration</small>
              </span>
              <i>›</i>
            </Link>
          </section>

          <footer className="ad-footer">
            <span>
              THE TECH MYSTERY <b>·</b> ADMIN CONSOLE
            </span>
            <span>
              SECURE EVENT OPERATIONS <i className="ad-dot" />
            </span>
            <small>
              REAL-TIME EVENT TELEMETRY · LIVE DATABASE CONNECTED
            </small>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboardWrapper(props) {
  return (
    <ErrorBoundary title="ADMIN DASHBOARD ANOMALY // RECOVERY ACTIVE">
      <AdminDashboard {...props} />
    </ErrorBoundary>
  );
}
