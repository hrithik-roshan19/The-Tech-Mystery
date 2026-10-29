import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Link, useSearchParams, useParams, useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { useAuth } from "../../hooks/useAuth";
import { checkpointService } from "../../services/checkpoint.service";
import { challengeService } from "../../services/challenge.service";
import { teamService } from "../../services/team.service";
import { eventService } from "../../services/event.service";
import { ROUTES } from "../../constants/routes";
import Navbar from "../../components/navigation/Navbar";
import { ErrorBoundary } from "../../components/common/ErrorBoundary";
import "../../styles/QRCheckpointPage.css";


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
  if (!raw) return { code: "", token: "", questionId: "" };

  try {
    // 1. Try URL parsing
    if (raw.includes("?") || raw.startsWith("http://") || raw.startsWith("https://")) {
      const url = new URL(raw, window.location.origin);
      const code = url.searchParams.get("code") || url.searchParams.get("checkpointCode") || "";
      const token = url.searchParams.get("token") || "";
      const questionId = url.searchParams.get("qid") || url.searchParams.get("questionId") || "";
      if (code || token) return { code, token, questionId };
    }

    // 2. Try JSON parsing
    if (raw.trim().startsWith("{")) {
      const parsed = JSON.parse(raw);
      if (parsed.code || parsed.token) {
        return {
          code: parsed.code || parsed.checkpointCode || "",
          token: parsed.token || "",
          questionId: parsed.qid || parsed.questionId || ""
        };
      }
    }
  } catch {
    // fallback to string inspection
  }

  // 3. Fallback: treat as raw code
  return { code: raw.trim(), token: "", questionId: "" };
}

