import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { checkpointService } from "../../services/checkpoint.service";
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

/**
 * Extracts code and token from various QR payload formats:
 * - URL: /checkpoint/scan?code=CP-01&token=xyz or https://domain/checkpoint/scan?...
 * - JSON: {"code":"CP-01","token":"xyz"}
 * - Raw string: CP-01
 */
function parseCheckpointPayload(raw) {
  if (!raw) return { code: "", token: "" };

  try {
    // 1. Try URL parsing
    if (raw.includes("?") || raw.startsWith("http://") || raw.startsWith("https://")) {
      const url = new URL(raw, window.location.origin);
      const code = url.searchParams.get("code") || "";
      const token = url.searchParams.get("token") || "";
      if (code || token) return { code, token };
    }

    // 2. Try JSON parsing
    if (raw.trim().startsWith("{")) {
      const parsed = JSON.parse(raw);
      if (parsed.code || parsed.token) {
        return { code: parsed.code || "", token: parsed.token || "" };
      }
    }
  } catch {
    // fallback to string inspection
  }

  // 3. Fallback: treat as raw code
  return { code: raw.trim(), token: "" };
}

export default function QRCheckpointPage() {
  const { isAuthenticated, user } = useAuth();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanFrameRef = useRef(null);
  const scanBusyRef = useRef(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [scanMessage, setScanMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [decodedValue, setDecodedValue] = useState("");
  const [cameraError, setCameraError] = useState("");

  // Server verification state
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);

  const stopLiveScan = useCallback(() => {
    if (scanFrameRef.current) cancelAnimationFrame(scanFrameRef.current);
    scanFrameRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    scanBusyRef.current = false;
    setCameraActive(false);
  }, []);

  const startLiveScan = useCallback(async () => {
    setCameraError("");
    setDecodedValue("");
    setVerifyResult(null);
    setScanMessage("");

    if (!("BarcodeDetector" in window)) {
      setCameraError(
        "Live QR decoding via BarcodeDetector is not supported by this browser. Open this page in the latest Chrome or Edge, or use the upload option."
      );
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera access requires a secure connection. Open the app on localhost or HTTPS.");
      return;
    }

    try {
      const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });

      streamRef.current = stream;
      if (!videoRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        return;
      }

      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setCameraActive(true);
      setSelectedFile(null);
      setPreviewUrl("");
      setScanMessage("Camera is live. Hold the QR code steady inside the frame.");

      const scan = async () => {
        if (!streamRef.current || !videoRef.current) return;
        if (!scanBusyRef.current && videoRef.current.readyState >= 2) {
          scanBusyRef.current = true;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes.length && codes[0].rawValue) {
              const value = codes[0].rawValue;
              setDecodedValue(value);
              setScanMessage("QR code detected. Verify this checkpoint with the event server before awarding points.");
              stopLiveScan();
              return;
            }
          } catch {
            // Keep scanning; a single unreadable frame is normal while the camera moves.
          } finally {
            scanBusyRef.current = false;
          }
        }
        if (streamRef.current) scanFrameRef.current = requestAnimationFrame(scan);
      };
      scanFrameRef.current = requestAnimationFrame(scan);
    } catch (error) {
      stopLiveScan();
      if (error?.name === "NotAllowedError") {
        setCameraError("Camera permission was denied. Allow camera access in your browser settings and try again.");
      } else if (error?.name === "NotFoundError") {
        setCameraError("No camera was found on this device.");
      } else {
        setCameraError("Could not start the camera. Check camera permissions and try again.");
      }
    }
  }, [stopLiveScan]);

  useEffect(() => () => {
    if (scanFrameRef.current) cancelAnimationFrame(scanFrameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

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
    setScanMessage("Image preview ready. Use Start Live Scan for camera-based QR detection.");
  }

  // Handle server-side checkpoint verification
  async function handleVerifyWithServer() {
    if (!decodedValue) return;

    const { code, token } = parseCheckpointPayload(decodedValue);
    if (!code) {
      setVerifyResult({
        success: false,
        message: "Unable to parse a valid checkpoint code from the scanned payload."
      });
      return;
    }

    setVerifying(true);
    setVerifyResult(null);

    try {
      const res = await checkpointService.scanCheckpoint(code, token);
      setVerifyResult({
        success: true,
        message: res.message || `Checkpoint verified! Level ${res.data?.checkpoint?.levelNumber || ""} unlocked.`,
        data: res.data
      });
    } catch (err) {
      setVerifyResult({
        success: false,
        message: err.response?.data?.message || err.message || "Checkpoint verification rejected by server."
      });
    } finally {
      setVerifying(false);
    }
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

            <div className={`htg-qr-scan-frame ${selectedFile ? "has-image" : ""} ${cameraActive ? "camera-active" : ""}`}>
              <i className="corner top-left" />
              <i className="corner top-right" />
              <i className="corner bottom-left" />
              <i className="corner bottom-right" />
              <video
                ref={videoRef}
                className="htg-qr-live-video"
                style={{ display: cameraActive ? "block" : "none" }}
                muted
                playsInline
                aria-label="Live QR scanner camera preview"
              />
              {!cameraActive && (
                previewUrl ? (
                  <img src={previewUrl} alt="Selected QR code image preview" />
                ) : (
                  <span className="htg-qr-scan-symbol">▣</span>
                )
              )}
              <strong>{cameraActive ? "Live camera scanning…" : selectedFile ? selectedFile.name : "Scan QR Code"}</strong>
              <small>
                {cameraActive
                  ? "Move the QR code into view and hold it steady."
                  : selectedFile
                  ? "Image selected for preview"
                  : "Start the camera and align an official checkpoint QR code inside the frame."}
              </small>
            </div>

            <div className="htg-qr-camera-actions">
              {!cameraActive ? (
                <button type="button" className="htg-qr-live-button" onClick={startLiveScan}>
                  <span>◉</span> Start Live Scan
                </button>
              ) : (
                <button type="button" className="htg-qr-stop-button" onClick={stopLiveScan}>
                  Stop Camera
                </button>
              )}
            </div>

            {cameraError && <p className="htg-qr-message htg-qr-error" role="alert">{cameraError}</p>}

            {decodedValue && (
              <div className="htg-qr-result" role="status">
                <strong>QR detected</strong>
                <code>{decodedValue}</code>
                <small>Detection only — checkpoint validation and challenge loading must be handled by the backend.</small>
                {verifyResult && (
                  <div className={`htg-qr-verify-status ${verifyResult.success ? "success" : "error"}`}>
                    {verifyResult.message}
                  </div>
                )}
                <div style={{ display: "flex", gap: "10px", marginTop: "4px", flexWrap: "wrap", alignItems: "center" }}>
                  {isAuthenticated ? (
                    <button
                      type="button"
                      className="htg-qr-verify-btn"
                      onClick={handleVerifyWithServer}
                      disabled={verifying}
                    >
                      {verifying ? "Verifying..." : "Verify with Server →"}
                    </button>
                  ) : (
                    <Link
                      to={ROUTES.LOGIN}
                      className="htg-qr-verify-btn"
                      style={{ textDecoration: "none", display: "inline-block" }}
                    >
                      Login to Verify Checkpoint →
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setDecodedValue("");
                      setVerifyResult(null);
                      setScanMessage("Ready to scan another checkpoint.");
                    }}
                  >
                    Clear result
                  </button>
                </div>
              </div>
            )}

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
                  <p>Use Start Live Scan to open your camera, or upload an image.</p>
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
