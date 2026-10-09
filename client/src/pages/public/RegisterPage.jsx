import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/RegisterPage.css";
import { ROUTES } from "../../constants/routes";
import Navbar from "../../components/navigation/Navbar";

const steps = ["Team Details", "Team Leader", "Team Members", "Review"];

function Icon({ type }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (type === "team") return <svg {...common}><circle cx="9" cy="8" r="3" /><path d="M3.5 19c.5-3.2 2.2-5 5.5-5s5 1.8 5.5 5" /><circle cx="17" cy="9" r="2.2" /><path d="M16 14c2.7.2 4.2 1.8 4.5 4" /></svg>;
  if (type === "flag") return <svg {...common}><path d="M6 20V4" /><path d="M6 5c3.5-2.5 6.5 2.5 12 0v9c-5.5 2.5-8.5-2.5-12 0" /></svg>;
  if (type === "college") return <svg {...common}><path d="m3 9 9-5 9 5-9 5-9-5z" /><path d="M7 11v5c2.8 2.5 7.2 2.5 10 0v-5M21 9v6" /></svg>;
  if (type === "code") return <svg {...common}><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" /></svg>;
  if (type === "trophy") return <svg {...common}><path d="M8 4h8v4c0 3-1.6 5-4 5S8 11 8 8V4z" /><path d="M8 6H4v2c0 2.5 1.8 4 4 4M16 6h4v2c0 2.5-1.8 4-4 4M12 13v4M8 20h8M9 17h6" /></svg>;
  if (type === "learn") return <svg {...common}><path d="m3 9 9-5 9 5-9 5-9-5z" /><path d="M7 11v5c2.8 2.5 7.2 2.5 10 0v-5M21 9v6" /></svg>;
  if (type === "chart") return <svg {...common}><path d="M5 20V10M12 20V5M19 20v-8" /></svg>;
  if (type === "user") return <svg {...common}><circle cx="12" cy="8" r="3" /><path d="M5 20c.7-4 3-6 7-6s6.3 2 7 6" /></svg>;
  if (type === "mail") return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
  if (type === "phone") return <svg {...common}><path d="M6 3h3l2 5-2 2c1 2 2.5 3.5 4.5 4.5l2-2 5 2v3c0 1-1 2-2 1.5C11 18 6 13 4.5 6 4 4 5 3 6 3z" /></svg>;
  if (type === "arrow") return <span aria-hidden="true">→</span>;
  return null;
}

