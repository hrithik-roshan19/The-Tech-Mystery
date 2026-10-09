import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import "../../styles/QRCheckpointPage.css";

const checkpointData = [
  { id: "CP-01", name: "Main Gate", status: "completed", time: "Scanned 12 min ago", points: "+100 pts" },
  { id: "CP-02", name: "Central Lawn", status: "completed", time: "Scanned 35 min ago", points: "+150 pts" },
  { id: "CP-03", name: "Library Block", status: "pending", time: "Pending", points: "—" },
  { id: "CP-04", name: "CSE Block", status: "locked", time: "Locked", points: "—" },
];

const navLinks = [
  ["Mission", ROUTES.MISSION],
  ["How It Works", "/mission#how-it-works"],
  ["Challenges", ROUTES.CHALLENGES],
  ["QR Checkpoint", ROUTES.QR_CHECKPOINT],
  ["Leaderboard", ROUTES.LEADERBOARD],
];

export default function QRCheckpointPage() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [scanMessage, setScanMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setScanMessage("Please select an image file containing a QR code.");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl((oldUrl) => {
      if (oldUrl) URL.revokeObjectURL(oldUrl);
      return URL.createObjectURL(file);
    });
    setScanMessage("Image selected. QR decoding is not connected yet.");
  }

  return (
    <main className="htg-qr-page">
      <div className="htg-qr-background" aria-hidden="true" />
      <header className="htg-qr-navbar">
        <Link to={ROUTES.HOME} className="htg-qr-brand" aria-label="Hack the Grid home">
          <span>HACK THE <b>GRID</b></span>
          <small>CODESPHERE × UTKRISHT 2026</small>
        </Link>
        <nav className="htg-qr-navlinks" aria-label="Main navigation">
          {navLinks.map(([label, to]) => (
            <Link key={label} to={to} className={label === "QR Checkpoint" ? "active" : ""}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="htg-qr-nav-actions">
          <Link to={ROUTES.DASHBOARD} className="htg-qr-dashboard-link">Dashboard</Link>
          <Link to={ROUTES.REGISTER} className="htg-qr-register-link">Register</Link>
        </div>
      </header>

      <div className="htg-qr-layout">
        <section className="htg-qr-intro">
          <p className="htg-qr-eyebrow">QR CHECKPOINTS</p>
          <h1>SCAN<br />EXPLORE<br /><em>SOLVE</em></h1>
          <div className="htg-qr-accent-line" />
          <p className="htg-qr-intro-copy">
            Find QR checkpoints across the campus, scan the code, get your unique challenge and solve it to earn points.
          </p>
          <div className="htg-qr-stats">
            <div>
              <span className="htg-qr-stat-icon">⬡</span>
              <strong>10</strong>
              <small>CHECKPOINT<br />LOCATIONS</small>
            </div>
            <div>
              <span className="htg-qr-stat-icon">⚑</span>
              <strong>10</strong>
              <small>UNIQUE<br />CHALLENGES</small>
            </div>
            <div>
              <span className="htg-qr-stat-icon">♜</span>
              <strong>REAL-TIME</strong>
              <small>PROGRESS</small>
            </div>
          </div>
          <blockquote className="htg-qr-quote">
            “ The campus is your playground.<br />Every QR code is a new mystery. ”
            <small>— Hack the Grid 2026</small>
          </blockquote>
        </section>

        <section className="htg-qr-center-column">
          <div className="htg-qr-scanner-panel">
            <p className="htg-qr-panel-eyebrow">QR CHECKPOINT</p>
            <h2>Scan <span>the Code</span></h2>
            <p className="htg-qr-panel-subtitle">Find a QR code at a checkpoint and scan it to get your challenge.</p>
            <button
              className={`htg-qr-scan-frame ${selectedFile ? "has-image" : ""}`}
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Choose an image with a QR code"
            >
              <i className="corner top-left" />
              <i className="corner top-right" />
              <i className="corner bottom-left" />
              <i className="corner bottom-right" />
              {previewUrl ? (
                <img src={previewUrl} alt="Selected QR code image preview" />
              ) : (
                <span className="htg-qr-scan-symbol">▣</span>
              )}
              <strong>{selectedFile ? selectedFile.name : "Scan QR Code"}</strong>
              <small>
                {selectedFile
                  ? "Click to choose a different image"
                  : "Align the QR code within the frame to scan and get your challenge."}
              </small>
            </button>
            <div className="htg-qr-or"><span />OR<span /></div>
            <button type="button" className="htg-qr-upload" onClick={() => fileInputRef.current?.click()}>
              <span className="htg-qr-upload-icon">▧</span>
              <span>
                <strong>Upload QR Code Image</strong>
                <small>Select an image from your device</small>
              </span>
              <span className="htg-qr-upload-arrow">↗</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="htg-qr-file-input"
              onChange={handleFileChange}
            />
            {scanMessage && <p className="htg-qr-message" role="status">{scanMessage}</p>}
          </div>

          <section className="htg-qr-recent-panel">
            <div className="htg-qr-panel-heading">
              <h2>Recent Checkpoints <small style={{ fontSize: "10px", color: "#8a968c", fontWeight: 400 }}>(Sample Preview)</small></h2>
              <Link to={ROUTES.CHALLENGES}>View All <span>→</span></Link>
            </div>
            <div className="htg-qr-checkpoint-grid">
              {checkpointData.map((cp) => (
                <article className={`htg-qr-checkpoint-card ${cp.status}`} key={cp.id}>
                  <div className="htg-qr-checkpoint-top">
                    <strong>{cp.id}</strong>
                    <span aria-label={cp.status}>
                      {cp.status === "completed" ? "✓" : cp.status === "pending" ? "⌛" : "♙"}
                    </span>
                  </div>
                  <h3>{cp.name}</h3>
                  <p>{cp.time}</p>
                  <strong className="htg-qr-points">{cp.points}</strong>
                </article>
              ))}
            </div>
          </section>
        </section>

        <aside className="htg-qr-right-column">
          <section className="htg-qr-how-panel">
            <h2>How It Works?</h2>
            <div className="htg-qr-steps">
              <article>
                <span>1</span>
                <div>
                  <strong>Find Checkpoint</strong>
                  <p>Locate the QR code at the given checkpoint on campus.</p>
                </div>
              </article>
              <article>
                <span>2</span>
                <div>
                  <strong>Scan QR Code</strong>
                  <p>Scan the QR code using your camera or upload an image.</p>
                </div>
              </article>
              <article>
                <span>3</span>
                <div>
                  <strong>Get Your Challenge</strong>
                  <p>Receive a unique challenge for your team.</p>
                </div>
              </article>
              <article>
                <span>4</span>
                <div>
                  <strong>Solve &amp; Earn Points</strong>
                  <p>Solve the challenge and submit the correct answer.</p>
                </div>
              </article>
            </div>
            <div className="htg-qr-rules">
              <h3><span>⚠</span> Important Rules</h3>
              <ul>
                <li>Each QR code gives a unique challenge.</li>
                <li>Do not share QR codes with other teams.</li>
                <li>Scan only official checkpoints.</li>
                <li>Tampering with QR codes is strictly prohibited.</li>
                <li>Follow the event's internet usage rules.</li>
              </ul>
            </div>
          </section>
          <section className="htg-qr-next-panel">
            <div className="htg-qr-next-icon">⚑</div>
            <div>
              <h2>Ready for the next checkpoint?</h2>
              <p>Explore the campus and keep scanning.</p>
            </div>
            <Link to={ROUTES.CHALLENGES} className="htg-qr-map-button">
              View Challenge Map <span>→</span>
            </Link>
          </section>
        </aside>
      </div>
    </main>
  );
}
