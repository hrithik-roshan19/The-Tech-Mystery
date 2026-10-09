import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/HomePage.css";
import { ROUTES } from "../../constants/routes";

const stats = [
  ["10", "CHALLENGE LEVELS", "PROGRESSIVE DIFFICULTY", "grid"],
  ["2–4", "TEAM MEMBERS", "BUILD YOUR SQUAD", "users"],
  ["90–120", "MINUTES", "RACE AGAINST TIME", "clock"],
  ["1", "MASTER FLAG", "THE ULTIMATE GOAL", "flag"],
];

const levels = [
  ["01","WELCOME SIGNAL","Observation & QR"],
  ["02","BINARY BREAKER","Binary & ASCII"],
  ["03","CAESAR CIPHER","Cryptography"],
  ["04","HIDDEN WEB","Web Inspection"],
  ["05","DEBUG THE SYSTEM","Programming"],
  ["06","LOGIC LOCK","Logical Reasoning"],
  ["07","BASE64 VAULT","Encoding"],
  ["08","STEGANOGRAPHY","Hidden Information"],
  ["09","MASTER PUZZLE","Multi-stage Reasoning"],
  ["10","MASTER FLAG","Final Challenge"],
];

function Icon({type}) {
  const p={width:34,height:34,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.6,strokeLinecap:"round",strokeLinejoin:"round"};
  if(type==="users") return <svg {...p}><circle cx="9" cy="8" r="3"/><path d="M3.5 19c.5-3.2 2.2-5 5.5-5s5 1.8 5.5 5"/><path d="M15.5 6.5a3 3 0 1 1 0 5.8M17 14c2.2.2 3.5 1.7 4 4"/></svg>;
  if(type==="clock") return <svg {...p}><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg>;
  if(type==="flag") return <svg {...p}><path d="M6 20V4"/><path d="M6 5c3.5-2.5 6.5 2.5 12 0v9c-5.5 2.5-8.5-2.5-12 0"/></svg>;
  return <svg {...p}><path d="M5 5h5v5H5zM14 5h5v5h-5zM5 14h5v5H5zM14 14h5v5h-5z"/><path d="M10 7.5h4M7.5 10v4M16.5 10v4M10 16.5h4"/></svg>;
}

