import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import { challengeService } from "../../services/challenge.service";
import Navbar from "../../components/navigation/Navbar";
import {
  PageTransition,
  StaggerContainer,
  StaggerItem,
} from "../../components/common/Motion";
import { buttonHoverTap } from "../../utils/motion";
import { ErrorBoundary } from "../../components/common/ErrorBoundary";
import "../../styles/ChallengeLevelsPage.css";

const baseLevels = [
  { number: "01", title: "Orientation & Signal Breaker", description: "Get started and decode the initial signal.", difficulty: "Easy", icon: "⚑", detail: "Observe the starting clue and decode the transmission to unlock the grid." },
  { number: "02", title: "Hidden in Plain Sight", description: "Find client attributes and hidden DOM elements.", difficulty: "Easy", icon: "</>", detail: "Inspect the web portal source code and extract secrets embedded in the client structure." },
  { number: "03", title: "Lost Transmission", description: "Decode polyalphabetic and classical transposition ciphers.", difficulty: "Medium", icon: "▣", detail: "Analyze frequency patterns and reverse cryptographic cipher structures." },
  { number: "04", title: "Digital Footprint", description: "Gather open intelligence and investigate public repositories.", difficulty: "Medium", icon: "⌘", detail: "Trace commits, repository histories, and campus DNS records." },
  { number: "05", title: "Binary Echo", description: "Analyze compiled assembly bytecode and reverse validation logic.", difficulty: "Medium", icon: "⚙", detail: "Study executable samples, reverse bitwise operations, and bypass checks." },
  { number: "06", title: "Memory Artifacts", description: "Investigate volatility memory dumps and raw disk artifacts.", difficulty: "Hard", icon: "▤", detail: "Examine memory spaces, process metadata, and recover deleted sectors." },
  { number: "07", title: "Binary Exploitation", description: "Redirect execution flow and smash the sandboxed binary.", difficulty: "Hard", icon: "›_", detail: "Exploit stack vulnerabilities safely in the designated target binary environment." },
  { number: "08", title: "Network & Infrastructure", description: "Reassemble PCAP streams and trace exfiltration tunnels.", difficulty: "Hard", icon: "⌁", detail: "Interpret captured protocol packets and uncover hidden transport payloads." },
  { number: "09", title: "Logic & Steganography", description: "Extract hidden bit planes and layered media payloads.", difficulty: "Expert", icon: "♧", detail: "Combine logical reasoning with bit-plane extraction to uncover embedded data." },
  { number: "10", title: "Final Challenge", description: "The ultimate climax. Synthesize keys and capture the Master Flag.", difficulty: "Expert", icon: "♜", detail: "Assemble the cryptographic fragments from prior levels and breach the final citadel." },
];

