import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import adminService from "../../services/admin.service";
import { leaderboardService } from "../../services/leaderboard.service";
import AdminSidebar from "../../components/navigation/AdminSidebar";
import "../../styles/LeaderboardManagementPage.css";

const initialTeams = [
  { rank: 1, name: "Null Pointers", code: "TEAM-07", members: 4, score: 1840, solved: 8, level: 8, streak: 5, trend: "up", lastActivity: "1 min ago", status: "Active" },
  { rank: 2, name: "Byte Bandits", code: "TEAM-12", members: 4, score: 1690, solved: 7, level: 7, streak: 4, trend: "up", lastActivity: "3 min ago", status: "Active" },
  { rank: 3, name: "Stack Smashers", code: "TEAM-03", members: 3, score: 1510, solved: 7, level: 7, streak: 2, trend: "down", lastActivity: "4 min ago", status: "Active" },
  { rank: 4, name: "Cyber Wolves", code: "TEAM-15", members: 4, score: 1320, solved: 6, level: 6, streak: 3, trend: "up", lastActivity: "7 min ago", status: "Active" },
  { rank: 5, name: "Packet Pirates", code: "TEAM-02", members: 3, score: 1180, solved: 6, level: 6, streak: 1, trend: "same", lastActivity: "9 min ago", status: "Active" },
  { rank: 6, name: "Logic Legends", code: "TEAM-09", members: 4, score: 1050, solved: 5, level: 5, streak: 2, trend: "up", lastActivity: "12 min ago", status: "Active" },
  { rank: 7, name: "Kernel Kings", code: "TEAM-04", members: 3, score: 920, solved: 5, level: 5, streak: 1, trend: "down", lastActivity: "14 min ago", status: "Active" },
  { rank: 8, name: "Root Access", code: "TEAM-11", members: 4, score: 840, solved: 4, level: 4, streak: 2, trend: "same", lastActivity: "18 min ago", status: "Active" },
  { rank: 9, name: "Bit Raiders", code: "TEAM-06", members: 2, score: 710, solved: 4, level: 4, streak: 1, trend: "up", lastActivity: "21 min ago", status: "Active" },
  { rank: 10, name: "Ghost Protocol", code: "TEAM-14", members: 3, score: 560, solved: 3, level: 3, streak: 1, trend: "same", lastActivity: "26 min ago", status: "Active" },
];

const medal = (rank) => (rank === 1 ? "gold" : rank === 2 ? "silver" : rank === 3 ? "bronze" : "");

