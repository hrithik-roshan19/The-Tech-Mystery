import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import "../../styles/ParticipantDashboard.css";

const levels = [
  ["01", "Orientation", "Easy", "done", "⚑"],
  ["02", "Web Exploitation", "Easy", "done", "</>"],
  ["03", "Cryptography", "Medium", "done", "♙"],
  ["04", "OSINT", "Medium", "done", "⌘"],
  ["05", "Reverse Engineering", "Medium", "done", "⚙"],
  ["06", "Forensics", "Hard", "done", "▤"],
  ["07", "Binary Exploitation", "Hard", "active", "›_"],
  ["08", "Network & Infra", "Hard", "locked", "⌁"],
  ["09", "Logic & Steganography", "Expert", "locked", "♧"],
  ["10", "Final Challenge", "Expert", "locked", "♜"],
];

const activities = [
  ["You solved", "Cryptography · Level 3", "10 min ago", "done"],
  ["New challenge unlocked", "Binary Exploitation · Level 7", "15 min ago", "active"],
  ["Team member joined", "Rohit Kumar", "32 min ago", "neutral"],
  ["You solved", "OSINT · Level 4", "1 hour ago", "neutral"],
];

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
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const teamDisplayName = user?.name || "Team ByteForce";
  const userInitials = (user?.name ? user.name.slice(0, 2).toUpperCase() : "HY");

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
          <span>HACK THE <b>GRID</b></span>
          <small>CODESPHERE × UTKRISHT 2026</small>
        </Link>
        <div className="pd-topbar-spacer" />
        <button className="pd-notification" type="button" aria-label="Notifications">♧<i>•</i></button>
        <Link to={ROUTES.TEAM_PROFILE} className="pd-account" style={{ textDecoration: "none" }}>
          <span className="pd-avatar">{userInitials}</span>
          <span><strong>{teamDisplayName}</strong><small>{user?.role ? user.role.replace('_', ' ') : "Team Leader"}</small></span>
          <span className="pd-chevron">⌄</span>
        </Link>
      </header>

      <aside className={`pd-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <nav className="pd-side-nav" aria-label="Participant navigation">
          <Link className="selected" to={ROUTES.DASHBOARD} onClick={() => setSidebarOpen(false)}><span>⌂</span>Dashboard</Link>
          <Link to={ROUTES.CHALLENGES} onClick={() => setSidebarOpen(false)}><span>⚑</span>Challenges</Link>
          <Link to={ROUTES.TEAM_PROFILE} onClick={() => setSidebarOpen(false)}><span>♧</span>Team</Link>
          <Link to={ROUTES.LEADERBOARD} onClick={() => setSidebarOpen(false)}><span>▥</span>Leaderboard</Link>
          <Link to={ROUTES.RULES} onClick={() => setSidebarOpen(false)}><span>▤</span>Rules</Link>
          <Link to={ROUTES.FAQ} onClick={() => setSidebarOpen(false)}><span>♧</span>Resources</Link>
          <Link to={ROUTES.TEAM_PROFILE} onClick={() => setSidebarOpen(false)}><span>◉</span>Profile</Link>
        </nav>
        <section className="pd-timer-card">
          <h3><span>◷</span> Event Timer</h3>
          <strong>01:32:15</strong>
          <div className="pd-timer-labels"><span>Hours</span><span>Minutes</span><span>Seconds</span></div>
          <button type="button" className="pd-end-event" disabled>⏻ &nbsp; End Event</button>
          <small className="pd-demo-note">Sample timer • Design preview</small>
        </section>
        <blockquote className="pd-sidebar-quote">“ Think.<br />&nbsp; Solve.<br />&nbsp; Capture the Flag. ”<small>— Hack the Grid 2026</small></blockquote>
      </aside>

      <section className="pd-main">
        <div className="pd-welcome-row">
          <div>
            <p className="pd-welcome-eyebrow">PARTICIPANT DASHBOARD <span className="pd-demo-badge">[PREVIEW MODE // SAMPLE DATA]</span></p>
            <h1>Welcome Back,<br /><span>{teamDisplayName}</span></h1>
            <p className="pd-welcome-subtitle">Keep solving, keep exploring. You're doing great!</p>
          </div>
          <blockquote className="pd-welcome-quote">“ Every challenge you solve brings you closer to mastering the Grid. ”<small>— CodeSphere × UTKRISHT 2026</small></blockquote>
        </div>

        <div className="pd-stats-grid">
          <StatCard icon="♜" value="6 / 10" label="Challenges Solved">
            <div className="pd-mini-progress"><i style={{ width: "60%" }} /></div>
          </StatCard>
          <StatCard icon="▥" value="1250" label="Total Points">
            <small className="pd-positive">↗ &nbsp; +250</small>
          </StatCard>
          <StatCard icon="♧" value="3 / 4" label="Team Members">
            <div className="pd-member-stack"><i>HY</i><i>AS</i><i>RK</i><i>+</i></div>
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
                <span className="pd-current-number">07</span>
                <span className="pd-current-symbol">›_</span>
                <div className="pd-current-copy">
                  <h3>Binary Exploitation</h3>
                  <p>Break the system (safely) and find the hidden flag. Analyze the provided binary, identify the vulnerability and gain access.</p>
                </div>
                <span className="pd-difficulty hard">HARD</span>
              </div>
              <div className="pd-current-actions">
                <Link to={ROUTES.CHALLENGES} className="pd-primary-button">Continue Challenge <span>→</span></Link>
                <Link to={ROUTES.CHALLENGES} className="pd-secondary-button">View Details</Link>
              </div>
            </section>

            <section className="pd-panel pd-levels-panel">
              <div className="pd-panel-heading"><h2>Challenge Levels</h2><Link to={ROUTES.CHALLENGES}>View All Challenges →</Link></div>
              <div className="pd-level-grid">
                {levels.map(([number, title, difficulty, state, icon]) => (
                  <Link to={ROUTES.CHALLENGES} key={number} className={`pd-level-card ${state}`}>
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
                <div className="pd-donut"><div><strong>60%</strong><small>Completed</small></div></div>
                <div className="pd-progress-bars">
                  {[["Easy", "2 / 2", "100%", "easy"], ["Medium", "2 / 3", "67%", "medium"], ["Hard", "1 / 3", "33%", "hard"], ["Expert", "1 / 2", "50%", "expert"]].map(([label, count, width, kind]) => (
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
              {[
                ["🥇", "NullPointers", "1850"],
                ["🥈", "CyberTitans", "1620"],
                ["🥉", "HackOverflow", "1480"],
                ["4", "ByteForce", "1250"],
                ["5", "KernelPanic", "980"],
              ].map(([rank, team, points]) => <div key={team} className={`pd-rank-row ${team === "ByteForce" ? "own-team" : ""}`}><span>{rank}</span><span>{team}</span><span>{points}</span></div>)}
            </section>

            <section className="pd-panel pd-activity-panel">
              <div className="pd-panel-heading"><h2>Recent Activity</h2><button type="button">View All →</button></div>
              <div className="pd-activity-list">
                {activities.map(([title, description, time, state]) => (
                  <div className="pd-activity-item" key={title + description}>
                    <span className={`pd-activity-dot ${state}`} />
                    <div><strong>{title}</strong><p>{description}</p></div>
                    <small>{time}</small>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
        <p className="pd-footer-note">HACK THE GRID 2026 <span>•</span> CODESPHERE × UTKRISHT</p>
      </section>
    </main>
  );
}