export function QRCheckpointPage() {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const { checkpointId: routeCheckpointId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const scannerRef = useRef(null);
  const hasScannedRef = useRef(false);

  const [activeTab, setActiveTab] = useState("camera"); // "camera" | "manual"
  const [manualCode, setManualCode] = useState("");
  const [manualToken, setManualToken] = useState("");

  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [scanMessage, setScanMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [decodedValue, setDecodedValue] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [team, setTeam] = useState(null);
  const [submissionFlag, setSubmissionFlag] = useState("");
  const [submittingFlag, setSubmittingFlag] = useState(false);
  const [solveResult, setSolveResult] = useState(null);
  const [checkingEventStatus, setCheckingEventStatus] = useState(false);
  const [eventStatusFeedback, setEventStatusFeedback] = useState("");

  const [missionMap, setMissionMap] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchTeamData() {
      if (isAuthenticated) {
        try {
          const res = await teamService.getMyTeam();
          if (isMounted && res.success && res.data?.team) {
            setTeam(res.data.team);
          }
        } catch {
          // ignore error
        }

        try {
          const mapRes = await challengeService.getMissionMap();
          if (isMounted && mapRes.success && Array.isArray(mapRes.data?.missionMap)) {
            setMissionMap(mapRes.data.missionMap);
          }
        } catch {
          // non-blocking
        }
      }
    }
    fetchTeamData();
    return () => { isMounted = false; };
  }, [isAuthenticated]);

  const checkpointItems = useMemo(() => {
    const curLevel = team?.currentLevel || 1;
    if (missionMap.length > 0) {
      return missionMap.map((m) => {
        const isCompleted = m.isSolved || curLevel > m.levelNumber;
        const isCurrent = m.isCurrent || curLevel === m.levelNumber;
        const status = isCompleted ? "completed" : isCurrent ? "pending" : "locked";
        const time = isCompleted ? "Completed" : isCurrent ? "Active Station" : "Locked";
        const points = isCompleted ? "Cleared" : `${m.points || 100} PTS`;
        return {
          id: m.checkpoint?.code || `CP-${String(m.levelNumber).padStart(2, '0')}`,
          name: m.checkpoint?.name || `Checkpoint Level ${m.levelNumber}`,
          location: m.checkpoint?.locationDescription || `Campus Station Level ${m.levelNumber}`,
          level: m.levelNumber,
          status,
          time,
          points
        };
      });
    }

    return Array.from({ length: 10 }, (_, i) => {
      const lvl = i + 1;
      const isCompleted = curLevel > lvl;
      const isCurrent = curLevel === lvl;
      return {
        id: `CP-${String(lvl).padStart(2, '0')}`,
        name: `Checkpoint Level ${lvl}`,
        location: `Campus Station Level ${lvl}`,
        level: lvl,
        status: isCompleted ? "completed" : isCurrent ? "pending" : "locked",
        time: isCompleted ? "Completed" : isCurrent ? "Active Station" : "Locked",
        points: isCompleted ? "Cleared" : "—"
      };
    });
  }, [team, missionMap]);

  // Server verification state
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);

  // Pre-fill and auto-verify from URL parameters or route params (e.g. /qr-checkpoint/:checkpointId or /checkpoint/scan?code=HTG-CP01&token=...)
  useEffect(() => {
    const codeParam = searchParams.get("code") || searchParams.get("checkpointCode");
    const tokenParam = searchParams.get("token");
    const qidParam = searchParams.get("qid") || searchParams.get("questionId");

    if (routeCheckpointId || codeParam) {
      const codeOrId = routeCheckpointId || (codeParam ? codeParam.trim().toUpperCase() : "");
      const cleanToken = tokenParam ? tokenParam.trim() : "";
      if (codeParam) setManualCode(codeParam.trim().toUpperCase());
      if (cleanToken) setManualToken(cleanToken);

      const raw = cleanToken
        ? `${window.location.origin}/checkpoint/scan?code=${encodeURIComponent(codeOrId)}&token=${encodeURIComponent(cleanToken)}`
        : codeOrId;
      setDecodedValue(raw);

      if (isAuthenticated) {
        setVerifying(true);
        checkpointService.scanCheckpoint(codeOrId, cleanToken, qidParam)
          .then((res) => {
            setVerifyResult({
              success: true,
              message: res.message || `Checkpoint verified: ${res.data?.checkpoint?.name || codeOrId}. Level unlocked!`,
              data: res.data
            });
            setScanMessage(`Checkpoint Station ${res.data?.checkpoint?.name || codeOrId} verified!`);
          })
          .catch((err) => {
            setVerifyResult({
              success: false,
              message: err.response?.data?.message || err.message || "Checkpoint verification rejected by server."
            });
          })
          .finally(() => {
            setVerifying(false);
          });
      } else {
        setScanMessage(`Checkpoint Station detected. Log in to authenticate and access your level question.`);
      }
    }
  }, [routeCheckpointId, searchParams, isAuthenticated]);

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

    const { code, token, questionId } = parseCheckpointPayload(decodedValue);
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
      const res = await checkpointService.scanCheckpoint(code, token, questionId);
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

  // Handle checking live event lifecycle status directly
  async function handleRecheckEventStatus() {
    setCheckingEventStatus(true);
    setEventStatusFeedback("");
    try {
      const res = await eventService.getEventStatus();
      const statusData = res?.data;
      if (statusData?.isLive) {
        setEventStatusFeedback("✓ Event is now LIVE! Verifying checkpoint station...");
        await handleVerifyWithServer();
      } else if (statusData?.state === "REGISTRATION_OPEN") {
        setEventStatusFeedback("Notice: Competition is still in REGISTRATION phase. Checkpoint scanning unlocks as soon as organizers transition the event to LIVE.");
      } else if (statusData?.state === "PAUSED") {
        setEventStatusFeedback("Notice: Competition is currently PAUSED by administrators. Checkpoint scanning will resume shortly.");
      } else if (statusData?.maintenanceMode) {
        setEventStatusFeedback("Notice: Event is currently undergoing maintenance. Checkpoint scanning will resume shortly.");
      } else {
        setEventStatusFeedback(`Current Event State: ${statusData?.state || "NOT LIVE"}. Gameplay unlocks when administrators start the live event.`);
      }
    } catch {
      await handleVerifyWithServer();
    } finally {
      setCheckingEventStatus(false);
    }
  }

  // Handle manual code entry verification
  async function handleManualVerify(e) {
    if (e) e.preventDefault();
    const cleanCode = manualCode.trim().toUpperCase();
    if (!cleanCode) {
      setVerifyResult({
        success: false,
        message: "Please enter a valid checkpoint station code (e.g., HTG-CP01)."
      });
      return;
    }

    setVerifying(true);
    setVerifyResult(null);

    try {
      const res = await checkpointService.scanCheckpoint(cleanCode, manualToken.trim());
      setVerifyResult({
        success: true,
        message: res.message || `Checkpoint verified: ${res.data?.checkpoint?.name || cleanCode}. Level unlocked!`,
        data: res.data
      });
      setScanMessage(`Station ${cleanCode} verified with event server!`);
    } catch (err) {
      setVerifyResult({
        success: false,
        message: err.response?.data?.message || err.message || "Checkpoint verification rejected by server."
      });
    } finally {
      setVerifying(false);
    }
  }

  // Handle inline answer submission for the unlocked question
  async function handleSubmitFlagInline(e) {
    if (e) e.preventDefault();
    const cleanFlag = String(submissionFlag).trim();
    const targetLevel = verifyResult?.data?.checkpoint?.levelNumber || team?.currentLevel || 1;
    const qid = verifyResult?.data?.question?._id || null;
    if (!cleanFlag) return;

    setSubmittingFlag(true);
    setSolveResult(null);

    try {
      const res = await challengeService.submitFlag(targetLevel, cleanFlag, qid);
      const isComplete = Boolean(res.data?.isLevelComplete);
      const nextQ = res.data?.nextQuestion;
      const nextCpLoc = res.data?.nextCheckpointLocation || res.data?.nextCheckpoint?.name;

      setSolveResult({
        success: true,
        message: res.message || (isComplete ? "Level completed! All questions conquered." : "Correct answer!"),
        pointsAwarded: res.data?.pointsAwarded,
        isLevelComplete: isComplete,
        isEventComplete: Boolean(res.data?.isEventComplete),
        nextCheckpointLocation: nextCpLoc,
        attemptsRemaining: res.data?.attemptsRemaining,
        maxAttempts: res.data?.maxAttempts
      });
      setSubmissionFlag("");

      // If more questions exist in this level, update verifyResult to show next question
      if (nextQ && verifyResult?.data) {
        setVerifyResult((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            question: nextQ,
            sequenceNumber: res.data?.sequenceNumber || ((prev.data.sequenceNumber || 1) + 1),
            solvedCount: res.data?.solvedQuestionsCount || ((prev.data.solvedCount || 0) + 1)
          }
        }));
      }

      // Refresh team data to update currentLevel and score
      const teamRes = await teamService.getMyTeam();
      if (teamRes.success && teamRes.data?.team) {
        setTeam(teamRes.data.team);
      }
    } catch (err) {
      const errData = err.response?.data;
      setSolveResult({
        success: false,
        message: errData?.message || err.message || "Incorrect answer. Try again.",
        attemptsRemaining: errData?.data?.attemptsRemaining,
        maxAttempts: errData?.data?.maxAttempts
      });
    } finally {
      setSubmittingFlag(false);
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
            <small>— The Tech Mystery 2026</small>
          </blockquote>
        </section>

        <section className="htg-qr-center-column">
          <div className="htg-qr-scanner-panel">
            <p className="htg-qr-panel-eyebrow">QR CHECKPOINT</p>
            <h2>Scan <span>the Code</span></h2>
            <p className="htg-qr-panel-subtitle">Find a QR code at a checkpoint and scan it to get your challenge.</p>

            {/* Mode Selector Tabs */}
            <div className="htg-qr-mode-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "camera"}
                className={`htg-qr-mode-tab ${activeTab === "camera" ? "is-active" : ""}`}
                onClick={() => setActiveTab("camera")}
              >
                <span>◉</span> Live Camera &amp; Upload
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "manual"}
                className={`htg-qr-mode-tab ${activeTab === "manual" ? "is-active" : ""}`}
                onClick={() => setActiveTab("manual")}
              >
                <span>⌨</span> Manual Code Entry
              </button>
            </div>

            {/* Tab 1: Live Camera & Upload */}
            {activeTab === "camera" && (
              <>
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
                    <strong>QR detected:</strong>
                    <code>{decodedValue}</code>
                    <small>Detected QR payload. Click below to authenticate your team with the event server.</small>
                    <div style={{ display: "flex", gap: "10px", marginTop: "4px", flexWrap: "wrap", alignItems: "center" }}>
                      {isAuthenticated ? (
                        <button
                          type="button"
                          className="htg-qr-verify-btn"
                          onClick={handleVerifyWithServer}
                          disabled={verifying}
                        >
                          {verifying ? "Verifying with Server..." : "Verify with Server →"}
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
              </>
            )}

            {/* Tab 2: Manual Code Entry */}
            {activeTab === "manual" && (
              <form onSubmit={handleManualVerify} className="htg-qr-manual-form">
                <div className="htg-qr-input-group">
                  <label htmlFor="manual-code-input">Checkpoint Station Code</label>
                  <input
                    id="manual-code-input"
                    type="text"
                    required
                    placeholder="e.g. HTG-CP01"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  />
                  <small style={{ color: "#a5b0a7", fontSize: "11px" }}>
                    Enter the code visible at the physical checkpoint banner or placard.
                  </small>
                </div>
                <div className="htg-qr-input-group">
                  <label htmlFor="manual-token-input">Security HMAC Token (Optional / From Placard)</label>
                  <input
                    id="manual-token-input"
                    type="text"
                    placeholder="e.g. 64-character token if printed on station"
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                  />
                </div>
                {isAuthenticated ? (
                  <button
                    type="submit"
                    className="htg-qr-manual-submit"
                    disabled={verifying || !manualCode.trim()}
                  >
                    {verifying ? "Authenticating Station..." : "Authenticate Checkpoint →"}
                  </button>
                ) : (
                  <Link
                    to={ROUTES.LOGIN}
                    className="htg-qr-manual-submit"
                    style={{ textDecoration: "none" }}
                  >
                    Login to Authenticate Checkpoint →
                  </Link>
                )}
              </form>
            )}

            {/* Error Feedback */}
            {verifyResult && !verifyResult.success && (
              <div className="htg-qr-verify-status error" style={{ marginTop: "14px" }} role="alert">
                <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                  <strong>⚠ Verification Failed: </strong>
                  <span>{verifyResult.message}</span>
                </div>
                {(verifyResult.message?.includes("LIVE") ||
                  verifyResult.message?.includes("registration") ||
                  verifyResult.message?.includes("paused") ||
                  verifyResult.message?.includes("maintenance")) && (
                  <div style={{ marginTop: "10px", fontSize: "11px", color: "#b0b8b2", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "8px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                    <span>Gameplay unlocks as soon as administrators transition the competition to LIVE state.</span>
                    <button
                      type="button"
                      onClick={handleRecheckEventStatus}
                      disabled={checkingEventStatus || verifying}
                      style={{
                        background: "rgba(184, 255, 61, 0.1)",
                        border: "1px solid rgba(184, 255, 61, 0.4)",
                        color: "var(--qr-lime, #b8ff3d)",
                        borderRadius: "4px",
                        padding: "3px 10px",
                        fontSize: "11px",
                        cursor: "pointer",
                        fontWeight: 600
                      }}
                    >
                      {checkingEventStatus ? "Checking Event Status..." : "↻ Recheck Event Status"}
                    </button>
                  </div>
                )}
                {eventStatusFeedback && (
                  <div
                    style={{
                      marginTop: "8px",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      fontSize: "11.5px",
                      background: eventStatusFeedback.includes("LIVE") ? "rgba(16, 185, 129, 0.15)" : "rgba(59, 130, 246, 0.15)",
                      border: eventStatusFeedback.includes("LIVE") ? "1px solid #10b981" : "1px solid rgba(59, 130, 246, 0.4)",
                      color: eventStatusFeedback.includes("LIVE") ? "#34d399" : "#93c5fd",
                      fontWeight: 500
                    }}
                  >
                    ℹ {eventStatusFeedback}
                  </div>
                )}
              </div>
            )}

            {/* Success Unlocked Station Card */}
            {verifyResult?.success && verifyResult.data && (
              <div className="htg-qr-unlocked-card" role="region" aria-label="Unlocked Station Information">
                <div className="htg-qr-unlocked-header">
                  <span className="htg-qr-unlocked-badge">
                    LEVEL {verifyResult.data.checkpoint?.levelNumber} UNLOCKED
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--qr-lime)", fontWeight: 700 }}>
                    {verifyResult.data.alreadyScanned ? "✓ Station Already Active" : "✓ Newly Authenticated"}
                  </span>
                </div>
                <h3 className="htg-qr-unlocked-title">
                  {verifyResult.data.checkpoint?.name}
                </h3>
                <div className="htg-qr-unlocked-loc">
                  <span>📍</span>
                  <span>{verifyResult.data.checkpoint?.locationDescription}</span>
                </div>

                {verifyResult.data.question && (
                  <div className="htg-qr-question-preview" style={{ marginTop: "12px", border: "1px solid rgba(184, 255, 61, 0.25)", borderRadius: "6px", padding: "14px", background: "rgba(10, 18, 10, 0.6)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
                      <strong style={{ fontSize: "15px", margin: 0, color: "#fff" }}>
                        {verifyResult.data.question.title}
                      </strong>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "10px", background: "rgba(184, 255, 61, 0.15)", color: "var(--qr-lime)", fontWeight: 700 }}>
                          {verifyResult.data.question.type || "Flag"}
                        </span>
                        <span style={{ fontSize: "11px", color: "var(--qr-lime)", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                          {verifyResult.data.question.points || 100} PTS · {verifyResult.data.question.difficulty || "MEDIUM"}
                        </span>
                      </div>
                    </div>

                    <p style={{ margin: "0 0 12px 0", opacity: 0.95, lineHeight: 1.6, whiteSpace: "pre-wrap", color: "#e2e8f0", fontSize: "13.5px" }}>
                      {verifyResult.data.question.prompt}
                    </p>

                    {verifyResult.data.question.instructions && (
                      <div style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "8px 12px", borderRadius: "4px", fontSize: "12px", marginBottom: "12px", color: "#93c5fd" }}>
                        <strong style={{ color: "#60a5fa" }}>INSTRUCTIONS: </strong>
                        {verifyResult.data.question.instructions}
                      </div>
                    )}

                    {verifyResult.data.question.hints?.[0]?.content && (
                      <div style={{ background: "rgba(255,255,255,0.03)", padding: "8px 10px", borderRadius: "4px", fontSize: "11px", marginBottom: "12px", borderLeft: "2px solid var(--qr-lime)" }}>
                        <span style={{ color: "var(--qr-lime)", fontWeight: 700 }}>HINT: </span>
                        {verifyResult.data.question.hints[0].content}
                      </div>
                    )}

                    {/* Multiple Choice Options Display */}
                    {verifyResult.data.question.type === "Multiple Choice" && Array.isArray(verifyResult.data.question.options) && verifyResult.data.question.options.length > 0 && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px", marginBottom: "14px" }}>
                        {verifyResult.data.question.options.map((option, optIdx) => (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => setSubmissionFlag(option)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              padding: "10px 14px",
                              background: submissionFlag === option ? "rgba(184, 255, 61, 0.15)" : "rgba(0, 0, 0, 0.4)",
                              border: submissionFlag === option ? "1px solid var(--qr-lime)" : "1px solid rgba(255, 255, 255, 0.12)",
                              borderRadius: "4px",
                              color: submissionFlag === option ? "var(--qr-lime)" : "#e2e8f0",
                              cursor: "pointer",
                              textAlign: "left",
                              transition: "all 0.15s ease"
                            }}
                          >
                            <span style={{
                              display: "inline-flex",
                              width: "22px",
                              height: "22px",
                              borderRadius: "50%",
                              background: submissionFlag === option ? "var(--qr-lime)" : "rgba(255, 255, 255, 0.1)",
                              color: submissionFlag === option ? "#051105" : "#fff",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "11px",
                              fontWeight: 700
                            }}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span style={{ fontSize: "13px" }}>{option}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Solve Result Notice */}
                    {solveResult && (
                      <div
                        style={{
                          padding: "10px",
                          borderRadius: "4px",
                          marginBottom: "12px",
                          fontSize: "12px",
                          fontWeight: 600,
                          background: solveResult.success ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                          border: solveResult.success ? "1px solid #10b981" : "1px solid #ef4444",
                          color: solveResult.success ? "#10b981" : "#fca5a5"
                        }}
                        role="alert"
                      >
                        <div>
                          {solveResult.success ? "✓ " : "⚠ "}
                          {solveResult.message}
                        </div>
                        {solveResult.attemptsRemaining !== undefined && !solveResult.success && (
                          <div style={{ marginTop: "4px", fontSize: "11px", opacity: 0.9 }}>
                            Attempts Remaining: {solveResult.attemptsRemaining} of {solveResult.maxAttempts || 3}
                          </div>
                        )}
                        {solveResult.isLevelComplete && solveResult.nextCheckpointLocation && (
                          <div style={{
                            marginTop: "8px",
                            padding: "8px 10px",
                            borderRadius: "4px",
                            background: "rgba(6, 182, 212, 0.2)",
                            border: "1px solid #06b6d4",
                            color: "#67e8f9",
                            fontSize: "12px",
                            fontWeight: 700
                          }}>
                            📍 NEXT CHECKPOINT: {solveResult.nextCheckpointLocation}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Answer Submission Form */}
                    {isAuthenticated ? (
                      <form onSubmit={handleSubmitFlagInline} style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          {verifyResult.data.question.type === "Numeric Answer" ? (
                            <input
                              type="number"
                              step="any"
                              required
                              value={submissionFlag}
                              onChange={(e) => setSubmissionFlag(e.target.value)}
                              placeholder="Enter numeric answer (e.g. 42)"
                              style={{
                                flex: 1,
                                background: "rgba(0,0,0,0.5)",
                                border: "1px solid rgba(255,255,255,0.2)",
                                borderRadius: "4px",
                                padding: "10px 12px",
                                color: "#fff",
                                fontFamily: "var(--font-mono)",
                                fontSize: "13px"
                              }}
                            />
                          ) : (
                            <input
                              type="text"
                              required
                              value={submissionFlag}
                              onChange={(e) => setSubmissionFlag(e.target.value)}
                              placeholder={
                                verifyResult.data.question.type === "Multiple Choice"
                                  ? "Select an option above or enter option (A, B, C, D)"
                                  : verifyResult.data.question.type === "Text Answer" || verifyResult.data.question.type === "Short Text"
                                  ? (verifyResult.data.question.isCaseSensitive ? "Enter text answer (case-sensitive)" : "Enter text answer (case-insensitive)")
                                  : "HTG{flag_here}"
                              }
                              style={{
                                flex: 1,
                                background: "rgba(0,0,0,0.5)",
                                border: "1px solid rgba(255,255,255,0.2)",
                                borderRadius: "4px",
                                padding: "10px 12px",
                                color: "#fff",
                                fontFamily: verifyResult.data.question.type === "Flag" ? "var(--font-mono)" : "inherit",
                                fontSize: "13px"
                              }}
                            />
                          )}
                          <button
                            type="submit"
                            disabled={submittingFlag || !submissionFlag.trim() || solveResult?.success}
                            style={{
                              background: solveResult?.success ? "rgba(16, 185, 129, 0.4)" : "var(--qr-lime)",
                              color: solveResult?.success ? "#fff" : "#051105",
                              border: "none",
                              borderRadius: "4px",
                              padding: "10px 18px",
                              fontWeight: 700,
                              fontSize: "12px",
                              cursor: solveResult?.success ? "default" : "pointer",
                              letterSpacing: "0.05em",
                              whiteSpace: "nowrap"
                            }}
                          >
                            {submittingFlag ? "VERIFYING..." : solveResult?.success ? "SOLVED ✓" : "SUBMIT ANSWER →"}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <Link
                        to={ROUTES.LOGIN}
                        style={{
                          display: "inline-block",
                          color: "var(--qr-lime)",
                          fontSize: "12px",
                          textDecoration: "underline",
                          marginTop: "8px"
                        }}
                      >
                        Log in with team account to submit your answer
                      </Link>
                    )}
                  </div>
                )}

                <div className="htg-qr-points-notice" style={{ marginTop: "12px" }}>
                  ℹ First-Come-First-Served QR question active. Submit your flag directly above or open the full terminal console.
                </div>

                <div className="htg-qr-unlocked-actions">
                  <Link to="/portal/challenge" className="htg-qr-proceed-btn">
                    OPEN TERMINAL CHALLENGE →
                  </Link>
                  <Link to={ROUTES.CHALLENGES} className="htg-qr-secondary-btn">
                    VIEW MISSION MAP
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setVerifyResult(null);
                      setDecodedValue("");
                      setManualCode("");
                      setManualToken("");
                      setSolveResult(null);
                      setSubmissionFlag("");
                      setScanMessage("Ready for next checkpoint scan.");
                    }}
                    style={{ background: "transparent", border: "none", color: "#b0b8b2", fontSize: "11px", cursor: "pointer", textDecoration: "underline" }}
                  >
                    Clear &amp; Scan Another
                  </button>
                </div>
              </div>
            )}

            {scanMessage && !verifyResult && <p className="htg-qr-message" role="status">{scanMessage}</p>}
          </div>

          <section className="htg-qr-recent-panel">
            <div className="htg-qr-panel-heading">
              <h2>Recent Checkpoints <small style={{ fontSize: "10px", color: "#8a968c", fontWeight: 400 }}>Station Status</small></h2>
              <Link to={ROUTES.CHALLENGES}>View All <span>→</span></Link>
            </div>
            <div className="htg-qr-checkpoint-grid">
              {checkpointItems.map((cp) => (
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

export default function QRCheckpointPageWrapper(props) {
  return (
    <ErrorBoundary title="CHECKPOINT SCANNER EXCEPTION // CONTAINED">
      <QRCheckpointPage {...props} />
    </ErrorBoundary>
  );
}
