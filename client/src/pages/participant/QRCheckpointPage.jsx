import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { useAuth } from "../../hooks/useAuth";
import { checkpointService } from "../../services/checkpoint.service";
import { ROUTES } from "../../constants/routes";
import Navbar from "../../components/navigation/Navbar";
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
  const { isAuthenticated } = useAuth();
  const fileInputRef = useRef(null);
  const scannerRef = useRef(null);
  const hasScannedRef = useRef(false);

  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [scanMessage, setScanMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [decodedValue, setDecodedValue] = useState("");
  const [cameraError, setCameraError] = useState("");

  // Server verification state
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);

  // Stop live scanner and safely release camera resources
  const stopLiveScan = useCallback(async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
      } catch (err) {
        console.warn("Notice: Html5Qrcode stop:", err);
      } finally {
        try {
          scannerRef.current.clear();
        } catch {
          // ignore cleanup errors
        }
        scannerRef.current = null;
      }
    }
    setCameraActive(false);
  }, []);

  // Enumerate cameras on mount if supported
  useEffect(() => {
    let isMounted = true;
    async function loadCameras() {
      if (navigator.mediaDevices?.enumerateDevices) {
        try {
          const devices = await Html5Qrcode.getCameras();
          if (isMounted && devices && devices.length > 0) {
            setCameras(devices);
            // Auto-select rear camera if available
            const rearCam = devices.find(
              (c) =>
                c.label.toLowerCase().includes("back") ||
                c.label.toLowerCase().includes("rear") ||
                c.label.toLowerCase().includes("environment")
            );
            if (rearCam) {
              setSelectedCameraId(rearCam.id);
            } else {
              setSelectedCameraId(devices[0].id);
            }
          }
        } catch {
          // Camera enumeration might fail before permissions are granted;
          // default behavior falls back to { facingMode: 'environment' }.
        }
      }
    }
    loadCameras();

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            scannerRef.current.stop().catch(() => {}).finally(() => {
              try { scannerRef.current?.clear(); } catch {}
              scannerRef.current = null;
            });
          } else {
            try { scannerRef.current.clear(); } catch {}
            scannerRef.current = null;
          }
        } catch {}
      }
    };
  }, []);

  // Start live scanning using Html5Qrcode
  const startLiveScan = useCallback(async () => {
    setCameraError("");
    setDecodedValue("");
    setVerifyResult(null);
    setScanMessage("");
    hasScannedRef.current = false;

    // Secure origin verification
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "::1";
    if (window.location.protocol !== "https:" && !isLocalhost) {
      setCameraError(
        "Camera access requires a secure connection (HTTPS or localhost). It is blocked by your browser on insecure HTTP origins."
      );
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(
        "Camera mediaDevices API is not available on this device or browser. You can use the upload image option instead."
      );
      return;
    }

    // Stop any running scanner first
    await stopLiveScan();

    try {
      setCameraActive(true);
      setSelectedFile(null);
      setPreviewUrl("");
      setScanMessage("Initializing camera. Align an official checkpoint QR code inside the frame...");

      // Allow a brief tick for the container element #htg-qr-reader to be mounted
      await new Promise((resolve) => setTimeout(resolve, 120));

      const scanner = new Html5Qrcode("htg-qr-reader");
      scannerRef.current = scanner;

      const config = {
        fps: 10,
        qrbox: (viewfinderWidth, viewfinderHeight) => {
          const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
          const size = Math.floor(minEdge * 0.75);
          return { width: size, height: size };
        },
        aspectRatio: 1.0,
      };

      // Camera selection strategy:
      // If a specific camera ID is selected, use it. Otherwise, prefer environment (rear) camera.
      const cameraConfig = selectedCameraId
        ? selectedCameraId
        : { facingMode: "environment" };

      await scanner.start(
        cameraConfig,
        config,
        (decodedText) => {
          // Prevent multiple callbacks for the same scan
          if (hasScannedRef.current) return;
          hasScannedRef.current = true;

          setDecodedValue(decodedText);
          setScanMessage("QR code detected! Verify this checkpoint with the event server before awarding points.");
          stopLiveScan();
        },
        () => {
          // Frame parse error happens continuously while searching for QR codes; ignore silently.
        }
      );

      setScanMessage("Camera is live. Hold the QR code steady inside the frame.");
    } catch (error) {
      await stopLiveScan();
      const errStr = String(error?.message || error || "");
      if (
        error?.name === "NotAllowedError" ||
        errStr.toLowerCase().includes("permission denied") ||
        errStr.toLowerCase().includes("notallowed")
      ) {
        setCameraError(
          "Camera permission was denied. Please allow camera access in your browser settings and try again."
        );
      } else if (
        error?.name === "NotFoundError" ||
        errStr.toLowerCase().includes("not found") ||
        errStr.toLowerCase().includes("devicesnotfound")
      ) {
        setCameraError("No camera was found on this device. You can use the image upload option instead.");
      } else if (error?.name === "NotReadableError" || errStr.toLowerCase().includes("in use")) {
        setCameraError("Camera is currently in use by another application or blocked by system permissions.");
      } else {
        setCameraError(`Could not start the camera: ${errStr || "Check camera permissions and try again."}`);
      }
    }
  }, [stopLiveScan, selectedCameraId]);

  // Handle image upload with file preview + instant QR decode attempt
  async function handleFileChange(event) {
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
    setScanMessage("Image preview ready. Scanning image for QR codes...");

    // Stop live camera if active
    if (cameraActive) {
      await stopLiveScan();
    }

    // Attempt decoding the uploaded image via Html5Qrcode
    try {
      const fileScanner = new Html5Qrcode("htg-qr-file-decoder");
      const decodedText = await fileScanner.scanFile(file, false);
      try { fileScanner.clear(); } catch {}
      if (decodedText) {
        setDecodedValue(decodedText);
        setScanMessage("QR code successfully detected in uploaded image! Verify with server below.");
      }
    } catch {
      // If scanFile couldn't decode, maintain preview and notify user
      setScanMessage("Image preview ready. No readable QR code detected in this file. Try another image or use Start Live Scan.");
    }
  }

  // Handle server-side checkpoint verification
  async function handleVerifyWithServer() {
    if (!decodedValue) return;

    const { code, token } = parseCheckpointPayload(decodedValue);
    if (!code) {
      setVerifyResult({
        success: false,
        message: "Scanned QR code does not contain a recognizable checkpoint code format."
      });
      return;
    }

    setVerifying(true);
    setVerifyResult(null);

    try {
      const res = await checkpointService.scanCheckpoint(code, token);
      setVerifyResult({
        success: true,
        message: res.message || `Checkpoint verified: ${res.data?.checkpoint?.name || code}. Level unlocked!`,
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
      <Navbar />

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

              {/* Cross-browser Html5Qrcode live viewfinder container */}
              <div
                id="htg-qr-reader"
                style={{ display: cameraActive ? "block" : "none" }}
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

            {/* Hidden container for file-based decoding */}
            <div id="htg-qr-file-decoder" style={{ display: "none" }} aria-hidden="true" />

            {/* Camera selector if multiple cameras detected */}
            {cameras.length > 1 && !cameraActive && (
              <div className="htg-qr-camera-picker">
                <label htmlFor="camera-select">Camera:</label>
                <select
                  id="camera-select"
                  value={selectedCameraId}
                  onChange={(e) => setSelectedCameraId(e.target.value)}
                  className="htg-qr-select"
                >
                  {cameras.map((cam) => (
                    <option key={cam.id} value={cam.id}>
                      {cam.label || `Camera ${cam.id}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
