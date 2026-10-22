import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import adminService from "../../services/admin.service";
import AdminSidebar from "../../components/navigation/AdminSidebar";
import "../../styles/ChallengeManagementPage.css";


const statusClass = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/\s+/g, "-");

const categories = [
  "Recon",
  "OSINT",
  "Crypto",
  "Web",
  "Forensics",
  "Pwn",
  "Stego",
  "Network",
  "Mixed",
];
const difficulties = ["Easy", "Medium", "Hard", "Expert"];

const LEVEL_ICONS = ["🏁", "🌌", "🛰️", "📡", "🖥️", "🔎", "🔐", "🧩", "🗂️", "🌐"];

function formatDifficulty(raw) {
  if (!raw) return "Medium";
  const upper = String(raw).toUpperCase();
  if (upper === "EASY") return "Easy";
  if (upper === "MEDIUM") return "Medium";
  if (upper === "HARD") return "Hard";
  if (upper === "EXPERT") return "Expert";
  return raw;
}

function formatCategory(raw) {
  if (!raw) return "Web";
  const map = {
    CRYPTOGRAPHY: "Crypto",
    BINARY_ASCII: "Recon",
    BASE64_ENCODING: "Crypto",
    WEB_INSPECTION: "Web",
    DEBUGGING: "Pwn",
    LOGICAL_REASONING: "OSINT",
    STEGANOGRAPHY: "Stego",
    MULTI_STAGE: "Network",
    MASTER_FLAG: "Mixed",
  };
  return map[raw] || raw;
}

function mapApiChallengeToUi(ch, idx) {
  const level = Number(ch.levelNumber) || idx + 1;
  const status =
    ch.status || (ch.isActive === false ? "Paused" : "Published");
  const linkedQuestions = Array.isArray(ch.linkedQuestions)
    ? ch.linkedQuestions
    : [];
  const linkedCheckpoints = Array.isArray(ch.linkedCheckpoints)
    ? ch.linkedCheckpoints
    : [];

  return {
    id: ch._id || level,
    level,
    title: ch.title || `Level ${level}`,
    subtitle: ch.subtitle || `Stage ${level} containment node`,
    category: formatCategory(ch.category),
    difficulty: formatDifficulty(ch.difficulty),
    points: Number(ch.points) || 100,
    status,
    questions:
      ch.questionCount !== undefined
        ? Number(ch.questionCount)
        : linkedQuestions.length,
    description: ch.description || "",
    objectives:
      Array.isArray(ch.objectives) && ch.objectives.length > 0
        ? ch.objectives
        : [
            "Analyze the challenge briefing and environment",
            "Identify the vulnerability or cipher pattern",
            "Submit the validated HTG flag",
          ],
    image: ch.image || LEVEL_ICONS[level % LEVEL_ICONS.length],
    requiresCheckpointScan: ch.requiresCheckpointScan !== false,
    checkpointId: ch.checkpointId?._id || ch.checkpointId || "",
    isDemo: false,
    linkedQuestions,
    linkedCheckpoints,
  };
}

