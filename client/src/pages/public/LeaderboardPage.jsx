import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ROUTES } from "../../constants/routes";
import Navbar from "../../components/navigation/Navbar";
import { PageTransition } from "../../components/common/Motion";
import { buttonHoverTap } from "../../utils/motion";
import { leaderboardService } from "../../services/leaderboard.service";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/LeaderboardPage.css";



function formatTimeAgo(dateString) {
  if (!dateString) return "Recently";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rank");
  const [showAllActivity, setShowAllActivity] = useState(false);

  // Live state
  const [liveTeams, setLiveTeams] = useState(null);
  const [recentActivitiesList, setRecentActivitiesList] = useState([]);
  const [isFrozen, setIsFrozen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLiveLeaderboard = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      setError(null);
      const res = await leaderboardService.getLeaderboard();
      if (res?.success && res.data) {
        if (Array.isArray(res.data.leaderboard)) {
          setLiveTeams(res.data.leaderboard);
        }
        if (Array.isArray(res.data.recentActivity)) {
          setRecentActivitiesList(res.data.recentActivity);
        }
        setIsVisible(res.data.isVisible !== false);
        setIsFrozen(Boolean(res.data.isFrozen));
        setLastUpdated(res.data.lastUpdated ? new Date(res.data.lastUpdated).toLocaleTimeString() : new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.warn("Notice: Live leaderboard fetch error:", err?.message);
      setError(err?.response?.data?.message || err?.message || "Failed to synchronize leaderboard telemetry.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveLeaderboard(false);

    let eventSource = null;
    try {
      const streamUrl = leaderboardService.getStreamUrl();
      eventSource = new EventSource(streamUrl);
      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload && Array.isArray(payload.leaderboard)) {
            setLiveTeams(payload.leaderboard);
            setIsVisible(payload.isVisible !== false);
            setIsFrozen(Boolean(payload.isFrozen));
            setLastUpdated(payload.lastUpdated ? new Date(payload.lastUpdated).toLocaleTimeString() : new Date().toLocaleTimeString());
          }
        } catch {
          // ignore parsing error
        }
      };
    } catch {
      // EventSource fallback to polling
    }

    const timer = setInterval(() => fetchLiveLeaderboard(false), 12000);

    return () => {
      clearInterval(timer);
      if (eventSource) eventSource.close();
    };
  }, []);

  const isLive = Boolean(liveTeams !== null);

  const allTeams = useMemo(() => {
    if (Array.isArray(liveTeams)) {
      return liveTeams.map((t, idx) => ({
        rank: t.rank || idx + 1,
        id: t.teamId || `team-${idx}`,
        name: t.teamName || `Team ${idx + 1}`,
        members: `${t.membersCount || 3} Operatives`,
        points: Number(t.totalScore || 0),
        solved: t.solvedCount !== undefined ? t.solvedCount : (t.completedChallenges || 0),
        last: formatTimeAgo(t.lastSolveTimestamp),
        trend: "same",
        own: Boolean(user?.teamId && user.teamId === t.teamId)
      }));
    }
    return [];
  }, [liveTeams, user]);

  const visibleTeams = useMemo(() => {
    let result = allTeams.filter((team) => {
      const matchesSearch = team.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || (filter === "top5" ? team.rank <= 5 : team.own);
      return matchesSearch && matchesFilter;
    });
    if (sortBy === "points") result = [...result].sort((a, b) => b.points - a.points);
    if (sortBy === "solved") result = [...result].sort((a, b) => b.solved - a.solved || b.points - a.points);
    return result;
  }, [allTeams, filter, search, sortBy]);

  // Top 3 ranked teams: [Silver #2 (left), Gold #1 (center), Bronze #3 (right)]
  const topThree = useMemo(() => {
    const list = allTeams;
    if (list.length >= 3) {
      return [list[1], list[0], list[2]];
    }
    if (list.length === 2) {
      return [list[1], list[0], { rank: 3, name: "Unclaimed", points: 0, solved: 0, members: "—" }];
    }
    if (list.length === 1) {
      return [
        { rank: 2, name: "Unclaimed", points: 0, solved: 0, members: "—" },
        list[0],
        { rank: 3, name: "Unclaimed", points: 0, solved: 0, members: "—" }
      ];
    }
    return [
      { rank: 2, name: "Unclaimed", points: 0, solved: 0, members: "—" },
      { rank: 1, name: "Unclaimed", points: 0, solved: 0, members: "—" },
      { rank: 3, name: "Unclaimed", points: 0, solved: 0, members: "—" }
    ];
  }, [allTeams]);

  // User's own team stats
  const userTeam = useMemo(() => {
    if (user?.teamId) {
      const found = allTeams.find((t) => t.own || t.id === user.teamId);
      if (found) return found;
    }
    return {
      rank: "—",
      name: user?.name ? `${user.name}'s Squad` : "No Squad Joined",
      points: 0,
      solved: 0,
      trend: "same",
      unregistered: !user?.teamId
    };
  }, [allTeams, user]);

  return (
    <PageTransition className="htg-lb-page">
      <div className="htg-lb-background" aria-hidden="true" />

      {/* Top Navbar */}
      <Navbar />

      {/* 3-Column Desktop Layout */}
      <div className="htg-lb-layout">
        {/* LEFT HERO: 26–29% width */}
        <aside className="htg-lb-col-left">
          <div className="htg-lb-hero-panel">
            <p className="htg-lb-eyebrow">TOP TEAMS RISE TO THE GRID</p>
            <h1 className="htg-lb-hero-title">
              LIVE STANDINGS<br />
              <span>THE GRID</span>
            </h1>
            <div className="htg-lb-accent-bar" />
            <p className="htg-lb-hero-desc">
              Every flag counts. Every point matters. Real-time team standings and competitive telemetry for CodeSphere × Utkrisht 2026.
            </p>

            <div className="htg-lb-hero-stats">
              <div className="htg-lb-hero-stat">
                <span className="htg-lb-stat-icon">👥</span>
                <strong>{allTeams.length}</strong>
                <small>REGISTERED<br />TEAMS</small>
              </div>
              <div className="htg-lb-hero-stat">
                <span className="htg-lb-stat-icon">⚑</span>
                <strong>10</strong>
                <small>CHALLENGE<br />LEVELS</small>
              </div>
              <div className="htg-lb-hero-stat">
                <span className="htg-lb-stat-icon">♛</span>
                <strong>{topThree[1]?.points ? topThree[1].points.toLocaleString() : 0}</strong>
                <small>CHAMPION<br />SCORE</small>
              </div>
            </div>

            <blockquote className="htg-lb-hero-quote">
              “ Don't just chase the top spot.<br />
              <span>Earn every point.</span> The Tech Mystery. ”
              <footer>— CodeSphere SOC Operations</footer>
            </blockquote>

            <div className="htg-lb-hero-meta">
              <span>PEOPLE</span>
              <span>IDEAS</span>
              <span>TECHNOLOGY</span>
              <span>A STRONGER TOMORROW</span>
            </div>
          </div>
        </aside>

        {/* CENTER MAIN: 46–49% width */}
        <section className="htg-lb-col-center">
          {/* SOC Concealed Alert Banner */}
          {!isVisible && (
            <div className="htg-lb-alert-banner warning" role="alert">
              <div className="htg-lb-alert-inner">
                <span className="htg-lb-alert-icon">🔒</span>
                <div>
                  <strong>LEADERBOARD CONCEALED BY SOC:</strong> Public standings are currently hidden by event administrators. Verified team scores continue to accumulate securely.
                </div>
              </div>
              <button
                type="button"
                className="htg-lb-btn-refresh"
                onClick={() => fetchLiveLeaderboard(true)}
                disabled={isRefreshing}
              >
                {isRefreshing ? "SYNCING..." : "↻ REFRESH"}
              </button>
            </div>
          )}

          {/* Leaderboard Frozen Banner */}
          {isFrozen && isVisible && (
            <div className="htg-lb-alert-banner info" role="status">
              <div className="htg-lb-alert-inner">
                <span className="htg-lb-alert-icon">❄️</span>
                <div>
                  <strong>LEADERBOARD FROZEN:</strong> Final round standings are frozen. Scores continue to track behind the scenes.
                </div>
              </div>
            </div>
          )}

          {/* Connection Error Banner */}
          {error && (
            <div className="htg-lb-alert-banner" role="alert">
              <div className="htg-lb-alert-inner">
                <span className="htg-lb-alert-icon">⚠️</span>
                <div>{error}</div>
              </div>
              <button type="button" className="htg-lb-retry-btn" onClick={() => fetchLiveLeaderboard(true)}>
                RETRY
              </button>
            </div>
          )}

          {/* Top 3 Podium Cards */}
          <div className="htg-lb-podium">
            {/* 2nd Place #2 (Silver) on Left */}
            <motion.article
              className="htg-lb-podium-card place-2"
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="htg-lb-podium-rank-ribbon silver">
                <span className="htg-lb-podium-emblem">🥈</span>
                <span className="htg-lb-podium-rank-title">#02 2ND PLACE</span>
              </div>
              <div className="htg-lb-podium-avatar-wrap silver">
                <span className="htg-lb-podium-avatar silver">
                  {topThree[0]?.name ? topThree[0].name.slice(0, 2).toUpperCase() : "02"}
                </span>
              </div>
              <h2 className="htg-lb-podium-team-name">{topThree[0]?.name || "Unclaimed"}</h2>
              <div className="htg-lb-podium-points">
                <strong>{topThree[0]?.points?.toLocaleString() || 0}</strong> <span>PTS</span>
              </div>
              <p className="htg-lb-podium-challenges">{topThree[0]?.solved || 0} / 10 challenges solved</p>
            </motion.article>

            {/* 1st Place #1 (Gold) in Center (Elevated) */}
            <motion.article
              className="htg-lb-podium-card place-1 featured"
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div className="htg-lb-podium-rank-ribbon gold">
                <span className="htg-lb-podium-emblem">👑</span>
                <span className="htg-lb-podium-rank-title">#01 CHAMPION</span>
              </div>
              <div className="htg-lb-podium-avatar-wrap gold">
                <span className="htg-lb-podium-avatar gold">
                  {topThree[1]?.name ? topThree[1].name.slice(0, 2).toUpperCase() : "01"}
                </span>
              </div>
              <h2 className="htg-lb-podium-team-name gold">{topThree[1]?.name || "Unclaimed"}</h2>
              <div className="htg-lb-podium-points gold">
                <strong>{topThree[1]?.points?.toLocaleString() || 0}</strong> <span>PTS</span>
              </div>
              <p className="htg-lb-podium-challenges">{topThree[1]?.solved || 0} / 10 challenges solved</p>
            </motion.article>

            {/* 3rd Place #3 (Bronze) on Right */}
            <motion.article
              className="htg-lb-podium-card place-3"
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="htg-lb-podium-rank-ribbon bronze">
                <span className="htg-lb-podium-emblem">🥉</span>
                <span className="htg-lb-podium-rank-title">#03 3RD PLACE</span>
              </div>
              <div className="htg-lb-podium-avatar-wrap bronze">
                <span className="htg-lb-podium-avatar bronze">
                  {topThree[2]?.name ? topThree[2].name.slice(0, 2).toUpperCase() : "03"}
                </span>
              </div>
              <h2 className="htg-lb-podium-team-name">{topThree[2]?.name || "Unclaimed"}</h2>
              <div className="htg-lb-podium-points">
                <strong>{topThree[2]?.points?.toLocaleString() || 0}</strong> <span>PTS</span>
              </div>
              <p className="htg-lb-podium-challenges">{topThree[2]?.solved || 0} / 10 challenges solved</p>
            </motion.article>
          </div>

          {/* Full Rankings Panel */}
          <div className="htg-lb-main-panel">
            <div className="htg-lb-panel-heading">
              <div>
                <p className="htg-lb-eyebrow">LIVE TELEMETRY</p>
                <h2>Team Rankings</h2>
              </div>
              <div className="htg-lb-live">
                <i style={{ background: isLive ? "var(--htg-lime, #b8ff3d)" : "#ffaa00" }} />
                <span>{isLive ? "LIVE DATABASE" : "CONNECTING..."}</span>
                {isFrozen && <strong style={{ color: "#00e5ff", marginLeft: "6px" }}>[FROZEN]</strong>}
                {!isVisible && <strong style={{ color: "#ffaa00", marginLeft: "6px" }}>[HIDDEN]</strong>}
                {lastUpdated && <small style={{ marginLeft: "8px", color: "#7a827e", fontSize: "10px" }}>{lastUpdated}</small>}
                <motion.button
                  type="button"
                  className="htg-lb-btn-refresh"
                  style={{ marginLeft: "8px" }}
                  onClick={() => fetchLiveLeaderboard(true)}
                  disabled={isRefreshing}
                  {...buttonHoverTap}
                >
                  {isRefreshing ? "..." : "↻ REFRESH"}
                </motion.button>
              </div>
            </div>

            <div className="htg-lb-controls">
              <label className="htg-lb-search">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search squad or team..."
                  aria-label="Search team"
                />
              </label>

              <div className="htg-lb-filters" role="tablist">
                <button
                  type="button"
                  className={filter === "all" ? "active" : ""}
                  onClick={() => setFilter("all")}
                >
                  All Teams ({allTeams.length})
                </button>
                <button
                  type="button"
                  className={filter === "top5" ? "active" : ""}
                  onClick={() => setFilter("top5")}
                >
                  Top 5
                </button>
                <button
                  type="button"
                  className={filter === "my" ? "active" : ""}
                  onClick={() => setFilter("my")}
                >
                  My Squad
                </button>
              </div>

              <label className="htg-lb-sort">
                Sort by
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="rank">Rank</option>
                  <option value="points">Points</option>
                  <option value="solved">Challenges solved</option>
                </select>
              </label>
            </div>

            <div className="htg-lb-table-wrap">
              <table className="htg-lb-table">
                <thead>
                  <tr>
                    <th>RANK</th>
                    <th>TEAM NAME</th>
                    <th>CHALLENGES SOLVED</th>
                    <th>POINTS</th>
                    <th>LAST ACTIVITY</th>
                    <th>TREND</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan="6" className="htg-lb-empty">
                        <div className="htg-lb-loading-box">
                          <div className="htg-lb-spinner" />
                          <p>Connecting to The Tech Mystery telemetry...</p>
                        </div>
                      </td>
                    </tr>
                  )}
                  {!loading && !isVisible && (
                    <tr>
                      <td colSpan="6" className="htg-lb-empty">
                        <div className="htg-lb-empty-box">
                          <p style={{ fontSize: "16px", marginBottom: "6px" }}>🔒 STANDINGS CONCEALED</p>
                          <p>The public leaderboard is currently hidden by event marshals. Solved flags remain securely registered.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                  {!loading && isVisible && visibleTeams.map((team) => (
                    <tr key={team.id || team.rank} className={team.own ? "my-team" : ""}>
                      <td>
                        <span className={`htg-lb-rank ${team.rank <= 3 ? `rank-${team.rank}` : ""}`}>
                          {team.rank <= 3
                            ? ["🥇", "🥈", "🥉"][team.rank - 1]
                            : String(team.rank).padStart(2, "0")}
                        </span>
                      </td>
                      <td>
                        <div className="htg-lb-team">
                          <span className="htg-lb-team-avatar">
                            {team.name.slice(0, 2).toUpperCase()}
                          </span>
                          <span>
                            <strong>
                              {team.name}
                              {team.own && <em>YOU</em>}
                            </strong>
                            <small>{team.members}</small>
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="htg-lb-solved">
                          {team.solved}
                          <small> / 10</small>
                        </span>
                        <span className="htg-lb-row-progress">
                          <i style={{ width: `${Math.min(100, team.solved * 10)}%` }} />
                        </span>
                      </td>
                      <td>
                        <strong className="htg-lb-points">{team.points.toLocaleString()}</strong>
                      </td>
                      <td className="htg-lb-last">{team.last}</td>
                      <td>
                        <span className={`htg-lb-trend ${team.trend}`}>
                          {team.trend === "up" ? "↗" : team.trend === "down" ? "↘" : "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!loading && isVisible && allTeams.length === 0 && (
                    <tr>
                      <td colSpan="6" className="htg-lb-empty">
                        <div className="htg-lb-empty-box">
                          <p style={{ fontSize: "16px", marginBottom: "6px" }}>⚡ THE ARENA IS OPEN</p>
                          <p>No teams ranked yet. Standings activate when squads scan checkpoints and solve challenges!</p>
                        </div>
                      </td>
                    </tr>
                  )}
                  {!loading && isVisible && allTeams.length > 0 && visibleTeams.length === 0 && (
                    <tr>
                      <td colSpan="6" className="htg-lb-empty">
                        No teams match your search "{search}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="htg-lb-table-footer">
              <span>Showing {visibleTeams.length} of {allTeams.length} active teams</span>
              <span>Scoring updates with verified flag submissions.</span>
            </div>
          </div>
        </section>

        {/* RIGHT SIDEBAR: 24–26% width */}
        <aside className="htg-lb-col-right">
          {/* 1. Your Team Card */}
          <div className="htg-lb-side-card htg-lb-your-team-card">
            <div className="htg-lb-side-card-top">
              <span className="htg-lb-side-eyebrow">YOUR SQUAD</span>
              <span className="htg-lb-side-badge">#{String(userTeam.rank || 1).padStart(2, "0")}</span>
            </div>
            <div className="htg-lb-your-team-row">
              <span className="htg-lb-team-icon">▥</span>
              <div>
                <h3>{userTeam.name}</h3>
                <p className="htg-lb-points-banner">{userTeam.points?.toLocaleString() || 0} <span>PTS</span></p>
              </div>
            </div>
            <div className="htg-lb-your-team-details">
              <div className="htg-lb-metric-line">
                <span>Challenges Solved</span>
                <strong>{userTeam.solved} / 10 ({userTeam.solved * 10}%)</strong>
              </div>
              <div className="htg-lb-progress-bar-wrap">
                <i style={{ width: `${Math.min(100, userTeam.solved * 10)}%` }} />
              </div>
              <div className="htg-lb-metric-line">
                <span>Current Standing</span>
                <strong className="htg-lb-positive-trend">Rank #{userTeam.rank} on Grid</strong>
              </div>
            </div>
            <Link to={ROUTES.DASHBOARD} className="htg-lb-side-cta">
              View Mission Dashboard →
            </Link>
          </div>

          {/* 2. Leaderboard Stats Card */}
          <div className="htg-lb-side-card htg-lb-stats-card">
            <h4 className="htg-lb-side-title">
              <span className="htg-lb-icon-glyph">📊</span> Leaderboard Telemetry
            </h4>
            <div className="htg-lb-stats-list">
              <div className="htg-lb-stat-row">
                <span>Total Squads</span>
                <strong>{allTeams.length} Teams</strong>
              </div>
              <div className="htg-lb-stat-row">
                <span>Challenge Nodes</span>
                <strong>10 Active Levels</strong>
              </div>
              <div className="htg-lb-stat-row">
                <span>Leading Score</span>
                <strong className="htg-lb-highlight">{topThree[1]?.points?.toLocaleString() || 0} PTS</strong>
              </div>
              <div className="htg-lb-stat-row">
                <span>Freeze Mode</span>
                <strong>{isFrozen ? "ACTIVE (CLOAKED)" : "OFF (REAL-TIME)"}</strong>
              </div>
            </div>
          </div>

          {/* 3. Recent Activity Card */}
          <div className="htg-lb-side-card htg-lb-activity-card">
            <div className="htg-lb-activity-header">
              <h4 className="htg-lb-side-title">
                <span className="htg-lb-live-dot" /> Recent Activity
              </h4>
              <span className="htg-lb-pill-tag">LIVE FEED</span>
            </div>
            <div className="htg-lb-activity-feed">
              {recentActivitiesList.length === 0 ? (
                <div className="htg-lb-empty-activity" style={{ padding: "16px 0", textAlign: "center", color: "#7a827e", fontSize: "0.85rem" }}>
                  No challenge submissions recorded yet. Feed updates in real time during the event.
                </div>
              ) : (
                (showAllActivity ? recentActivitiesList : recentActivitiesList.slice(0, 4)).map((act, i) => (
                  <div key={i} className="htg-lb-activity-item">
                    <span className={`htg-lb-act-marker ${act.type || "score"}`} />
                    <div className="htg-lb-act-content">
                      <p>
                        <strong>{act.team}</strong> {act.action}
                      </p>
                      <small>{act.time}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              type="button"
              className="htg-lb-view-all-btn"
              onClick={() => setShowAllActivity((prev) => !prev)}
            >
              {showAllActivity ? "Show Less ↑" : "View All Activity →"}
            </button>
          </div>
        </aside>
      </div>

      <footer className="htg-lb-footer">
        THE TECH MYSTERY 2026 <span>•</span> CODESPHERE × UTKRISHT <span>•</span> PLAY FAIR. THINK SMART.
      </footer>
    </PageTransition>
  );
}
