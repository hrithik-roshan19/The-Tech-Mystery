import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import adminService from "../../services/admin.service";
import AdminSidebar from "../../components/navigation/AdminSidebar";
import "../../styles/SubmissionManagementPage.css";


const resultOptions = ["Correct", "Incorrect", "Pending Review"];
const resultClass = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/\s+/g, "-");
const statusIcon = (value) =>
  value === "Correct" ? "✓" : value === "Incorrect" ? "×" : "◷";

export default function SubmissionManagementPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [selectedId, setSelectedId] = useState("SUB-1046");
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState("All Results");
  const [levelFilter, setLevelFilter] = useState("All Levels");
  const [teamFilter, setTeamFilter] = useState("All Teams");
  const [view, setView] = useState("table");
  const [notice, setNotice] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [reviewPoints, setReviewPoints] = useState("100");
  const [showAnswer, setShowAnswer] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLiveDb, setIsLiveDb] = useState(true);
  const [dbBannerDismissed, setDbBannerDismissed] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  // Sync live submissions from backend
  useEffect(() => {
    let isMounted = true;
    async function fetchSubmissions() {
      try {
        const res = await adminService.getSubmissionLogs({ limit: 100 });
        if (isMounted) {
          const apiSubs = res?.data?.submissions || [];
          setSubmissions(apiSubs);
          setIsLiveDb(true);
          if (apiSubs.length > 0) {
            const firstPending = apiSubs.find((s) => s.result === "Pending Review");
            if (firstPending) {
              setSelectedId(firstPending.id);
              setReviewPoints(String(firstPending.maxPoints || 100));
            } else {
              setSelectedId(apiSubs[0].id);
              setReviewPoints(String(apiSubs[0].points || apiSubs[0].maxPoints || 100));
            }
          } else {
            setSelectedId(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          setSubmissions([]);
          setSelectedId(null);
          setIsLiveDb(true);
        }
      }
    }
    fetchSubmissions();
    return () => {
      isMounted = false;
    };
  }, []);

  const selected =
    submissions.find((item) => item.id === selectedId) ||
    submissions[0] ||
    null;

  const filtered = useMemo(() => {
    return submissions.filter((item) => {
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        [
          item.id,
          item.team,
          item.teamCode,
          item.question,
          item.challenge,
          item.answer,
        ].some((value) => String(value || "").toLowerCase().includes(term));
      return (
        matchesSearch &&
        (resultFilter === "All Results" || item.result === resultFilter) &&
        (levelFilter === "All Levels" || item.level === Number(levelFilter)) &&
        (teamFilter === "All Teams" || item.team === teamFilter)
      );
    });
  }, [submissions, search, resultFilter, levelFilter, teamFilter]);

  const correctCount = submissions.filter(
    (item) => item.result === "Correct"
  ).length;
  const incorrectCount = submissions.filter(
    (item) => item.result === "Incorrect"
  ).length;
  const pendingCount = submissions.filter(
    (item) => item.result === "Pending Review"
  ).length;
  const totalPoints = submissions.reduce(
    (sum, item) => sum + Number(item.points || 0),
    0
  );
  const teams = [...new Set(submissions.map((item) => item.team))];

  const resetFilters = () => {
    setSearch("");
    setResultFilter("All Results");
    setLevelFilter("All Levels");
    setTeamFilter("All Teams");
  };

  const exportCsv = () => {
    const rows = [
      [
        "Submission ID",
        "Team",
        "Team Code",
        "Question",
        "Challenge",
        "Level",
        "Result",
        "Points",
        "Attempts",
        "Time",
        "Date",
        "Reviewed",
      ],
      ...filtered.map((item) => [
        item.id,
        item.team,
        item.teamCode,
        item.question,
        item.challenge,
        item.level,
        item.result,
        item.points,
        item.attempts,
        item.submittedAt,
        item.date,
        item.reviewed ? "Yes" : "No",
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
    link.download = `the-tech-mystery-submissions-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Filtered submissions exported as CSV.");
  };

  const reviewSubmission = async (result) => {
    if (!selected) return;
    const targetPoints =
      result === "Correct" ? Math.max(0, Number(reviewPoints) || 0) : 0;

    setIsReviewing(true);
    try {
      if (isLiveDb && selected.rawId) {
        // Authenticated live backend review
        const res = await adminService.reviewSubmission(selected.rawId, {
          result,
          points: targetPoints,
          reviewNote,
        });

        if (res?.data?.submission) {
          const updated = res.data.submission;
          setSubmissions((items) =>
            items.map((item) =>
              item.id === selected.id || item.rawId === selected.rawId
                ? { ...item, ...updated }
                : item
            )
          );
          setNotice(
            `Submission ${selected.id} successfully marked ${result} (${targetPoints} pts) in live database.`
          );
        } else {
          setSubmissions((items) =>
            items.map((item) =>
              item.id === selected.id
                ? {
                    ...item,
                    result,
                    points: targetPoints,
                    reviewed: true,
                    reviewNote,
                    reviewedAt: "Just now",
                  }
                : item
            )
          );
          setNotice(`Submission ${selected.id} updated.`);
        }
      } else {
        // Local demo state fallback
        setSubmissions((items) =>
          items.map((item) =>
            item.id === selected.id
              ? {
                  ...item,
                  result,
                  points: targetPoints,
                  reviewed: true,
                  reviewNote,
                  reviewedAt: "Just now",
                }
              : item
          )
        );
        setNotice(
          `${selected.id} marked ${result} in local demo state. Connect authenticated backend to persist reviews.`
        );
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to review submission";
      setNotice(`Error reviewing submission: ${msg}`);
    } finally {
      setIsReviewing(false);
      setReviewNote("");
    }
  };

  const adminName = user?.fullName || user?.username || "Event Admin";

  return (
    <div className="subm-page">
      {/* Shared Mission Control Sidebar */}
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        submissionsCount={pendingCount || submissions.length}
      />

      <main className="subm-main">
        {/* Topbar */}
        <header className="subm-topbar">
          <button
            type="button"
            className="htg-mobile-menu-btn"
            aria-label="Open navigation menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            ☰
          </button>
          <div className="subm-global-search">
            <span>⌕</span>
            <input
              aria-label="Global search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search submissions, teams, questions..."
            />
            <kbd>Ctrl + K</kbd>
          </div>
          <button className="subm-icon-button" aria-label="Notifications">
            ♧<i />
          </button>
          <Link to={ROUTES.ADMIN_DASHBOARD} className="subm-admin-chip">
            <span className="subm-avatar">
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
        <section className="subm-hero">
          <div className="subm-breadcrumb">
            Admin <span>›</span> Submissions
            <span className="subm-data-pill live">● LIVE DATABASE</span>
          </div>
          <div className="subm-heading-row">
            <div>
              <h1>
                Submission <em>Review</em>
              </h1>
              <p>
                Review team answers, validate pending submissions and audit
                scoring activity.
              </p>
            </div>
            <div className="subm-hero-actions">
              <button
                type="button"
                className="subm-outline-button"
                onClick={exportCsv}
              >
                ⇩ Export CSV
              </button>
            </div>
          </div>
        </section>

        

        {notice && (
          <div className="subm-notice" role="status">
            <span>{notice}</span>
            <button onClick={() => setNotice("")} aria-label="Dismiss notice">
              ×
            </button>
          </div>
        )}

        {/* 5 KPI Stat Cards */}
        <section className="subm-stats">
          <article>
            <span className="subm-stat-icon lime">⇧</span>
            <div>
              <strong>{submissions.length}</strong>
              <small>Total Submissions</small>
            </div>
            <div className="subm-meter">
              <i
                style={{
                  width: `${Math.min(100, submissions.length * 10)}%`,
                }}
              />
            </div>
          </article>
          <article>
            <span className="subm-stat-icon green">✓</span>
            <div>
              <strong>{correctCount}</strong>
              <small>Correct</small>
            </div>
            <div className="subm-meter green">
              <i
                style={{
                  width: `${
                    submissions.length
                      ? (correctCount / submissions.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </article>
          <article>
            <span className="subm-stat-icon red">×</span>
            <div>
              <strong>{incorrectCount}</strong>
              <small>Incorrect</small>
            </div>
            <div className="subm-meter red">
              <i
                style={{
                  width: `${
                    submissions.length
                      ? (incorrectCount / submissions.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </article>
          <article>
            <span className="subm-stat-icon amber">◷</span>
            <div>
              <strong>{pendingCount}</strong>
              <small>Pending Review</small>
            </div>
            <div className="subm-meter amber">
              <i
                style={{
                  width: `${
                    submissions.length
                      ? (pendingCount / submissions.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </article>
          <article>
            <span className="subm-stat-icon purple">✦</span>
            <div>
              <strong>{totalPoints.toLocaleString("en-IN")}</strong>
              <small>Points Awarded</small>
            </div>
            <div className="subm-meter purple">
              <i style={{ width: "65%" }} />
            </div>
          </article>
        </section>

        {/* Pending Queue Shortcut Strip */}
        <section className="subm-queue-strip">
          <div>
            <span className="subm-live-dot" />
            <span>
              <strong>{pendingCount} submissions need review</strong>
              <small>Check pending answers before approving points.</small>
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setResultFilter("Pending Review");
              setLevelFilter("All Levels");
              setTeamFilter("All Teams");
              setSearch("");
            }}
          >
            Review pending queue →
          </button>
        </section>

        {/* Toolbar */}
        <section className="subm-toolbar">
          <label className="subm-search">
            <span>⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search ID, team, question or answer..."
            />
          </label>
          <select
            value={resultFilter}
            onChange={(event) => setResultFilter(event.target.value)}
            aria-label="Filter result"
          >
            <option>All Results</option>
            {resultOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={levelFilter}
            onChange={(event) => setLevelFilter(event.target.value)}
            aria-label="Filter level"
          >
            <option>All Levels</option>
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Level {i + 1}
              </option>
            ))}
          </select>
          <select
            value={teamFilter}
            onChange={(event) => setTeamFilter(event.target.value)}
            aria-label="Filter team"
          >
            <option>All Teams</option>
            {teams.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <button
            type="button"
            className="subm-reset"
            onClick={resetFilters}
          >
            Reset
          </button>
          <div className="subm-spacer" />
          <div className="subm-view-toggle">
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
        <section className="subm-content">
          <div className="subm-list">
            {view === "table" ? (
              <div className="subm-table-wrap">
                <table className="subm-table">
                  <thead>
                    <tr>
                      <th>Submission</th>
                      <th>Team / Level</th>
                      <th>Question</th>
                      <th>Submitted Answer</th>
                      <th>Result</th>
                      <th>Points</th>
                      <th>Time</th>
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
                          setReviewNote("");
                          setReviewPoints(
                            String(item.points || item.maxPoints || 100)
                          );
                        }}
                        className={selectedId === item.id ? "selected-row" : ""}
                      >
                        <td>
                          <span className="subm-id">{item.id}</span>
                          <small className="subm-date">{item.date}</small>
                        </td>
                        <td>
                          <div className="subm-team-cell">
                            <span className="subm-team-avatar">
                              {item.team.slice(0, 1)}
                            </span>
                            <span>
                              <strong>{item.team}</strong>
                              <small>
                                {item.teamCode} · L{item.level}
                              </small>
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="subm-question-name">
                            {item.question}
                          </span>
                          <small className="subm-challenge">
                            {item.challenge}
                          </small>
                        </td>
                        <td>
                          <code className="subm-answer-preview">
                            {item.answer}
                          </code>
                        </td>
                        <td>
                          <span
                            className={`subm-result ${resultClass(
                              item.result
                            )}`}
                          >
                            <i>{statusIcon(item.result)}</i>
                            {item.result}
                          </span>
                        </td>
                        <td className="subm-points">{item.points}</td>
                        <td>
                          <span className="subm-time">{item.submittedAt}</span>
                          <small className="subm-attempts">
                            Attempt {item.attempts}
                          </small>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="subm-row-action"
                            title="Review submission"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedId(item.id);
                              setReviewPoints(
                                String(item.points || item.maxPoints || 100)
                              );
                              setReviewNote("");
                            }}
                          >
                            ↗
                          </button>
                          <button
                            type="button"
                            className="subm-row-action"
                            title="Copy answer"
                            onClick={(event) => {
                              event.stopPropagation();
                              navigator.clipboard?.writeText(item.answer);
                              setNotice(`Copied answer for ${item.id}`);
                            }}
                          >
                            ⎘
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan="8" className="subm-empty">
                          submissions.length === 0 ? "No submissions recorded yet." : "No submissions match these filters."
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="subm-cards">
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`subm-card ${
                      selectedId === item.id ? "chosen" : ""
                    }`}
                    onClick={() => {
                      setSelectedId(item.id);
                      setReviewPoints(
                        String(item.points || item.maxPoints || 100)
                      );
                    }}
                  >
                    <small>
                      {item.id} · LEVEL {item.level}
                    </small>
                    <strong>{item.team}</strong>
                    <span>{item.question}</span>
                    <code>{item.answer}</code>
                    <div className="subm-card-bottom">
                      <span>{item.points} pts</span>
                      <span className={`subm-result ${resultClass(item.result)}`}>
                        {item.result}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <footer className="subm-table-footer">
              <span>
                Showing {filtered.length ? 1 : 0}–{filtered.length} of{" "}
                {filtered.length} submissions
              </span>
              <div>
                <button disabled>‹</button>
                <button className="current">1</button>
                <button disabled>›</button>
              </div>
            </footer>
          </div>

          {/* Right Detail Inspector Panel */}
          <aside className="subm-detail">
            <div className="subm-detail-banner">
              <div className="subm-banner-grid" />
              <span className={`subm-result ${resultClass(selected.result)}`}>
                <i>{statusIcon(selected.result)}</i>
                {selected.result}
              </span>
              <small>SUBMISSION DETAIL · {selected.id}</small>
              <h2>{selected.team}</h2>
              <p>
                {selected.teamCode} <span>•</span> Level {selected.level}
              </p>
            </div>
            <div className="subm-detail-metrics">
              <div>
                <strong>{selected.points}</strong>
                <small>Points</small>
              </div>
              <div>
                <strong>{selected.attempts}</strong>
                <small>Attempt</small>
              </div>
              <div>
                <strong>{selected.submittedAt}</strong>
                <small>Submitted at</small>
              </div>
            </div>
            <div className="subm-detail-body">
              <h3>Submission Context</h3>
              <div className="subm-context-row">
                <span>Question</span>
                <strong>{selected.question}</strong>
              </div>
              <div className="subm-context-row">
                <span>Challenge</span>
                <strong>{selected.challenge}</strong>
              </div>
              <div className="subm-context-row">
                <span>Answer type</span>
                <strong>{selected.mode}</strong>
              </div>
              <div className="subm-context-row">
                <span>Submitted on</span>
                <strong>
                  {selected.date} · {selected.submittedAt}
                </strong>
              </div>

              <h3 className="subm-answer-heading">
                Submitted Answer{" "}
                <button
                  type="button"
                  onClick={() => setShowAnswer((value) => !value)}
                >
                  {showAnswer ? "Hide" : "Reveal"}
                </button>
              </h3>
              <div className="subm-submitted-answer">
                <code>
                  {showAnswer ? selected.answer : "••••••••••••••••••••••"}
                </code>
              </div>

              <h3 className="subm-review-heading">Admin Review</h3>
              <label className="subm-field">
                Award points (Max: {selected.maxPoints || 100})
                <input
                  type="number"
                  min="0"
                  max={selected.maxPoints || 10000}
                  value={reviewPoints}
                  onChange={(event) => setReviewPoints(event.target.value)}
                  disabled={selected.result !== "Pending Review" || isReviewing}
                />
              </label>
              <label className="subm-field">
                Review note
                <textarea
                  rows="2"
                  value={reviewNote}
                  onChange={(event) => setReviewNote(event.target.value)}
                  placeholder="Add an internal review note..."
                  disabled={selected.result !== "Pending Review" || isReviewing}
                />
              </label>
              <div className="subm-review-actions">
                <button
                  type="button"
                  className="subm-mark-wrong"
                  onClick={() => reviewSubmission("Incorrect")}
                  disabled={selected.result !== "Pending Review" || isReviewing}
                >
                  {isReviewing ? "Saving..." : "× Reject"}
                </button>
                <button
                  type="button"
                  className="subm-mark-correct"
                  onClick={() => reviewSubmission("Correct")}
                  disabled={selected.result !== "Pending Review" || isReviewing}
                >
                  {isReviewing ? "Saving..." : "✓ Approve"}
                </button>
              </div>

              {selected.result !== "Pending Review" && (
                <p className="subm-reviewed-note">
                  This submission is already marked{" "}
                  <strong>{selected.result}</strong> (
                  {selected.points} pts awarded).
                  {selected.reviewNote && (
                    <span> Note: "{selected.reviewNote}"</span>
                  )}
                </p>
              )}
              <p className="subm-security-note">
                Strict server-side validation enforced. Approved points update
                team score and score snapshot atomically with an audit log.
              </p>
            </div>
          </aside>
        </section>

        {/* Footer */}
        <footer className="subm-footer">
          Build with <span>♥</span> by Hrithik Roshan{" "}
          <small>THE TECH MYSTERY · MISSION CONTROL</small>
        </footer>
      </main>
    </div>
  );
}

