import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/MissionPage.css";
import { ROUTES } from "../../constants/routes";

const steps = [
  ["01", "START HERE", "Register Your Team", "Create your team, add members and get ready to enter the Grid.", "Teams contain 2–4 participants. Use accurate details and keep team credentials private."],
  ["02", "GET BRIEFED", "Enter Mission Control", "Review the event briefing, rules and your team's starting instructions.", "Organizers explain event flow, scoring and checkpoint procedures before the challenge begins."],
  ["03", "SCAN & DISCOVER", "Find Your Checkpoint", "Scan official QR checkpoints to uncover the challenge assigned to your team.", "Challenges may differ by team. Use official QR codes and never share team-specific tokens."],
  ["04", "SOLVE THE CHALLENGE", "Crack Each Level", "Use logic, coding, cryptography and observation to solve progressive challenges.", "Submit answers through the official platform and stay within authorized challenge environments."],
  ["05", "LEVEL UP", "Unlock the Next Stage", "Submit a valid answer to progress through the ten challenge levels.", "The platform or an authorized volunteer confirms valid solutions. Scoring follows the announced policy."],
  ["06", "FINAL OBJECTIVE", "Capture the Master Flag", "Complete the final challenge and finish your mission with your team.", "Final results are subject to organizer verification. Respect other teams and play fairly."]
];

const pillars = [
  ["⌘", "THINK CRITICALLY", "Decode clues, connect information and approach problems from different angles."],
  ["▦", "EXPLORE & DISCOVER", "Move through QR checkpoints and uncover team-specific challenges."],
  ["⟷", "COLLABORATE", "Share ideas, divide tasks and solve problems together."],
  ["⬡", "PLAY RESPONSIBLY", "Explore only the systems and challenge environments authorized for the event."]
];

const levels = [
  "Welcome Signal",
  "Binary Breaker",
  "Caesar Cipher",
  "Hidden Web",
  "Debug the System",
  "Logic Lock",
  "Base64 Vault",
  "Steganography",
  "Master Puzzle",
  "Master Flag"
];

