import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import adminService from "../../services/admin.service";
import AdminSidebar from "../../components/navigation/AdminSidebar";
import "../../styles/QuestionManagementPage.css";

const initialQuestions = [
  {
    id: "Q-001",
    title: "Decode the Signal",
    challenge: "Lost Transmission",
    level: 3,
    type: "Text Answer",
    category: "Cryptography",
    difficulty: "Medium",
    points: 100,
    status: "Published",
    attempts: 3,
    hint: "Try shifting each letter by a fixed number.",
    prompt:
      "A short encrypted message has been intercepted. Decode the provided ciphertext using the clue and submit the recovered plaintext.",
    answer: "demo-answer-not-for-production",
    updated: "Oct 12, 2026",
    required: true,
    isDemo: true,
  },
  {
    id: "Q-002",
    title: "Find the Hidden Clue",
    challenge: "Hidden in Plain Sight",
    level: 2,
    type: "Flag",
    category: "OSINT",
    difficulty: "Easy",
    points: 75,
    status: "Published",
    attempts: 5,
    hint: "Inspect the event materials carefully.",
    prompt:
      "Review the supplied event artifact and identify the hidden clue that leads to the next checkpoint.",
    answer: "HTG{demo_flag_002}",
    updated: "Oct 11, 2026",
    required: true,
    isDemo: true,
  },
  {
    id: "Q-003",
    title: "Inspect the Metadata",
    challenge: "Digital Forensics",
    level: 5,
    type: "Flag",
    category: "Forensics",
    difficulty: "Medium",
    points: 150,
    status: "Draft",
    attempts: 3,
    hint: "Start with the file properties.",
    prompt:
      "Analyze the provided sample file in the offline challenge environment and recover the requested evidence.",
    answer: "HTG{demo_flag_003}",
    updated: "Oct 11, 2026",
    required: false,
    isDemo: true,
  },
  {
    id: "Q-004",
    title: "Caesar's Secret",
    challenge: "Lost Transmission",
    level: 3,
    type: "Multiple Choice",
    category: "Cryptography",
    difficulty: "Easy",
    points: 50,
    status: "Published",
    attempts: 3,
    hint: "The key is a small integer.",
    prompt: "Which option correctly describes a Caesar cipher?",
    answer: "A substitution cipher",
    updated: "Oct 10, 2026",
    required: true,
    isDemo: true,
  },
  {
    id: "Q-005",
    title: "Spot the Weakness",
    challenge: "System Breach",
    level: 4,
    type: "Text Answer",
    category: "Web Security",
    difficulty: "Hard",
    points: 125,
    status: "Paused",
    attempts: 2,
    hint: "Look at how the demo app handles input.",
    prompt:
      "Inspect the deliberately vulnerable demo application and identify the intended weakness. Do not test systems outside the provided sandbox.",
    answer: "input-validation",
    updated: "Oct 09, 2026",
    required: true,
    isDemo: true,
  },
  {
    id: "Q-006",
    title: "Master Grid Fragment",
    challenge: "The Final Grid",
    level: 10,
    type: "Flag",
    category: "Mixed",
    difficulty: "Expert",
    points: 500,
    status: "Draft",
    attempts: 1,
    hint: "Combine the fragments earned earlier.",
    prompt:
      "Combine the valid fragments collected during the event to produce the final Master Flag.",
    answer: "HTG{demo_master_flag}",
    updated: "Oct 09, 2026",
    required: true,
    isDemo: true,
  },
  {
    id: "Q-007",
    title: "Read the Packet",
    challenge: "Lateral Movement",
    level: 9,
    type: "File Upload",
    category: "Networking",
    difficulty: "Expert",
    points: 300,
    status: "Draft",
    attempts: 2,
    hint: "Inspect the provided packet capture offline.",
    prompt:
      "Use the provided packet capture in the controlled lab and answer the question about the simulated traffic.",
    answer: "demo-packet-answer",
    updated: "Oct 08, 2026",
    required: false,
    isDemo: true,
  },
  {
    id: "Q-008",
    title: "Base64 Vault",
    challenge: "Encrypted Shadows",
    level: 7,
    type: "Text Answer",
    category: "Encoding",
    difficulty: "Hard",
    points: 200,
    status: "Published",
    attempts: 3,
    hint: "The text uses a common encoding scheme.",
    prompt:
      "Decode the supplied Base64 sample and submit the expected output.",
    answer: "demo-decoded-text",
    updated: "Oct 08, 2026",
    required: true,
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
  updated: "Just now",
  required: true,
};

const statusClass = (value) => (value || "").toLowerCase().replace(/\s+/g, "-");

export default function QuestionManagementPage() {
  const { user, isAuthenticated } = useAuth();
  const [questions, setQuestions] = useState(initialQuestions);
  const [challenges, setChallenges] = useState(fallbackChallenges);
  const [selectedId, setSelectedId] = useState("Q-001");
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
      updated: q.updatedAt
        ? new Date(q.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Live DB",
      required: q.required !== undefined ? Boolean(q.required) : true,
      isDemo: false,
    };
  }, []);

  // Fetch live questions and challenges from backend
  const fetchQuestions = useCallback(async () => {
    if (!isAuthenticated || user?.role !== "ADMIN") {
      setIsLiveDb(false);
      return;
    }

    setLoading(true);
    try {
      const [questionsRes, challengesRes] = await Promise.allSettled([
        adminService.getQuestions({ includeFlag: "true" }),
        adminService.getChallenges(),
      ]);

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
          // If database is empty, maintain initial demo questions with demo flag
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
    questions.find((item) => item.id === selectedId) || questions[0] || blankQuestion;

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
    setDraft({ ...question });
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
      // Local state fallback for demo preview
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
          isDemo: true,
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
    link.download = `hack-the-grid-questions-${new Date().toISOString().slice(0, 10)}.csv`;
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
            {isLiveDb ? (
              <span className="htg-data-pill live">● LIVE DATABASE</span>
            ) : (
              <span className="htg-data-pill demo">● DEMO PREVIEW DATA</span>
            )}
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
        {!isLiveDb && !dbBannerDismissed && (
          <div className="htg-api-banner">
            <div>
              <strong>● DEMO PREVIEW DATA</strong> — Live database synchronization
              active when authenticated as Administrator. Answer keys remain
              server-side in production.
            </div>
            <div className="htg-api-banner-actions">
              <Link to={ROUTES.ADMIN_LOGIN} className="htg-banner-link">
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
                        <td>{item.attempts}</td>
                        <td>
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
                        <td colSpan="9" className="q-empty">
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
              <button className="active">Preview</button>
              <button
                type="button"
                onClick={() =>
                  setNotice(
                    "Answer settings are edited through the question form. Secret answer keys remain strictly server-side."
                  )
                }
              >
                Answer Settings
              </button>
              <button
                type="button"
                onClick={() =>
                  setNotice(
                    "QR checkpoint mapping connects automatically through the level number."
                  )
                }
              >
                QR Mapping
              </button>
            </div>
            <div className="q-detail-body">
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
          <small>HACK THE GRID · MISSION CONTROL</small>
        </footer>
      </main>

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