export default function HomePage(){
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return <div className="htg-home">
    <header className="htg-nav">
      <Link className="htg-brand" to="/"><div className="htg-brand-title">HACK THE <span>GRID</span></div><div className="htg-brand-sub">CODESPHERE × UTKRISHT 2026</div></Link>
      <nav className="htg-nav-links">
        <Link to={ROUTES.MISSION}>MISSION</Link><Link to="/mission#how-it-works">HOW IT WORKS</Link><a href="#challenges">CHALLENGES</a><Link to={ROUTES.RULES}>RULES</Link><a href="#leaderboard">LEADERBOARD</a>
      </nav>
      <div className="htg-nav-actions"><Link className="htg-btn htg-btn-outline htg-btn-small" to="/login">LOGIN</Link><Link className="htg-btn htg-btn-lime htg-btn-small" to="/register">REGISTER</Link></div>
      <button className="htg-mobile-menu" aria-label="Open menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><span/><span/><span/></button>
      {mobileMenuOpen && (
        <div className="htg-mobile-drawer">
          <Link to={ROUTES.MISSION} onClick={() => setMobileMenuOpen(false)}>MISSION</Link>
          <Link to="/mission#how-it-works" onClick={() => setMobileMenuOpen(false)}>HOW IT WORKS</Link>
          <a href="#challenges" onClick={() => setMobileMenuOpen(false)}>CHALLENGES</a>
          <Link to={ROUTES.RULES} onClick={() => setMobileMenuOpen(false)}>RULES</Link>
          <a href="#leaderboard" onClick={() => setMobileMenuOpen(false)}>LEADERBOARD</a>
          <div className="htg-mobile-actions">
            <Link className="htg-btn htg-btn-outline htg-btn-small" to="/login" onClick={() => setMobileMenuOpen(false)}>LOGIN</Link>
            <Link className="htg-btn htg-btn-lime htg-btn-small" to="/register" onClick={() => setMobileMenuOpen(false)}>REGISTER</Link>
          </div>
        </div>
      )}
    </header>

    <main>
      <section className="htg-hero">
        <div className="htg-hero-image"/><div className="htg-hero-overlay"/><div className="htg-grid-overlay"/>
        <div className="htg-hero-content htg-container">
          <div className="htg-eyebrow">CODESPHERE CODING CLUB <span>×</span> UTKRISHT 2026</div>
          <h1>HACK<br/>THE <span>GRID</span></h1>
          <h2>THE ULTIMATE CAMPUS<br/>CAPTURE-THE-FLAG EXPERIENCE.</h2>
          <div className="htg-accent-line"/>
          <p>A team-based challenge combining cybersecurity, cryptography, programming, logical reasoning and creative problem solving.</p>
          <div className="htg-hero-actions"><Link className="htg-btn htg-btn-lime htg-btn-large" to="/register">REGISTER YOUR TEAM <span>→</span></Link><a className="htg-btn htg-btn-ghost htg-btn-large" href="#challenges">EXPLORE THE GRID</a></div>
        </div>
        <div className="htg-side-copy"><span>PEOPLE</span><span>IDEAS</span><span>TECHNOLOGY</span><span>A STRONGER TOMORROW</span><i/></div>
        <div className="htg-stats htg-container">{stats.map(([value,label,note,icon])=><div className="htg-stat" key={label}><div className="htg-stat-icon"><Icon type={icon}/></div><div className="htg-stat-copy"><strong>{value}</strong><span>{label}</span><small>{note}</small></div></div>)}</div>
        <a className="htg-scroll" href="#mission"><span className="htg-scroll-mouse"><i/></span><span>SCROLL TO EXPLORE</span></a>
      </section>

      <section id="mission" className="htg-section htg-mission"><div className="htg-container htg-two-col"><div><p className="htg-kicker">THE MISSION</p><h2>HOW FAR CAN YOUR TEAM<br/><em>GO THROUGH THE GRID?</em></h2></div><div className="htg-section-copy"><p>Hack the Grid is an immersive Capture-the-Flag experience where teams progress through a sequence of increasingly challenging puzzles involving cybersecurity, cryptography, programming, logic and creative problem solving.</p><a className="htg-text-link" href="#how-it-works">DISCOVER THE MISSION →</a></div></div></section>

      <section id="how-it-works" className="htg-section htg-process"><div className="htg-container"><p className="htg-kicker">HOW IT WORKS</p><h2>FROM ZERO TO <em>MASTER FLAG.</em></h2><div className="htg-process-grid">{[["01","BUILD YOUR TEAM","Bring 2–4 operators and prepare to solve together."],["02","ENTER THE GRID","Register your squad and enter the competition."],["03","SOLVE THE CHALLENGES","Decode, reason, investigate and submit your answers."],["04","CLAIM THE FLAG","Complete the final challenge and reach the top."]].map(([n,t,d])=><article className="htg-process-card" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>

      <section id="challenges" className="htg-section htg-levels"><div className="htg-container"><div className="htg-levels-head"><div><p className="htg-kicker">THE CHALLENGES</p><h2>10 LEVELS.<br/><em>ONE MASTER FLAG.</em></h2></div><p>Progress through ten interconnected challenges, each designed to test a different technical and analytical skill.</p></div><div className="htg-level-list">{levels.map(([n,t,d])=><Link to="/login" className="htg-level" key={n}><span className="htg-level-no">{n}</span><span className="htg-level-title">{t}</span><span className="htg-level-desc">{d}</span><span className="htg-level-arrow">↗</span></Link>)}</div></div></section>

      <section id="leaderboard" className="htg-section htg-leaderboard"><div className="htg-container htg-two-col"><div><p className="htg-kicker">LIVE COMPETITION</p><h2>THE GRID<br/><em>IS LIVE.</em></h2></div><div className="htg-board">{[["01","CYBERX","1475 XP"],["02","ROOTACCESS","1325 XP"],["03","NULLBYTE","1250 XP"],["04","CODERAIDERS","1100 XP"]].map(([r,t,s])=><div className="htg-board-row" key={t}><span>{r}</span><strong>{t}</strong><b>{s}</b></div>)}<Link className="htg-text-link" to="/leaderboard">VIEW LIVE LEADERBOARD →</Link></div></div></section>

      <section id="rules" className="htg-cta"><div className="htg-container"><p className="htg-kicker">READY?</p><h2>BREAK<br/><span>THE GRID.</span></h2><p>10 levels. One team. One Master Flag.</p><Link className="htg-btn htg-btn-lime htg-btn-large" to="/register">ENTER THE GRID →</Link></div></section>
    </main>

    <footer className="htg-footer"><div className="htg-container htg-footer-inner"><div><div className="htg-brand-title">HACK THE <span>GRID</span></div><div className="htg-brand-sub">CODESPHERE × UTKRISHT 2026</div></div><p>CodeSphere Coding Club · Tula's University, Dehradun</p><p>© 2026 CodeSphere Coding Club</p></div></footer>
  </div>;
}
