import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/HomePage.css";

const NAV_ITEMS = [
  ["Home", "/"], ["Leaderboard", "/leaderboard"], ["Mission", "/mission"],
  ["Challenges", "/challenges"], ["QR Checkpoint", "/qr-checkpoint"],
  ["Final Flag", "/final-flag"], ["Rules", "/rules"],
];

const STATS = [
  ["⬡", "10", "Challenge levels", "Progressive difficulty"],
  ["♧", "2–4", "Team members", "Build your squad"],
  ["◷", "90–120", "Minutes", "Race against time"],
  ["⚑", "1", "Master flag", "The ultimate goal"],
];

const STEPS = [
  ["01", "Build your squad", "Register a team of 2–4 players and get ready to collaborate."],
  ["02", "Scan checkpoints", "Find QR checkpoints and unlock the next stage of the mission."],
  ["03", "Crack the challenges", "Solve puzzles across cryptography, logic, code and digital forensics."],
  ["04", "Capture the flag", "Submit the final flag and secure your place on the leaderboard."],
];

const LEVELS = [
  ["01", "Welcome Signal", "Warm-up"], ["02", "Binary Breaker", "Binary"],
  ["03", "Caesar Cipher", "Cryptography"], ["04", "Hidden Web", "Web"],
  ["05", "Debug the System", "Logic"], ["06", "Base64 Vault", "Encoding"],
  ["07", "Steganography", "Forensics"], ["08", "Logic Lock", "Reasoning"],
  ["09", "Master Puzzle", "Teamwork"], ["10", "Master Flag", "Final"],
];


