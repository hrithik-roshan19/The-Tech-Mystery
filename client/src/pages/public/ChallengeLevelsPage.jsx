import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import "../../styles/ChallengeLevelsPage.css";

const levels = [
  { number: "01", title: "Orientation", description: "Get started and learn the basics.", difficulty: "Easy", icon: "⚑", detail: "Observe the starting clue and discover how the mission works." },
  { number: "02", title: "Web Exploitation", description: "Find and fix the vulnerabilities.", difficulty: "Easy", icon: "</>", detail: "Inspect a controlled demo page and follow the clues hidden in its structure." },
  { number: "03", title: "Cryptography", description: "Decode the hidden secrets.", difficulty: "Medium", icon: "▣", detail: "Use the cipher clues provided by the challenge to reveal the next checkpoint." },
  { number: "04", title: "OSINT", description: "Gather information from the open web.", difficulty: "Medium", icon: "⌘", detail: "Connect the provided public clues and identify the intended answer." },
  { number: "05", title: "Reverse Engineering", description: "Analyze and uncover the logic.", difficulty: "Medium", icon: "⚙", detail: "Study a safe sample and work backwards to understand its logic." },
  { number: "06", title: "Forensics", description: "Investigate and find the traces.", difficulty: "Hard", icon: "▤", detail: "Examine the supplied evidence and locate the information relevant to the mission." },
  { number: "07", title: "Binary Exploitation", description: "Break the system (safely).", difficulty: "Hard", icon: "›_", detail: "Solve a sandboxed binary puzzle using the information provided by the event." },
  { number: "08", title: "Network & Infrastructure", description: "Explore the network and capture clues.", difficulty: "Hard", icon: "⌁", detail: "Interpret the provided network clues in the event's simulated environment only." },
  { number: "09", title: "Logic & Steganography", description: "Think deeper, look closer.", difficulty: "Expert", icon: "♧", detail: "Combine logical reasoning with a hidden clue to progress toward the final stage." },
  { number: "10", title: "Final Challenge", description: "The ultimate test. Capture the final flag.", difficulty: "Expert", icon: "♜", detail: "Bring together what your team has learned and submit the final flag." },
];

const navItems = [
  ["Mission", ROUTES.MISSION],
  ["How It Works", "/mission#how-it-works"],
  ["Challenges", ROUTES.CHALLENGES],
  ["Rules", ROUTES.RULES],
  ["Leaderboard", ROUTES.LEADERBOARD],
];

