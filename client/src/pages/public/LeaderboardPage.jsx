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

const navLinks = [
  ["Mission", ROUTES.MISSION],
  ["How It Works", "/mission#how-it-works"],
  ["Challenges", ROUTES.CHALLENGES],
  ["QR Checkpoint", ROUTES.QR_CHECKPOINT],
  ["Leaderboard", ROUTES.LEADERBOARD],
];

export default function LeaderboardPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rank");

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

  const podium = [teams[1], teams[0], teams[2]];

  return (
    <main className="htg-lb-page">
      <div className="htg-lb-background" aria-hidden="true" />
      <header className="htg-lb-navbar">
        <Link to={ROUTES.HOME} className="htg-lb-brand" aria-label="Hack the Grid home">
          <span>HACK THE <b>GRID</b></span>
          <small>CODESPHERE × UTKRISHT 2026</small>
        </Link>
        <nav className="htg-lb-navlinks" aria-label="Main navigation">
          {navLinks.map(([label, href]) => (
            <Link key={label} to={href} className={label === "Leaderboard" ? "active" : ""}>{label}</Link>
          ))}
        </nav>
        <div className="htg-lb-nav-actions">
          <Link to={ROUTES.DASHBOARD} className="htg-lb-dashboard">Dashboard</Link>
          <Link to={ROUTES.REGISTER} className="htg-lb-register">Register</Link>
        </div>
      </header>

      <section className="htg-lb-hero">
        <div>
          <p className="htg-lb-eyebrow">CODESPHERE × UTKRISHT 2026</p>
          <h1>THE <span>LEADERBOARD</span></h1>
          <p className="htg-lb-hero-copy">Every flag counts. Every point matters. See who's leading the Grid.</p>
        </div>
        <div className="htg-lb-live"><i /> EVENT RANKINGS <strong>DEMO DATA</strong></div>
      </section>

      <section className="htg-lb-podium" aria-label="Top three teams">
        {podium.map((team) => (
          <article key={team.rank} className={`htg-lb-podium-card place-${team.rank}`}>
            <div className="htg-lb-medal">{team.rank === 1 ? "♛" : team.rank === 2 ? "Ⅱ" : "Ⅲ"}</div>
            <small>{team.rank === 1 ? "GRID CHAMPION" : team.rank === 2 ? "RUNNER UP" : "THIRD PLACE"}</small>
            <h2>{team.name}</h2>
            <p>{team.solved} challenges solved</p>
            <strong>{team.points.toLocaleString()} <span>PTS</span></strong>
          </article>
        ))}
      </section>

      <section className="htg-lb-main-panel">
        <div className="htg-lb-panel-heading">
          <div><p className="htg-lb-eyebrow">LIVE STANDINGS</p><h2>Team Rankings</h2></div>
          <div className="htg-lb-updated"><i /> Rankings refresh when connected to live event data</div>
        </div>

        <div className="htg-lb-controls">
          <label className="htg-lb-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search team..." aria-label="Search team" /></label>
          <div className="htg-lb-filters" role="group" aria-label="Filter teams">
            <button className={filter === "all" ? "selected" : ""} onClick={() => setFilter("all")} type="button">All Teams</button>
            <button className={filter === "top5" ? "selected" : ""} onClick={() => setFilter("top5")} type="button">Top 5</button>
            <button className={filter === "mine" ? "selected" : ""} onClick={() => setFilter("mine")} type="button">My Team</button>
          </div>
          <label className="htg-lb-sort">Sort by
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="rank">Rank</option>
              <option value="points">Points</option>
              <option value="solved">Challenges solved</option>
            </select>
          </label>
        </div>

        <div className="htg-lb-table-wrap">
          <table className="htg-lb-table">
            <thead><tr><th>RANK</th><th>TEAM</th><th>CHALLENGES SOLVED</th><th>POINTS</th><th>LAST ACTIVITY</th><th>TREND</th></tr></thead>
            <tbody>
              {visibleTeams.map((team) => (
                <tr key={team.rank} className={team.own ? "my-team" : ""}>
                  <td><span className={`htg-lb-rank ${team.rank <= 3 ? `rank-${team.rank}` : ""}`}>{team.rank <= 3 ? ["🥇", "🥈", "🥉"][team.rank - 1] : String(team.rank).padStart(2, "0")}</span></td>
                  <td><div className="htg-lb-team"><span className="htg-lb-team-avatar">{team.name.slice(0, 2).toUpperCase()}</span><span><strong>{team.name}{team.own && <em>YOU</em>}</strong><small>{team.members}</small></span></div></td>
                  <td><span className="htg-lb-solved">{team.solved}<small> / 10</small></span><span className="htg-lb-row-progress"><i style={{ width: `${team.solved * 10}%` }} /></span></td>
                  <td><strong className="htg-lb-points">{team.points.toLocaleString()}</strong></td>
                  <td className="htg-lb-last">{team.last}</td>
                  <td><span className={`htg-lb-trend ${team.trend}`}>{team.trend === "up" ? "↗" : team.trend === "down" ? "↘" : "—"}</span></td>
                </tr>
              ))}
              {visibleTeams.length === 0 && <tr><td colSpan="6" className="htg-lb-empty">No teams match your search.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="htg-lb-table-footer"><span>Showing {visibleTeams.length} of {teams.length} demo teams</span><span>Scoring is based on challenge points and approved submissions.</span></div>
      </section>

      <section className="htg-lb-bottom-row">
        <article className="htg-lb-your-rank">
          <span className="htg-lb-rank-icon">▥</span>
          <div><small>YOUR TEAM</small><h2>ByteForce <span>#04</span></h2><p>1,250 points · 6 of 10 challenges solved</p></div>
          <Link to={ROUTES.DASHBOARD}>View Dashboard →</Link>
        </article>
        <article className="htg-lb-quote">“ Don't just chase the top spot.<br /><span>Earn every point.</span> ”<small>HACK THE GRID 2026 · CODESPHERE</small></article>
      </section>
      <footer className="htg-lb-footer">HACK THE GRID 2026 <span>•</span> CODESPHERE × UTKRISHT <span>•</span> PLAY FAIR. THINK SMART.</footer>
    </main>
  );
}