const FACULTY = [["Mr. Shivam Paney","CSE Department"],["Mr. Mohit Saini","CSE Department"],["Mr. Abhishek Rawat","CSE Department"]];
const STUDENTS = [["Hrithik Roshan","Advisor, CodeSphere"],["Anshika Kumari","President, CodeSphere"],["Ayush Kumar","Vice-President, CodeSphere"]];
const Arrow = () => <span className="htg-arrow" aria-hidden="true">↗</span>;

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="htg-home">
      <header className="htg-header">
        <Link className="htg-brand" to="/" aria-label="Hack the Grid home" onClick={closeMenu}>
          <span className="htg-brand__name">HACK THE <b>GRID</b></span>
          <span className="htg-brand__tag">CODESPHERE <i>×</i> UTKRISHT 2026</span>
        </Link>
        <button className={`htg-menu-toggle ${menuOpen ? "is-open" : ""}`} type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen} onClick={() => setMenuOpen(v => !v)}>
          <span /><span />
        </button>
        <nav className={`htg-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
          {NAV_ITEMS.map(([label, to]) => (
            <Link key={label} to={to} className={`htg-nav__link ${to === "/" ? "is-active" : ""}`}
              onClick={closeMenu}>{label}</Link>
          ))}
          <div className="htg-nav__mobile-actions">
            <Link to="/login" className="htg-button htg-button--outline" onClick={closeMenu}>Login</Link>
            <Link to="/register" className="htg-button htg-button--lime" onClick={closeMenu}>Register <Arrow /></Link>
          </div>
        </nav>
        <div className="htg-header__actions">
          <Link to="/login" className="htg-button htg-button--outline">Login</Link>
          <Link to="/register" className="htg-button htg-button--lime">Register <Arrow /></Link>
        </div>
      </header>

      <section className="htg-hero" aria-labelledby="htg-hero-title">
        <div className="htg-hero__background" aria-hidden="true" />
        <div className="htg-hero__grid" aria-hidden="true" />
        <div className="htg-hero__vignette" aria-hidden="true" />
        <div className="htg-hero__content">
          <p className="htg-eyebrow"><span className="htg-status-dot" /> CODESPHERE CODING CLUB <span className="htg-eyebrow__cross">×</span> UTKRISHT 2026</p>
          <h1 id="htg-hero-title">HACK<br />THE <span>GRID</span></h1>
          <p className="htg-hero__subhead">THE ULTIMATE CAMPUS<br className="htg-desktop-break" /> CAPTURE-THE-FLAG EXPERIENCE.</p>
          <div className="htg-accent-line" />
          <p className="htg-hero__description">A team-based challenge combining cybersecurity,<br className="htg-desktop-break" /> cryptography, programming, logical reasoning<br className="htg-desktop-break" /> and creative problem solving.</p>
          <div className="htg-hero__actions">
            <Link to="/register" className="htg-button htg-button--lime htg-button--large">Register your team <Arrow /></Link>
            <a href="#how-it-works" className="htg-button htg-button--glass htg-button--large">Explore the grid <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="htg-hero__side-note" aria-hidden="true">
          <span>PEOPLE</span><span>IDEAS</span><span>TECHNOLOGY</span><span>A STRONGER TOMORROW</span><i />
        </div>
        <a href="#event-stats" className="htg-scroll-cue"><span className="htg-scroll-cue__mouse"><i /></span><span>Scroll to explore</span></a>
      </section>

      <section className="htg-stats" id="event-stats" aria-label="Event facts">
        {STATS.map(([icon, value, label, detail]) => (
          <article className="htg-stat" key={label}><span className="htg-stat__icon" aria-hidden="true">{icon}</span>
            <div><strong>{value}</strong><span className="htg-stat__label">{label}</span><small>{detail}</small></div>
          </article>
        ))}
      </section>

      <section className="htg-section htg-section--mission" id="mission">
        <div className="htg-section__heading"><p className="htg-kicker">01 / THE MISSION</p><h2>Think sharp.<br /><span>Move together.</span></h2></div>
        <div className="htg-mission-copy"><p>Hack the Grid turns the campus into a live puzzle trail. Every checkpoint brings a new problem, every solved challenge moves your team closer to the Master Flag.</p><Link to="/mission" className="htg-text-link">Explore the mission <Arrow /></Link></div>
      </section>

      <section className="htg-section htg-section--process" id="how-it-works">
        <div className="htg-section__topline"><p className="htg-kicker">02 / HOW IT WORKS</p><p className="htg-section__aside">One grid. Ten levels. One winning team.</p></div>
        <div className="htg-steps">{STEPS.map(([number, title, text]) => <article className="htg-step" key={number}><span className="htg-step__number">{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="htg-section htg-section--levels" id="challenges">
        <div className="htg-section__topline"><div><p className="htg-kicker">03 / THE GRID</p><h2>Ten levels.<br /><span>One Master Flag.</span></h2></div><Link to="/challenges" className="htg-text-link">Explore challenges <Arrow /></Link></div>
        <div className="htg-level-grid">{LEVELS.map(([number, title, category]) => <article className="htg-level" key={number}><span className="htg-level__number">{number}</span><div><h3>{title}</h3><p>{category}</p></div><span className="htg-level__arrow" aria-hidden="true">↗</span></article>)}</div>
      </section>

      <section className="htg-team-section" id="team">
        <p className="htg-kicker">04 / THE PEOPLE BEHIND THE GRID</p>
        <h2 className="htg-team-title">Meet the <span>team.</span></h2>
        <p className="htg-team-intro">The faculty and student coordinators bringing Hack the Grid to life.</p>
        <div className="htg-team-group"><div className="htg-team-group__title"><h3>Faculty Coordinators</h3><span>CSE DEPARTMENT</span></div>
          <div className="htg-team-grid">{FACULTY.map(([name,role])=><article className="htg-person-card" key={name}><div className="htg-person-photo"><span>PHOTO</span></div><div className="htg-person-info"><h4>{name}</h4><p>{role}</p></div></article>)}</div>
        </div>
        <div className="htg-team-group"><div className="htg-team-group__title"><h3>Student Coordinators</h3><span>CODESPHERE CORE TEAM</span></div>
          <div className="htg-team-grid">{STUDENTS.map(([name,role])=><article className="htg-person-card" key={name}><div className="htg-person-photo"><span>PHOTO</span></div><div className="htg-person-info"><h4>{name}</h4><p>{role}</p></div></article>)}</div>
        </div>
      </section>

      <section className="htg-final-cta" id="rules"><p className="htg-kicker">READY TO ENTER THE GRID?</p><h2>Your team.<br /><span>Your strategy. Your flag.</span></h2><div className="htg-final-cta__actions"><Link to="/register" className="htg-button htg-button--lime htg-button--large">Register your team <Arrow /></Link><Link to="/rules" className="htg-button htg-button--glass htg-button--large">Read the rules <Arrow /></Link></div></section>

      <footer className="htg-footer">
        <Link className="htg-brand htg-brand--footer" to="/" aria-label="Hack the Grid home">
          <span className="htg-brand__name">HACK THE <b>GRID</b></span>
          <span className="htg-brand__tag">CODESPHERE <i>×</i> UTKRISHT 2026</span>
        </Link>
        <p className="htg-footer-tagline">Built for curious minds and bold teams.</p>
        <span className="htg-footer-credit">Built with <b>♥</b> by Hrithik Roshan</span>
        <span className="htg-footer-copy">© 2026 Hack the Grid · CodeSphere</span>
      </footer>
    </main>
  );
}