export default function ChallengeLevelsPage() {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const { isAuthenticated } = useAuth();

  return (
    <main className="htg-levels-page">
      <div className="htg-levels-backdrop" aria-hidden="true" />
      <header className="htg-levels-nav">
        <Link to="/" className="htg-levels-brand" aria-label="Hack the Grid home">
          <span>HACK THE <b>GRID</b></span>
          <small>CODESPHERE × UTKRISHT 2026</small>
        </Link>
        <nav className="htg-levels-links" aria-label="Main navigation">
          {navItems.map(([label, href]) => (
            <Link key={label} className={label === "Challenges" ? "active" : ""} to={href}>{label}</Link>
          ))}
        </nav>
        <div className="htg-levels-nav-actions">
          {isAuthenticated ? (
            <Link className="htg-levels-register" to={ROUTES.DASHBOARD}>Dashboard</Link>
          ) : (
            <>
              <Link className="htg-levels-login" to={ROUTES.LOGIN}>Login</Link>
              <Link className="htg-levels-register" to={ROUTES.REGISTER}>Register</Link>
            </>
          )}
        </div>
      </header>

      <section className="htg-levels-layout">
        <div className="htg-levels-intro">
          <p className="htg-levels-eyebrow">CODESPHERE CODING CLUB <span>×</span> UTKRISHT 2026</p>
          <h1>HACK<br />THE <em>GRID</em></h1>
          <h2>THE ULTIMATE CAMPUS<br />CAPTURE-THE-FLAG EXPERIENCE.</h2>
          <div className="htg-levels-rule" />
          <p className="htg-levels-description">10 unique challenges. A progressive journey across skills, logic, creativity and real-world problem solving.</p>
          <div className="htg-levels-cta-row" style={{ marginTop: '22px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link className="htg-levels-register" to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.REGISTER}>
              {isAuthenticated ? "OPEN DASHBOARD →" : "REGISTER YOUR TEAM →"}
            </Link>
            <Link className="htg-levels-login" to={ROUTES.RULES}>
              RULES
            </Link>
          </div>
          <div className="htg-levels-stats">
            <div><span className="stat-icon">⬡</span><strong>10</strong><small>CHALLENGE<br />LEVELS</small></div>
            <div><span className="stat-icon">♧</span><strong>2–4</strong><small>TEAM<br />MEMBERS</small></div>
            <div><span className="stat-icon">◷</span><strong>90–120</strong><small>MINUTES</small></div>
          </div>
          <div className="htg-levels-footer-words">PEOPLE <i /> IDEAS <i /> TECHNOLOGY<br />A STRONGER TOMORROW</div>
        </div>

        <section className="htg-map-panel" aria-labelledby="htg-map-title">
          <p className="htg-map-eyebrow">CHALLENGE LEVELS</p>
          <h2 id="htg-map-title">Mission <span>Map</span></h2>
          <p className="htg-map-subtitle">10 levels. Increasing difficulty. Explore. Solve. Capture the Flag.</p>
          <div className="htg-level-list">
            {levels.map((level) => (
              <button
                key={level.number}
                type="button"
                className={`htg-level-row ${selectedLevel === level.number ? "is-selected" : ""}`}
                onClick={() => setSelectedLevel(selectedLevel === level.number ? null : level.number)}
                aria-expanded={selectedLevel === level.number}
              >
                <span className="htg-level-number">{level.number}</span>
                <span className="htg-level-icon" aria-hidden="true">{level.icon}</span>
                <span className="htg-level-copy">
                  <strong>{level.title}</strong>
                  <small>{level.description}</small>
                  {selectedLevel === level.number && (
                    <span className="htg-level-detail">
                      {level.detail}
                      {level.number === "10" && (
                        <Link
                          to={ROUTES.FINAL_FLAG}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            display: "inline-block",
                            marginTop: "8px",
                            padding: "6px 12px",
                            background: "var(--htg-lime, #b8ff3d)",
                            color: "#080a09",
                            fontWeight: "800",
                            fontSize: "10px",
                            borderRadius: "4px",
                            textDecoration: "none",
                            letterSpacing: "0.5px"
                          }}
                        >
                          FINAL FLAG GATE →
                        </Link>
                      )}
                    </span>
                  )}
                </span>
                <span className={`htg-difficulty ${level.difficulty.toLowerCase()}`}>{level.difficulty}</span>
                <span className="htg-level-chevron" aria-hidden="true">›</span>
              </button>
            ))}
          </div>
          <p className="htg-map-note">Select a level to view its mission briefing.</p>
        </section>

        <aside className="htg-levels-benefits">
          <div className="htg-benefit">
            <span className="htg-benefit-icon">◎</span>
            <div><strong>EXPLORE</strong><p>10 unique challenges across different domains.</p></div>
          </div>
          <div className="htg-benefit">
            <span className="htg-benefit-icon">▥</span>
            <div><strong>PROGRESS</strong><p>Increasing difficulty from easy to expert.</p></div>
          </div>
          <div className="htg-benefit">
            <span className="htg-benefit-icon">♧</span>
            <div><strong>LEARN</strong><p>Sharpen real-world technical skills.</p></div>
          </div>
          <div className="htg-benefit">
            <span className="htg-benefit-icon">♜</span>
            <div><strong>COMPETE</strong><p>Climb the leaderboard and prove your team.</p></div>
          </div>
          <blockquote>“Every challenge is a step closer to mastering the Grid.”<small>— CodeSphere × UTKRISHT 2026</small></blockquote>
        </aside>
      </section>
    </main>
  );
}
