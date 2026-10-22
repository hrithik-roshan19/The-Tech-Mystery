import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import adminService from "../../services/admin.service";
import AdminSidebar from "../../components/navigation/AdminSidebar";
import "../../styles/QuestionManagementPage.css";


/**
 * Genuine Scannable QR Code Component
 */
function ScannableQrImage({ value, size = 120, className = "" }) {
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
        className={`q-qr-placeholder ${className}`}
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

const types = ["Text Answer", "Flag", "Multiple Choice", "File Upload"];
const categories = [
  "Cryptography",
  "OSINT",
  "Forensics",
  "Web Security",
  "Networking",
  "Encoding",
  "Mixed",
];
const difficulties = ["Easy", "Medium", "Hard", "Expert"];

const blankQuestion = {
  title: "",
  challenge: "Lost Transmission",
  level: 1,
  type: "Text Answer",
  category: "Cryptography",
  difficulty: "Easy",
  points: 50,
  status: "Draft",
  attempts: 3,
  hint: "",
  prompt: "",
  answer: "",
  checkpointId: "",
  updated: "Just now",
  required: true,
};

const statusClass = (value) => (value || "").toLowerCase().replace(/\s+/g, "-");

export default function QuestionManagementPage() {
  const { user, isAuthenticated } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [challenges, setChallenges] = useState(fallbackChallenges);
  const [checkpoints, setCheckpoints] = useState([]);
  const [detailTab, setDetailTab] = useState("Preview");
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [levelFilter, setLevelFilter] = useState("All Levels");
  const [view, setView] = useState("table");
  const [notice, setNotice] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [draft, setDraft] = useState(blankQuestion);
  const [isLiveDb, setIsLiveDb] = useState(false);
  const [dbBannerDismissed, setDbBannerDismissed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [printTarget, setPrintTarget] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadText, setUploadText] = useState("");
  const [uploading, setUploading] = useState(false);
  const uploadFileInputRef = useRef(null);

  // Normalize server question to UI question format
  const mapServerQuestion = useCallback((q, index) => {
    const rawDiff = (q.difficulty || "MEDIUM").toLowerCase();
    const normalizedDifficulty =
      rawDiff === "easy"
        ? "Easy"
        : rawDiff === "medium"
        ? "Medium"
        : rawDiff === "hard"
        ? "Hard"
        : "Expert";

    const challengeName =
      q.challengeId?.title ||
      fallbackChallenges[(q.levelNumber || 1) - 1] ||
      `Level ${q.levelNumber || 1}`;

    const questionCode = `Q-${String(index + 1).padStart(3, "0")}`;

    return {
      _mongoId: q._id,
      id: questionCode,
      title: q.title || "Untitled Question",
      challenge: challengeName,
      challengeId: q.challengeId?._id || q.challengeId,
      level: q.levelNumber || 1,
      type: q.type || "Flag",
      category: q.category || "Cryptography",
      difficulty: normalizedDifficulty,
      points: Number(q.points ?? q.challengeId?.points ?? 100),
      status: q.status || (q.isActive ? "Published" : "Paused"),
      attempts: Number(q.attempts ?? 3),
      hint: q.hints?.[0]?.content || "",
      prompt: q.prompt || "",
      answer: q.flag || "••••••••••••••••••",
      checkpointId: q.checkpointId?._id || q.checkpointId || "",
      checkpointCode: q.checkpointCode || q.checkpointId?.checkpointCode || null,
      qrCodeDataUrl: q.qrCodeDataUrl || null,
      qrScanUrl: q.qrScanUrl || null,
      qrToken: q.qrToken || null,
      checkpoint: q.checkpointId
        ? {
            _id: q.checkpointId._id,
            code: q.checkpointId.checkpointCode,
            name: q.checkpointId.name,
            location: q.checkpointId.locationDescription,
            mode: q.checkpointId.mode,
            status: q.checkpointId.status,
          }
        : null,
      updated: q.updatedAt
        ? new Date(q.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Live DB",
      required: q.required !== undefined ? Boolean(q.required) : true,
      isClaimed: Boolean(q.isClaimed),
      claimedByTeamId: q.claimedByTeamId?._id || q.claimedByTeamId || null,
      claimedByTeamName: q.claimedByTeamId?.name || (q.isClaimed ? "Claimed" : null),
      claimedAt: q.claimedAt || null,
      claimExpiresAt: q.claimExpiresAt || null,
      isCompleted: Boolean(q.isCompleted),
      completedByTeamId: q.completedByTeamId?._id || q.completedByTeamId || null,
      completedByTeamName: q.completedByTeamId?.name || (q.isCompleted ? "Solved" : null),
      completedAt: q.completedAt || null,
      isDemo: false,
    };
  }, []);

  // Fetch live questions, challenges and checkpoints from backend
  const fetchQuestions = useCallback(async () => {
    if (!isAuthenticated || user?.role !== "ADMIN") {
      setIsLiveDb(false);
      return;
    }

    setLoading(true);
    try {
      const [questionsRes, challengesRes, checkpointsRes] = await Promise.allSettled([
        adminService.getQuestions({ includeFlag: "true" }),
        adminService.getChallenges(),
        adminService.getCheckpoints(),
      ]);

      if (
        checkpointsRes.status === "fulfilled" &&
        checkpointsRes.value?.data?.checkpoints
      ) {
        setCheckpoints(checkpointsRes.value.data.checkpoints);
      }

      if (
        challengesRes.status === "fulfilled" &&
        challengesRes.value?.data?.challenges
      ) {
        const loadedTitles = challengesRes.value.data.challenges
          .map((c) => c.title)
          .filter(Boolean);
        if (loadedTitles.length > 0) {
          setChallenges(loadedTitles);
        }
      }

      if (
        questionsRes.status === "fulfilled" &&
        questionsRes.value?.data?.questions
      ) {
        const liveQuestions = questionsRes.value.data.questions;
        if (liveQuestions.length > 0) {
          const mapped = liveQuestions.map((q, idx) => mapServerQuestion(q, idx));
          setQuestions(mapped);
          setIsLiveDb(true);
          setSelectedId((prev) =>
            mapped.some((m) => m.id === prev) ? prev : mapped[0]?.id || "Q-001"
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
  }, [isAuthenticated, user, mapServerQuestion]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const selected =
    questions.find((item) => item.id === selectedId) || questions[0] || null;

  const filtered = useMemo(
    () =>
      questions.filter((item) => {
        const term = search.trim().toLowerCase();
        const matchesSearch =
          !term ||
          [item.id, item.title, item.challenge, item.category, item.prompt].some(
            (value) => String(value || "").toLowerCase().includes(term)
          );
        return (
          matchesSearch &&
          (statusFilter === "All Status" || item.status === statusFilter) &&
          (typeFilter === "All Types" || item.type === typeFilter) &&
          (levelFilter === "All Levels" || item.level === Number(levelFilter))
        );
      }),
    [questions, search, statusFilter, typeFilter, levelFilter]
  );

  const published = questions.filter((item) => item.status === "Published").length;
  const drafts = questions.filter((item) => item.status === "Draft").length;
  const paused = questions.filter((item) => item.status === "Paused").length;
  const totalPoints = questions.reduce(
    (sum, item) => sum + Number(item.points || 0),
    0
  );

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All Status");
    setTypeFilter("All Types");
    setLevelFilter("All Levels");
  };

  const openCreate = () => {
    setEditingId(null);
    setDraft({ ...blankQuestion });
    setShowEditor(true);
  };

  const openEdit = (question) => {
    setEditingId(question.id);
    setDraft({
      ...question,
      checkpointId: question.checkpointId || "",
    });
    setShowEditor(true);
  };

  const saveQuestion = async (event) => {
    event.preventDefault();
    if (!draft.title.trim() || !draft.prompt.trim()) {
      setNotice("Question title and prompt are required.");
      return;
    }

    if (isLiveDb) {
      try {
        const payload = {
          title: draft.title.trim(),
          challenge: draft.challenge,
          levelNumber: Number(draft.level),
          checkpointId: draft.checkpointId || null,
          type: draft.type,
          category: draft.category,
          difficulty: draft.difficulty.toUpperCase(),
          points: Number(draft.points),
          attempts: Number(draft.attempts),
          prompt: draft.prompt.trim(),
          hint: draft.hint ? draft.hint.trim() : "",
          answer: draft.answer ? draft.answer.trim() : "",
          status: draft.status,
          isActive: draft.status === "Published",
          required: Boolean(draft.required),
        };

        if (editingId) {
          const target = questions.find((q) => q.id === editingId);
          if (target?._mongoId) {
            await adminService.updateQuestion(target._mongoId, payload);
            setNotice(`Question ${editingId} updated in live database.`);
          }
        } else {
          await adminService.createQuestion(payload);
          setNotice("New question persisted to live database.");
        }
        await fetchQuestions();
      } catch (err) {
        setNotice(`API Error: ${err.response?.data?.message || err.message}`);
      }
    } else {
      // Local state update fallback
      if (editingId) {
        setQuestions((items) =>
          items.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  ...draft,
                  points: Number(draft.points),
                  level: Number(draft.level),
                  attempts: Number(draft.attempts),
                }
              : item
          )
        );
        setSelectedId(editingId);
        setNotice(
          "Question updated in local demo state. Connect authenticated admin session for live database synchronization."
        );
      } else {
        const nextNumber =
          questions.reduce(
            (max, item) => Math.max(max, Number(item.id.split("-")[1]) || 0),
            0
          ) + 1;
        const id = `Q-${String(nextNumber).padStart(3, "0")}`;
        const newRecord = {
          ...draft,
          id,
          points: Number(draft.points),
          level: Number(draft.level),
          attempts: Number(draft.attempts),
          isDemo: false,
        };
        setQuestions((items) => [...items, newRecord]);
        setSelectedId(id);
        setNotice(
          "Question created in local demo state. Connect authenticated admin session for live database synchronization."
        );
      }
    }

    setShowEditor(false);
    setShowAnswer(false);
  };

  const handleDeleteQuestion = async (question) => {
    if (!question) return;
    if (
      !window.confirm(
        `Are you sure you want to permanently delete question "${question.title}" (${question.id})?`
      )
    ) {
      return;
    }

    if (isLiveDb && question._mongoId) {
      try {
        await adminService.deleteQuestion(question._mongoId);
        setNotice(`Question "${question.title}" deleted from live database.`);
        await fetchQuestions();
      } catch (err) {
        setNotice(`API Error: ${err.response?.data?.message || err.message}`);
      }
    } else {
      const remaining = questions.filter((q) => q.id !== question.id);
      setQuestions(remaining);
      if (selectedId === question.id && remaining.length > 0) {
        setSelectedId(remaining[0].id);
      }
      setNotice(`Question "${question.title}" removed from local state.`);
    }
  };

  const toggleStatus = async (question) => {
    const nextStatus = question.status === "Published" ? "Paused" : "Published";

    if (isLiveDb && question._mongoId) {
      try {
        await adminService.updateQuestion(question._mongoId, {
          status: nextStatus,
          isActive: nextStatus === "Published",
        });
        setNotice(`Question ${question.id} set to ${nextStatus} in live database.`);
        await fetchQuestions();
        return;
      } catch (err) {
        setNotice(`Error: ${err.response?.data?.message || err.message}`);
      }
    }

    // Local demo toggle
    setQuestions((items) =>
      items.map((item) =>
        item.id === question.id ? { ...item, status: nextStatus } : item
      )
    );
    setNotice(
      `${question.id} set to ${nextStatus} in local demo state. Connect live database to persist.`
    );
  };

  const handleReleaseClaim = async (item) => {
    if (!item) return;
    const confirmRelease = window.confirm(
      `Are you sure you want to release the claim on "${item.title}" (${item.id})? This will make the QR code available for other teams.`
    );
    if (!confirmRelease) return;

    if (isLiveDb && item._mongoId) {
      try {
        const res = await adminService.releaseQuestionClaim(item._mongoId);
        setNotice(res.message || `Claim released for ${item.id}.`);
        await fetchQuestions();
        return;
      } catch (err) {
        setNotice(`Error releasing claim: ${err.response?.data?.message || err.message}`);
        return;
      }
    }

    setQuestions((items) =>
      items.map((q) =>
        q.id === item.id
          ? { ...q, isClaimed: false, claimedByTeamId: null, claimedByTeamName: null, claimExpiresAt: null }
          : q
      )
    );
    setNotice(`Claim released for ${item.id} in local demo state.`);
  };

  const handleDownloadQr = (item) => {
    if (!item) return;
    if (item.qrCodeDataUrl) {
      const link = document.createElement("a");
      link.href = item.qrCodeDataUrl;
      link.download = `HTG-Question-${item.id}-Level-${item.level}.png`;
      link.click();
      setNotice(`Downloaded QR code for ${item.id} (Level ${item.level}).`);
      return;
    }

    const origin = typeof window !== "undefined" ? window.location.origin : "https://hackthegrid.codesphere.org";
    const cpCode = item.checkpointCode || item.checkpoint?.code || `HTG-CP${String(item.level).padStart(2, "0")}`;
    const targetUrl = item.qrScanUrl || `${origin}/checkpoint/scan?code=${encodeURIComponent(cpCode)}&token=${encodeURIComponent(item.qrToken || "")}&qid=${encodeURIComponent(item._mongoId || item.id)}`;

    QRCode.toDataURL(targetUrl, { width: 600, margin: 2, errorCorrectionLevel: "H" })
      .then((url) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = `HTG-Question-${item.id}-Level-${item.level}.png`;
        link.click();
        setNotice(`Generated and downloaded QR code for ${item.id}.`);
      })
      .catch((err) => {
        setNotice(`Failed to generate QR download: ${err.message}`);
      });
  };

  const handleBulkUpload = async (e) => {
    if (e) e.preventDefault();
    if (!uploadText.trim()) {
      setNotice("Please paste JSON or CSV question data or select a file.");
      return;
    }

    setUploading(true);
    try {
      let parsedQuestions = [];
      const trimmed = uploadText.trim();

      if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
        // Parse JSON
        const raw = JSON.parse(trimmed);
        parsedQuestions = Array.isArray(raw) ? raw : [raw];
      } else {
        // Parse CSV
        const lines = trimmed.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
        if (lines.length < 2) {
          throw new Error("CSV must contain a header row and at least one data row.");
        }
        const headers = lines[0].split(",").map((h) => h.replace(/^["']|["']$/g, "").trim().toLowerCase());
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(",").map((p) => p.replace(/^["']|["']$/g, "").trim());
          const row = {};
          headers.forEach((h, idx) => {
            row[h] = parts[idx] || "";
          });

          parsedQuestions.push({
            title: row.title || row.question || `Imported Question ${i}`,
            prompt: row.prompt || row.description || row.title || "Solve this challenge",
            flag: row.flag || row.answer || row["correct answer"] || "HTG{imported_flag}",
            levelNumber: Number(row.level || row.levelnumber || 1),
            type: row.type || "Flag",
            category: row.category || "Cryptography",
            difficulty: (row.difficulty || "MEDIUM").toUpperCase(),
            points: Number(row.points || 100),
            hint: row.hint || "",
            status: row.status || "Published",
          });
        }
      }

      const res = await adminService.uploadQuestions(parsedQuestions);
      setNotice(`Successfully uploaded ${res.data?.createdCount || parsedQuestions.length} questions with generated QR codes!`);
      setShowUploadModal(false);
      setUploadText("");
      await fetchQuestions();
    } catch (err) {
      setNotice(`Upload error: ${err.response?.data?.message || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadText(String(event.target.result || ""));
    };
    reader.readAsText(file);
  };

  const exportCsv = () => {
    const rows = [
      [
        "ID",
        "Question",
        "Challenge",
        "Level",
        "Type",
        "Category",
        "Difficulty",
        "Points",
        "Status",
        "Attempts",
        "Required",
      ],
      ...filtered.map((item) => [
        item.id,
        item.title,
        item.challenge,
        item.level,
        item.type,
        item.category,
        item.difficulty,
        item.points,
        item.status,
        item.attempts,
        item.required ? "Yes" : "No",
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
    link.download = `the-tech-mystery-questions-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice(`Exported ${filtered.length} questions to CSV.`);
  };

  const adminName = user?.fullName || user?.username || "Event Admin";

  return (
    <div className="htg-question-page">
      {/* Shared Mission Control Sidebar */}
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <main className="htg-question-main">
        {/* Topbar */}
        <header className="htg-topbar">
          <button
            type="button"
            className="htg-mobile-menu-btn"
            aria-label="Open navigation menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            ☰
          </button>
          <div className="htg-global-search">
            <span>⌕</span>
            <input
              aria-label="Global search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions, challenges, content..."
            />
            <kbd>Ctrl + K</kbd>
          </div>
          <button className="htg-icon-button" aria-label="Notifications">
            ♧<i />
          </button>
          <Link to={ROUTES.ADMIN_DASHBOARD} className="htg-admin-chip">
            <span className="htg-admin-avatar">
              {(adminName || "A").slice(0, 1).toUpperCase()}
            </span>
            <span>
              <strong>{adminName}</strong>
              <small>Administrator</small>
            </span>
            <span>⌄</span>
          </Link>
        </header>

        {/* Hero Banner */}
        <section className="htg-question-hero">
          <div className="htg-breadcrumb">
            Admin <span>›</span> Questions
            <span className="htg-data-pill live">● LIVE DATABASE</span>
          </div>
          <div className="htg-heading-row">
            <div>
              <h1>
                Questions <em>Management</em>
              </h1>
              <p>
                Create question bank items, configure answers and assign them to
                challenge levels.
              </p>
            </div>
            <div className="htg-hero-actions">
              <button
                type="button"
                className="htg-outline-button"
                onClick={() => setShowUploadModal(true)}
              >
                ⇧ Upload Questions
              </button>
              <button
                type="button"
                className="htg-outline-button"
                onClick={exportCsv}
              >
                ⇩ Export
              </button>
              <button
                type="button"
                className="htg-primary-button"
                onClick={openCreate}
              >
                ＋ Add Question
              </button>
            </div>
          </div>
        </section>

        {/* Live / Demo notice info banner */}
        

        {notice && (
          <div className="htg-notice" role="status">
            <span>{notice}</span>
            <button onClick={() => setNotice("")} aria-label="Dismiss notice">
              ×
            </button>
          </div>
        )}

        {/* Stats Row */}
        <section className="htg-question-stats">
          <article>
            <span className="q-stat-icon lime">☷</span>
            <div>
              <strong>{questions.length}</strong>
              <small>Total Questions</small>
            </div>
            <div className="q-meter">
              <i
                style={{
                  width: `${Math.min(100, questions.length * 10)}%`,
                }}
              />
            </div>
          </article>
          <article>
            <span className="q-stat-icon lime">✓</span>
            <div>
              <strong>{published}</strong>
              <small>Published</small>
            </div>
            <div className="q-meter">
              <i
                style={{
                  width: `${
                    questions.length ? (published / questions.length) * 100 : 0
                  }%`,
                }}
              />
            </div>
          </article>
          <article>
            <span className="q-stat-icon amber">◷</span>
            <div>
              <strong>{drafts}</strong>
              <small>Drafts</small>
            </div>
            <div className="q-meter amber">
              <i
                style={{
                  width: `${
                    questions.length ? (drafts / questions.length) * 100 : 0
                  }%`,
                }}
              />
            </div>
          </article>
          <article>
            <span className="q-stat-icon muted">Ⅱ</span>
            <div>
              <strong>{paused}</strong>
              <small>Paused</small>
            </div>
            <div className="q-meter muted">
              <i
                style={{
                  width: `${
                    questions.length ? (paused / questions.length) * 100 : 0
                  }%`,
                }}
              />
            </div>
          </article>
          <article>
            <span className="q-stat-icon purple">✦</span>
            <div>
              <strong>{totalPoints.toLocaleString("en-IN")}</strong>
              <small>Available Points</small>
            </div>
            <div className="q-meter purple">
              <i style={{ width: "70%" }} />
            </div>
          </article>
        </section>

        {/* Toolbar: Filters, Search, View Mode */}
        <section className="htg-question-toolbar">
          <label className="htg-question-search">
            <span>⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, ID, challenge or content..."
            />
          </label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter status"
          >
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Paused</option>
          </select>
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            aria-label="Filter question type"
          >
            <option>All Types</option>
            {types.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={levelFilter}
            onChange={(event) => setLevelFilter(event.target.value)}
            aria-label="Filter level"
          >
            <option>All Levels</option>
            {Array.from({ length: 10 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                Level {index + 1}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="htg-reset-button"
            onClick={resetFilters}
          >
            Reset
          </button>
          <div className="htg-toolbar-spacer" />
          <div className="htg-view-toggle">
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

        {/* Main Content Area */}
        <section className="htg-question-content">
          <div className="htg-question-list">
            {view === "table" ? (
              <div className="htg-question-table-wrap">
                <table className="htg-question-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Question</th>
                      <th>Challenge / Level</th>
                      <th>Type</th>
                      <th>Difficulty</th>
                      <th>Points</th>
                      <th>Status</th>
                      <th>FCFS Claim</th>
                      <th>Attempts</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => {
                          setSelectedId(item.id);
                          setShowAnswer(false);
                        }}
                        className={
                          selectedId === item.id ? "selected-row" : ""
                        }
                      >
                        <td>
                          <span className="q-id">{item.id}</span>
                        </td>
                        <td>
                          <div className="q-title-cell">
                            <span className="q-question-icon">?</span>
                            <span>
                              <strong>{item.title}</strong>
                              <small>{item.category}</small>
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="q-challenge-name">
                            {item.challenge}
                          </span>
                          <small className="q-level">Level {item.level}</small>
                        </td>
                        <td>
                          <span className="q-type-chip">{item.type}</span>
                        </td>
                        <td>
                          <span
                            className={`q-difficulty ${statusClass(
                              item.difficulty
                            )}`}
                          >
                            {item.difficulty}
                          </span>
                        </td>
                        <td className="q-points">{item.points}</td>
                        <td>
                          <span
                            className={`q-status ${statusClass(item.status)}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td>
                          {item.isCompleted ? (
                            <span className="q-claim-badge completed" title={`Solved by ${item.completedByTeamName || 'Team'}`}>
                              ✓ Solved {item.completedByTeamName ? `(${item.completedByTeamName})` : ''}
                            </span>
                          ) : item.isClaimed ? (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <span className="q-claim-badge claimed" title={`Claimed by ${item.claimedByTeamName || 'Team'}`}>
                                🔒 {item.claimedByTeamName ? item.claimedByTeamName : 'Claimed'}
                              </span>
                              <button
                                type="button"
                                className="q-row-action"
                                title="Release claim"
                                style={{ color: '#f59e0b', borderColor: '#f59e0b', fontSize: '10px', padding: '1px 5px', height: 'auto' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReleaseClaim(item);
                                }}
                              >
                                Release
                              </button>
                            </div>
                          ) : (
                            <span className="q-claim-badge available" title="Available for any team to claim">
                              ● Available
                            </span>
                          )}
                        </td>
                        <td>{item.attempts}</td>
                        <td>
                          <button
                            type="button"
                            className="q-row-action"
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
                            className="q-row-action"
                            title="Print QR Beacon Placard"
                            onClick={(event) => {
                              event.stopPropagation();
                              setPrintTarget(item);
                            }}
                          >
                            ⎙
                          </button>
                          <button
                            type="button"
                            className="q-row-action"
                            title="Edit question"
                            onClick={(event) => {
                              event.stopPropagation();
                              openEdit(item);
                            }}
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            className="q-row-action"
                            title="Toggle status"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleStatus(item);
                            }}
                          >
                            {item.status === "Published" ? "⏸" : "▶"}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan="10" className="q-empty">
                          No questions match these filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="q-cards">
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`q-card ${
                      selectedId === item.id ? "chosen" : ""
                    }`}
                    onClick={() => {
                      setSelectedId(item.id);
                      setShowAnswer(false);
                    }}
                  >
                    <span className="q-question-icon big">?</span>
                    <small>
                      {item.id} · LEVEL {item.level}
                    </small>
                    <strong>{item.title}</strong>
                    <span>{item.challenge}</span>
                    <div className="q-card-bottom">
                      <span>{item.points} pts</span>
                      <span className={`q-status ${statusClass(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div style={{ marginTop: '6px', fontSize: '10px' }}>
                      {item.isCompleted ? (
                        <span className="q-claim-badge completed">✓ Solved</span>
                      ) : item.isClaimed ? (
                        <span className="q-claim-badge claimed">🔒 Claimed</span>
                      ) : (
                        <span className="q-claim-badge available">● Available</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
            <footer className="htg-question-table-footer">
              <span>
                Showing {filtered.length ? 1 : 0}–{filtered.length} of{" "}
                {filtered.length} questions
              </span>
              <div>
                <button disabled>‹</button>
                <button className="current">1</button>
                <button disabled>›</button>
              </div>
            </footer>
          </div>

          {/* Right Question Detail Inspector */}
          <aside className="htg-question-detail">
            <div className="q-detail-banner">
              <div className="q-banner-grid" />
              <span className={`q-status ${statusClass(selected.status)}`}>
                {selected.status}
              </span>
              <small>QUESTION PREVIEW · {selected.id}</small>
              <h2>{selected.title}</h2>
              <p>
                {selected.challenge} <span>•</span> Level {selected.level}
              </p>
            </div>
            <div className="q-detail-metrics">
              <div>
                <strong>{selected.points}</strong>
                <small>Points</small>
              </div>
              <div>
                <strong>{selected.attempts}</strong>
                <small>Max Attempts</small>
              </div>
              <div>
                <strong>{selected.difficulty}</strong>
                <small>Difficulty</small>
              </div>
            </div>
            <div className="q-detail-tabs">
              <button
                type="button"
                className={detailTab === "Preview" ? "active" : ""}
                onClick={() => setDetailTab("Preview")}
              >
                Preview
              </button>
              <button
                type="button"
                className={detailTab === "Answer Settings" ? "active" : ""}
                onClick={() => setDetailTab("Answer Settings")}
              >
                Answer Settings
              </button>
              <button
                type="button"
                className={detailTab === "QR Mapping" ? "active" : ""}
                onClick={() => setDetailTab("QR Mapping")}
              >
                QR Mapping
              </button>
            </div>
            <div className="q-detail-body">
              {detailTab === "Preview" && (
                <>
                  <div className="q-section-title">
                    <h3>Question Prompt</h3>
                    <button type="button" onClick={() => openEdit(selected)}>
                      Edit
                    </button>
                  </div>
                  <p className="q-prompt-text">{selected.prompt}</p>
                  <div className="q-meta-pills">
                    <span>{selected.type}</span>
                    <span>{selected.category}</span>
                    <span>{selected.required ? "Required" : "Optional"}</span>
                  </div>
                  <h3>Hint for participants</h3>
                  <div className="q-hint-box">
                    <span>✦</span>
                    <p>{selected.hint || "No hint configured."}</p>
                  </div>
                  <h3>
                    Correct Answer{" "}
                    <small>
                      {isLiveDb
                        ? "ADMIN ONLY · LIVE DATABASE"
                        : "ADMIN ONLY · DEMO DATA"}
                    </small>
                  </h3>
                  <div className="q-answer-box">
                    <code>
                      {showAnswer ? selected.answer : "••••••••••••••••••"}
                    </code>
                    <button
                      type="button"
                      onClick={() => setShowAnswer((value) => !value)}
                    >
                      {showAnswer ? "Hide" : "Reveal"}
                    </button>
                  </div>
                  <p className="q-security-note">
                    Never send answer keys to participant-facing APIs. Store and
                    validate flags server-side.
                  </p>
                  <div className="q-detail-info">
                    <div>
                      <span>Last updated</span>
                      <strong>{selected.updated}</strong>
                    </div>
                    <div>
                      <span>Challenge</span>
                      <strong>{selected.challenge}</strong>
                    </div>
                  </div>
                </>
              )}

              {detailTab === "Answer Settings" && (
                <>
                  <div className="q-section-title">
                    <h3>Answer & Verification Rules</h3>
                    <button type="button" onClick={() => openEdit(selected)}>
                      Configure
                    </button>
                  </div>
                  <div className="q-detail-info" style={{ marginTop: 0, borderTop: 0 }}>
                    <div>
                      <span>Submission Type</span>
                      <strong>{selected.type}</strong>
                    </div>
                    <div>
                      <span>Max Attempts Allowed</span>
                      <strong>{selected.attempts} attempts</strong>
                    </div>
                    <div>
                      <span>Flag Case Sensitivity</span>
                      <strong>Case Sensitive (Exact Match)</strong>
                    </div>
                    <div>
                      <span>Hint Penalty</span>
                      <strong>-20 Points (if unlocked)</strong>
                    </div>
                  </div>
                  <h3 style={{ marginTop: "16px" }}>Flag Masking & Security</h3>
                  <div className="q-answer-box">
                    <code>{showAnswer ? selected.answer : "••••••••••••••••••"}</code>
                    <button type="button" onClick={() => setShowAnswer((v) => !v)}>
                      {showAnswer ? "Hide" : "Reveal"}
                    </button>
                  </div>
                  <p className="q-security-note" style={{ marginTop: "10px" }}>
                    ✓ Question flags are excluded from participant payloads (select: false in schema).
                    <br />
                    ✓ Submissions are evaluated against HMAC-salted hashes or strict string comparisons.
                  </p>
                </>
              )}

              {detailTab === "QR Mapping" && (
                <>
                  <div className="q-section-title">
                    <h3>Physical QR Beacon & Station</h3>
                    <button type="button" onClick={() => openEdit(selected)}>
                      Link Checkpoint
                    </button>
                  </div>

                  <div className="q-qr-station-card">
                    <div className="q-qr-canvas-container">
                      {selected.qrCodeDataUrl ? (
                        <img
                          src={selected.qrCodeDataUrl}
                          alt={`QR Code for ${selected.id}`}
                          className="q-qr-image"
                        />
                      ) : (
                        <ScannableQrImage
                          value={
                            selected.qrScanUrl ||
                            `${typeof window !== "undefined" ? window.location.origin : "https://hackthegrid.codesphere.org"}/checkpoint/scan?code=${encodeURIComponent(
                              selected.checkpointCode || selected.checkpoint?.code || `HTG-CP${String(selected.level).padStart(2, "0")}`
                            )}&token=${encodeURIComponent(selected.qrToken || "")}&qid=${encodeURIComponent(selected._mongoId || selected.id)}`
                          }
                          size={180}
                        />
                      )}
                      <div className="q-qr-card-overlay">
                        <span className="q-qr-badge">{selected.id}</span>
                        <span className="q-qr-lvl">LEVEL {selected.level}</span>
                      </div>
                    </div>

                    <div className="q-qr-meta-block">
                      <div className="q-qr-meta-row">
                        <span>Station Code:</span>
                        <strong>{selected.checkpointCode || selected.checkpoint?.code || `HTG-CP${String(selected.level).padStart(2, "0")}`}</strong>
                      </div>
                      <div className="q-qr-meta-row">
                        <span>Challenge Level:</span>
                        <strong>Level {selected.level} — {selected.challenge}</strong>
                      </div>
                      <div className="q-qr-meta-row">
                        <span>Physical Station:</span>
                        <strong>{selected.checkpoint?.location || checkpoints.find((c) => c.levelNumber === selected.level)?.locationDescription || "Campus Station Placement"}</strong>
                      </div>
                    </div>

                    <div className="q-qr-actions-row">
                      <button
                        type="button"
                        className="htg-primary-button small"
                        onClick={() => handleDownloadQr(selected)}
                        title="Download high-resolution PNG QR sticker"
                      >
                        ⇩ Download PNG
                      </button>
                      <button
                        type="button"
                        className="htg-outline-button small"
                        onClick={() => setPrintTarget(selected)}
                        title="Print physical campus checkpoint placard"
                      >
                        ⎙ Print Beacon
                      </button>
                      <button
                        type="button"
                        className="htg-outline-button small"
                        onClick={() => {
                          const origin = typeof window !== "undefined" ? window.location.origin : "https://hackthegrid.codesphere.org";
                          const cpCode = selected.checkpointCode || selected.checkpoint?.code || `HTG-CP${String(selected.level).padStart(2, "0")}`;
                          const url = selected.qrScanUrl || `${origin}/checkpoint/scan?code=${encodeURIComponent(cpCode)}&token=${encodeURIComponent(selected.qrToken || "")}&qid=${encodeURIComponent(selected._mongoId || selected.id)}`;
                          navigator.clipboard?.writeText(url);
                          setNotice(`Copied canonical scan URL for ${selected.id} to clipboard.`);
                        }}
                      >
                        ⎘ Copy URL
                      </button>
                    </div>

                    <p className="q-security-note">
                      ✓ QR code embeds ONLY signed verification HMAC token. It NEVER exposes the flag, answer, or hint to scanning devices.
                    </p>

                    <div style={{ marginTop: '16px', padding: '12px', border: '1px solid #2a342b', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#b8ff3d' }}>
                        FCFS QR Question Claim Lease
                      </h4>
                      <div className="q-qr-meta-row" style={{ marginBottom: '6px' }}>
                        <span>Current Status:</span>
                        <strong>
                          {selected.isCompleted ? (
                            <span className="q-claim-badge completed">✓ Completed / Solved</span>
                          ) : selected.isClaimed ? (
                            <span className="q-claim-badge claimed">🔒 Claimed</span>
                          ) : (
                            <span className="q-claim-badge available">● Available for Claim</span>
                          )}
                        </strong>
                      </div>
                      {selected.isClaimed && (
                        <>
                          <div className="q-qr-meta-row" style={{ marginBottom: '6px' }}>
                            <span>Claimed by Team:</span>
                            <strong>{selected.claimedByTeamName || selected.claimedByTeamId || "Active Team"}</strong>
                          </div>
                          {selected.claimExpiresAt && (
                            <div className="q-qr-meta-row" style={{ marginBottom: '6px' }}>
                              <span>Lease Expires:</span>
                              <strong>{new Date(selected.claimExpiresAt).toLocaleTimeString()}</strong>
                            </div>
                          )}
                          {!selected.isCompleted && (
                            <button
                              type="button"
                              className="htg-outline-button small"
                              style={{ marginTop: '8px', color: '#f59e0b', borderColor: '#f59e0b' }}
                              onClick={() => handleReleaseClaim(selected)}
                            >
                              Release Claim Now →
                            </button>
                          )}
                        </>
                      )}
                      {selected.isCompleted && (
                        <div className="q-qr-meta-row" style={{ marginBottom: '6px' }}>
                          <span>Completed by:</span>
                          <strong>{selected.completedByTeamName || selected.completedByTeamId || "Winning Team"}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="q-detail-actions">
              <button
                type="button"
                className="q-pause-button"
                onClick={() => toggleStatus(selected)}
              >
                {selected.status === "Published"
                  ? "Ⅱ Pause Question"
                  : "▶ Publish Question"}
              </button>
              <button
                type="button"
                className="q-delete-button"
                onClick={() => handleDeleteQuestion(selected)}
              >
                ✕ Delete
              </button>
              <button
                type="button"
                className="htg-primary-button"
                onClick={() => openEdit(selected)}
              >
                ✎ Edit Question
              </button>
            </div>
          </aside>
        </section>

        {/* Footer */}
        <footer className="htg-question-footer">
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
                  className="htg-primary-button"
                  onClick={() => window.print()}
                >
                  ⎙ Print Now
                </button>
                <button
                  type="button"
                  className="htg-outline-button"
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
                <span className="htg-badge-code">
                  {printTarget.checkpointCode || printTarget.checkpoint?.code || printTarget.code || `HTG-CP${String(printTarget.level).padStart(2, "0")}`}
                </span>
                {printTarget.id && <span className="htg-badge-qid">{printTarget.id}</span>}
              </div>

              <h3 className="htg-badge-challenge">{printTarget.challenge || printTarget.title}</h3>

              <div className="htg-badge-qr-container">
                {printTarget.qrCodeDataUrl ? (
                  <img src={printTarget.qrCodeDataUrl} alt="Checkpoint QR" />
                ) : (
                  <ScannableQrImage
                    value={
                      printTarget.qrScanUrl ||
                      `${typeof window !== "undefined" ? window.location.origin : "https://hackthegrid.codesphere.org"}/checkpoint/scan?code=${encodeURIComponent(
                        printTarget.checkpointCode || printTarget.code || `HTG-CP${String(printTarget.level).padStart(2, "0")}`
                      )}&token=${encodeURIComponent(printTarget.qrToken || printTarget.token || "")}${printTarget._mongoId ? `&qid=${encodeURIComponent(printTarget._mongoId)}` : ""}`
                    }
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

      {/* Upload Questions Modal */}
      {showUploadModal && (
        <div className="q-modal-backdrop" onClick={() => setShowUploadModal(false)}>
          <div className="q-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <header>
              <div>
                <small>BULK IMPORT</small>
                <h2>Upload Questions Pool</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </header>

            <form onSubmit={handleBulkUpload}>
              <div style={{ padding: "0 0 16px", display: "grid", gap: "12px" }}>
                <p style={{ color: "#aeb9b0", fontSize: "11px", lineHeight: "1.4" }}>
                  Upload questions in JSON array or CSV format. The backend will automatically generate unique QR codes for each question and map them to the corresponding challenge level checkpoint.
                </p>

                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#f2f5ef", marginBottom: "6px" }}>
                    Select JSON or CSV File:
                  </label>
                  <input
                    ref={uploadFileInputRef}
                    type="file"
                    accept=".json,.csv,text/csv,application/json"
                    onChange={handleUploadFileChange}
                    style={{ background: "#0a100c", border: "1px solid #243528", padding: "8px", borderRadius: "6px", width: "100%", color: "#f2f5ef" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#f2f5ef", marginBottom: "6px" }}>
                    Or Paste JSON / CSV Content:
                  </label>
                  <textarea
                    rows="8"
                    value={uploadText}
                    onChange={(e) => setUploadText(e.target.value)}
                    placeholder={`JSON format example:
[
  {
    "title": "Crypto Decode",
    "prompt": "Decode the broadcast: ...",
    "flag": "HTG{secret_flag}",
    "level": 1,
    "points": 100,
    "category": "Cryptography"
  }
]

Or CSV format:
title,prompt,flag,level,points,category
Crypto Decode,"Decode: ...",HTG{flag},1,100,Cryptography`}
                    style={{
                      width: "100%",
                      font: "10px 'DM Mono', monospace",
                      background: "#070d09",
                      border: "1px solid #243528",
                      borderRadius: "6px",
                      color: "#b8ff3d",
                      padding: "10px",
                    }}
                  />
                </div>

                <div style={{ background: "#0c150f", border: "1px solid #1c2e22", borderRadius: "6px", padding: "10px", fontSize: "10px", color: "#8e9a90" }}>
                  <strong style={{ color: "#b8ff3d", display: "block", marginBottom: "4px" }}>
                    ✓ Automatic QR Generation Guarantee
                  </strong>
                  Every question imported will immediately receive an HMAC-signed QR token, scannable URL, and downloadable PNG QR badge stored directly in MongoDB.
                </div>
              </div>

              <div className="q-modal-actions">
                <button
                  type="button"
                  className="htg-outline-button"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="htg-primary-button"
                  disabled={uploading}
                >
                  {uploading ? "Generating QR Codes..." : "Upload & Generate QR Codes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Question Modal */}
      {showEditor && (
        <div
          className="q-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowEditor(false);
          }}
        >
          <form className="q-modal" onSubmit={saveQuestion}>
            <header>
              <div>
                <small>QUESTION CONFIGURATION</small>
                <h2>{editingId ? "Edit Question" : "Create Question"}</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </header>
            <div className="q-form-grid">
              <label>
                Question title *
                <input
                  required
                  value={draft.title}
                  onChange={(event) =>
                    setDraft({ ...draft, title: event.target.value })
                  }
                  placeholder="e.g. Decode the Signal"
                />
              </label>
              <label>
                Link to challenge *
                <select
                  value={draft.challenge}
                  onChange={(event) => {
                    const chTitle = event.target.value;
                    const idx = challenges.indexOf(chTitle);
                    const lvl = idx >= 0 ? idx + 1 : draft.level;
                    setDraft({ ...draft, challenge: chTitle, level: lvl });
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
                Level
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={draft.level}
                  onChange={(event) =>
                    setDraft({ ...draft, level: event.target.value })
                  }
                />
              </label>
              <label>
                Question type
                <select
                  value={draft.type}
                  onChange={(event) =>
                    setDraft({ ...draft, type: event.target.value })
                  }
                >
                  {types.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                Linked Campus Checkpoint (Optional)
                <select
                  value={draft.checkpointId || ""}
                  onChange={(event) =>
                    setDraft({ ...draft, checkpointId: event.target.value })
                  }
                >
                  <option value="">Auto-associate by Level (Default)</option>
                  {checkpoints.map((cp) => (
                    <option key={cp._id} value={cp._id}>
                      {cp.checkpointCode} — {cp.name} (Level {cp.levelNumber})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Category
                <select
                  value={draft.category}
                  onChange={(event) =>
                    setDraft({ ...draft, category: event.target.value })
                  }
                >
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                Difficulty
                <select
                  value={draft.difficulty}
                  onChange={(event) =>
                    setDraft({ ...draft, difficulty: event.target.value })
                  }
                >
                  {difficulties.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                Points
                <input
                  type="number"
                  min="0"
                  required
                  value={draft.points}
                  onChange={(event) =>
                    setDraft({ ...draft, points: event.target.value })
                  }
                />
              </label>
              <label>
                Maximum attempts
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={draft.attempts}
                  onChange={(event) =>
                    setDraft({ ...draft, attempts: event.target.value })
                  }
                />
              </label>
              <label className="q-full">
                Question prompt *
                <textarea
                  required
                  rows="4"
                  value={draft.prompt}
                  onChange={(event) =>
                    setDraft({ ...draft, prompt: event.target.value })
                  }
                  placeholder="Write the question participants will see..."
                />
              </label>
              <label className="q-full">
                Hint
                <textarea
                  rows="2"
                  value={draft.hint}
                  onChange={(event) =>
                    setDraft({ ...draft, hint: event.target.value })
                  }
                  placeholder="Optional hint for participants"
                />
              </label>
              <label className="q-full">
                Correct answer / expected flag *
                <input
                  required
                  value={draft.answer}
                  onChange={(event) =>
                    setDraft({ ...draft, answer: event.target.value })
                  }
                  placeholder="Admin-only answer key or flag"
                />
              </label>
              <label>
                Status
                <select
                  value={draft.status}
                  onChange={(event) =>
                    setDraft({ ...draft, status: event.target.value })
                  }
                >
                  <option>Draft</option>
                  <option>Published</option>
                  <option>Paused</option>
                  <option>Archived</option>
                </select>
              </label>
              <label className="q-checkbox-label">
                <input
                  type="checkbox"
                  checked={draft.required}
                  onChange={(event) =>
                    setDraft({ ...draft, required: event.target.checked })
                  }
                />{" "}
                Required to complete challenge
              </label>
            </div>
            <div className="q-modal-actions">
              <button
                type="button"
                className="htg-outline-button"
                onClick={() => setShowEditor(false)}
              >
                Cancel
              </button>
              <button type="submit" className="htg-primary-button">
                {editingId ? "Save Changes" : "Create Question"}
              </button>
            </div>
            <p className="q-modal-note">
              {isLiveDb
                ? "Changes will be written directly to the authenticated live database."
                : "Demo mode: data stays in local UI state until connected to an authenticated live database session. Secret flags remain server-side in production."}
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