const benefits = [
  ["trophy", "COMPETE", "Solve challenging problems and capture the flag."],
  ["team", "COLLABORATE", "Work with your team and learn together."],
  ["learn", "LEARN", "Build real-world skills in a fun environment."],
  ["chart", "EARN RECOGNITION", "Get featured on the leaderboard and win prizes."],
];

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [teamName, setTeamName] = useState("");
  const [motto, setMotto] = useState("");
  const [college, setCollege] = useState("Tula's University, Dehradun");
  const [year, setYear] = useState("");
  const [domain, setDomain] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const next = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep((current) => Math.min(current + 1, 3));
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="htg-register">
      <div className="htg-register-bg" />
      <div className="htg-register-overlay" />
      <div className="htg-register-grid" />

      <Navbar />

      <main className="htg-register-main">
        <section className="htg-register-intro">
          <p className="register-eyebrow">CODESPHERE CODING CLUB <span>×</span> UTKRISHT 2026</p>
          <h1>HACK<br />THE <span>GRID</span></h1>
          <h2>THE ULTIMATE CAMPUS<br />CAPTURE-THE-FLAG EXPERIENCE.</h2>
          <div className="register-accent" />
          <p className="register-description">
            A team-based challenge combining cybersecurity, cryptography,
            programming, logical reasoning and creative problem solving.
          </p>

          <div className="register-stats">
            <div><Icon type="team" /><strong>10</strong><small>CHALLENGE<br />LEVELS</small></div>
            <div><Icon type="team" /><strong>2–4</strong><small>TEAM<br />MEMBERS</small></div>
            <div>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7v5l3 2" />
              </svg>
              <strong>90–120</strong>
              <small>MINUTES</small>
            </div>
          </div>

          <div className="register-side-copy">
            <span>PEOPLE</span><span>IDEAS</span><span>TECHNOLOGY</span><span>A STRONGER TOMORROW</span><i />
          </div>
        </section>

        <section className="htg-register-card">
          <div className="register-card-heading">
            <h2>Create Your <span>Team</span></h2>
            <p>Register now and be a part of Hack the Grid 2026</p>
          </div>

          <div className="register-progress">
            {steps.map((label, index) => (
              <div className={`register-step ${index <= step ? "active" : ""}`} key={label}>
                <div className="register-step-node">{index + 1}</div>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {submitted ? (
            <div className="register-step-content" style={{ textAlign: "center", padding: "24px 10px 10px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "rgba(184,255,61,0.15)",
                  border: "2px solid var(--rg-lime)",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 16px",
                  color: "var(--rg-lime)",
                  fontSize: "26px"
                }}
              >
                ✓
              </div>
              <h3 style={{ fontFamily: "Manrope, sans-serif", fontSize: "22px", margin: "0 0 8px", color: "#fff" }}>
                Registration Received!
              </h3>
              <p style={{ color: "#aeb4b0", fontSize: "13px", lineHeight: "1.5", margin: "0 0 24px" }}>
                Squad <strong>{teamName || "operative"}</strong> has been registered. You can now login with your credentials once validated.
              </p>
              <Link
                to={ROUTES.LOGIN}
                className="register-next"
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
              >
                Proceed to Login →
              </Link>
            </div>
          ) : (
            <form onSubmit={next}>
              {step === 0 && (
                <div className="register-step-content">
                  <div className="register-section-title">
                    <div className="register-section-icon"><Icon type="team" /></div>
                    <div><h3>Team Information</h3><p>Tell us about your team.</p></div>
                  </div>

                  <label>Team Name <b>*</b></label>
                  <div className="register-input">
                    <Icon type="user" />
                    <input value={teamName} maxLength={30} onChange={(e) => setTeamName(e.target.value)} placeholder="Enter your team name" required />
                  </div>
                  <div className="register-counter">{teamName.length}/30</div>

                  <label>Team Motto <em>(Optional)</em></label>
                  <div className="register-input">
                    <Icon type="flag" />
                    <input value={motto} maxLength={50} onChange={(e) => setMotto(e.target.value)} placeholder="A short motto for your team" />
                  </div>
                  <div className="register-counter">{motto.length}/50</div>

                  <label>College/Department <b>*</b></label>
                  <div className="register-input select-wrap">
                    <Icon type="college" />
                    <select value={college} onChange={(e) => setCollege(e.target.value)} required>
                      <option>Tula's University, Dehradun</option>
                      <option>Other College / University</option>
                    </select>
                  </div>

                  <label>Year of Study <b>*</b></label>
                  <div className="register-input select-wrap">
                    <Icon type="college" />
                    <select value={year} onChange={(e) => setYear(e.target.value)} required>
                      <option value="">Select Year</option>
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                    </select>
                  </div>

                  <label>Domain Preference <em>(Optional)</em></label>
                  <div className="register-input select-wrap">
                    <Icon type="code" />
                    <select value={domain} onChange={(e) => setDomain(e.target.value)}>
                      <option value="">Select your primary interest</option>
                      <option>Web Development</option>
                      <option>Cybersecurity</option>
                      <option>Programming</option>
                      <option>Cryptography</option>
                      <option>AI / Machine Learning</option>
                      <option>Problem Solving</option>
                    </select>
                  </div>

                  <button className="register-next" type="submit">Next: Team Leader <Icon type="arrow" /></button>
                </div>
              )}

              {step === 1 && (
                <div className="register-step-content">
                  <div className="register-section-title">
                    <div className="register-section-icon"><Icon type="user" /></div>
                    <div><h3>Team Leader</h3><p>Add the primary contact for your team.</p></div>
                  </div>
                  <label>Full Name <b>*</b></label>
                  <div className="register-input"><Icon type="user" /><input placeholder="Enter full name" required /></div>
                  <label>Email Address <b>*</b></label>
                  <div className="register-input"><Icon type="mail" /><input type="email" placeholder="Enter email address" required /></div>
                  <label>Phone Number <b>*</b></label>
                  <div className="register-input"><Icon type="phone" /><input type="tel" placeholder="Enter phone number" required /></div>
                  <label>Participant ID / Roll Number <b>*</b></label>
                  <div className="register-input"><Icon type="college" /><input placeholder="Enter ID or roll number" required /></div>
                  <button className="register-next" type="submit">Next: Team Members <Icon type="arrow" /></button>
                  <button type="button" className="register-back" onClick={() => setStep(0)}>← Back to Team Details</button>
                </div>
              )}

              {step === 2 && (
                <div className="register-step-content">
                  <div className="register-section-title">
                    <div className="register-section-icon"><Icon type="team" /></div>
                    <div><h3>Team Members</h3><p>Add 1–3 additional members.</p></div>
                  </div>
                  {[1, 2, 3].map((member) => (
                    <div className="member-row" key={member}>
                      <span className="member-number">{member + 1}</span>
                      <div className="member-fields">
                        <input placeholder={`Member ${member + 1} name${member === 1 ? " (optional)" : ""}`} />
                        <input type="email" placeholder="Email address" />
                      </div>
                    </div>
                  ))}
                  <button className="register-next" type="submit">Review Registration <Icon type="arrow" /></button>
                  <button type="button" className="register-back" onClick={() => setStep(1)}>← Back to Team Leader</button>
                </div>
              )}

              {step === 3 && (
                <div className="register-step-content review-content">
                  <div className="register-section-title">
                    <div className="register-section-icon"><Icon type="flag" /></div>
                    <div><h3>Review & Register</h3><p>Check your details before submitting.</p></div>
                  </div>
                  <div className="review-box">
                    <div><span>TEAM NAME</span><strong>{teamName || "—"}</strong></div>
                    <div><span>MOTTO</span><strong>{motto || "—"}</strong></div>
                    <div><span>COLLEGE</span><strong>{college}</strong></div>
                    <div><span>YEAR</span><strong>{year || "—"}</strong></div>
                    <div><span>DOMAIN</span><strong>{domain || "—"}</strong></div>
                  </div>
                  <label className="terms">
                    <input type="checkbox" required />
                    <span>I agree to the Hack the Grid rules and participation guidelines.</span>
                  </label>
                  <button className="register-next" type="submit">Create Team & Enter the Grid <Icon type="arrow" /></button>
                  <button type="button" className="register-back" onClick={() => setStep(2)}>← Back to Team Members</button>
                </div>
              )}
            </form>
          )}

          <p className="login-prompt">
            Already have an account? <Link to={ROUTES.LOGIN}>Login to your team →</Link>
          </p>
        </section>

        <aside className="htg-register-benefits">
          {benefits.map(([icon, title, text]) => (
            <div className="benefit" key={title}>
              <div className="benefit-icon"><Icon type={icon} /></div>
              <div><h3>{title}</h3><p>{text}</p></div>
            </div>
          ))}
          <blockquote>
            <span>“</span>
            <p>Great challenges<br />build greater developers.</p>
            <footer>— CodeSphere × UTKRISHT 2026</footer>
          </blockquote>
        </aside>
      </main>
    </div>
  );
}