export function ChallengeLevelsPage() {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const { isAuthenticated } = useAuth();
  const [missionMap, setMissionMap] = useState([]);

  useEffect(() => {
    let isMounted = true;
    if (isAuthenticated) {
      challengeService.getMissionMap()
        .then((res) => {
          if (isMounted && res.success && Array.isArray(res.data?.missionMap)) {
            setMissionMap(res.data.missionMap);
          }
        })
        .catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const levels = baseLevels.map((lvl) => {
    const node = missionMap.find((m) => String(m.levelNumber).padStart(2, "0") === lvl.number);
    return {
      ...lvl,
      title: node?.title || lvl.title,
      difficulty: node?.difficulty ? node.difficulty.charAt(0).toUpperCase() + node.difficulty.slice(1).toLowerCase() : lvl.difficulty,
      isSolved: node?.isSolved,
      isCurrent: node?.isCurrent,
      isUnlocked: node?.isUnlocked,
      requiresScan: node?.requiresCheckpointScan
    };
  });

  return (
    <PageTransition className="htg-levels-page">
      <div className="htg-levels-backdrop" aria-hidden="true" />
      <Navbar />

      <section className="htg-levels-layout">
        <motion.div
          className="htg-levels-intro"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="htg-levels-eyebrow">CODESPHERE CODING CLUB <span>×</span> UTKRISHT 2026</p>
          <h1>THE TECH<br /><em>MYSTERY</em></h1>
          <h2>THE ULTIMATE CAMPUS<br />CAPTURE-THE-FLAG EXPERIENCE.</h2>
          <div className="htg-levels-rule" />
          <p className="htg-levels-description">10 unique challenges. A progressive journey across skills, logic, creativity and real-world problem solving.</p>
          <div className="htg-levels-cta-row" style={{ marginTop: '22px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <motion.div {...buttonHoverTap}>
              <Link className="htg-levels-register" to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.REGISTER}>
                {isAuthenticated ? "OPEN DASHBOARD →" : "REGISTER YOUR TEAM →"}
              </Link>
            </motion.div>
            <motion.div {...buttonHoverTap}>
              <Link className="htg-levels-login" to={ROUTES.RULES}>
                RULES
              </Link>
            </motion.div>
          </div>
          <div className="htg-levels-stats">
            <div><span className="stat-icon">⬡</span><strong>10</strong><small>CHALLENGE<br />LEVELS</small></div>
            <div><span className="stat-icon">♧</span><strong>2–4</strong><small>TEAM<br />MEMBERS</small></div>
            <div><span className="stat-icon">◷</span><strong>90–120</strong><small>MINUTES</small></div>
          </div>
          <div className="htg-levels-footer-words">PEOPLE <i /> IDEAS <i /> TECHNOLOGY<br />A STRONGER TOMORROW</div>
        </motion.div>

        <section className="htg-map-panel" aria-labelledby="htg-map-title">
          <p className="htg-map-eyebrow">CHALLENGE LEVELS</p>
          <h2 id="htg-map-title">Mission <span>Map</span></h2>
          <p className="htg-map-subtitle">10 levels. Increasing difficulty. Explore. Solve. Capture the Flag.</p>
          <StaggerContainer className="htg-level-list">
            {levels.map((level) => (
              <StaggerItem key={level.number}>
                <button
                  type="button"
                  className={`htg-level-row ${selectedLevel === level.number ? "is-selected" : ""}`}
                  onClick={() => setSelectedLevel(selectedLevel === level.number ? null : level.number)}
                  aria-expanded={selectedLevel === level.number}
                >
                  <span className="htg-level-number">{level.number}</span>
                  <span className="htg-level-icon" aria-hidden="true">{level.icon}</span>
                  <span className="htg-level-copy">
                    <strong>
                      {level.title}
                      {level.isSolved && <span style={{ marginLeft: "8px", color: "var(--htg-lime, #b8ff3d)", fontSize: "11px" }}>✓ SOLVED</span>}
                      {level.isCurrent && <span style={{ marginLeft: "8px", color: "#00e5ff", fontSize: "11px" }}>● ACTIVE</span>}
                    </strong>
                    <small>{level.description}</small>
                    <AnimatePresence>
                      {selectedLevel === level.number && (
                        <motion.span
                          className="htg-level-detail"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                          style={{ display: 'block', overflow: 'hidden' }}
                        >
                          {level.detail}
                          <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {level.number === "10" ? (
                              <Link
                                to={ROUTES.FINAL_FLAG}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  display: "inline-block",
                                  padding: "6px 14px",
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
                            ) : (
                              <Link
                                to={ROUTES.QR_CHECKPOINT}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  display: "inline-block",
                                  padding: "6px 14px",
                                  background: "var(--htg-lime, #b8ff3d)",
                                  color: "#080a09",
                                  fontWeight: "800",
                                  fontSize: "10px",
                                  borderRadius: "4px",
                                  textDecoration: "none",
                                  letterSpacing: "0.5px"
                                }}
                              >
                                SCAN CHECKPOINT →
                              </Link>
                            )}
                            <Link
                              to={ROUTES.DASHBOARD}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                display: "inline-block",
                                padding: "6px 14px",
                                background: "rgba(255,255,255,0.08)",
                                color: "#fff",
                                fontWeight: "600",
                                fontSize: "10px",
                                borderRadius: "4px",
                                textDecoration: "none",
                                border: "1px solid rgba(255,255,255,0.15)"
                              }}
                            >
                              DASHBOARD
                            </Link>
                          </div>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                  <span className={`htg-difficulty ${level.difficulty.toLowerCase()}`}>{level.difficulty}</span>
                  <span className="htg-level-chevron" aria-hidden="true">›</span>
                </button>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <p className="htg-map-note">Select a level to view its mission briefing.</p>
        </section>

        <motion.aside
          className="htg-levels-benefits"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
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
        </motion.aside>
      </section>
    </PageTransition>
  );
}

export default function ChallengeLevelsPageWrapper(props) {
  return (
    <ErrorBoundary title="MISSION MAP ANOMALY // CONTAINED">
      <ChallengeLevelsPage {...props} />
    </ErrorBoundary>
  );
}
