import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/RegisterPage.css";
import { ROUTES } from "../../constants/routes";
import Navbar from "../../components/navigation/Navbar";
import { authService } from "../../services/auth.service";
import { teamService } from "../../services/team.service";
import { useAuth } from "../../hooks/useAuth";

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
  if (type === "lock") return <svg {...common}><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>;
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
  const navigate = useNavigate();
  const { login } = useAuth();

  // Wizard state
  const [step, setStep] = useState(0);

  // Step 0: Team info
  const [teamName, setTeamName] = useState("");
  const [motto, setMotto] = useState("");
  const [college, setCollege] = useState("Tula's University, Dehradun");
  const [year, setYear] = useState("");
  const [domain, setDomain] = useState("");

  // Step 1: Team Leader info
  const [leaderName, setLeaderName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [leaderPhone, setLeaderPhone] = useState("");
  const [leaderRollNo, setLeaderRollNo] = useState("");
  const [leaderPassword, setLeaderPassword] = useState("");

  // Step 2: Team Members
  const [members, setMembers] = useState([
    { name: "", email: "" },
    { name: "", email: "" },
    { name: "", email: "" }
  ]);

  // Submission state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [createdTeam, setCreatedTeam] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleMemberChange = (index, field, value) => {
    setMembers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError("");

    if (step === 0) {
      if (!teamName.trim() || teamName.trim().length < 3) {
        setError("Team name must be at least 3 characters.");
        return;
      }
      setStep(1);
    } else if (step === 1) {
      if (!leaderName.trim()) {
        setError("Team leader full name is required.");
        return;
      }
      if (!leaderEmail.trim() || !/^\S+@\S+\.\S+$/.test(leaderEmail.trim())) {
        setError("A valid email address is required for the team leader.");
        return;
      }
      if (!leaderPassword || leaderPassword.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Generate unique alphanumeric username from email or name
      const cleanEmailUser = leaderEmail.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "_");
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      const username = `${cleanEmailUser}_${randomSuffix}`.slice(0, 28);

      // 2. Register Leader User
      const regRes = await authService.register({
        username,
        email: leaderEmail.trim().toLowerCase(),
        password: leaderPassword,
        fullName: leaderName.trim(),
        phone: leaderPhone.trim(),
        collegeRollNo: leaderRollNo.trim()
      });

      const user = regRes.data?.user;
      const accessToken = regRes.data?.accessToken;

      if (user && accessToken) {
        login(user, accessToken);
      }

      // 3. Create Team
      const teamRes = await teamService.createTeam(teamName.trim());
      const newTeam = teamRes.data?.team;

      // Update tokens in context with new team
      if (teamRes.data?.accessToken) {
        login(teamRes.data.user || user, teamRes.data.accessToken);
      }

      setCreatedTeam(newTeam);
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please review your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyJoinCode = () => {
    if (createdTeam?.joinCode) {
      navigator.clipboard.writeText(createdTeam.joinCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
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
          <h1>THE TECH<br /><span>MYSTERY</span></h1>
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
            <p>Register now and be a part of The Tech Mystery 2026</p>
          </div>

          <div className="register-progress">
            {steps.map((label, index) => (
              <div className={`register-step ${index <= step ? "active" : ""}`} key={label}>
                <div className="register-step-node">{index + 1}</div>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {error && (
            <div
              style={{
                background: "rgba(255, 77, 100, 0.12)",
                border: "1px solid rgba(255, 77, 100, 0.4)",
                color: "#ff8595",
                fontSize: "12px",
                padding: "10px 14px",
                borderRadius: "6px",
                marginBottom: "16px",
                fontFamily: "Geist Mono, monospace"
              }}
            >
              ⚠ {error}
            </div>
          )}

          {submitted ? (
            <div className="register-step-content" style={{ textAlign: "center", padding: "20px 10px 10px" }}>
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
                Squad Enrolled Successfully!
              </h3>
              <p style={{ color: "#aeb4b0", fontSize: "13px", lineHeight: "1.5", margin: "0 0 16px" }}>
                Squad <strong>{teamName || "Your Team"}</strong> has been registered on the Grid.
              </p>

              {createdTeam?.joinCode && (
                <div
                  style={{
                    background: "rgba(184, 255, 61, 0.06)",
                    border: "1px dashed rgba(184, 255, 61, 0.4)",
                    borderRadius: "8px",
                    padding: "14px",
                    margin: "0 auto 20px",
                    maxWidth: "340px"
                  }}
                >
                  <div style={{ fontSize: "10px", color: "#aeb4b0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>
                    OFFICIAL SQUAD JOIN CODE
                  </div>
                  <div style={{ fontSize: "24px", fontFamily: "Geist Mono, monospace", fontWeight: "800", color: "var(--rg-lime)", letterSpacing: "2px", margin: "4px 0 8px" }}>
                    {createdTeam.joinCode}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyJoinCode}
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "#fff",
                      fontSize: "11px",
                      padding: "4px 12px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    {copiedCode ? "✓ Copied to Clipboard!" : "Copy Join Code"}
                  </button>
                  <p style={{ color: "#7a827e", fontSize: "11px", margin: "8px 0 0", lineHeight: "1.4" }}>
                    Share this code with up to 3 teammates so they can join your squad.
                  </p>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link
                  to={ROUTES.DASHBOARD}
                  className="register-next"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
                >
                  Enter Mission Dashboard →
                </Link>
                <Link
                  to={ROUTES.CHALLENGES}
                  className="register-back"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
                >
                  View Mission Map
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleNext}>
              {step === 0 && (
                <div className="register-step-content">
                  <div className="register-section-title">
                    <div className="register-section-icon"><Icon type="team" /></div>
                    <div><h3>Team Information</h3><p>Tell us about your team.</p></div>
                  </div>

                  <label>Team Name <b>*</b></label>
                  <div className="register-input">
                    <Icon type="user" />
                    <input
                      value={teamName}
                      maxLength={30}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Enter your team name (min 3 chars)"
                      required
                    />
                  </div>
                  <div className="register-counter">{teamName.length}/30</div>

                  <label>Team Motto <em>(Optional)</em></label>
                  <div className="register-input">
                    <Icon type="flag" />
                    <input
                      value={motto}
                      onChange={(e) => setMotto(e.target.value)}
                      placeholder="e.g. Decode. Infiltrate. Conquer."
                    />
                  </div>

                  <label>College / Institution <b>*</b></label>
                  <div className="register-input">
                    <Icon type="college" />
                    <input
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="Your college or university"
                      required
                    />
                  </div>

                  <div className="register-row">
                    <div className="register-field">
                      <label>Academic Year</label>
                      <div className="register-input">
                        <input
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          placeholder="e.g. 3rd Year"
                        />
                      </div>
                    </div>
                    <div className="register-field">
                      <label>Primary Focus</label>
                      <div className="register-input">
                        <input
                          value={domain}
                          onChange={(e) => setDomain(e.target.value)}
                          placeholder="e.g. Web / Crypto"
                        />
                      </div>
                    </div>
                  </div>

                  <button className="register-next" type="submit">
                    Next: Team Leader <Icon type="arrow" />
                  </button>
                </div>
              )}

              {step === 1 && (
                <div className="register-step-content">
                  <div className="register-section-title">
                    <div className="register-section-icon"><Icon type="user" /></div>
                    <div><h3>Team Leader</h3><p>Add the primary contact and login credentials.</p></div>
                  </div>

                  <label>Full Name <b>*</b></label>
                  <div className="register-input">
                    <Icon type="user" />
                    <input
                      value={leaderName}
                      onChange={(e) => setLeaderName(e.target.value)}
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <label>Email Address <b>*</b></label>
                  <div className="register-input">
                    <Icon type="mail" />
                    <input
                      type="email"
                      value={leaderEmail}
                      onChange={(e) => setLeaderEmail(e.target.value)}
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <label>Password (Account Login) <b>*</b></label>
                  <div className="register-input">
                    <Icon type="lock" />
                    <input
                      type="password"
                      value={leaderPassword}
                      onChange={(e) => setLeaderPassword(e.target.value)}
                      placeholder="Create password (min 6 characters)"
                      minLength={6}
                      required
                    />
                  </div>

                  <div className="register-row">
                    <div className="register-field">
                      <label>Phone Number</label>
                      <div className="register-input">
                        <Icon type="phone" />
                        <input
                          type="tel"
                          value={leaderPhone}
                          onChange={(e) => setLeaderPhone(e.target.value)}
                          placeholder="Contact number"
                        />
                      </div>
                    </div>
                    <div className="register-field">
                      <label>Roll Number / ID</label>
                      <div className="register-input">
                        <Icon type="college" />
                        <input
                          value={leaderRollNo}
                          onChange={(e) => setLeaderRollNo(e.target.value)}
                          placeholder="College roll no."
                        />
                      </div>
                    </div>
                  </div>

                  <button className="register-next" type="submit">
                    Next: Team Members <Icon type="arrow" />
                  </button>
                  <button type="button" className="register-back" onClick={() => setStep(0)}>
                    ← Back to Team Details
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="register-step-content">
                  <div className="register-section-title">
                    <div className="register-section-icon"><Icon type="team" /></div>
                    <div><h3>Team Members (Optional)</h3><p>Roster teammates now or share your squad join code later.</p></div>
                  </div>
                  {members.map((member, idx) => (
                    <div className="member-row" key={idx}>
                      <span className="member-number">{idx + 2}</span>
                      <div className="member-fields">
                        <input
                          value={member.name}
                          onChange={(e) => handleMemberChange(idx, "name", e.target.value)}
                          placeholder={`Member ${idx + 2} name (optional)`}
                        />
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) => handleMemberChange(idx, "email", e.target.value)}
                          placeholder="Email address"
                        />
                      </div>
                    </div>
                  ))}
                  <button className="register-next" type="submit">
                    Review Registration <Icon type="arrow" />
                  </button>
                  <button type="button" className="register-back" onClick={() => setStep(1)}>
                    ← Back to Team Leader
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="register-step-content review-content">
                  <div className="register-section-title">
                    <div className="register-section-icon"><Icon type="flag" /></div>
                    <div><h3>Review & Register</h3><p>Check your details before submitting to the Grid.</p></div>
                  </div>
                  <div className="review-box">
                    <div><span>TEAM NAME</span><strong>{teamName || "—"}</strong></div>
                    <div><span>LEADER</span><strong>{leaderName || "—"} ({leaderEmail})</strong></div>
                    <div><span>COLLEGE</span><strong>{college}</strong></div>
                    <div><span>MEMBERS</span><strong>Leader + {members.filter(m => m.name || m.email).length} operative(s)</strong></div>
                    <div><span>MOTTO</span><strong>{motto || "—"}</strong></div>
                  </div>
                  <label className="terms">
                    <input type="checkbox" required />
                    <span>I agree to the The Tech Mystery rules, code of conduct, and anti-cheat guidelines.</span>
                  </label>
                  <button className="register-next" type="submit" disabled={loading}>
                    {loading ? "Registering Squad..." : "Create Team & Enter the Grid"} <Icon type="arrow" />
                  </button>
                  <button type="button" className="register-back" onClick={() => setStep(2)}>
                    ← Back to Team Members
                  </button>
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
