import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import "../../styles/AdminDashboard.css";

const nav = [
  ["Overview", "◫", ROUTES.ADMIN_DASHBOARD],
  ["Teams", "♧", ROUTES.ADMIN_TEAMS],
  ["Challenges", "⌘", ROUTES.ADMIN_CHALLENGES],
  ["Questions", "≡", ROUTES.ADMIN_QUESTIONS],
  ["QR Checkpoints", "▦", ROUTES.ADMIN_CHECKPOINTS],
  ["Submissions", "⇧", ROUTES.ADMIN_SUBMISSIONS],
  ["Leaderboard", "♜", ROUTES.ADMIN_LEADERBOARD],
  ["Event Control", "◉", ROUTES.ADMIN_EVENT_CONTROL],
  ["Security Logs", "⛨", ROUTES.ADMIN_SECURITY_LOGS],
];

const initial = [
  ["NullPointers", "HTG-024", 4, 1850, 9, "Active"],
  ["CyberTitans", "HTG-011", 4, 1620, 8, "Active"],
  ["HackOverflow", "HTG-018", 3, 1480, 8, "Active"],
  ["ByteForce", "HTG-006", 4, 1250, 5, "Review"],
  ["KernelPanic", "HTG-029", 2, 980, 4, "Active"],
];

const levelProgress = [
  ["Level 01", 94],
  ["Level 02", 82],
  ["Level 03", 68],
  ["Level 04", 52],
  ["Level 05", 35],
];

const activity = [
  ["11:24:08", "Flag accepted", "NullPointers submitted Level 09", "ok"],
  ["11:21:42", "New team registered", "HTG-032 completed registration", "info"],
  ["11:18:13", "Rate limit triggered", "Repeated attempts from HTG-006", "warn"],
  ["11:12:56", "Checkpoint scanned", "CP-07 scanned by CyberTitans", "info"],
];

