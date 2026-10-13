import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import adminService from "../../services/admin.service";
import AdminSidebar from "../../components/navigation/AdminSidebar";
import "../../styles/QRCheckpointManagementPage.css";

const initialCheckpoints = [
  {
    id: "CP-01",
    name: "Welcome Signal",
    code: "HTG-CP01",
    level: 1,
    challenge: "The Starting Point",
    location: "Main Auditorium Entrance",
    status: "Active",
    scans: 42,
    teams: 32,
    mode: "Public QR",
    lastScan: "2 min ago",
    notes: "Starting checkpoint. Verify team registration before opening Level 1.",
    token: "demo-token-cp01",
    isDemo: true,
  },
  {
    id: "CP-02",
    name: "Hidden in Plain Sight",
    code: "HTG-CP02",
    level: 2,
    challenge: "Hidden in Plain Sight",
    location: "Computer Centre — Lab 5",
    status: "Active",
    scans: 31,
    teams: 27,
    mode: "Public QR",
    lastScan: "5 min ago",
    notes: "Unlock after Level 1 completion.",
    token: "demo-token-cp02",
    isDemo: true,
  },
  {
    id: "CP-03",
    name: "Lost Transmission",
    code: "HTG-CP03",
    level: 3,
    challenge: "Lost Transmission",
    location: "Innovation Lab",
    status: "Active",
    scans: 24,
    teams: 21,
    mode: "Team-bound QR",
    lastScan: "8 min ago",
    notes: "Challenge opens only for eligible teams.",
    token: "demo-token-cp03",
    isDemo: true,
  },
  {
    id: "CP-04",
    name: "System Breach",
    code: "HTG-CP04",
    level: 4,
    challenge: "System Breach",
    location: "Networking Lab",
    status: "Paused",
    scans: 0,
    teams: 0,
    mode: "Team-bound QR",
    lastScan: "—",
    notes: "Keep paused until volunteers confirm the station is ready.",
    token: "demo-token-cp04",
    isDemo: true,
  },
  {
    id: "CP-05",
    name: "Digital Forensics",
    code: "HTG-CP05",
    level: 5,
    challenge: "Digital Forensics",
    location: "Library Help Desk",
    status: "Active",
    scans: 18,
    teams: 15,
    mode: "Team-bound QR",
    lastScan: "12 min ago",
    notes: "Use only the supplied offline forensic artifact.",
    token: "demo-token-cp05",
    isDemo: true,
  },
  {
    id: "CP-06",
    name: "Privilege Escalation",
    code: "HTG-CP06",
    level: 6,
    challenge: "Privilege Escalation",
    location: "Cyber Lab",
    status: "Draft",
    scans: 0,
    teams: 0,
    mode: "Team-bound QR",
    lastScan: "—",
    notes: "Draft checkpoint; verify the sandbox before publishing.",
    token: "demo-token-cp06",
    isDemo: true,
  },
  {
    id: "CP-07",
    name: "Encrypted Shadows",
    code: "HTG-CP07",
    level: 7,
    challenge: "Encrypted Shadows",
    location: "Seminar Hall Corridor",
    status: "Active",
    scans: 12,
    teams: 10,
    mode: "Public QR",
    lastScan: "21 min ago",
    notes: "Cryptography puzzle and a server-validated answer.",
    token: "demo-token-cp07",
    isDemo: true,
  },
  {
    id: "CP-08",
    name: "The Insider",
    code: "HTG-CP08",
    level: 8,
    challenge: "The Insider",
    location: "Media Room",
    status: "Draft",
    scans: 0,
    teams: 0,
    mode: "Team-bound QR",
    lastScan: "—",
    notes: "Publish after the media artifact is uploaded.",
    token: "demo-token-cp08",
    isDemo: true,
  },
];

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
    if (!value) return;

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
  const [checkpoints, setCheckpoints] = useState(initialCheckpoints);
  const [challenges, setChallenges] = useState(fallbackChallenges);
  const [selectedId, setSelectedId] = useState("CP-03");
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

  // Compute canonical scan URL for a checkpoint
  const getScanUrl = useCallback((cp) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://hackthegrid.codesphere.org";
    const token = cp?.token || cp?.hmacToken || "demo-token";
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
      token: token,
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
          setIsLiveDb(false);
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

  const selected =
    checkpoints.find((item) => item.id === selectedId) || checkpoints[0] || blankCheckpoint;

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
      token: `demo-token-cp${String(nextNum).padStart(2, "0")}`,
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

    if (isLiveDb) {
      try {
        const payload = {
          name: draft.name.trim(),
          code: draft.code.trim().toUpperCase(),
          levelNumber: Number(draft.level),
          challenge: draft.challenge,
          locationDescription: draft.location.trim(),
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
        await fetchCheckpoints();
      } catch (err) {
        setNotice(`API Error: ${err.response?.data?.message || err.message}`);
      }
    } else {
      // Local state fallback for demo preview
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
          isDemo: true,
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
    link.download = `hack-the-grid-checkpoints-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice(`Exported ${filtered.length} checkpoints to CSV.`);
  };

  // Download high-resolution scannable placard
  const downloadPlacard = async () => {
    try {
      const scanUrl = getScanUrl(selected);
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
      ctx.fillText("HACK THE GRID 2026 // QR CHECKPOINT", canvas.width / 2, 36);

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
            {isLiveDb ? (
              <span className="qrcm-data-pill live">● LIVE DATABASE</span>
            ) : (
              <span className="qrcm-data-pill demo">● DEMO PREVIEW DATA</span>
            )}
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

        {/* Live/Demo info banner */}
        {!isLiveDb && !dbBannerDismissed && (
          <div className="qrcm-api-banner">
            <div>
              <strong>● DEMO PREVIEW DATA</strong> — Connect authenticated
              administrator session for live database synchronization. Generated
              QR codes encode authentic server verification URLs.
            </div>
            <div className="qrcm-api-banner-actions">
              <Link to={ROUTES.ADMIN_LOGIN} className="qrcm-banner-link">
                Admin Login →
              </Link>
              <button
                type="button"
                onClick={() => setDbBannerDismissed(true)}
                aria-label="Dismiss banner"
              >
                ×
              </button>
            </div>
          </div>
        )}

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
            <div className="qrcm-detail-head">
              <div>
                <small>CHECKPOINT DETAILS</small>
                <h2>{selected.name}</h2>
                <p>
                  {selected.id} <span>•</span> {selected.code}
                </p>
              </div>
              <span className={`qrcm-status ${statusClass(selected.status)}`}>
                {selected.status}
              </span>
            </div>
            <div className="qrcm-qr-preview">
              <div className="qrcm-qr-paper">
                <ScannableQrImage
                  value={getScanUrl(selected)}
                  size={106}
                />
                <small>{selected.code}</small>
              </div>
              <div className="qrcm-qr-copy">
                <span className="qrcm-secure-tag">⌑ GENUINE SCANNABLE QR</span>
                <h3>Scan to continue</h3>
                <p>
                  Participants scan this QR to request access to its linked challenge.
                </p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="qrcm-outline-button"
                    onClick={downloadPlacard}
                    title="Download high-resolution printable placard"
                  >
                    ↓ Download QR Placard
                  </button>
                  <button
                    type="button"
                    className="qrcm-outline-button"
                    onClick={copyScanUrl}
                    title="Copy server-validated scan URL"
                  >
                    ⎘ Copy URL
                  </button>
                </div>
              </div>
            </div>
            <div className="qrcm-detail-metrics">
              <div>
                <strong>{selected.scans}</strong>
                <small>Total scans</small>
              </div>
              <div>
                <strong>{selected.teams}</strong>
                <small>Teams reached</small>
              </div>
              <div>
                <strong>Level {selected.level}</strong>
                <small>Unlock level</small>
              </div>
            </div>
            <div className="qrcm-detail-body">
              <h3>Checkpoint Configuration</h3>
              <div className="qrcm-detail-row">
                <span>Linked challenge</span>
                <strong>{selected.challenge}</strong>
              </div>
              <div className="qrcm-detail-row">
                <span>Physical location</span>
                <strong>{selected.location}</strong>
              </div>
              <div className="qrcm-detail-row">
                <span>QR access mode</span>
                <strong>{selected.mode}</strong>
              </div>
              <div className="qrcm-detail-row">
                <span>Last scan</span>
                <strong>{selected.lastScan}</strong>
              </div>
              <div className="qrcm-detail-row">
                <span>Opaque token</span>
                <strong style={{ font: "9px 'DM Mono', monospace" }}>
                  {selected.token ? `${selected.token.slice(0, 16)}...` : "None"}
                </strong>
              </div>
              <h3>Volunteer Notes</h3>
              <p className="qrcm-notes">
                {selected.notes || "No notes configured."}
              </p>
              <div className="qrcm-security-note">
                <span>⬡</span>
                <p>
                  <strong>Security reminder</strong>
                  <br />
                  QR codes identify a physical station; they must never contain
                  answer keys or secret flags. Team eligibility and challenge
                  unlocks are enforced strictly server-side.
                </p>
              </div>
            </div>
            <div className="qrcm-detail-actions">
              <button
                type="button"
                className="qrcm-pause-button"
                onClick={() => toggleStatus(selected)}
              >
                {selected.status === "Active"
                  ? "Ⅱ Pause checkpoint"
                  : "▶ Activate checkpoint"}
              </button>
              <button
                type="button"
                className="qrcm-primary-button"
                onClick={() => openEdit(selected)}
              >
                ✎ Edit Checkpoint
              </button>
            </div>
          </aside>
        </section>

        {/* Footer */}
        <footer className="qrcm-footer">
          Build with <span>♥</span> by Hrithik Roshan{" "}
          <small>HACK THE GRID · MISSION CONTROL</small>
        </footer>
      </main>

      {/* Create / Edit Modal Dialog */}
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