function formatRelativeTime(timestamp) {
  if (!timestamp) return "Recently";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Recently";
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 45) return "Just now";
  if (diffSec < 3600) return `${Math.max(1, Math.floor(diffSec / 60))} min ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function mapApiTeamToLeaderboard(team, index) {
  const memberCount = Array.isArray(team.members) ? team.members.length : (team.memberCount || 3);
  const solvedCount = team.solvedCount !== undefined ? team.solvedCount : Math.max(0, (team.currentLevel || 1) - 1);
  const solveTime = team.lastSolveTimestamp ? new Date(team.lastSolveTimestamp).getTime() : (team.updatedAt ? new Date(team.updatedAt).getTime() : 0);
  const lastActiveStr = team.lastSolveTimestamp ? formatRelativeTime(team.lastSolveTimestamp) : (team.updatedAt ? formatRelativeTime(team.updatedAt) : "Recently");

  return {
    rawId: team._id || team.teamId || `team-${index}`,
    rank: index + 1,
    name: team.name || team.teamName || `Team ${index + 1}`,
    code: team.joinCode || team.code || `TEAM-${String(team._id || index + 1).slice(-2).toUpperCase()}`,
    members: memberCount || 2,
    score: Number(team.totalScore !== undefined ? team.totalScore : (team.score || 0)),
    solved: solvedCount,
    level: Number(team.currentLevel || team.level || 1),
    streak: Math.min(5, Math.max(1, solvedCount)),
    trend: index < 3 ? "up" : (index % 3 === 0 ? "down" : "same"),
    lastActivity: lastActiveStr,
    lastSolveTimestamp: solveTime,
    status: team.isDisqualified ? "Disqualified" : "Active",
    isLive: true,
  };
}

export default function LeaderboardManagementPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState(initialTeams);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("All Levels");
  const [sortBy, setSortBy] = useState("score");
  const [visibility, setVisibility] = useState("Public");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [view, setView] = useState("table");
  const [notice, setNotice] = useState("");
  const [selectedCode, setSelectedCode] = useState("TEAM-07");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLiveDb, setIsLiveDb] = useState(false);
  const [isSavingVisibility, setIsSavingVisibility] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Sync leaderboard and event configuration from backend
  const fetchLeaderboardData = useCallback(async (isSilent = false) => {
    try {
      const [teamsRes, statsRes] = await Promise.allSettled([
        adminService.getAllTeams(),
        adminService.getDashboardStats(),
      ]);

      let liveTeams = null;
      let isFrozenConfig = null;

      if (teamsRes.status === "fulfilled" && teamsRes.value?.data?.teams?.length > 0) {
        liveTeams = teamsRes.value.data.teams;
      } else {
        // Fallback to public leaderboard endpoint if admin teams call is empty
        try {
          const lbRes = await leaderboardService.getLeaderboard();
          if (lbRes?.data?.leaderboard?.length > 0) {
            liveTeams = lbRes.data.leaderboard;
            if (lbRes.data.isFrozen !== undefined) {
              isFrozenConfig = lbRes.data.isFrozen;
            }
          }
        } catch {
          // Keep null to fall back to demo records
        }
      }

      if (statsRes.status === "fulfilled" && statsRes.value?.data?.eventConfig) {
        isFrozenConfig = statsRes.value.data.eventConfig.isLeaderboardFrozen;
      }

      if (liveTeams && liveTeams.length > 0) {
        const mapped = liveTeams.map((t, idx) => mapApiTeamToLeaderboard(t, idx));
        setTeams(mapped);
        setIsLiveDb(true);
        setLastSyncTime(new Date());

        // Ensure selectedCode points to a valid team
        setSelectedCode((curr) => {
          const found = mapped.find((t) => t.code === curr);
          return found ? curr : mapped[0]?.code || "TEAM-01";
        });
      } else {
        setIsLiveDb(false);
      }

      if (isFrozenConfig !== null && isFrozenConfig !== undefined) {
        setVisibility(isFrozenConfig ? "Hidden" : "Public");
      }

      if (!isSilent && liveTeams && liveTeams.length > 0) {
        setNotice(`Synchronized ${liveTeams.length} teams from live database.`);
      }
    } catch {
      if (!isSilent) {
        setIsLiveDb(false);
      }
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchLeaderboardData(false);
  }, [fetchLeaderboardData]);

  // Auto-refresh interval (15s polling) when enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchLeaderboardData(true);
    }, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchLeaderboardData]);

  // Deterministic ranking and tie-breaking calculation:
  // Primary sort by user choice (score, solved, level);
  // Deterministic tie-breaker: lastSolveTimestamp ASC (earlier solve time takes precedence)
  const ranked = useMemo(() => {
    return [...teams]
      .sort((a, b) => {
        if (sortBy === "solved") {
          return (
            b.solved - a.solved ||
            b.score - a.score ||
            (a.lastSolveTimestamp || 0) - (b.lastSolveTimestamp || 0)
          );
        }
        if (sortBy === "level") {
          return (
            b.level - a.level ||
            b.score - a.score ||
            (a.lastSolveTimestamp || 0) - (b.lastSolveTimestamp || 0)
          );
        }
        // Default: score DESC, with lastSolveTimestamp ASC tie-breaker
        return (
          b.score - a.score ||
          (a.lastSolveTimestamp || 0) - (b.lastSolveTimestamp || 0)
        );
      })
      .map((team, index) => ({
        ...team,
        rank: index + 1,
      }));
  }, [teams, sortBy]);

  const filtered = useMemo(() => {
    return ranked.filter((team) => {
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        [team.name, team.code].some((v) =>
          String(v || "").toLowerCase().includes(term)
        );
      const matchesLevel =
        levelFilter === "All Levels" || team.level === Number(levelFilter);
      return matchesSearch && matchesLevel;
    });
  }, [ranked, search, levelFilter]);

  const selected =
    ranked.find((team) => team.code === selectedCode) ||
    ranked[0] ||
    initialTeams[0];

  const totalPoints = useMemo(() => {
    return teams.reduce((sum, team) => sum + (team.score || 0), 0);
  }, [teams]);

  const solvedCount = useMemo(() => {
    return teams.reduce((sum, team) => sum + (team.solved || 0), 0);
  }, [teams]);

  const recentlyActiveCount = useMemo(() => {
    return teams.filter(
      (t) =>
        typeof t.lastActivity === "string" &&
        (t.lastActivity.includes("min") || t.lastActivity.includes("now"))
    ).length;
  }, [teams]);

  // CSV Export with RFC 4180 escaping
  const exportCsv = () => {
    const rows = [
      [
        "Rank",
        "Team",
        "Team Code",
        "Members",
        "Score",
        "Challenges Solved",
        "Level",
        "Streak",
        "Last Activity",
        "Status",
      ],
      ...filtered.map((t) => [
        t.rank,
        t.name,
        t.code,
        t.members,
        t.score,
        t.solved,
        t.level,
        t.streak,
        t.lastActivity,
        t.status,
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `hack-the-grid-leaderboard-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice(`Filtered leaderboard exported as CSV (${filtered.length} teams).`);
  };

  // Demo-only rank adjustment (disabled when connected to live database)
  const moveTeam = (code, delta) => {
    if (isLiveDb) {
      setNotice(
        "Rank manipulation is disabled in live database mode. Official rankings derive strictly from server-verified scores."
      );
      return;
    }
    setTeams((current) => {
      const sorted = [...current].sort((a, b) => b.score - a.score);
      const index = sorted.findIndex((t) => t.code === code);
      const target = index + delta;
      if (index < 0 || target < 0 || target >= sorted.length) return current;
      const a = sorted[index];
      const b = sorted[target];
      const adjustedA = {
        ...a,
        score: Math.max(0, b.score + (delta < 0 ? 1 : -1)),
      };
      return current.map((t) =>
        t.code === a.code ? adjustedA : t.code === b.code ? { ...b, score: a.score } : t
      );
    });
    setNotice(
      "Demo rank adjustment applied locally. In production, rank must derive from server-verified scores."
    );
  };

  // Reset or manual reload
  const handleResetOrReload = () => {
    if (isLiveDb) {
      fetchLeaderboardData(false);
      setNotice("Refreshing leaderboard from live database...");
    } else {
      setTeams(initialTeams);
      setSortBy("score");
      setLevelFilter("All Levels");
      setSearch("");
      setNotice("Demo leaderboard reset to default state.");
    }
  };

  // Public Visibility Switch with EventConfig sync
  const handleToggleVisibility = async () => {
    const nextVal = visibility === "Public" ? "Hidden" : "Public";
    const nextFrozen = nextVal === "Hidden";

    if (isLiveDb) {
      setIsSavingVisibility(true);
      try {
        await adminService.updateEventConfig({
          isLeaderboardFrozen: nextFrozen,
          frozenAt: nextFrozen ? new Date() : null,
        });
        setVisibility(nextVal);
        setNotice(
          `Public leaderboard visibility updated to ${nextVal.toUpperCase()} in database (Freeze: ${nextFrozen ? "Enabled" : "Disabled"}).`
        );
      } catch (err) {
        setNotice(
          `Failed to update public visibility: ${err?.response?.data?.message || err?.message || "Server error"}`
        );
      } finally {
        setIsSavingVisibility(false);
      }
    } else {
      setVisibility(nextVal);
      setNotice(
        "Visibility changed in local demo state. Connect authenticated backend to persist event settings."
      );
    }
  };

  const adminName = user?.fullName || user?.username || "Event Admin";

  return (
    <div className="lbm-page">
      {/* Shared Mission Control Sidebar */}
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <main className="lbm-main">
        {/* Topbar */}
        <header className="lbm-topbar">
          <button
            type="button"
            className="htg-mobile-menu-btn"
            aria-label="Open navigation menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            ☰
          </button>
          <div className="lbm-global-search">
            <span>⌕</span>
            <input
              aria-label="Global search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search teams, challenges, submissions..."
            />
            <kbd>Ctrl + K</kbd>
          </div>
          <button className="lbm-icon-button" aria-label="Notifications">
            ♧<i />
          </button>
          <Link to={ROUTES.ADMIN_DASHBOARD} className="lbm-admin-chip">
            <span className="lbm-avatar">
              {(adminName || "A").slice(0, 1).toUpperCase()}
            </span>
            <span>
              <strong>{adminName}</strong>
              <small>Event Administrator</small>
            </span>
            <span>⌄</span>
          </Link>
        </header>

        {/* Hero Section */}
        <section className="lbm-hero">
          <div className="lbm-breadcrumb">
            Admin <span>›</span> Leaderboard
            {isLiveDb ? (
              <span className="lbm-data-pill live">● LIVE DATABASE</span>
            ) : (
              <span className="lbm-data-pill demo">● DEMO PREVIEW DATA</span>
            )}
          </div>
          <div className="lbm-heading-row">
            <div>
              <h1>
                Leaderboard <em>Control</em>
              </h1>
              <p>
                Monitor team rankings, track score progression and manage public leaderboard visibility.
              </p>
            </div>
            <div className="lbm-hero-actions">
              <button className="lbm-outline-button" onClick={handleResetOrReload}>
                {isLiveDb ? "↻ Refresh Live" : "↻ Reset Demo"}
              </button>
              <button className="lbm-primary-button" onClick={exportCsv}>
                ⇩ Export CSV
              </button>
            </div>
          </div>
        </section>

        {/* Status Notice Banner */}
        {notice && (
          <div className="lbm-notice" role="status">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notice">
              ×
            </button>
          </div>
        )}

        {/* Overview Stats */}
        <section className="lbm-stats">
          <article>
            <span className="lbm-stat-icon green">✦</span>
            <div>
              <strong>{totalPoints.toLocaleString("en-IN")}</strong>
              <small>Total Points</small>
            </div>
            <div className="lbm-meter green">
              <i style={{ width: `${Math.min(100, Math.round((totalPoints / 20000) * 100))}%` }} />
            </div>
          </article>
          <article>
            <span className="lbm-stat-icon purple">✓</span>
            <div>
              <strong>{solvedCount}</strong>
              <small>Challenges Solved</small>
            </div>
            <div className="lbm-meter purple">
              <i style={{ width: `${Math.min(100, Math.round((solvedCount / 100) * 100))}%` }} />
            </div>
          </article>
          <article>
            <span className="lbm-stat-icon amber">◷</span>
            <div>
              <strong>{recentlyActiveCount}</strong>
              <small>Recently Active</small>
            </div>
            <div className="lbm-meter amber">
              <i style={{ width: `${Math.min(100, Math.round((recentlyActiveCount / (teams.length || 1)) * 100))}%` }} />
            </div>
          </article>
        </section>

        {/* Event Controls Bar */}
        <section className="lbm-controls">
          <div className="lbm-public-setting">
            <span className="lbm-live-dot" />
            <div>
              <strong>Public leaderboard</strong>
              <small>
                {visibility === "Public"
                  ? "Visible to participants"
                  : "Hidden from participants (Frozen)"}
              </small>
            </div>
            <button
              className={`lbm-switch ${visibility === "Public" ? "on" : ""}`}
              role="switch"
              aria-checked={visibility === "Public"}
              aria-label="Toggle public leaderboard visibility"
              disabled={isSavingVisibility}
              onClick={handleToggleVisibility}
            >
              <i />
            </button>
          </div>

          <div className="lbm-auto-setting">
            <div>
              <strong>Auto refresh</strong>
              <small>
                {autoRefresh
                  ? `Enabled (15s poll${lastSyncTime ? ` · Last: ${lastSyncTime.toLocaleTimeString()}` : ""})`
                  : "Disabled"}
              </small>
            </div>
            <button
              className={`lbm-switch ${autoRefresh ? "on" : ""}`}
              role="switch"
              aria-checked={autoRefresh}
              aria-label="Toggle automatic refresh"
              onClick={() => setAutoRefresh((v) => !v)}
            >
              <i />
            </button>
          </div>

          {isLiveDb ? (
            <span className="lbm-live-db-badge">● LIVE SYNC</span>
          ) : (
            <span className="lbm-demo-badge">DEMO DATA</span>
          )}
        </section>

        {/* Filter and View Toolbar */}
        <section className="lbm-toolbar">
          <label className="lbm-search">
            <span>⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search team name or team ID..."
              aria-label="Filter teams by name or code"
            />
          </label>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            aria-label="Filter by challenge level"
          >
            <option value="All Levels">All Levels</option>
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Level {i + 1}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort rankings criteria"
          >
            <option value="score">Sort: Highest score</option>
            <option value="solved">Sort: Challenges solved</option>
            <option value="level">Sort: Highest level</option>
          </select>

          <div className="lbm-spacer" />

          <div className="lbm-view-toggle">
            <button
              type="button"
              className={view === "table" ? "selected" : ""}
              onClick={() => setView("table")}
              aria-label="Table view"
              title="Table view"
            >
              ☷
            </button>
            <button
              type="button"
              className={view === "grid" ? "selected" : ""}
              onClick={() => setView("grid")}
              aria-label="Grid view"
              title="Grid view"
            >
              ▦
            </button>
          </div>
        </section>

        {/* Main Content: Ranking List + Detail Panel */}
        <section className="lbm-content">
          <div className="lbm-list">
            <div className="lbm-list-heading">
              <div>
                <h2>
                  Live Rankings{" "}
                  <span className="lbm-live-tag">
                    <i />
                    {isLiveDb ? "LIVE SCORING" : "LIVE PREVIEW"}
                  </span>
                </h2>
                <p>
                  Rankings are computed dynamically using verified scores and deterministic tie-breaking.
                </p>
              </div>
              <span className="lbm-team-total">{filtered.length} teams</span>
            </div>

            {view === "table" ? (
              <div className="lbm-table-wrap">
                <table className="lbm-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Team</th>
                      <th>Score</th>
                      <th>Solved</th>
                      <th>Level</th>
                      <th>Trend</th>
                      <th>Last Activity</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((team) => (
                      <tr
                        key={team.code}
                        onClick={() => setSelectedCode(team.code)}
                        className={selectedCode === team.code ? "selected-row" : ""}
                      >
                        <td>
                          <span className={`lbm-rank ${medal(team.rank)}`}>
                            {team.rank <= 3 ? "♛" : team.rank}
                          </span>
                        </td>
                        <td>
                          <div className="lbm-team-cell">
                            <span className={`lbm-team-avatar ${medal(team.rank)}`}>
                              {(team.name || "T").slice(0, 1)}
                            </span>
                            <span>
                              <strong>{team.name}</strong>
                              <small>
                                {team.code} · {team.members} members
                              </small>
                            </span>
                          </div>
                        </td>
                        <td>
                          <strong className="lbm-score">
                            {team.score.toLocaleString("en-IN")}
                          </strong>
                          <small className="lbm-points-label">POINTS</small>
                        </td>
                        <td>
                          <span className="lbm-solved">
                            {team.solved}
                            <small>/10</small>
                          </span>
                        </td>
                        <td>
                          <span className="lbm-level-pill">L{team.level}</span>
                          <div className="lbm-level-bar">
                            <i style={{ width: `${Math.min(100, team.level * 10)}%` }} />
                          </div>
                        </td>
                        <td>
                          <span className={`lbm-trend ${team.trend || "same"}`}>
                            {team.trend === "up" ? "↗" : team.trend === "down" ? "↘" : "→"}{" "}
                            {team.trend === "up"
                              ? "Rising"
                              : team.trend === "down"
                              ? "Falling"
                              : "Stable"}
                          </span>
                        </td>
                        <td className="lbm-activity">{team.lastActivity}</td>
                        <td>
                          <button
                            type="button"
                            className="lbm-row-action"
                            title="Inspect team details"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCode(team.code);
                            }}
                          >
                            ↗
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan="8" className="lbm-empty">
                          No teams match the specified filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="lbm-cards">
                {filtered.map((team) => (
                  <button
                    key={team.code}
                    type="button"
                    onClick={() => setSelectedCode(team.code)}
                    className={`lbm-card ${selectedCode === team.code ? "chosen" : ""}`}
                  >
                    <div className="lbm-card-top">
                      <span className={`lbm-rank ${medal(team.rank)}`}>
                        {team.rank <= 3 ? "♛" : team.rank}
                      </span>
                      <span className={`lbm-trend ${team.trend || "same"}`}>
                        {team.trend === "up" ? "↗" : team.trend === "down" ? "↘" : "→"}
                      </span>
                    </div>
                    <strong>{team.name}</strong>
                    <small>
                      {team.code} · {team.members} members
                    </small>
                    <b>
                      {team.score.toLocaleString("en-IN")} <small>PTS</small>
                    </b>
                    <div className="lbm-card-bottom">
                      <span>{team.solved}/10 solved</span>
                      <span>Level {team.level}</span>
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="lbm-empty" style={{ gridColumn: "1/-1" }}>
                    No teams match the specified filters.
                  </div>
                )}
              </div>
            )}

            <footer className="lbm-table-footer">
              <span>
                Showing {filtered.length ? 1 : 0}–{filtered.length} of {filtered.length} teams
              </span>
              <div>
                <button type="button" disabled>
                  ‹
                </button>
                <button type="button" className="current">
                  1
                </button>
                <button type="button" disabled>
                  ›
                </button>
              </div>
            </footer>
          </div>

          {/* Team Detail Inspection Sidebar */}
          <aside className="lbm-detail">
            <div className="lbm-detail-head">
              <small>TEAM PERFORMANCE</small>
              <span className={`lbm-rank ${medal(selected.rank)}`}>
                {selected.rank <= 3 ? "♛" : selected.rank}
              </span>
              <div className={`lbm-detail-avatar ${medal(selected.rank)}`}>
                {(selected.name || "T").slice(0, 1)}
              </div>
              <h2>{selected.name}</h2>
              <p>
                {selected.code} <span>•</span> {selected.members} members
              </p>
            </div>

            <div className="lbm-detail-score">
              <small>TOTAL SCORE</small>
              <strong>
                {selected.score.toLocaleString("en-IN")} <span>PTS</span>
              </strong>
              <div className="lbm-score-progress">
                <i
                  style={{
                    width: `${Math.min(100, Math.round((selected.score / 2000) * 100))}%`,
                  }}
                />
              </div>
              <small>
                {Math.round((selected.score / 2000) * 100)}% of 2,000 reference score
              </small>
            </div>

            <div className="lbm-detail-metrics">
              <div>
                <strong>
                  {selected.solved}
                  <small>/10</small>
                </strong>
                <span>Challenges solved</span>
              </div>
              <div>
                <strong>Level {selected.level}</strong>
                <span>Current level</span>
              </div>
              <div>
                <strong>
                  {selected.streak || 1} <small>🔥</small>
                </strong>
                <span>Activity streak</span>
              </div>
            </div>

            <div className="lbm-detail-body">
              <h3>Performance Overview</h3>
              <div className="lbm-performance-row">
                <span>Challenge completion</span>
                <strong>{Math.min(100, selected.solved * 10)}%</strong>
              </div>
              <div className="lbm-progress">
                <i style={{ width: `${Math.min(100, selected.solved * 10)}%` }} />
              </div>

              <div className="lbm-performance-row">
                <span>Current level progress</span>
                <strong>{selected.level}/10</strong>
              </div>
              <div className="lbm-progress">
                <i style={{ width: `${Math.min(100, selected.level * 10)}%` }} />
              </div>

              <h3>Recent Activity</h3>
              <div className="lbm-activity-line">
                <i />
                <div>
                  <strong>{selected.lastActivity}</strong>
                  <small>
                    Latest team activity · {selected.code} ({selected.status})
                  </small>
                </div>
              </div>

              <div className="lbm-security-note">
                <span>ⓘ</span>
                <p>
                  <strong>Ranking integrity</strong>
                  <br />
                  Official ranks strictly compute from server-verified submission scores using deterministic tie-breaking (earliest completion wins). Manual client-side rank edits are disabled in live mode.
                </p>
              </div>
            </div>

            <div className="lbm-detail-actions">
              <Link
                to={`${ROUTES.ADMIN_TEAMS}?search=${encodeURIComponent(selected.name)}`}
                className="lbm-outline-button"
                style={{
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                View Team Profile ↗
              </Link>
              <button
                type="button"
                className="lbm-primary-button"
                onClick={() => moveTeam(selected.code, -1)}
                disabled={selected.rank === 1 || isLiveDb}
                title={
                  isLiveDb
                    ? "Rank manipulation disabled in live database mode"
                    : "Demo-only local rank adjustment"
                }
              >
                {isLiveDb ? "✓ Server Verified" : "↑ Demo Move Up"}
              </button>
            </div>
          </aside>
        </section>

        {/* Footer */}
        <footer className="lbm-footer">
          Build with <span>♥</span> by Hrithik Roshan{" "}
          <small>HACK THE GRID · MISSION CONTROL</small>
        </footer>
      </main>
    </div>
  );
}

