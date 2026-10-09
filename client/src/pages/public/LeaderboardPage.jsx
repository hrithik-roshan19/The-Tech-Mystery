import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import "../../styles/LeaderboardPage.css";

const teams = [
  { rank: 1, name: "NullPointers", members: "Team of 4", points: 1850, solved: 9, last: "2 min ago", trend: "up" },
  { rank: 2, name: "CyberTitans", members: "Team of 3", points: 1620, solved: 8, last: "5 min ago", trend: "up" },
  { rank: 3, name: "HackOverflow", members: "Team of 4", points: 1480, solved: 8, last: "8 min ago", trend: "same" },
  { rank: 4, name: "ByteForce", members: "Team of 3", points: 1250, solved: 6, last: "10 min ago", trend: "up", own: true },
  { rank: 5, name: "KernelPanic", members: "Team of 4", points: 980, solved: 5, last: "12 min ago", trend: "down" },
  { rank: 6, name: "StackSmashers", members: "Team of 2", points: 875, solved: 5, last: "16 min ago", trend: "up" },
  { rank: 7, name: "SegFault Squad", members: "Team of 3", points: 790, solved: 4, last: "20 min ago", trend: "same" },
  { rank: 8, name: "BitBandits", members: "Team of 4", points: 640, solved: 4, last: "24 min ago", trend: "down" },
  { rank: 9, name: "RootAccess", members: "Team of 2", points: 520, solved: 3, last: "29 min ago", trend: "up" },
  { rank: 10, name: "LogicLoop", members: "Team of 3", points: 410, solved: 2, last: "35 min ago", trend: "same" },
];

const recentActivities = [
  { team: "ByteForce", action: "solved Level 6 Forensics", time: "2 min ago", type: "solve" },
  { team: "CyberTitans", action: "captured Flag #8", time: "5 min ago", type: "flag" },
  { team: "NullPointers", action: "unlocked Level 10 Final Challenge", time: "9 min ago", type: "unlock" },
  { team: "HackOverflow", action: "solved Cryptography", time: "14 min ago", type: "solve" },
  { team: "KernelPanic", action: "submitted flag (+120 pts)", time: "21 min ago", type: "score" },
];

const navLinks = [
  ["Mission", ROUTES.MISSION],
  ["How It Works", "/mission#how-it-works"],
  ["Challenges", ROUTES.CHALLENGES],
  ["QR Checkpoint", ROUTES.QR_CHECKPOINT],
  ["Rules", ROUTES.RULES],
  ["Leaderboard", ROUTES.LEADERBOARD],
];

