import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import adminService from "../../services/admin.service";
import AdminSidebar from "../../components/navigation/AdminSidebar";
import "../../styles/QRCheckpointManagementPage.css";


const fallbackChallenges = [
  "The Starting Point",
  "Hidden in Plain Sight",
  "Lost Transmission",
  "System Breach",
  "Digital Forensics",
  "Privilege Escalation",
  "Encrypted Shadows",
  "The Insider",
  "Lateral Movement",
  "The Final Grid",
];

const statuses = ["Active", "Paused", "Draft"];
const statusClass = (value) => (value || "").toLowerCase().replace(/\s+/g, "-");

const blankCheckpoint = {
  name: "",
  code: "",
  level: 1,
  challenge: "The Starting Point",
  location: "",
  nextLocationName: "",
  locationInstructions: "",
  status: "Draft",
  mode: "Team-bound QR",
  notes: "",
  scans: 0,
  teams: 0,
  lastScan: "—",
  token: "",
};

/**
 * Genuine Scannable QR Code Component
 * Encodes the canonical scan URL using standard qrcode package.
 */
function ScannableQrImage({ value, size = 100, className = "" }) {
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    let isMounted = true;
    if (!value) { setDataUrl(""); return; }

    QRCode.toDataURL(value, {
      margin: 1,
      width: size * 2,
      errorCorrectionLevel: "M",
      color: {
        dark: "#101610",
        light: "#ffffff",
      },
    })
      .then((url) => {
        if (isMounted) setDataUrl(url);
      })
      .catch((err) => {
        console.error("QR generation error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div
        className={`qrcm-qr-placeholder ${className}`}
        style={{ width: size, height: size, background: "#fff", borderRadius: 4 }}
      />
    );
  }

  return (
    <img
      src={dataUrl}
      alt={`Scannable QR: ${value}`}
      className={className}
      style={{ width: size, height: size, display: "block" }}
    />
  );
}

export default function QRCheckpointManagementPage() {
  const { user, isAuthenticated } = useAuth();
  const [checkpoints, setCheckpoints] = useState([]);
  const [challenges, setChallenges] = useState(fallbackChallenges);
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [modeFilter, setModeFilter] = useState("All Modes");
  const [view, setView] = useState("table");
  const [notice, setNotice] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(blankCheckpoint);
  const [isLiveDb, setIsLiveDb] = useState(false);
  const [dbBannerDismissed, setDbBannerDismissed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [printTarget, setPrintTarget] = useState(null);

  // Compute canonical scan URL for a checkpoint
  const getScanUrl = useCallback((cp) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://hackthegrid.codesphere.org";
    const token = cp?.token || cp?.hmacToken || "";
    if (!token) return "";
    return `${origin}/checkpoint/scan?code=${encodeURIComponent(cp?.code || "HTG-CP01")}&token=${encodeURIComponent(token)}`;
  }, []);

  // Map server checkpoint record to UI state
  const mapServerCheckpoint = useCallback((cp, index) => {
    const code = cp.checkpointCode || cp.code || `HTG-CP${String(index + 1).padStart(2, "0")}`;
    const token = cp.hmacToken || cp.token || "";
    const cpId = `CP-${String(cp.levelNumber || index + 1).padStart(2, "0")}`;

    const challengeTitle =
      cp.associatedChallengeId?.title ||
      fallbackChallenges[(cp.levelNumber || 1) - 1] ||
      `Level ${cp.levelNumber || 1}`;

    const lastScanFormatted = cp.lastScanAt
      ? new Date(cp.lastScanAt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : cp.lastScan || "—";

    return {
      _mongoId: cp._id,
      id: cpId,
      name: cp.name || `Checkpoint Level ${cp.levelNumber}`,
      code: code,
      level: Number(cp.levelNumber || index + 1),
      challenge: challengeTitle,
      challengeId: cp.associatedChallengeId?._id || cp.associatedChallengeId,
      location: cp.locationDescription || cp.location || "Campus Venue",
      status: cp.status || (cp.isActive ? "Active" : "Paused"),
      mode: cp.mode || "Team-bound QR",
      scans: Number(cp.scanCount ?? cp.scans ?? 0),
      teams: Number(cp.teamsCount ?? cp.teams ?? 0),
      lastScan: lastScanFormatted,
      notes: cp.notes || "",
      nextLocationName: cp.nextLocationName || "",
      locationInstructions: cp.locationInstructions || "",
      token: token,
      qrCodeDataUrl: cp.qrCodeDataUrl || null,
      qrScanUrl: cp.qrScanUrl || null,
      isDemo: false,
    };
  }, []);

  // Fetch live checkpoints from backend API
  const fetchCheckpoints = useCallback(async () => {
    if (!isAuthenticated || user?.role !== "ADMIN") {
      setIsLiveDb(false);
      return;
    }

    setLoading(true);
    try {
      const [checkpointsRes, challengesRes] = await Promise.allSettled([
        adminService.getCheckpoints(),
        adminService.getChallenges(),
      ]);

      if (
        challengesRes.status === "fulfilled" &&
        challengesRes.value?.data?.challenges
      ) {
        const titles = challengesRes.value.data.challenges
          .map((c) => c.title)
          .filter(Boolean);
        if (titles.length > 0) setChallenges(titles);
      }

      if (
        checkpointsRes.status === "fulfilled" &&
        checkpointsRes.value?.data?.checkpoints
      ) {
        const liveCheckpoints = checkpointsRes.value.data.checkpoints;
        if (liveCheckpoints.length > 0) {
          const mapped = liveCheckpoints.map((cp, idx) => mapServerCheckpoint(cp, idx));
          setCheckpoints(mapped);
          setIsLiveDb(true);
          setSelectedId((prev) =>
            mapped.some((m) => m.id === prev) ? prev : mapped[0]?.id || "CP-01"
          );
        } else {
          setCheckpoints([]);
          setIsLiveDb(true);
        }
      } else {
        setIsLiveDb(false);
      }
    } catch {
      setIsLiveDb(false);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, mapServerCheckpoint]);

  useEffect(() => {
    fetchCheckpoints();
  }, [fetchCheckpoints]);

  // Checkpoint Locations & Routing State
  const [locations, setLocations] = useState(() =>
    Array.from({ length: 10 }, (_, i) => ({
      levelNumber: i + 1,
      checkpointCode: `HTG-CP${String(i + 1).padStart(2, "0")}`,
      checkpointName: `Level ${i + 1} Station`,
      currentLocation: i === 0 ? "Main Campus Entrance" : `Station Level ${i + 1}`,
      nextLocationName: i === 9 ? "" : `Campus Zone ${i + 2}`,
      locationInstructions: "",
      isFinalLevel: i === 9,
    }))
  );
  const [savingLocationLevel, setSavingLocationLevel] = useState(null);
  const [routingError, setRoutingError] = useState("");
  const [routingSuccess, setRoutingSuccess] = useState("");

  const fetchLocations = useCallback(async () => {
    if (!isAuthenticated || user?.role !== "ADMIN") return;
    try {
      const res = await adminService.getCheckpointLocations();
      if (res?.data?.locations && Array.isArray(res.data.locations) && res.data.locations.length > 0) {
        setLocations(res.data.locations);
      }
    } catch (err) {
      console.error("Failed to load checkpoint locations", err);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleLocationChange = (lvlNum, field, value) => {
    setLocations((prev) =>
      prev.map((loc) =>
        loc.levelNumber === lvlNum ? { ...loc, [field]: value } : loc
      )
    );
  };

  const handleUpdateLocation = async (lvlNum) => {
    setRoutingError("");
    setRoutingSuccess("");
    const target = locations.find((l) => l.levelNumber === lvlNum);
    const nextName = target?.nextLocationName ? String(target.nextLocationName).trim() : "";
    const instructions = target?.locationInstructions ? String(target.locationInstructions).trim() : "";

    if (lvlNum < 10 && !nextName) {
      setRoutingError(`Level ${lvlNum} requires a next location name before saving.`);
      return;
    }

    setSavingLocationLevel(lvlNum);
    try {
      const res = await adminService.updateCheckpointLocation(lvlNum, {
        nextLocationName: nextName,
        locationInstructions: instructions || null,
      });
      setRoutingSuccess(
        `Level ${lvlNum} routing saved: Next location is "${res.data?.nextLocationName || nextName}".`
      );
      await Promise.all([fetchLocations(), fetchCheckpoints()]);
    } catch (err) {
      setRoutingError(err.response?.data?.message || err.message || "Failed to update routing location.");
    } finally {
      setSavingLocationLevel(null);
    }
  };

  const selected =
    checkpoints.find((item) => item.id === selectedId) || checkpoints[0] || null;

  const filtered = useMemo(
    () =>
      checkpoints.filter((item) => {
        const term = search.trim().toLowerCase();
        const matchesSearch =
          !term ||
          [item.id, item.name, item.code, item.challenge, item.location].some(
            (value) => String(value || "").toLowerCase().includes(term)
          );
        return (
          matchesSearch &&
          (statusFilter === "All Status" || item.status === statusFilter) &&
          (modeFilter === "All Modes" || item.mode === modeFilter)
        );
      }),
    [checkpoints, search, statusFilter, modeFilter]
  );

  const active = checkpoints.filter((item) => item.status === "Active").length;
  const drafts = checkpoints.filter((item) => item.status === "Draft").length;
  const paused = checkpoints.filter((item) => item.status === "Paused").length;
  const totalScans = checkpoints.reduce(
    (sum, item) => sum + Number(item.scans || 0),
    0
  );

  const handleDownloadQr = (item) => {
    if (!item) return;
    const isObsoleteDataUrl = item.qrScanUrl && item.qrScanUrl.includes("localhost");
    if (item.qrCodeDataUrl && !isObsoleteDataUrl) {
      const link = document.createElement("a");
      link.href = item.qrCodeDataUrl;
      link.download = `HTG-Checkpoint-${item.code}.png`;
      link.click();
      setNotice(`Downloaded QR code for station ${item.code}.`);
      return;
    }

    const url = getScanUrl(item);
    if (!url) {
      setNotice("No token available to generate QR download.");
      return;
    }

    QRCode.toDataURL(url, { width: 600, margin: 2, errorCorrectionLevel: "H" })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `HTG-Checkpoint-${item.code}.png`;
        link.click();
        setNotice(`Generated and downloaded QR code for station ${item.code}.`);
      })
      .catch((err) => {
        setNotice(`Failed to generate QR download: ${err.message}`);
      });
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All Status");
    setModeFilter("All Modes");
  };

  const openCreate = () => {
    setEditingId(null);
    const nextNum = checkpoints.length + 1;
    setDraft({
      ...blankCheckpoint,
      code: `HTG-CP${String(nextNum).padStart(2, "0")}`,
      token: "",
    });
    setShowEditor(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setDraft({ ...item });
    setShowEditor(true);
  };

  const saveCheckpoint = async (event) => {
    event.preventDefault();
    if (!draft.name.trim() || !draft.location.trim() || !draft.code.trim()) {
      setNotice("Checkpoint name, code and location are required.");
      return;
    }

    if (isLiveDb || (isAuthenticated && user?.role === "ADMIN")) {
      try {
        const payload = {
          name: draft.name.trim(),
          code: draft.code.trim().toUpperCase(),
          levelNumber: Number(draft.level),
          challenge: draft.challenge,
          locationDescription: draft.location.trim(),
          nextLocationName: draft.nextLocationName ? draft.nextLocationName.trim() : null,
          locationInstructions: draft.locationInstructions ? draft.locationInstructions.trim() : null,
          status: draft.status,
          mode: draft.mode,
          notes: draft.notes ? draft.notes.trim() : "",
        };

        if (editingId) {
          const target = checkpoints.find((c) => c.id === editingId);
          if (target?._mongoId) {
            await adminService.updateCheckpoint(target._mongoId, payload);
            setNotice(`Checkpoint ${editingId} updated in live database.`);
          }
        } else {
          await adminService.createCheckpoint(payload);
          setNotice("New checkpoint persisted to live database.");
        }
        await Promise.all([fetchCheckpoints(), fetchLocations()]);
      } catch (err) {
        setNotice(`API Error: ${err.response?.data?.message || err.message}`);
      }
    } else {
      // Local state update fallback
      if (editingId) {
        setCheckpoints((items) =>
          items.map((item) =>
            item.id === editingId
              ? { ...item, ...draft, level: Number(draft.level) }
              : item
          )
        );
        setSelectedId(editingId);
        setNotice(
          "Checkpoint updated in local demo state. Connect authenticated admin session for live database synchronization."
        );
      } else {
        const next =
          checkpoints.reduce(
            (max, item) => Math.max(max, Number(item.id.split("-")[1]) || 0),
            0
          ) + 1;
        const id = `CP-${String(next).padStart(2, "0")}`;
        const created = {
          ...draft,
          id,
          level: Number(draft.level),
          scans: 0,
          teams: 0,
          lastScan: "—",
          isDemo: false,
        };
        setCheckpoints((items) => [...items, created]);
        setSelectedId(id);
        setNotice(
          "Checkpoint created in local demo state. Connect authenticated admin session for live database synchronization."
        );
      }
    }
    setShowEditor(false);
  };

  const toggleStatus = async (item) => {
    const nextStatus = item.status === "Active" ? "Paused" : "Active";

    if (isLiveDb && item._mongoId) {
      try {
        await adminService.updateCheckpoint(item._mongoId, {
          status: nextStatus,
          isActive: nextStatus === "Active",
        });
        setNotice(`Checkpoint ${item.name} set to ${nextStatus} in live database.`);
        await fetchCheckpoints();
        return;
      } catch (err) {
        setNotice(`Error: ${err.response?.data?.message || err.message}`);
      }
    }

    setCheckpoints((items) =>
      items.map((checkpoint) =>
        checkpoint.id === item.id ? { ...checkpoint, status: nextStatus } : checkpoint
      )
    );
    setNotice(
      `${item.name} set to ${nextStatus} in local demo state. Connect live database to persist.`
    );
  };

  const exportCsv = () => {
    const rows = [
      [
        "ID",
        "Name",
        "Code",
        "Level",
        "Challenge",
        "Location",
        "Mode",
        "Status",
        "Scans",
        "Teams",
        "Scan_URL",
      ],
      ...filtered.map((item) => [
        item.id,
        item.name,
        item.code,
        item.level,
        item.challenge,
        item.location,
        item.mode,
        item.status,
        item.scans,
        item.teams,
        getScanUrl(item),
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `the-tech-mystery-checkpoints-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice(`Exported ${filtered.length} checkpoints to CSV.`);
  };

  // Download high-resolution scannable placard
  const downloadPlacard = async () => {
    try {
      const scanUrl = getScanUrl(selected);
      if (!scanUrl) {
        setNotice("A server-issued signed QR is required. Configure team binding or public mode, then reload checkpoints.");
        return;
      }
      const qrDataUrl = await QRCode.toDataURL(scanUrl, {
        margin: 2,
        width: 320,
        errorCorrectionLevel: "H",
        color: { dark: "#070b09", light: "#ffffff" },
      });

      // Render placard canvas
      const canvas = document.createElement("canvas");
      canvas.width = 460;
      canvas.height = 620;
      const ctx = canvas.getContext("2d");

      // Background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dark header band
      ctx.fillStyle = "#070c09";
      ctx.fillRect(0, 0, canvas.width, 90);

      // Header branding
      ctx.fillStyle = "#b8ff3d";
      ctx.font = "bold 15px 'DM Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("THE TECH MYSTERY 2026 // QR CHECKPOINT", canvas.width / 2, 36);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px 'Manrope', sans-serif";
      ctx.fillText(selected.name.toUpperCase(), canvas.width / 2, 68);

      // Draw QR image
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, (canvas.width - 300) / 2, 115, 300, 300);

        // Details below QR
        ctx.fillStyle = "#070c09";
        ctx.font = "bold 16px 'DM Mono', monospace";
        ctx.fillText(`CODE: ${selected.code}  |  LEVEL: ${selected.level}`, canvas.width / 2, 450);

        ctx.fillStyle = "#4a594d";
        ctx.font = "13px 'Manrope', sans-serif";
        ctx.fillText(`Challenge: ${selected.challenge}`, canvas.width / 2, 480);
        ctx.fillText(`Location: ${selected.location}`, canvas.width / 2, 505);

        // Security border & notice
        ctx.strokeStyle = "#b8ff3d";
        ctx.lineWidth = 3;
        ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);

        ctx.fillStyle = "#1b2a20";
        ctx.fillRect(20, 535, canvas.width - 40, 55);
        ctx.fillStyle = "#b8ff3d";
        ctx.font = "11px 'DM Mono', monospace";
        ctx.fillText("SCAN WITH MOBILE CAMERA OR IN-APP SCANNER", canvas.width / 2, 556);
        ctx.fillStyle = "#ffffff";
        ctx.font = "10px 'Manrope', sans-serif";
        ctx.fillText("Do not relocate placard. Tampering leads to team disqualification.", canvas.width / 2, 574);

        const a = document.createElement("a");
        a.download = `HTG-Placard-${selected.code}.png`;
        a.href = canvas.toDataURL("image/png");
        a.click();
        setNotice(`High-resolution scannable placard for ${selected.code} downloaded!`);
      };
      img.src = qrDataUrl;
    } catch (err) {
      setNotice(`Failed to generate printable placard: ${err.message}`);
    }
  };

  const copyScanUrl = () => {
    const url = getScanUrl(selected);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setNotice(`Copied scannable URL for ${selected.code} to clipboard.`);
    } else {
      setNotice(`Scan URL: ${url}`);
    }
  };

  const adminName = user?.fullName || user?.username || "Event Admin";

  return (
    <div className="qrcm-page">
      {/* Shared Mission Control Sidebar */}
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <main className="qrcm-main">
        {/* Topbar */}
        <header className="qrcm-topbar">
          <button
            type="button"
            className="htg-mobile-menu-btn"
            aria-label="Open navigation menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            ☰
          </button>
          <div className="qrcm-global-search">
            <span>⌕</span>
            <input
              aria-label="Global search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search checkpoints, teams, challenges..."
            />
            <kbd>Ctrl + K</kbd>
          </div>
          <button className="qrcm-icon-button" aria-label="Notifications">
            ♧<i />
          </button>
          <Link to={ROUTES.ADMIN_DASHBOARD} className="qrcm-admin-chip">
            <span className="qrcm-avatar">
              {(adminName || "A").slice(0, 1).toUpperCase()}
            </span>
            <span>
              <strong>{adminName}</strong>
              <small>Administrator</small>
            </span>
            <span>⌄</span>
          </Link>
        </header>

        {/* Hero Section */}
        <section className="qrcm-hero">
          <div className="qrcm-breadcrumb">
            Admin <span>›</span> QR Checkpoints
            <span className="qrcm-data-pill live">● LIVE DATABASE</span>
          </div>
          <div className="qrcm-heading-row">
            <div>
              <h1>
                QR Checkpoints <em>Management</em>
              </h1>
              <p>
                Create checkpoint stations, map them to challenges and monitor
                scan activity.
              </p>
            </div>
            <div className="qrcm-hero-actions">
              <button
                type="button"
                className="qrcm-outline-button"
                onClick={exportCsv}
              >
                ⇩ Export
              </button>
              <button
                type="button"
                className="qrcm-primary-button"
                onClick={openCreate}
              >
                ＋ Create Checkpoint
              </button>
            </div>
          </div>
        </section>

        

        {notice && (
          <div className="qrcm-notice" role="status">
            <span>{notice}</span>
            <button onClick={() => setNotice("")} aria-label="Dismiss notice">
              ×
            </button>
          </div>
        )}

        {/* Stat Cards */}
        <section className="qrcm-stats">
          <article>
            <span className="qrcm-stat-icon lime">▦</span>
            <div>
              <strong>{checkpoints.length}</strong>
              <small>Total Checkpoints</small>
            </div>
            <div className="qrcm-meter">
              <i
                style={{
                  width: `${Math.min(100, checkpoints.length * 10)}%`,
                }}
              />
            </div>
          </article>
          <article>
            <span className="qrcm-stat-icon lime">◉</span>
            <div>
              <strong>{active}</strong>
              <small>Active</small>
            </div>
            <div className="qrcm-meter">
              <i
                style={{
                  width: `${
                    checkpoints.length ? (active / checkpoints.length) * 100 : 0
                  }%`,
                }}
              />
            </div>
          </article>
          <article>
            <span className="qrcm-stat-icon amber">◷</span>
            <div>
              <strong>{drafts}</strong>
              <small>Drafts</small>
            </div>
            <div className="qrcm-meter amber">
              <i
                style={{
                  width: `${
                    checkpoints.length ? (drafts / checkpoints.length) * 100 : 0
                  }%`,
                }}
              />
            </div>
          </article>
          <article>
            <span className="qrcm-stat-icon muted">Ⅱ</span>
            <div>
              <strong>{paused}</strong>
              <small>Paused</small>
            </div>
            <div className="qrcm-meter muted">
              <i
                style={{
                  width: `${
                    checkpoints.length ? (paused / checkpoints.length) * 100 : 0
                  }%`,
                }}
              />
            </div>
          </article>
          <article>
            <span className="qrcm-stat-icon purple">⌁</span>
            <div>
              <strong>{totalScans}</strong>
              <small>Total Scans</small>
            </div>
            <div className="qrcm-meter purple">
              <i style={{ width: "68%" }} />
            </div>
          </article>
        </section>

        {/* Toolbar */}
        <section className="qrcm-toolbar">
          <label className="qrcm-search">
            <span>⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search checkpoint, code, challenge or location..."
            />
          </label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter status"
          >
            <option>All Status</option>
            {statuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={modeFilter}
            onChange={(event) => setModeFilter(event.target.value)}
            aria-label="Filter QR mode"
          >
            <option>All Modes</option>
            <option>Public QR</option>
            <option>Team-bound QR</option>
          </select>
          <button
            type="button"
            className="qrcm-reset"
            onClick={resetFilters}
          >
            Reset
          </button>
          <div className="qrcm-spacer" />
          <div className="qrcm-view-toggle">
            <button
              type="button"
              className={view === "table" ? "selected" : ""}
              onClick={() => setView("table")}
              aria-label="Table view"
              title="Table view"
            >
              ☷
            </button>
            <button
              type="button"
              className={view === "grid" ? "selected" : ""}
              onClick={() => setView("grid")}
              aria-label="Grid view"
              title="Grid view"
            >
              ▦
            </button>
          </div>
        </section>

        {/* Content Area */}
        <section className="qrcm-content">
          <div className="qrcm-list">
            {view === "table" ? (
              <div className="qrcm-table-wrap">
                <table className="qrcm-table">
                  <thead>
                    <tr>
                      <th>Checkpoint</th>
                      <th>Challenge / Level</th>
                      <th>Location</th>
                      <th>QR Mode</th>
                      <th>Scans</th>
                      <th>Status</th>
                      <th>Last Scan</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className={selectedId === item.id ? "selected-row" : ""}
                      >
                        <td>
                          <div className="qrcm-name-cell">
                            <span className="qrcm-mini-qr">
                              <ScannableQrImage
                                value={getScanUrl(item)}
                                size={32}
                              />
                            </span>
                            <span>
                              <strong>{item.name}</strong>
                              <small>
                                {item.id} · {item.code}
                              </small>
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="qrcm-challenge">{item.challenge}</span>
                          <small className="qrcm-level">Level {item.level}</small>
                        </td>
                        <td>
                          <span className="qrcm-location">⌖ {item.location}</span>
                        </td>
                        <td>
                          <span className="qrcm-mode-chip">{item.mode}</span>
                        </td>
                        <td>
                          <span className="qrcm-scan-count">{item.scans}</span>
                          <small className="qrcm-team-count">
                            {item.teams} teams
                          </small>
                        </td>
                        <td>
                          <span
                            className={`qrcm-status ${statusClass(item.status)}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td>{item.lastScan}</td>
                        <td>
                          <button
                            type="button"
                            className="qrcm-row-action"
                            title="Download QR code"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDownloadQr(item);
                            }}
                          >
                            ⇩ QR
                          </button>
                          <button
                            type="button"
                            className="qrcm-row-action"
                            title="Print Station Beacon"
                            onClick={(event) => {
                              event.stopPropagation();
                              setPrintTarget(item);
                            }}
                          >
                            ⎙
                          </button>
                          <button
                            type="button"
                            className="qrcm-row-action"
                            title="Edit checkpoint"
                            onClick={(event) => {
                              event.stopPropagation();
                              openEdit(item);
                            }}
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            className="qrcm-row-action"
                            title="Toggle status"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleStatus(item);
                            }}
                          >
                            {item.status === "Active" ? "⏸" : "▶"}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan="8" className="qrcm-empty">
                          No checkpoints match these filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="qrcm-cards">
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`qrcm-card ${
                      selectedId === item.id ? "chosen" : ""
                    }`}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <div className="qrcm-card-top">
                      <ScannableQrImage
                        value={getScanUrl(item)}
                        size={48}
                      />
                      <span
                        className={`qrcm-status ${statusClass(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <small>
                      {item.id} · LEVEL {item.level}
                    </small>
                    <strong>{item.name}</strong>
                    <span>{item.challenge}</span>
                    <p>⌖ {item.location}</p>
                    <div className="qrcm-card-bottom">
                      <span>{item.scans} scans</span>
                      <span>{item.mode}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <footer className="qrcm-table-footer">
              <span>
                Showing {filtered.length ? 1 : 0}–{filtered.length} of{" "}
                {filtered.length} checkpoints
              </span>
              <div>
                <button disabled>‹</button>
                <button className="current">1</button>
                <button disabled>›</button>
              </div>
            </footer>
          </div>

          {/* Right Detail Inspector Panel */}
          <aside className="qrcm-detail">
          {!selected ? (
            <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--htg-text-secondary, #94a3b8)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px", opacity: 0.3 }}>📍</div>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "8px", color: "var(--htg-text-primary, #ffffff)" }}>No Checkpoint Selected</h3>
              <p style={{ fontSize: "0.85rem", lineHeight: "1.4" }}>
                Select a checkpoint from the list to view its configuration, station token, and scannable QR code.
              </p>
            </div>
          ) : (
            <div className="qrcm-detail-card">
              <div className="qrcm-detail-header">
                <div>
                  <small>STATION DETAILS</small>
                  <h2>{selected.name}</h2>
                  <p>
                    {selected.code} · Level {selected.level} · {selected.challenge}
                  </p>
                </div>
                <span className={`qrcm-status-chip ${statusClass(selected.status)}`}>
                  {selected.status}
                </span>
              </div>

              <div className="qrcm-qr-preview-box">
                <div className="qrcm-qr-canvas-wrap">
                  {selected.qrCodeDataUrl ? (
                    <img
                      src={selected.qrCodeDataUrl}
                      alt={`QR Code: ${selected.code}`}
                      className="qrcm-detail-qr"
                      style={{ width: 180, height: 180, display: "block", objectFit: "contain" }}
                    />
                  ) : selected.token ? (
                    <ScannableQrImage
                      value={getScanUrl(selected)}
                      size={180}
                      className="qrcm-detail-qr"
                    />
                  ) : (
                    <div className="qrcm-qr-empty">
                      <span>No Security Token</span>
                    </div>
                  )}
                </div>
                <div className="qrcm-qr-instructions">
                  <strong>Official Checkpoint Beacon</strong>
                  <p>
                    Participants scan this token with a mobile device or the in-app scanner to verify physical presence at {selected.location}.
                  </p>
                  <div className="qrcm-qr-actions">
                    <button
                      type="button"
                      className="qrcm-primary-button small"
                      onClick={() => handleDownloadQr(selected)}
                      title="Download high-resolution PNG QR sticker"
                    >
                      ⇩ Download PNG
                    </button>
                    <button
                      type="button"
                      className="qrcm-outline-button small"
                      onClick={() => setPrintTarget(selected)}
                      title="Print physical campus checkpoint placard"
                    >
                      ⎙ Print Beacon
                    </button>
                    <button
                      type="button"
                      className="qrcm-outline-button small"
                      onClick={() => {
                        const url = getScanUrl(selected);
                        if (!url) {
                          setNotice("No token available to generate scan URL.");
                          return;
                        }
                        navigator.clipboard?.writeText(url);
                        setNotice(`Copied scan URL for ${selected.code} to clipboard.`);
                      }}
                    >
                      Copy Scan URL ⎘
                    </button>
                    <button
                      type="button"
                      className="qrcm-outline-button small"
                      onClick={() => handleOpenEditor(selected)}
                    >
                      Edit Station ✎
                    </button>
                  </div>
                </div>
              </div>

              <div className="qrcm-detail-metrics">
                <div>
                  <strong>{selected.scans}</strong>
                  <span>Total Scans</span>
                </div>
                <div>
                  <strong>{selected.teams}</strong>
                  <span>Unique Teams</span>
                </div>
                <div>
                  <strong>{selected.lastScan}</strong>
                  <span>Last Scanned</span>
                </div>
              </div>

              <div className="qrcm-detail-info-rows">
                <div className="qrcm-info-row">
                  <span>Physical Location</span>
                  <strong>{selected.location}</strong>
                </div>
                <div className="qrcm-info-row">
                  <span>Access Mode</span>
                  <strong>{selected.mode}</strong>
                </div>
                <div className="qrcm-info-row">
                  <span>HMAC Station Token</span>
                  <code style={{ fontSize: "11px", wordBreak: "break-all" }}>
                    {selected.token ? `${selected.token.slice(0, 16)}...${selected.token.slice(-8)}` : "None"}
                  </code>
                </div>
                <div className="qrcm-info-row">
                  <span>Next Location Target</span>
                  <strong style={{ color: "var(--htg-neon-lime, #b8ff3d)" }}>
                    {selected.level === 10
                      ? "Final Level — Concludes Event"
                      : (selected.nextLocationName || "Auto-routed to Next Checkpoint")}
                  </strong>
                </div>
                {selected.locationInstructions && (
                  <div className="qrcm-info-row full">
                    <span>Next Location Instructions</span>
                    <p>{selected.locationInstructions}</p>
                  </div>
                )}
                {selected.notes && (
                  <div className="qrcm-info-row full">
                    <span>Organizer Notes</span>
                    <p>{selected.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>
        </section>

        {/* Checkpoint Routing Control Section */}
        <section className="qrcm-routing-card">
          <header className="qrcm-routing-header">
            <div>
              <h2>◈ Next Location Routing Control (Post-Answer Reveal)</h2>
              <p>
                Configure the admin-controlled physical location revealed only after teams correctly solve all questions in each level.
                Teams must physically travel to this station and scan its QR beacon to continue to the subsequent level.
              </p>
            </div>
            <button
              type="button"
              className="qrcm-outline-button small"
              onClick={fetchLocations}
            >
              ↻ Refresh Routes
            </button>
          </header>

          {routingError && (
            <div className="qrcm-routing-alert error" role="alert">
              ⚠️ {routingError}
            </div>
          )}

          {routingSuccess && (
            <div className="qrcm-routing-alert success" role="status">
              ✓ {routingSuccess}
            </div>
          )}

          <div className="qrcm-routing-table-wrap">
            <table className="qrcm-routing-table">
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>Level</th>
                  <th style={{ width: "110px" }}>Beacon Code</th>
                  <th style={{ width: "180px" }}>Current Station</th>
                  <th>Destination After Correct Solve</th>
                  <th>Routing Instructions / Notes</th>
                  <th style={{ width: "120px", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((loc) => {
                  const isFinal = loc.levelNumber === 10;
                  const isSaving = savingLocationLevel === loc.levelNumber;
                  return (
                    <tr key={loc.levelNumber}>
                      <td>
                        <span className="qrcm-tag active" style={{ fontSize: "10px" }}>
                          LVL {loc.levelNumber}
                        </span>
                      </td>
                      <td>
                        <code style={{ fontSize: "11px", color: "var(--htg-neon-lime, #b8ff3d)" }}>
                          {loc.checkpointCode}
                        </code>
                      </td>
                      <td>
                        <span style={{ color: "#e2e8f0", fontWeight: 600 }}>
                          {loc.currentLocation}
                        </span>
                      </td>
                      <td>
                        {isFinal ? (
                          <span style={{ color: "#a0aec0", fontStyle: "italic", fontSize: "11px" }}>
                            🏁 Final Level — Concludes Event (Grand Victory Screen)
                          </span>
                        ) : (
                          <input
                            type="text"
                            className="qrcm-routing-input"
                            value={loc.nextLocationName || ""}
                            onChange={(e) =>
                              handleLocationChange(loc.levelNumber, "nextLocationName", e.target.value)
                            }
                            placeholder="e.g. Central Library 2nd Floor, CSE Dept Lab"
                            required
                          />
                        )}
                      </td>
                      <td>
                        <input
                          type="text"
                          className="qrcm-routing-input"
                          value={loc.locationInstructions || ""}
                          onChange={(e) =>
                            handleLocationChange(loc.levelNumber, "locationInstructions", e.target.value)
                          }
                          placeholder={isFinal ? "N/A — Event Complete" : "e.g. Proceed to east staircase to find Beacon CP-02"}
                          disabled={isFinal}
                        />
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className="qrcm-save-route-btn"
                          disabled={isSaving}
                          onClick={() => handleUpdateLocation(loc.levelNumber)}
                        >
                          {isSaving ? "Saving..." : "Save Route"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer */}
        <footer className="qrcm-footer">
          Build with <span>♥</span> by Hrithik Roshan{" "}
          <small>THE TECH MYSTERY · MISSION CONTROL</small>
        </footer>
      </main>

      {/* Print Placard Modal */}
      {printTarget && (
        <div className="htg-print-modal-backdrop" onClick={() => setPrintTarget(null)}>
          <div className="htg-print-modal" onClick={(e) => e.stopPropagation()}>
            <div className="htg-print-modal-header no-print">
              <h3>Official Checkpoint QR Beacon</h3>
              <div className="htg-print-header-actions">
                <button
                  type="button"
                  className="qrcm-primary-button small"
                  onClick={() => window.print()}
                >
                  ⎙ Print Now
                </button>
                <button
                  type="button"
                  className="qrcm-outline-button small"
                  onClick={() => setPrintTarget(null)}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="htg-printable-badge" id="htg-print-badge-area">
              <div className="htg-badge-branding">
                <span className="htg-badge-logo" style={{ fontSize: "24px", color: "#000" }}>◈</span>
                <div>
                  <h2>THE TECH MYSTERY 2026</h2>
                  <small>OFFICIAL CAMPUS CHECKPOINT BEACON</small>
                </div>
              </div>

              <div className="htg-badge-level-row">
                <span className="htg-badge-pill">LEVEL {printTarget.level}</span>
                <span className="htg-badge-code">{printTarget.code}</span>
              </div>

              <h3 className="htg-badge-challenge">{printTarget.name}</h3>
              <p style={{ margin: "2px 0 8px", fontSize: "11px", color: "#555" }}>
                ⌖ {printTarget.location}
              </p>

              <div className="htg-badge-qr-container">
                {printTarget.qrCodeDataUrl ? (
                  <img src={printTarget.qrCodeDataUrl} alt="Checkpoint QR" />
                ) : (
                  <ScannableQrImage
                    value={getScanUrl(printTarget)}
                    size={220}
                  />
                )}
              </div>

              <div className="htg-badge-instructions">
                <strong>SCAN WITH THE TECH MYSTERY SCANNER</strong>
                <p>
                  Verify physical presence at this campus checkpoint station to unlock Challenge Level {printTarget.level}.
                  Points awarded strictly upon valid flag capture submission.
                </p>
              </div>

              <footer className="htg-badge-footer">
                <span>CODESPHERE • TULA'S UNIVERSITY</span>
                <span>TAMPERING IS STRICTLY PROHIBITED</span>
              </footer>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showEditor && (
        <div
          className="qrcm-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowEditor(false);
          }}
        >
          <form className="qrcm-modal" onSubmit={saveCheckpoint}>
            <header>
              <div>
                <small>CHECKPOINT CONFIGURATION</small>
                <h2>{editingId ? "Edit Checkpoint" : "Create Checkpoint"}</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                aria-label="Close"
              >
                ×
              </button>
            </header>
            <div className="qrcm-form-grid">
              <label>
                Checkpoint name *
                <input
                  required
                  value={draft.name}
                  onChange={(event) =>
                    setDraft({ ...draft, name: event.target.value })
                  }
                  placeholder="e.g. Welcome Signal"
                />
              </label>
              <label>
                Checkpoint code *
                <input
                  required
                  value={draft.code}
                  onChange={(event) =>
                    setDraft({ ...draft, code: event.target.value })
                  }
                  placeholder="HTG-CP09"
                />
              </label>
              <label>
                Level *
                <select
                  value={draft.level}
                  onChange={(event) =>
                    setDraft({ ...draft, level: event.target.value })
                  }
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Level {i + 1}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Linked challenge *
                <select
                  value={draft.challenge}
                  onChange={(event) => {
                    const ch = event.target.value;
                    const idx = challenges.indexOf(ch);
                    setDraft({
                      ...draft,
                      challenge: ch,
                      level: idx >= 0 ? idx + 1 : draft.level,
                    });
                  }}
                >
                  {challenges.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Physical location *
                <input
                  required
                  value={draft.location}
                  onChange={(event) =>
                    setDraft({ ...draft, location: event.target.value })
                  }
                  placeholder="Building, lab or station"
                />
              </label>
              <label>
                QR access mode
                <select
                  value={draft.mode}
                  onChange={(event) =>
                    setDraft({ ...draft, mode: event.target.value })
                  }
                >
                  <option>Team-bound QR</option>
                  <option>Public QR</option>
                </select>
              </label>
              <label>
                Status
                <select
                  value={draft.status}
                  onChange={(event) =>
                    setDraft({ ...draft, status: event.target.value })
                  }
                >
                  {statuses.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                Internal token label
                <input
                  value={draft.token}
                  onChange={(event) =>
                    setDraft({ ...draft, token: event.target.value })
                  }
                  placeholder="Server-issued token reference"
                />
              </label>
              <label>
                Next Location Target {Number(draft.level) < 10 ? '*' : ''}
                <input
                  value={draft.nextLocationName || ""}
                  onChange={(event) =>
                    setDraft({ ...draft, nextLocationName: event.target.value })
                  }
                  placeholder={Number(draft.level) === 10 ? "None (Final Level)" : "e.g. Central Library 2nd Floor"}
                  disabled={Number(draft.level) === 10}
                />
              </label>
              <label className="qrcm-full">
                Next Location Instructions / Guidance
                <textarea
                  rows="2"
                  value={draft.locationInstructions || ""}
                  onChange={(event) =>
                    setDraft({ ...draft, locationInstructions: event.target.value })
                  }
                  placeholder="Instructions for reaching the next station after this level is solved"
                  disabled={Number(draft.level) === 10}
                />
              </label>
              <label className="qrcm-full">
                Volunteer notes
                <textarea
                  rows="3"
                  value={draft.notes}
                  onChange={(event) =>
                    setDraft({ ...draft, notes: event.target.value })
                  }
                  placeholder="Instructions for the volunteer at this station"
                />
              </label>
            </div>
            <div className="qrcm-modal-actions">
              <button
                type="button"
                className="qrcm-outline-button"
                onClick={() => setShowEditor(false)}
              >
                Cancel
              </button>
              <button type="submit" className="qrcm-primary-button">
                {editingId ? "Save Changes" : "Create Checkpoint"}
              </button>
            </div>
            <p className="qrcm-modal-note">
              {isLiveDb
                ? "Changes will be written directly to the authenticated live database."
                : "Demo mode: changes remain in local UI state until connected to live database. QR codes encode server verification endpoints."}
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