export function ChallengeManagementPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const globalSearchRef = useRef(null);

  const [challenges, setChallenges] = useState([]);
  const [checkpoints, setCheckpoints] = useState([]);
  const [selectedId, setSelectedId] = useState(4);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [difficultyFilter, setDifficultyFilter] = useState("All Difficulty");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [view, setView] = useState("list");
  const [detailTab, setDetailTab] = useState("Overview");
  const [notice, setNotice] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dataSource, setDataSource] = useState("live"); // "live" | "demo"
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({
    level: 1,
    title: "",
    subtitle: "",
    category: "Web",
    difficulty: "Easy",
    points: 50,
    status: "Draft",
    description: "",
    questions: 0,
    checkpointId: "",
    requiresCheckpointScan: true,
  });

  const fetchLiveChallenges = useCallback(async (showSuccessNotice = false) => {
    setLoading(true);
    setApiError("");
    try {
      const [chRes, cpRes] = await Promise.allSettled([
        adminService.getChallenges(),
        adminService.getCheckpoints(),
      ]);

      if (cpRes.status === "fulfilled" && cpRes.value?.data?.checkpoints) {
        setCheckpoints(cpRes.value.data.checkpoints);
      }

      if (chRes.status === "fulfilled") {
        const apiList = chRes.value?.data?.challenges;
        if (Array.isArray(apiList)) {
          const mapped = apiList.map(mapApiChallengeToUi);
          setChallenges(mapped);
          setDataSource("live");
          if (mapped.length > 0) {
            setSelectedId((prev) =>
              mapped.some((item) => item.id === prev) ? prev : mapped[0].id
            );
          }
          if (showSuccessNotice) {
            setNotice(
              `Synchronized ${mapped.length} challenge level(s) from the live Admin API.`
            );
          }
        }
      } else {
        throw chRes.reason;
      }
    } catch (err) {
      const serverMsg = err?.response?.data?.message;
      setDataSource("live");
      setChallenges([]);
      setApiError(serverMsg || "Failed to synchronize challenge levels with live database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveChallenges(false);
  }, [fetchLiveChallenges]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        globalSearchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = useMemo(
    () =>
      challenges.filter((challenge) => {
        const term = search.toLowerCase().trim();
        const matchesSearch =
          !term ||
          [
            challenge.title,
            challenge.subtitle,
            challenge.category,
            challenge.description,
          ].some((item) => String(item || "").toLowerCase().includes(term));
        return (
          matchesSearch &&
          (statusFilter === "All Status" || challenge.status === statusFilter) &&
          (difficultyFilter === "All Difficulty" ||
            challenge.difficulty === difficultyFilter) &&
          (categoryFilter === "All Categories" ||
            challenge.category === categoryFilter)
        );
      }),
    [challenges, search, statusFilter, difficultyFilter, categoryFilter]
  );

  const selected =
    challenges.find((challenge) => challenge.id === selectedId) ||
    filtered[0] ||
    challenges[0] ||
    null;

  const published = challenges.filter((item) => item.status === "Published").length;
  const draftCount = challenges.filter((item) => item.status === "Draft").length;
  const paused = challenges.filter((item) => item.status === "Paused").length;
  const totalPoints = challenges.reduce(
    (sum, item) => sum + Number(item.points || 0),
    0
  );

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All Status");
    setDifficultyFilter("All Difficulty");
    setCategoryFilter("All Categories");
  };

  const openCreate = () => {
    const nextLevel =
      challenges.reduce((max, item) => Math.max(max, Number(item.level) || 0), 0) +
      1;
    setEditingId(null);
    setDraft({
      level: nextLevel,
      title: "",
      subtitle: "",
      category: "Web",
      difficulty: "Easy",
      points: 50,
      status: "Draft",
      description: "",
      questions: 0,
      checkpointId: "",
      requiresCheckpointScan: true,
    });
    setShowEditor(true);
  };

  const openEdit = (challenge) => {
    setEditingId(challenge.id);
    setDraft({
      level: challenge.level,
      title: challenge.title,
      subtitle: challenge.subtitle,
      category: challenge.category,
      difficulty: challenge.difficulty,
      points: challenge.points,
      status: challenge.status,
      description: challenge.description,
      questions: challenge.questions,
      checkpointId: challenge.checkpointId || "",
      requiresCheckpointScan: challenge.requiresCheckpointScan !== false,
    });
    setShowEditor(true);
  };

  const saveDraft = async (event) => {
    event.preventDefault();
    if (!draft.title.trim()) {
      setNotice("Please enter a challenge title.");
      return;
    }

    if (dataSource === "live") {
      setSaving(true);
      setApiError("");
      try {
        if (editingId) {
          const res = await adminService.updateChallenge(editingId, {
            levelNumber: Number(draft.level),
            title: draft.title.trim(),
            subtitle: draft.subtitle.trim(),
            category: draft.category,
            difficulty: draft.difficulty,
            points: Number(draft.points),
            status: draft.status,
            description: draft.description.trim(),
            checkpointId: draft.checkpointId || null,
            requiresCheckpointScan: Boolean(draft.requiresCheckpointScan),
          });
          const updated = res?.data?.challenge;
          if (updated) {
            const mapped = mapApiChallengeToUi(updated, 0);
            setChallenges((items) =>
              items.map((item) => (item.id === editingId ? mapped : item))
            );
            setSelectedId(mapped.id);
          }
          setNotice(res?.message || `Challenge "${draft.title}" updated on server.`);
        } else {
          const res = await adminService.createChallenge({
            levelNumber: Number(draft.level),
            title: draft.title.trim(),
            subtitle: draft.subtitle.trim() || "New challenge",
            category: draft.category,
            difficulty: draft.difficulty,
            points: Number(draft.points),
            status: draft.status,
            description:
              draft.description.trim() ||
              `${draft.title.trim()} — Level ${draft.level} challenge.`,
            checkpointId: draft.checkpointId || null,
            requiresCheckpointScan: Boolean(draft.requiresCheckpointScan),
          });
          const created = res?.data?.challenge;
          if (created) {
            const mapped = mapApiChallengeToUi(created, challenges.length);
            setChallenges((items) => [...items, mapped]);
            setSelectedId(mapped.id);
          }
          setNotice(res?.message || `Challenge "${draft.title}" created on server.`);
        }
        setShowEditor(false);
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          "Failed to save challenge on server. Ensure you are authenticated as an ADMIN.";
        setApiError(msg);
      } finally {
        setSaving(false);
      }
      return;
    }

    // Demo state fallback
    if (editingId) {
      setChallenges((items) =>
        items.map((item) =>
          item.id === editingId
            ? { ...item, ...draft, points: Number(draft.points) }
            : item
        )
      );
      setNotice(
        "Challenge updated in local demo state. Connect the backend API to persist changes."
      );
      setSelectedId(editingId);
    } else {
      const newId = Math.max(0, ...challenges.map((item) => Number(item.id) || 0)) + 1;
      const newChallenge = {
        ...draft,
        id: newId,
        level: Number(draft.level) || Math.min(10, newId),
        points: Number(draft.points),
        questions: Number(draft.questions) || 0,
        subtitle: draft.subtitle || "New challenge",
        objectives: ["Add learning objectives in the full editor"],
        image: "🧩",
        isDemo: false,
        linkedQuestions: [],
        linkedCheckpoints: [],
      };
      setChallenges((items) => [...items, newChallenge]);
      setSelectedId(newId);
      setNotice(
        "Challenge created in local demo state. Connect the backend API to persist changes."
      );
    }
    setShowEditor(false);
  };

  const handleDeleteChallenge = async (challenge) => {
    if (!challenge) return;
    if (
      !window.confirm(
        `Are you sure you want to permanently delete challenge "${challenge.title}" (Level ${challenge.level})? This will also remove any linked questions from the pool.`
      )
    ) {
      return;
    }

    if (challenge?.id) {
      try {
        await adminService.deleteChallenge(challenge.id);
        const remaining = challenges.filter((c) => c.id !== challenge.id);
        setChallenges(remaining);
        if (selectedId === challenge.id && remaining.length > 0) {
          setSelectedId(remaining[0].id);
        }
        setNotice(`Challenge "${challenge.title}" deleted.`);
      } catch (err) {
        setApiError(
          err.response?.data?.message || "Failed to delete challenge from server."
        );
      }
      return;
    }

    const remaining = challenges.filter((c) => c.id !== challenge.id);
    setChallenges(remaining);
    if (selectedId === challenge.id && remaining.length > 0) {
      setSelectedId(remaining[0].id);
    }
    setNotice(`Challenge "${challenge.title}" removed from demo state.`);
  };

  const toggleStatus = async (challenge) => {
    const nextStatus = challenge.status === "Published" ? "Paused" : "Published";

    if (challenge?.id) {
      try {
        const res = await adminService.updateChallenge(challenge.id, {
          status: nextStatus,
          isActive: nextStatus === "Published",
        });
        const updated = res?.data?.challenge;
        setChallenges((items) =>
          items.map((item) =>
            item.id === challenge.id
              ? updated
                ? mapApiChallengeToUi(updated, item.level - 1)
                : { ...item, status: nextStatus }
              : item
          )
        );
        setNotice(
          `${challenge.title} set to ${nextStatus} on the server.`
        );
      } catch (err) {
        setApiError(
          err.response?.data?.message ||
            "Failed to update challenge status on server."
        );
      }
      return;
    }

    setChallenges((items) =>
      items.map((item) =>
        item.id === challenge.id ? { ...item, status: nextStatus } : item
      )
    );
    setNotice(
      `${challenge.title} set to ${nextStatus} in local demo state. Connect the backend API to persist changes.`
    );
  };

  const exportCsv = () => {
    const rows = [
      ["Level", "Title", "Category", "Difficulty", "Points", "Status", "Questions", "Data Source"],
      ...filtered.map((item) => [
        item.level,
        item.title,
        item.category,
        item.difficulty,
        item.points,
        item.status,
        item.questions,
        "Live Database",
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
    link.download = "the-tech-mystery-challenges.csv";
    link.click();
    URL.revokeObjectURL(url);
    setNotice(
      `Filtered challenge list (${
        "live database records"
      }) exported as CSV.`
    );
  };

  const adminDisplayName = user?.fullName || user?.username || "Admin";
  const adminAvatar = (adminDisplayName || "A").slice(0, 1).toUpperCase();
  const linkedCheckpointCount = selected?.linkedCheckpoints?.length || 0;

  return (
    <div className="htg-challenge-page">
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <main className="htg-challenge-main">
        <header className="htg-topbar">
          <button
            type="button"
            className="htg-mobile-menu-btn"
            aria-label="Toggle navigation sidebar"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            ☰
          </button>
          <div className="htg-global-search">
            <span>⌕</span>
            <input
              ref={globalSearchRef}
              aria-label="Global search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search challenges, teams, members..."
            />
            <kbd>Ctrl + K</kbd>
          </div>
          <button
            type="button"
            className="htg-icon-button"
            aria-label="Notifications"
            onClick={() =>
              setNotice("No unread administrative alerts at this time.")
            }
          >
            ♧<i />
          </button>
          <Link to={ROUTES.ADMIN_LOGIN} className="htg-admin-chip">
            <span className="htg-admin-avatar">{adminAvatar}</span>
            <span>
              <strong>{adminDisplayName}</strong>
              <small>
                {isAuthenticated && user?.role === "ADMIN"
                  ? "Authenticated Admin"
                  : "Event Administrator"}
              </small>
            </span>
            <span>⌄</span>
          </Link>
        </header>

        <section className="htg-challenge-hero">
          <div className="htg-breadcrumb">
            Admin <span>›</span> Challenges
            <em className="htg-data-pill live">{loading ? "SYNCING API..." : "● LIVE DATABASE"}</em>
          </div>
          <div className="htg-heading-row">
            <div>
              <h1>
                Challenges <em>Management</em>
              </h1>
              <p>
                Create, manage and organize all challenge levels for The Tech Mystery.
              </p>
            </div>
            <div className="htg-hero-actions">
              <button
                type="button"
                className="htg-outline-button"
                onClick={() => fetchLiveChallenges(true)}
                disabled={loading}
              >
                {loading ? "Syncing..." : "↻ Sync API"}
              </button>
              <button
                type="button"
                className="htg-primary-button"
                onClick={openCreate}
              >
                ＋ Add Challenge
              </button>
            </div>
          </div>
        </section>

        {apiError && (
          <div className="htg-api-banner" role="alert">
            <span>
              <strong>API Status:</strong> {apiError}
            </span>
            <div className="htg-api-banner-actions">
              {!isAuthenticated && (
                <Link to={ROUTES.ADMIN_LOGIN} className="htg-banner-link">
                  Admin Login ↗
                </Link>
              )}
              <button
                type="button"
                onClick={() => setApiError("")}
                aria-label="Dismiss API warning"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {notice && (
          <div className="htg-notice" role="status">
            {notice}
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss notice"
            >
              ×
            </button>
          </div>
        )}

        <section className="htg-challenge-stats">
          <article className="htg-challenge-stat">
            <span className="stat-icon lime">♧</span>
            <div>
              <strong>{challenges.length}</strong>
              <small>Total Levels</small>
            </div>
            <div className="stat-meter">
              <i style={{ width: `${Math.min(100, challenges.length * 10)}%` }} />
            </div>
          </article>
          <article className="htg-challenge-stat">
            <span className="stat-icon lime">⚑</span>
            <div>
              <strong>{published}</strong>
              <small>Published</small>
            </div>
            <div className="stat-meter">
              <i
                style={{
                  width: `${
                    challenges.length ? (published / challenges.length) * 100 : 0
                  }%`,
                }}
              />
            </div>
          </article>
          <article className="htg-challenge-stat">
            <span className="stat-icon amber">◷</span>
            <div>
              <strong>{draftCount}</strong>
              <small>Draft</small>
            </div>
            <div className="stat-meter amber-meter">
              <i
                style={{
                  width: `${
                    challenges.length ? (draftCount / challenges.length) * 100 : 0
                  }%`,
                }}
              />
            </div>
          </article>
          <article className="htg-challenge-stat">
            <span className="stat-icon muted">Ⅱ</span>
            <div>
              <strong>{paused}</strong>
              <small>Paused</small>
            </div>
            <div className="stat-meter muted-meter">
              <i
                style={{
                  width: `${
                    challenges.length ? (paused / challenges.length) * 100 : 0
                  }%`,
                }}
              />
            </div>
          </article>
          <article className="htg-challenge-stat">
            <span className="stat-icon purple">♜</span>
            <div>
              <strong>{totalPoints.toLocaleString("en-IN")}</strong>
              <small>Total Points</small>
            </div>
            <div className="stat-meter purple-meter">
              <i style={{ width: "72%" }} />
            </div>
          </article>
        </section>

        <section className="htg-challenge-toolbar">
          <label className="htg-challenge-search">
            <span>⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search challenges by title, description or category..."
            />
          </label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Paused</option>
          </select>
          <select
            value={difficultyFilter}
            onChange={(event) => setDifficultyFilter(event.target.value)}
            aria-label="Filter by difficulty"
          >
            <option>All Difficulty</option>
            {difficulties.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            aria-label="Filter by category"
          >
            <option>All Categories</option>
            {categories.map((item) => (
              <option key={item}>{item}</option>
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
          <button
            type="button"
            className="htg-outline-button"
            onClick={exportCsv}
          >
            ⇩ <span>Export</span>
          </button>
          <div className="htg-view-toggle">
            <button
              type="button"
              className={view === "list" ? "selected" : ""}
              onClick={() => setView("list")}
              aria-label="List view"
            >
              ☷
            </button>
            <button
              type="button"
              className={view === "grid" ? "selected" : ""}
              onClick={() => setView("grid")}
              aria-label="Grid view"
            >
              ▦
            </button>
          </div>
        </section>

        <section className="htg-challenge-content">
          <div className="htg-challenge-list">
            {view === "list" ? (
              <div className="htg-challenge-table-wrap">
                <table className="htg-challenge-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Level</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Difficulty</th>
                      <th>Points</th>
                      <th>Status</th>
                      <th>Questions</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item, index) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className={
                          selected?.id === item.id ? "selected-row" : ""
                        }
                      >
                        <td>{index + 1}</td>
                        <td>Level {item.level}</td>
                        <td>
                          <div className="htg-challenge-title-cell">
                            <span
                              className={`htg-challenge-art art-${
                                item.level % 5
                              }`}
                            >
                              {item.image}
                            </span>
                            <span>
                              <strong>{item.title}</strong>
                              <small>{item.subtitle}</small>
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="htg-category-chip">
                            {item.category}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`htg-difficulty ${statusClass(
                              item.difficulty
                            )}`}
                          >
                            {item.difficulty}
                          </span>
                        </td>
                        <td className="challenge-points">{item.points}</td>
                        <td>
                          <div className="htg-publish-control">
                            <span
                              className={`htg-status-badge ${statusClass(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                            <button
                              type="button"
                              aria-label={`${
                                item.status === "Published" ? "Pause" : "Publish"
                              } ${item.title}`}
                              className={`htg-switch ${
                                item.status === "Published" ? "on" : ""
                              }`}
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleStatus(item);
                              }}
                            >
                              <i />
                            </button>
                          </div>
                        </td>
                        <td>{item.questions}</td>
                        <td>
                          <button
                            type="button"
                            className="htg-row-action"
                            title="Edit challenge"
                            onClick={(event) => {
                              event.stopPropagation();
                              openEdit(item);
                            }}
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            className="htg-row-action"
                            title="More actions"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedId(item.id);
                              setNotice(
                                `Selected ${item.title}. Use the right-hand details panel to inspect questions, checkpoints, or edit configuration.`
                              );
                            }}
                          >
                            ···
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan="9" className="htg-empty-state">
                          {loading
                            ? "Loading challenge records..."
                            : "No challenges match these filters."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="htg-challenge-cards">
                {filtered.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={`htg-challenge-card ${
                      selected?.id === item.id ? "chosen" : ""
                    }`}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <span
                      className={`htg-challenge-art art-${item.level % 5}`}
                    >
                      {item.image}
                    </span>
                    <small>LEVEL {item.level}</small>
                    <strong>{item.title}</strong>
                    <span className="htg-category-chip">{item.category}</span>
                    <span
                      className={`htg-difficulty ${statusClass(
                        item.difficulty
                      )}`}
                    >
                      {item.difficulty}
                    </span>
                    <div className="htg-challenge-card-bottom">
                      <span>{item.points} pts</span>
                      <span
                        className={`htg-status-badge ${statusClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="htg-empty-state">
                    No challenges match these filters.
                  </p>
                )}
              </div>
            )}
            <footer className="htg-challenge-table-footer">
              <span>
                Showing {filtered.length ? 1 : 0} to {filtered.length} of{" "}
                {filtered.length} challenges
              </span>
              <div>
                <button type="button" disabled>
                  ‹
                </button>
                <button type="button" className="current">
                  1
                </button>
                <button type="button" disabled>
                  ›
                </button>
              </div>
            </footer>
          </div>

          {selected && (
            <aside className="htg-challenge-detail">
              <div className={`htg-detail-cover cover-${selected.level % 5}`}>
                <div className="cover-grid" />
                <span
                  className={`htg-status-badge ${statusClass(selected.status)}`}
                >
                  {selected.status}
                </span>
                <div className="cover-copy">
                  <small>LEVEL {selected.level}</small>
                  <h2>{selected.title}</h2>
                  <p>{selected.subtitle}</p>
                </div>
              </div>
              <div className="htg-challenge-meta">
                <div>
                  <strong>♜ {selected.points}</strong>
                  <small>Points</small>
                </div>
                <div>
                  <strong>▥ {selected.difficulty}</strong>
                  <small>Difficulty</small>
                </div>
                <div>
                  <strong>▰ {selected.category}</strong>
                  <small>Category</small>
                </div>
              </div>
              <div className="htg-detail-tabs">
                <button
                  type="button"
                  className={detailTab === "Overview" ? "active" : ""}
                  onClick={() => setDetailTab("Overview")}
                >
                  Overview
                </button>
                <button
                  type="button"
                  className={detailTab === "Questions" ? "active" : ""}
                  onClick={() => {
                    setDetailTab("Questions");
                    setNotice(
                      `Questions for ${selected.title}: ${selected.questions} linked (${
                        dataSource === "live" ? "live pool count" : "demo count"
                      }). Secret flags are kept exclusively on the server.`
                    );
                  }}
                >
                  Questions ({selected.questions})
                </button>
                <button
                  type="button"
                  className={detailTab === "Checkpoints" ? "active" : ""}
                  onClick={() => {
                    setDetailTab("Checkpoints");
                    setNotice(
                      selected.linkedCheckpoints?.length
                        ? `Showing ${selected.linkedCheckpoints.length} checkpoint(s) linked to Level ${selected.level}.`
                        : "QR checkpoint mapping is a UI preview unless configured in QR Checkpoints Manager (/admin/checkpoints)."
                    );
                  }}
                >
                  QR Checkpoints ({linkedCheckpointCount})
                </button>
              </div>

              {detailTab === "Overview" && (
                <section className="htg-challenge-detail-section">
                  <div className="htg-section-title">
                    <h3>Description</h3>
                    <button type="button" onClick={() => openEdit(selected)}>
                      Edit
                    </button>
                  </div>
                  <p>{selected.description}</p>
                  <h3>Learning Objectives</h3>
                  <ul>
                    {selected.objectives.map((objective) => (
                      <li key={objective}>{objective}</li>
                    ))}
                  </ul>
                  <h3>Attachments</h3>
                  <div className="htg-attachment">
                    <span>▤</span>
                    <div>
                      <strong>challenge-materials.zip</strong>
                      <small>Demo attachment · not uploaded</small>
                    </div>
                    <button
                      type="button"
                      aria-label="Download attachment"
                      onClick={() =>
                        setNotice(
                          "No attachment is configured for this challenge. Binary/stego file upload API is pending backend storage integration."
                        )
                      }
                    >
                      ↓
                    </button>
                  </div>
                </section>
              )}

              {detailTab === "Questions" && (
                <section className="htg-challenge-detail-section">
                  <div className="htg-section-title">
                    <h3>Question Pool Variations ({selected.questions})</h3>
                    <button
                      type="button"
                      onClick={() => navigate(ROUTES.ADMIN_QUESTIONS)}
                    >
                      Manage Pool ↗
                    </button>
                  </div>
                  <p>
                    Each team is dynamically assigned one variation for Level{" "}
                    {selected.level}. Secret flags are stored server-side with{" "}
                    <code>select: false</code> and never transmitted to the client.
                  </p>
                  {Array.isArray(selected.linkedQuestions) &&
                  selected.linkedQuestions.length > 0 ? (
                    <div className="htg-linked-list">
                      {selected.linkedQuestions.map((q, idx) => (
                        <div className="htg-linked-item" key={q._id || idx}>
                          <div>
                            <strong>{q.title || `Variation #${idx + 1}`}</strong>
                            <small>
                              Level {q.levelNumber} · {formatDifficulty(q.difficulty)} ·{" "}
                              {q.hints?.length || 0} hint(s)
                            </small>
                          </div>
                          <span className="htg-status-badge published">
                            Flag Hidden
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ marginTop: "10px" }}>
                      "No question variations created for this level yet. Open Questions Management (/admin/questions) to add pool variations."
                    </p>
                  )}
                </section>
              )}

              {detailTab === "Checkpoints" && (
                <section className="htg-challenge-detail-section">
                  <div className="htg-section-title">
                    <h3>Linked QR Checkpoints</h3>
                    <button
                      type="button"
                      onClick={() => navigate(ROUTES.ADMIN_CHECKPOINTS)}
                    >
                      Manage QR ↗
                    </button>
                  </div>
                  <p>
                    Sequential level unlock rule: participants must complete Level{" "}
                    {Math.max(1, selected.level - 1)} and scan the HMAC-signed campus QR
                    placard to unlock Level {selected.level}.
                  </p>
                  {Array.isArray(selected.linkedCheckpoints) &&
                  selected.linkedCheckpoints.length > 0 ? (
                    <div className="htg-linked-list">
                      {selected.linkedCheckpoints.map((cp, idx) => (
                        <div
                          className="htg-linked-item"
                          key={cp._id || cp.checkpointCode || idx}
                        >
                          <div>
                            <strong>
                              {cp.checkpointCode} — {cp.name}
                            </strong>
                            <small>
                              {cp.locationDescription} · {cp.scanCount || 0} scan(s)
                            </small>
                          </div>
                          <span className="htg-status-badge published">
                            Active
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ marginTop: "10px" }}>
                      No physical checkpoint record linked to Level {selected.level}{" "}
                      yet. Configure beacons in QR Checkpoints Manager.
                    </p>
                  )}
                </section>
              )}

              <div className="htg-detail-actions">
                <button
                  type="button"
                  className="htg-pause-button"
                  onClick={() => toggleStatus(selected)}
                >
                  {selected.status === "Published" ? "Ⅱ Unpublish" : "▶ Publish"}
                </button>
                <button
                  type="button"
                  className="htg-outline-button"
                  onClick={() => openEdit(selected)}
                >
                  ✎ Edit Challenge
                </button>
                <button
                  type="button"
                  className="htg-delete-button"
                  onClick={() => handleDeleteChallenge(selected)}
                >
                  ✕ Delete
                </button>
                <button
                  type="button"
                  className="htg-primary-button"
                  onClick={() => {
                    setDetailTab("Questions");
                    setNotice(
                      `Viewing question pool summary for ${selected.title}. Use /admin/questions to add or edit question prompts.`
                    );
                  }}
                >
                  ▤ View Questions
                </button>
              </div>
            </aside>
          )}
        </section>

        <footer className="htg-challenge-footer">
          Build with <span>♥</span> by Hrithik Roshan{" "}
          <small>THE TECH MYSTERY · MISSION CONTROL</small>
        </footer>
      </main>

      {showEditor && (
        <div
          className="htg-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowEditor(false);
          }}
        >
          <form className="htg-challenge-modal" onSubmit={saveDraft}>
            <div className="htg-modal-header">
              <div>
                <small>CHALLENGE CONFIGURATION</small>
                <h2>{editingId ? "Edit Challenge" : "Add Challenge"}</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <label>
              Challenge title
              <input
                required
                value={draft.title}
                onChange={(event) =>
                  setDraft({ ...draft, title: event.target.value })
                }
                placeholder="e.g. Hidden Signal"
              />
            </label>
            <label>
              Subtitle
              <input
                value={draft.subtitle}
                onChange={(event) =>
                  setDraft({ ...draft, subtitle: event.target.value })
                }
                placeholder="Short challenge tagline"
              />
            </label>
            <div className="htg-modal-row">
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
            </div>
            <div className="htg-modal-row">
              <label>
                Points
                <input
                  type="number"
                  min="0"
                  value={draft.points}
                  onChange={(event) =>
                    setDraft({ ...draft, points: event.target.value })
                  }
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
            </div>
            <div className="htg-modal-row">
              <label>
                Linked QR Checkpoint (Campus Beacon)
                <select
                  value={draft.checkpointId || ""}
                  onChange={(event) =>
                    setDraft({ ...draft, checkpointId: event.target.value })
                  }
                >
                  <option value="">None / Independent (No Checkpoint)</option>
                  {checkpoints.map((cp) => (
                    <option key={cp._id} value={cp._id}>
                      {cp.checkpointCode} — {cp.name} (Level {cp.levelNumber})
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", marginTop: "18px" }}>
                <input
                  type="checkbox"
                  style={{ width: "auto" }}
                  checked={draft.requiresCheckpointScan}
                  onChange={(event) =>
                    setDraft({ ...draft, requiresCheckpointScan: event.target.checked })
                  }
                />
                Require Checkpoint Scan
              </label>
            </div>
            <label>
              Description
              <textarea
                rows="4"
                value={draft.description}
                onChange={(event) =>
                  setDraft({ ...draft, description: event.target.value })
                }
                placeholder="Describe the challenge and its intended environment."
              />
            </label>
            <div className="htg-modal-actions">
              <button
                type="button"
                className="htg-outline-button"
                onClick={() => setShowEditor(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="htg-primary-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Save Changes"
                  : "Create Challenge"}
              </button>
            </div>
            <p className="htg-modal-note">
              "Live database mode: changes are validated and persisted via /api/v1/admin/challenges."
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChallengeManagementPage;