export default function AdminDashboard() {
  const [active, setActive] = useState("Overview");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [menu, setMenu] = useState(false);
  const [live, setLive] = useState(true);
  const [notice, setNotice] = useState("");
  const [teams, setTeams] = useState(initial);

  const filtered = useMemo(
    () =>
      teams.filter(
        (t) =>
          (t[0] + " " + t[1]).toLowerCase().includes(query.toLowerCase()) &&
          (filter === "All" || t[5] === filter)
      ),
    [teams, query, filter]
  );

  const review = (id) => {
    setTeams((ts) =>
      ts.map((t) =>
        t[1] === id
          ? [t[0], t[1], t[2], t[3], t[4], t[5] === "Review" ? "Active" : "Review"]
          : t
      )
    );
    setNotice("Team status updated in this demo view.");
  };

  return (
    <div className="ad-shell">
      <aside className={`ad-sidebar ${menu ? "open" : ""}`}>
        <Link to={ROUTES.ADMIN_DASHBOARD} className="ad-brand">
          <b className="ad-mark">◆</b>
          <span>
            <strong>
              HACK THE <em>GRID</em>
            </strong>
            <small>MISSION CONTROL</small>
          </span>
        </Link>
        <p className="ad-side-label">
          ADMIN CONSOLE <i className="ad-dot" />
        </p>
        <nav>
          {nav.map(([label, icon, to]) => (
            <Link
              key={label}
              to={to}
              className={`ad-nav ${active === label ? "active" : ""}`}
              onClick={() => {
                setActive(label);
                setMenu(false);
              }}
            >
              <b>{icon}</b>
              {label}
              {label === "Teams" && <small>32</small>}
              {label === "Submissions" && <small>8</small>}
            </Link>
          ))}
        </nav>
        <div className="ad-side-bottom">
          <div className="ad-health">
            <i className="ad-dot" />
            <span>
              <b>All systems operational</b>
              <small>API · DATABASE · SCORING</small>
            </span>
          </div>
          <Link to={ROUTES.ADMIN_LOGIN} className="ad-user">
            <i>A</i>
            <span>
              <b>Event Admin</b>
              <small>Administrator</small>
            </span>
            <strong>···</strong>
          </Link>
        </div>
      </aside>

      {menu && (
        <button
          className="ad-scrim"
          onClick={() => setMenu(false)}
          aria-label="Close menu"
        />
      )}

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
              <i className="ad-dot" /> EVENT MONITORING
            </span>
            <button
              onClick={() =>
                setNotice("You are all caught up on notifications.")
              }
              aria-label="Notifications"
            >
              ♧<i />
            </button>
            <Link to={ROUTES.HOME}>View website ↗</Link>
          </div>
        </header>

        <div className="ad-content">
          <section className="ad-hero-banner">
            <div>
              <p className="ad-eyebrow">TULAS UNIVERSITY · UTKRISHT 2026</p>
              <p className="ad-welcome">WELCOME BACK,</p>
              <h1>
                Admin <em>Mission Control.</em>
              </h1>
              <p className="ad-hero-copy">
                Manage challenges, teams and keep the grid running smoothly.
              </p>
            </div>
            <div className="ad-event-pill">
              <i className={`ad-dot ${live ? "" : "off"}`} />
              {live ? "EVENT LIVE" : "EVENT PAUSED"} <small>DEMO MODE</small>
            </div>
          </section>

          {notice && (
            <div className="ad-notice">
              {notice}
              <button onClick={() => setNotice("")} aria-label="Dismiss notice">
                ×
              </button>
            </div>
          )}

          <section className="ad-metrics">
            {[
              ["REGISTERED TEAMS", "32", "+12% since event opened", "♧"],
              ["TOTAL PARTICIPANTS", "128", "+8% checked in", "♙"],
              ["FLAGS CAPTURED", "146", "+23% in the last hour", "⚑"],
              ["ACTIVE CHECKPOINTS", "10", "Live across the grid", "◷"],
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
                    {[25, 40, 32, 55, 46, 72, 64, 90].map((v, j) => (
                      <i key={j} style={{ height: v + "%" }} />
                    ))}
                  </div>
                )}
                {i === 3 && (
                  <button
                    className="ad-mini-button"
                    onClick={() =>
                      setNotice("Open Submissions to review pending flags.")
                    }
                  >
                    Review submissions ↗
                  </button>
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
                <span className="ad-pill">● LAST 60 MIN</span>
              </div>
              <div className="ad-legend">
                <span>🟩 Accepted flags</span>
                <span>▫ Attempts</span>
                <b>
                  146 <small>FLAGS</small>
                </b>
              </div>
              <div className="ad-chart">
                <div className="ad-y-axis">
                  <span>40</span>
                  <span>30</span>
                  <span>20</span>
                  <span>10</span>
                  <span>0</span>
                </div>
                <div className="ad-plot">
                  <div className="ad-lines">
                    {[0, 1, 2, 3, 4].map((n) => (
                      <i key={n} />
                    ))}
                  </div>
                  <svg
                    viewBox="0 0 700 210"
                    preserveAspectRatio="none"
                    aria-label="Illustrative challenge activity chart"
                  >
                    <defs>
                      <linearGradient id="adFill" x1="0" x2="0" y1="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#b8ff3d"
                          stopOpacity=".25"
                        />
                        <stop
                          offset="100%"
                          stopColor="#b8ff3d"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 170 C35 160 42 130 82 142 S132 105 168 120 S213 72 250 98 S300 130 335 85 S385 100 418 66 S466 95 500 58 S548 82 585 38 S640 57 700 20 L700 210 L0 210Z"
                      fill="url(#adFill)"
                    />
                    <path
                      d="M0 170 C35 160 42 130 82 142 S132 105 168 120 S213 72 250 98 S300 130 335 85 S385 100 418 66 S466 95 500 58 S548 82 585 38 S640 57 700 20"
                      fill="none"
                      stroke="#b8ff3d"
                      strokeWidth="3"
                    />
                  </svg>
                  <div className="ad-x-axis">
                    <span>10:30</span>
                    <span>10:40</span>
                    <span>10:50</span>
                    <span>11:00</span>
                    <span>11:10</span>
                    <span>11:20</span>
                    <span>11:30</span>
                  </div>
                </div>
              </div>
            </article>

            <article className="ad-panel ad-level-panel">
              <div className="ad-panel-title">
                <div>
                  <p className="ad-eyebrow">MISSION PROGRESS</p>
                  <h2>Level progress</h2>
                </div>
                <b className="ad-level-percent">60%</b>
              </div>
              <div className="ad-level-overview">
                <div className="ad-ring" aria-label="60 percent average completion">
                  <span>6/10</span>
                </div>
                <div className="ad-level-rows">
                  {levelProgress.map(([lvl, pct]) => (
                    <div className="ad-level-row" key={lvl}>
                      <span>{lvl}</span>
                      <div>
                        <i style={{ width: pct + "%" }} />
                      </div>
                      <small>{pct}%</small>
                    </div>
                  ))}
                </div>
              </div>
              <Link to={ROUTES.ADMIN_CHALLENGES} className="ad-level-link">
                View all levels ↗
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
                <i className={`ad-dot ${live ? "" : "off"}`} />
                <div>
                  <b>{live ? "Event is live" : "Event is paused"}</b>
                  <small>
                    {live
                      ? "Teams can submit flags"
                      : "Submissions temporarily disabled"}
                  </small>
                </div>
              </div>
              <button
                className={`ad-toggle ${live ? "live" : "paused"}`}
                onClick={() => {
                  setLive(!live);
                  setNotice(
                    "Demo control changed locally only. Connect the event-control API before production."
                  );
                }}
              >
                {live ? "Pause event (demo)" : "Resume event (demo)"}{" "}
                <span>↗</span>
              </button>
              {["Registration", "QR checkpoints", "Flag validation"].map(
                (x) => (
                  <div className="ad-control-row" key={x}>
                    <span>{x}</span>
                    <label>● Live</label>
                  </div>
                )
              )}
              <p className="ad-demo-note">
                Demo interface · not connected to backend APIs.
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
                    placeholder="Search team or ID..."
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
                  <option>Review</option>
                </select>
              </div>
              <div className="ad-table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>TEAM</th>
                      <th>TEAM ID</th>
                      <th>SOLVED</th>
                      <th>POINTS</th>
                      <th>STATUS</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((t) => (
                      <tr key={t[1]}>
                        <td>
                          <i className="ad-team-mark">{t[0][0]}</i>
                          <b>{t[0]}</b>
                        </td>
                        <td>{t[1]}</td>
                        <td>{t[4]}/10</td>
                        <td className="ad-points">{t[3].toLocaleString()}</td>
                        <td>
                          <span
                            className={`ad-status ${
                              t[5] === "Review" ? "review" : ""
                            }`}
                          >
                            {t[5]}
                          </span>
                        </td>
                        <td>
                          <button
                            className="ad-row-action"
                            onClick={() => review(t[1])}
                          >
                            {t[5] === "Review" ? "Clear" : "Review"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!filtered.length && (
                  <p className="ad-empty">No teams match your search.</p>
                )}
              </div>
              <div className="ad-table-foot">
                Showing {filtered.length} demo teams{" "}
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
                {[
                  ["NullPointers", "Level 9", "Correct", "2 min ago"],
                  ["ByteForce", "Level 4", "Review", "5 min ago"],
                  ["CyberTitans", "Level 3", "Correct", "8 min ago"],
                  ["HackOverflow", "Level 2", "Incorrect", "12 min ago"],
                ].map((s, i) => (
                  <div className="ad-submission-row" key={s[0] + s[1]}>
                    <span className="ad-sub-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <b>{s[0]}</b>
                      <small>
                        {s[1]} · {s[3]}
                      </small>
                    </div>
                    <span
                      className={`ad-result ad-result--${s[2].toLowerCase()}`}
                    >
                      {s[2]}
                    </span>
                  </div>
                ))}
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
                {activity.map((a) => (
                  <div className="ad-activity" key={a[0]}>
                    <i className={a[3]} />
                    <div>
                      <b>{a[1]}</b>
                      <p>{a[2]}</p>
                      <small>{a[0]} · TODAY</small>
                    </div>
                  </div>
                ))}
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
                <small>Create, edit and organize challenges</small>
              </span>
              <i>›</i>
            </Link>
            <Link to={ROUTES.ADMIN_CHECKPOINTS}>
              <b>▦</b>
              <span>
                <strong>QR Checkpoints</strong>
                <small>Generate and manage QR codes</small>
              </span>
              <i>›</i>
            </Link>
            <Link to={ROUTES.ADMIN_LEADERBOARD}>
              <b>♜</b>
              <span>
                <strong>View Leaderboard</strong>
                <small>Review team rankings</small>
              </span>
              <i>›</i>
            </Link>
            <Link to={ROUTES.ADMIN_ANALYTICS}>
              <b>▥</b>
              <span>
                <strong>Event Analytics</strong>
                <small>Explore event performance</small>
              </span>
              <i>›</i>
            </Link>
          </section>

          <footer className="ad-footer">
            <span>
              HACK THE GRID <b>·</b> ADMIN CONSOLE
            </span>
            <span>
              SECURE EVENT OPERATIONS <i className="ad-dot" />
            </span>
            <small>
              Dashboard preview uses sample data. Connect APIs before
              production.
            </small>
          </footer>
        </div>
      </main>
    </div>
  );
}