export default function LeaderboardPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rank");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);

  const visibleTeams = useMemo(() => {
    let result = teams.filter((team) => {
      const matchesSearch = team.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || (filter === "top5" ? team.rank <= 5 : team.own);
      return matchesSearch && matchesFilter;
    });
    if (sortBy === "points") result = [...result].sort((a, b) => b.points - a.points);
    if (sortBy === "solved") result = [...result].sort((a, b) => b.solved - a.solved || b.points - a.points);
    return result;
  }, [filter, search, sortBy]);

  // Top 3 ranked teams: [Silver #2 (left), Gold #1 (center), Bronze #3 (right)]
  const topThree = [teams[1], teams[0], teams[2]];

  return (
    <main className="htg-lb-page">
      <div className="htg-lb-background" aria-hidden="true" />

      {/* Top Navbar */}
      <header className="htg-lb-navbar">
        <Link to={ROUTES.HOME} className="htg-lb-brand" aria-label="Hack the Grid home">
          <span>HACK THE <b>GRID</b></span>
          <small>CODESPHERE × UTKRISHT 2026</small>
        </Link>
        <nav className="htg-lb-navlinks" aria-label="Main navigation">
          {navLinks.map(([label, href]) => (
            <Link
              key={label}
              to={href}
              className={label === "Leaderboard" ? "active" : ""}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="htg-lb-nav-actions">
          <Link to={ROUTES.DASHBOARD} className="htg-lb-dashboard">Dashboard</Link>
          <Link to={ROUTES.REGISTER} className="htg-lb-register">Register</Link>
        </div>
        <button
          type="button"
          className="htg-lb-mobile-menu"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <span /><span /><span />
        </button>

        {mobileMenuOpen && (
          <div className="htg-lb-mobile-drawer">
            {navLinks.map(([label, href]) => (
              <Link
                key={label}
                to={href}
                className={label === "Leaderboard" ? "active" : ""}
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="htg-lb-drawer-actions">
              <Link to={ROUTES.DASHBOARD} className="htg-lb-dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <Link to={ROUTES.REGISTER} className="htg-lb-register" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            </div>
          </div>
        )}
      </header>

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
                <strong>120+</strong>
                <small>PARTICIPANTS</small>
              </div>
              <div className="htg-lb-hero-stat">
                <span className="htg-lb-stat-icon">⚑</span>
                <strong>10</strong>
                <small>CHALLENGES</small>
              </div>
              <div className="htg-lb-hero-stat">
                <span className="htg-lb-stat-icon">♛</span>
                <strong>1,850</strong>
                <small>CHAMPION</small>
              </div>
            </div>

            <blockquote className="htg-lb-hero-quote">
              “ Don't just chase the top spot.<br />
              <span>Earn every point.</span> Hack the Grid. ”
              <small>— CodeSphere × Utkrisht 2026</small>
            </blockquote>
          </div>
        </aside>

        {/* CENTER COLUMN: 46–49% width */}
        <section className="htg-lb-col-center">
          {/* Compact Podium with 3 Ranked Teams */}
          <div className="htg-lb-podium" aria-label="Top three ranked teams">
            {/* Runner-up #2 (Silver) on Left */}
            <article className="htg-lb-podium-card place-2">
              <div className="htg-lb-podium-rank-ribbon">
                <span className="htg-lb-podium-emblem">🥈</span>
                <span className="htg-lb-podium-rank-title">#02 RUNNER UP</span>
              </div>
              <div className="htg-lb-podium-avatar-wrap">
                <span className="htg-lb-podium-avatar">CT</span>
              </div>
              <h2 className="htg-lb-podium-team-name">{topThree[0].name}</h2>
              <div className="htg-lb-podium-points">
                <strong>{topThree[0].points.toLocaleString()}</strong> <span>PTS</span>
              </div>
              <p className="htg-lb-podium-challenges">{topThree[0].solved} / 10 challenges solved</p>
            </article>

            {/* Champion #1 (Gold) in Center - Taller */}
            <article className="htg-lb-podium-card place-1">
              <div className="htg-lb-podium-rank-ribbon gold">
                <span className="htg-lb-podium-emblem">👑</span>
                <span className="htg-lb-podium-rank-title">#01 CHAMPION</span>
              </div>
              <div className="htg-lb-podium-avatar-wrap gold">
                <span className="htg-lb-podium-avatar gold">NP</span>
              </div>
              <h2 className="htg-lb-podium-team-name gold">{topThree[1].name}</h2>
              <div className="htg-lb-podium-points gold">
                <strong>{topThree[1].points.toLocaleString()}</strong> <span>PTS</span>
              </div>
              <p className="htg-lb-podium-challenges">{topThree[1].solved} / 10 challenges solved</p>
            </article>

            {/* 3rd Place #3 (Bronze) on Right */}
            <article className="htg-lb-podium-card place-3">
              <div className="htg-lb-podium-rank-ribbon bronze">
                <span className="htg-lb-podium-emblem">🥉</span>
                <span className="htg-lb-podium-rank-title">#03 3RD PLACE</span>
              </div>
              <div className="htg-lb-podium-avatar-wrap bronze">
                <span className="htg-lb-podium-avatar bronze">HO</span>
              </div>
              <h2 className="htg-lb-podium-team-name">{topThree[2].name}</h2>
              <div className="htg-lb-podium-points">
                <strong>{topThree[2].points.toLocaleString()}</strong> <span>PTS</span>
              </div>
              <p className="htg-lb-podium-challenges">{topThree[2].solved} / 10 challenges solved</p>
            </article>
          </div>

          {/* Full Rankings Panel */}
          <div className="htg-lb-main-panel">
            <div className="htg-lb-panel-heading">
              <div>
                <p className="htg-lb-eyebrow">LIVE TELEMETRY</p>
                <h2>Team Rankings</h2>
              </div>
              <div className="htg-lb-live">
                <i /> EVENT RANKINGS <strong>DEMO DATA</strong>
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
              <div className="htg-lb-filters" role="group" aria-label="Filter teams">
                <button
                  type="button"
                  className={filter === "all" ? "selected" : ""}
                  onClick={() => setFilter("all")}
                >
                  All Teams
                </button>
                <button
                  type="button"
                  className={filter === "top5" ? "selected" : ""}
                  onClick={() => setFilter("top5")}
                >
                  Top 5
                </button>
                <button
                  type="button"
                  className={filter === "mine" ? "selected" : ""}
                  onClick={() => setFilter("mine")}
                >
                  My Team
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
                  {visibleTeams.map((team) => (
                    <tr key={team.rank} className={team.own ? "my-team" : ""}>
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
                          <i style={{ width: `${team.solved * 10}%` }} />
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
                  {visibleTeams.length === 0 && (
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
              <span>Showing {visibleTeams.length} of {teams.length} registered teams</span>
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
              <span className="htg-lb-side-badge">#04</span>
            </div>
            <div className="htg-lb-your-team-row">
              <span className="htg-lb-team-icon">▥</span>
              <div>
                <h3>ByteForce</h3>
                <p className="htg-lb-points-banner">1,250 <span>PTS</span></p>
              </div>
            </div>
            <div className="htg-lb-your-team-details">
              <div className="htg-lb-metric-line">
                <span>Challenges Solved</span>
                <strong>6 / 10 (60%)</strong>
              </div>
              <div className="htg-lb-progress-bar-wrap">
                <i style={{ width: "60%" }} />
              </div>
              <div className="htg-lb-metric-line">
                <span>Current Trend</span>
                <strong className="htg-lb-positive-trend">↗ Rising (+250 pts)</strong>
              </div>
            </div>
            <Link to={ROUTES.DASHBOARD} className="htg-lb-side-cta">
              View Team Dashboard →
            </Link>
          </div>

          {/* 2. Leaderboard Stats Card */}
          <div className="htg-lb-side-card htg-lb-stats-card">
            <h4 className="htg-lb-side-title">
              <span className="htg-lb-icon-glyph">📊</span> Leaderboard Stats
            </h4>
            <div className="htg-lb-stats-list">
              <div className="htg-lb-stat-row">
                <span>Total Teams</span>
                <strong>32 Teams</strong>
              </div>
              <div className="htg-lb-stat-row">
                <span>Challenges</span>
                <strong>10 Active Levels</strong>
              </div>
              <div className="htg-lb-stat-row">
                <span>Participants</span>
                <strong>128 Operatives</strong>
              </div>
              <div className="htg-lb-stat-row">
                <span>Highest Points</span>
                <strong className="htg-lb-highlight">{teams[0].points.toLocaleString()} PTS</strong>
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
              {(showAllActivity ? recentActivities : recentActivities.slice(0, 4)).map((act, i) => (
                <div key={i} className="htg-lb-activity-item">
                  <span className={`htg-lb-act-marker ${act.type}`} />
                  <div className="htg-lb-act-content">
                    <p>
                      <strong>{act.team}</strong> {act.action}
                    </p>
                    <small>{act.time}</small>
                  </div>
                </div>
              ))}
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
        HACK THE GRID 2026 <span>•</span> CODESPHERE × UTKRISHT <span>•</span> PLAY FAIR. THINK SMART.
      </footer>
    </main>
  );
}
