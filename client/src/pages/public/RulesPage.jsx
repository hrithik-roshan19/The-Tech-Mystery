import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/RulesPage.css";
import { ROUTES } from "../../constants/routes";
import Navbar from "../../components/navigation/Navbar";
import {
  PageTransition,
  RevealSection,
  StaggerContainer,
  StaggerItem,
} from "../../components/common/Motion";
import { cardHoverMotion, buttonHoverTap } from "../../utils/motion";

const groups = [
  {
    id: "team",
    n: "01",
    icon: "♧",
    title: "Team Eligibility",
    sub: "Build your squad",
    summary: "Who can participate and how teams should be formed.",
    rules: [
      "Each team must consist of 2–4 participants.",
      "Every team must register using accurate participant and contact details.",
      "Teams must use their registered account and team identity throughout the event.",
      "Treat fellow participants and organizers respectfully."
    ]
  },
  {
    id: "fair",
    n: "02",
    icon: "◇",
    title: "Fair Play & Integrity",
    sub: "Compete with honesty",
    summary: "Keep the competition fair for every team.",
    rules: [
      "Do not impersonate another team or access another team's account.",
      "Do not share team-specific answers, flags, QR tokens or checkpoint credentials during the competition.",
      "Do not exploit platform bugs or manipulate scores, timers or leaderboard data.",
      "Follow instructions from organizers and checkpoint volunteers."
    ]
  },
  {
    id: "qr",
    n: "03",
    icon: "▦",
    title: "QR Checkpoints & Challenges",
    sub: "Follow your team's route",
    summary: "Use official checkpoints and solve the challenge assigned to your team.",
    rules: [
      "Scan only official The Tech Mystery QR codes placed or shared by organizers.",
      "A QR checkpoint may provide a team-specific challenge; do not attempt to access another team's content.",
      "Submit answers through the official event platform wherever required.",
      "Do not tamper with, damage or relocate QR codes and checkpoint materials."
    ]
  },
  {
    id: "security",
    n: "04",
    icon: "⬡",
    title: "Safety & Cybersecurity",
    sub: "Stay inside the sandbox",
    summary: "All technical activity must remain within authorized event challenges.",
    rules: [
      "Only interact with systems and challenge environments explicitly authorized for The Tech Mystery.",
      "Attacking real accounts, personal devices, university networks or external systems is prohibited.",
      "Do not use phishing, malware, denial-of-service attacks or unauthorized access against real systems or people.",
      "Report broken challenges or security concerns to an organizer."
    ]
  },
  {
    id: "score",
    n: "05",
    icon: "♜",
    title: "Scoring & Leaderboard",
    sub: "Earn points fairly",
    summary: "How submissions and results are handled.",
    rules: [
      "Points are awarded for valid answers according to the scoring rules announced by organizers.",
      "A challenge is solved only after the official platform or authorized volunteer confirms the submission.",
      "The leaderboard may update during the event; final results are subject to organizer verification.",
      "Any tie-break, hint penalty or time bonus will follow the policy announced before the event."
    ]
  },
  {
    id: "conduct",
    n: "06",
    icon: "✳",
    title: "Conduct & Disqualification",
    sub: "Respect the event",
    summary: "Help keep the experience safe and welcoming.",
    rules: [
      "Follow venue instructions and respect campus property, equipment and participants.",
      "Do not damage event materials or interfere with another team's work.",
      "Organizers may investigate suspected violations and request clarification.",
      "Serious or repeated violations may result in penalties or disqualification under the announced event policy."
    ]
  }
];

function Icon({ children }) {
  return <span className="rp-icon" aria-hidden="true">{children}</span>;
}