export default function MissionPage() {
  const [active, setActive] = useState(0);
  const [all, setAll] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const scrollToHash = () => {
        const el = document.querySelector(location.hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      };
      scrollToHash();
      const t1 = setTimeout(scrollToHash, 60);
      const t2 = setTimeout(scrollToHash, 200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.hash, location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const s = steps[active];

  return (
    <div className="htg-mission">
      <div className="mp-bg" />
      <div className="mp-overlay" />
      <div className="mp-grid" />

      <header className="mp-nav">
        <Link className="mp-brand" to="/">
          <strong>HACK THE <span>GRID</span></strong>
          <small>CODESPHERE × UTKRISHT 2026</small>
        </Link>

        <nav>
          <Link className="current" to={ROUTES.MISSION} onClick={scrollToTop}>MISSION</Link>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#how-it-works");
            }}
          >
            HOW IT WORKS
          </a>
          <Link to={ROUTES.CHALLENGES}>CHALLENGES</Link>
          <Link to={ROUTES.RULES}>RULES</Link>
          <Link to={ROUTES.LEADERBOARD}>LEADERBOARD</Link>
        </nav>

        <div className="mp-nav-actions">
          <Link className="mp-login" to={ROUTES.LOGIN}>LOGIN</Link>
          <Link className="mp-register" to={ROUTES.REGISTER}>REGISTER</Link>
        </div>

        <button
          type="button"
          className="mp-mobile-menu"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <span /><span /><span />
        </button>

        {mobileMenuOpen && (
          <div className="mp-mobile-drawer">
            <Link
              className="current"
              to={ROUTES.MISSION}
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToTop();
              }}
            >
              MISSION
            </Link>
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                scrollToSection("#how-it-works");
              }}
            >
              HOW IT WORKS
            </a>
            <Link to={ROUTES.CHALLENGES} onClick={() => setMobileMenuOpen(false)}>CHALLENGES</Link>
            <Link to={ROUTES.RULES} onClick={() => setMobileMenuOpen(false)}>RULES</Link>
            <Link to={ROUTES.LEADERBOARD} onClick={() => setMobileMenuOpen(false)}>LEADERBOARD</Link>
            <div className="mp-mobile-drawer-actions">
              <Link className="mp-login" to={ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)}>LOGIN</Link>
              <Link className="mp-register" to={ROUTES.REGISTER} onClick={() => setMobileMenuOpen(false)}>REGISTER</Link>
            </div>
          </div>
        )}
      </header>

      <main className="mp-main">
        <section className="mp-hero" id="mission">
          <div>
            <p className="mp-eyebrow"><i /> YOUR MISSION BEGINS HERE</p>
            <h1>ONE TEAM.<br /><span>TEN LEVELS.</span><br />ONE GRID.</h1>
            <p className="mp-hero-desc">
              Think sharp. Work together. Follow the clues. Hack the Grid is a team-based campus challenge where logic, creativity and technical skills lead the way.
            </p>
            <div className="mp-actions">
              <Link className="mp-primary" to={ROUTES.REGISTER}>JOIN THE MISSION <b>↗</b></Link>
              <Link className="mp-secondary" to={ROUTES.RULES}>READ THE RULES <b>→</b></Link>
            </div>
          </div>

          <div className="mp-hero-visual" aria-hidden="true">
            <div className="mp-orbit orbit-one" />
            <div className="mp-orbit orbit-two" />
            <div className="mp-orbit orbit-three" />
            <div className="mp-core">
              <span>HTG</span>
              <b>2026</b>
            </div>
            <div className="mp-float mp-float-top">
              <i /> MISSION STATUS <strong>READY</strong>
            </div>
            <div className="mp-float mp-float-bottom">
              <span>01—10</span> CHALLENGE SEQUENCE
            </div>
          </div>
        </section>

        <section className="mp-stats">
          <div>
            <strong>10</strong>
            <span>PROGRESSIVE LEVELS</span>
          </div>
          <div>
            <strong>2–4</strong>
            <span>MEMBERS PER TEAM</span>
          </div>
          <div>
            <strong>90–120</strong>
            <span>MINUTES OF ACTION</span>
          </div>
          <div>
            <strong>01</strong>
            <span>ULTIMATE MASTER FLAG</span>
          </div>
        </section>

        <section className="mp-how" id="how-it-works">
          <div className="mp-section-heading">
            <div>
              <p className="mp-kicker">MISSION PLAYBOOK / 01</p>
              <h2>HOW IT <span>WORKS.</span></h2>
            </div>
            <p>Every clue takes you closer to the finish. Follow the sequence, solve the challenge and unlock your next move.</p>
          </div>

          <div className="mp-process">
            <div className="mp-stage-list">
              {steps.map((x, i) => (
                <button
                  key={x[0]}
                  type="button"
                  className={`mp-stage ${active === i ? "selected" : ""}`}
                  onClick={() => setActive(i)}
                >
                  <span className="mp-stage-number">{x[0]}</span>
                  <span className="mp-stage-icon">{["＋", "⌘", "▦", "⌁", "↗", "⚑"][i]}</span>
                  <span className="mp-stage-text">
                    <small>{x[1]}</small>
                    <strong>{x[2]}</strong>
                  </span>
                  <span className="mp-stage-arrow">↗</span>
                </button>
              ))}
            </div>

            <div className="mp-stage-detail">
              <div className="mp-detail-top">
                <span>MISSION STEP / {s[0]}</span>
                <span className="mp-live"><i /> IN SEQUENCE</span>
              </div>
              <div className="mp-detail-symbol">{["＋", "⌘", "▦", "⌁", "↗", "⚑"][active]}</div>
              <p className="mp-kicker">{s[1]}</p>
              <h3>{s[2]}</h3>
              <p className="mp-detail-text">{s[3]}</p>
              <div className="mp-detail-note">
                <b>FIELD NOTE</b>
                <p>{s[4]}</p>
              </div>
              <div className="mp-detail-controls">
                <span>{s[0]} <i>/ 06</i></span>
                <button type="button" onClick={() => setActive((active + 1) % steps.length)}>
                  NEXT STEP <b>→</b>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mp-pillars">
          <div className="mp-section-heading">
            <div>
              <p className="mp-kicker">THE WAY WE PLAY</p>
              <h2>BUILT ON <span>TEAMWORK.</span></h2>
            </div>
            <p>More than a race to the finish: learn, experiment and grow together.</p>
          </div>

          <div className="mp-pillar-grid">
            {pillars.map((p, i) => (
              <article className="mp-pillar" key={p[1]}>
                <div className="mp-pillar-top">
                  <span>0{i + 1}</span>
                  <b>{p[0]}</b>
                </div>
                <h3>{p[1]}</h3>
                <p>{p[2]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mp-levels" id="challenges">
          <div className="mp-section-heading">
            <div>
              <p className="mp-kicker">THE CHALLENGE MAP</p>
              <h2>10 LEVELS. <span>ONE GOAL.</span></h2>
            </div>
            <button type="button" className="mp-expand" onClick={() => setAll(!all)}>
              {all ? "SHOW LESS −" : "VIEW ALL LEVELS +"}
            </button>
          </div>

          <div className="mp-level-grid">
            {levels.slice(0, all ? 10 : 5).map((name, i) => (
              <div className={`mp-level ${i === 9 ? "final" : ""}`} key={name}>
                <span>LEVEL {String(i + 1).padStart(2, "0")}</span>
                <strong>{name}</strong>
                <small>
                  {i === 9
                    ? "FINAL OBJECTIVE"
                    : i === 8
                    ? "MULTI-STAGE REASONING"
                    : i === 7
                    ? "HIDDEN INFORMATION"
                    : "SOLVE & ADVANCE"}
                </small>
                <b>{i === 9 ? "⚑" : "↗"}</b>
              </div>
            ))}
          </div>
          <p className="mp-level-footnote">
            Challenge details and difficulty may be revealed during the event. Follow official instructions at each checkpoint.
          </p>
        </section>

        <section className="mp-final-cta">
          <div>
            <p className="mp-kicker">THE GRID IS WAITING</p>
            <h2>READY TO <span>MAKE YOUR MOVE?</span></h2>
            <p>Bring your team. Bring your curiosity. Your mission starts here.</p>
          </div>
          <Link to={ROUTES.REGISTER}>REGISTER YOUR TEAM <b>↗</b></Link>
        </section>
      </main>

      <footer className="mp-footer">
        <Link className="mp-brand" to="/">
          <strong>HACK THE <span>GRID</span></strong>
          <small>CODESPHERE × UTKRISHT 2026</small>
        </Link>
        <p>CodeSphere Coding Club · Tula's University, Dehradun</p>
        <div>
          <Link to="/">HOME</Link>
          <Link to={ROUTES.RULES}>RULES</Link>
          <Link to={ROUTES.LOGIN}>LOGIN</Link>
          <Link to={ROUTES.REGISTER}>REGISTER</Link>
        </div>
      </footer>
    </div>
  );
}