export default function RulesPage() {
  const [open, setOpen] = useState(["team", "fair"]);
  const [accepted, setAccepted] = useState(false);

  const toggle = (id) =>
    setOpen((old) =>
      old.includes(id) ? old.filter((x) => x !== id) : [...old, id]
    );

  return (
    <PageTransition className="htg-rules">
      <div className="rp-bg" />
      <div className="rp-overlay" />
      <div className="rp-grid" />

      <Navbar />

      <main className="rp-main">
        <section className="rp-hero">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="rp-eyebrow"><i /> PARTICIPANT HANDBOOK / 01</p>
            <h1>KNOW THE<br /><span>RULES.</span></h1>
            <h2>PLAY FAIR. WIN SMART.</h2>
            <div className="rp-line" />
            <p className="rp-intro">
              Your mission starts with understanding the rules. Read the guidelines, respect your fellow participants and prepare to enter the Grid.
            </p>
          </motion.div>
          <motion.div
            className="rp-seal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <div>⬡</div>
            <b>FAIR PLAY PROTOCOL</b>
            <small>HTG // 2026</small>
          </motion.div>
        </section>

        <StaggerContainer className="rp-stats">
          <StaggerItem>
            <div>
              <Icon>♧</Icon>
              <p><strong>2–4</strong><small>MEMBERS / TEAM</small></p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div>
              <Icon>▦</Icon>
              <p><strong>10</strong><small>CHALLENGE LEVELS</small></p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div>
              <Icon>◷</Icon>
              <p><strong>90–120</strong><small>MINUTES</small></p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div>
              <Icon>⬡</Icon>
              <p><strong>ONE</strong><small>FAIR PLAY POLICY</small></p>
            </div>
          </StaggerItem>
        </StaggerContainer>

        <RevealSection className="rp-content">
          <div className="rp-content-heading">
            <div>
              <p className="rp-kicker">THE PARTICIPANT GUIDE</p>
              <h2>THE RULES OF<br /><span>THE GRID.</span></h2>
            </div>
            <p>
              Review each category before the event. Select a section to expand the complete guidelines.
            </p>
          </div>

          <div className="rp-layout">
            <div className="rp-accordion">
              {groups.map((g) => {
                const active = open.includes(g.id);
                return (
                  <article className={`rp-item ${active ? "opened" : ""}`} key={g.id}>
                    <button
                      className="rp-trigger"
                      onClick={() => toggle(g.id)}
                      aria-expanded={active}
                      aria-controls={`rp-${g.id}`}
                    >
                      <span className="rp-number">{g.n}</span>
                      <Icon>{g.icon}</Icon>
                      <span className="rp-item-title">
                        <b>{g.title}</b>
                        <small>{g.summary}</small>
                      </span>
                      <span className="rp-plus">{active ? "−" : "+"}</span>
                    </button>
                    <AnimatePresence>
                      {active && (
                        <motion.div
                          className="rp-panel"
                          id={`rp-${g.id}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                          style={{ overflow: 'hidden' }}
                        >
                          <p>{g.sub}</p>
                          <ul>
                            {g.rules.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </article>
                );
              })}
            </div>

            <aside className="rp-sidebar">
              <motion.div className="rp-side-card" {...cardHoverMotion}>
                <div className="rp-side-symbol">⬡</div>
                <p className="rp-kicker">THE GOLDEN RULE</p>
                <h3>Stay inside<br /><span>the sandbox.</span></h3>
                <p>Only test what the event explicitly authorizes. Curiosity is encouraged; unauthorized access is not.</p>
              </motion.div>

              <motion.div className="rp-side-card rp-help" {...cardHoverMotion}>
                <p className="rp-kicker">NEED CLARIFICATION?</p>
                <h3>Ask an organizer.</h3>
                <p>If a rule or challenge is unclear, pause and ask an authorized event volunteer instead of guessing.</p>
                <Link to={ROUTES.MISSION}>ABOUT THE EVENT ↗</Link>
              </motion.div>
            </aside>
          </div>
        </RevealSection>

        <RevealSection className="rp-ack">
          <div>
            <p className="rp-kicker">BEFORE YOU ENTER</p>
            <h2>PLAY WITH<br /><span>INTEGRITY.</span></h2>
            <p>Respect the challenge, your teammates and every team competing beside you.</p>
          </div>
          <div className="rp-ack-action">
            <label>
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
              />
              <span className="rp-check">{accepted ? "✓" : ""}</span>
              <span>I have read and understood the event rules.</span>
            </label>
            <motion.div {...buttonHoverTap}>
              <Link
                className={!accepted ? "disabled" : ""}
                to={accepted ? ROUTES.REGISTER : "#"}
                onClick={(e) => {
                  if (!accepted) e.preventDefault();
                }}
              >
                I UNDERSTAND THE RULES <b>→</b>
              </Link>
            </motion.div>
            {!accepted && <small>Check the box to continue to team registration.</small>}
          </div>
        </RevealSection>
      </main>

      <footer className="rp-footer">
        <Link className="rp-brand" to="/">
          <strong>THE TECH <span>MYSTERY</span></strong>
          <small>CODESPHERE × UTKRISHT 2026</small>
        </Link>
        <p>CodeSphere Coding Club · Tula's University, Dehradun</p>
        <div>
          <Link to="/">HOME</Link>
          <Link to={ROUTES.LOGIN}>LOGIN</Link>
          <Link to={ROUTES.REGISTER}>REGISTER</Link>
        </div>
      </footer>
    </PageTransition>
  );
}
