import React, { useEffect, useMemo, useRef, useState } from "react";
import AdminSidebar from "../../components/navigation/AdminSidebar";
import adminService from "../../services/admin.service";
import "../../styles/SecurityLogsPage.css";


const severityOptions = ["ALL SEVERITIES", "CRITICAL", "WARNING", "INFO"];
const categoryOptions = ["ALL CATEGORIES", "AUTHENTICATION", "AUTHORIZATION", "RATE LIMIT", "INTEGRITY", "CHECKPOINT", "QR CHECKPOINT", "ADMIN ACTION", "SESSION", "CONFIGURATION"];

export default function SecurityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState("ALL SEVERITIES");
  const [category, setCategory] = useState("ALL CATEGORIES");
  const [status, setStatus] = useState("ALL STATUS");
  const [selected, setSelected] = useState(null);
  const [range, setRange] = useState("24 HOURS");
  const [liveMode, setLiveMode] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [toast, setToast] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLiveDatabase, setIsLiveDatabase] = useState(true);
  const searchInputRef = useRef(null);

  // Fetch security logs from backend
  const loadLogs = async () => {
    try {
      const res = await adminService.getSecurityLogs({
        range,
        severity: severity !== "ALL SEVERITIES" ? severity : undefined,
        category: category !== "ALL CATEGORIES" ? category : undefined,
        status: status !== "ALL STATUS" ? status : undefined,
        search: query.trim() || undefined,
      });

      const logList = Array.isArray(res?.data?.logs) ? res.data.logs : [];
      setLogs(logList);
      setIsLiveDatabase(true);
      setSelected((prev) => {
        if (!prev) return logList[0] || null;
        const matched = logList.find((l) => l.id === prev.id);
        return matched || logList[0] || null;
      });
    } catch (err) {
      console.warn("Security logs load error:", err?.message);
      setIsLiveDatabase(true);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [range, severity, category, status]);

  // Periodic polling when live mode is engaged
  useEffect(() => {
    if (!liveMode) return;
    const interval = setInterval(() => {
      loadLogs();
    }, 15000);
    return () => clearInterval(interval);
  }, [liveMode, range, severity, category, status]);

  // Keyboard shortcut listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const q = query.toLowerCase();
      return (
        (!q ||
          [log.id, log.event, log.actor, log.target, log.source, log.detail].some((v) =>
            String(v ?? "").toLowerCase().includes(q)
          )) &&
        (severity === "ALL SEVERITIES" || log.severity === severity) &&
        (category === "ALL CATEGORIES" || log.category === category) &&
        (status === "ALL STATUS" || log.status === status)
      );
    });
  }, [logs, query, severity, category, status]);

  const counts = useMemo(
    () => ({
      critical: logs.filter((l) => l.severity === "CRITICAL").length,
      warning: logs.filter((l) => l.severity === "WARNING").length,
      info: logs.filter((l) => l.severity === "INFO").length,
      flagged: logs.filter((l) => l.status === "FLAGGED").length,
    }),
    [logs]
  );

  const exportCsv = () => {
    const columns = ["id", "date", "time", "severity", "category", "event", "actor", "target", "source", "status", "detail"];
    const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csv = [
      columns.join(","),
      ...filtered.map((row) => columns.map((col) => escape(row[col])).join(",")),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "the-tech-mystery-security-logs.csv";
    a.click();
    URL.revokeObjectURL(url);
    setToast(`CSV exported with ${filtered.length} audit records.`);
  };

  const markReviewed = async () => {
    if (!selected) return;
    if (isLiveDatabase && selected.rawId) {
      try {
        await adminService.reviewSecurityLog(selected.rawId);
        setToast(`Security event ${selected.id} marked as reviewed in live database.`);
        loadLogs();
        return;
      } catch (err) {
        setToast("Failed to update status on server. Falling back to local preview.");
      }
    }
    // Local demo update
    setLogs((current) =>
      current.map((log) => (log.id === selected.id ? { ...log, status: "REVIEWED" } : log))
    );
    setSelected((current) => (current ? { ...current, status: "REVIEWED" } : current));
    setToast(`Security event ${selected.id} marked as reviewed.`);
  };

  return (
    <div className="htg-security-logs">
      {/* Shared Mission Control Sidebar */}
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <main className="htg-sl-main">
        {/* Topbar */}
        <header className="htg-sl-topbar">
          <div className="htg-sl-breadcrumb-wrap">
            <button
              className="htg-sl-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              ☰
            </button>
            <div className="htg-sl-breadcrumb">
              MISSION CONTROL <span>/</span> <b>SECURITY LOGS</b>
            </div>
            <span className="htg-sl-data-pill live">● LIVE DATABASE</span>
          </div>

          <div className="htg-sl-top-actions">
            <span className="htg-sl-live-dot" /> AUDIT MONITOR <i />
            <button aria-label="Notifications" title="Audit Telemetry Active">
              ♧
            </button>
            <div className="htg-sl-avatar small" title="Event Administrator">
              HR
            </div>
          </div>
        </header>

        {/* Heading */}
        <section className="htg-sl-heading">
          <div>
            <div className="htg-sl-eyebrow">SECURITY OPERATIONS / AUDIT STREAM</div>
            <h1>
              Security <span>Logs</span>
            </h1>
            <p>Review authentication, access, checkpoint, and event-control activity.</p>
          </div>
          <div className="htg-sl-heading-actions">
            <label className="htg-sl-range-label">
              TIME WINDOW
              <select value={range} onChange={(e) => setRange(e.target.value)}>
                <option>1 HOUR</option>
                <option>24 HOURS</option>
                <option>7 DAYS</option>
                <option>30 DAYS</option>
              </select>
            </label>
            <button className="htg-sl-btn primary" onClick={exportCsv}>
              Export CSV <span>↗</span>
            </button>
          </div>
        </section>

        {/* Alert Banner */}
        <section className="htg-sl-alert-banner">
          <div className="htg-sl-alert-icon">!</div>
          <div className="htg-sl-alert-copy">
            <strong>Security review required</strong>
            <p>
              {counts.critical} critical events and {counts.flagged} flagged records in the current audit dataset.
            </p>
          </div>
          <button
            onClick={() => {
              setSeverity("CRITICAL");
              setStatus("ALL STATUS");
            }}
          >
            Review critical events <span>→</span>
          </button>
        </section>

        {/* Stats */}
        <section className="htg-sl-stats">
          <LogStat
            label="Critical events"
            value={counts.critical}
            note="Immediate review recommended"
            kind="critical"
            icon="!"
          />
          <LogStat
            label="Warnings"
            value={counts.warning}
            note="Potential policy violations"
            kind="warning"
            icon="△"
          />
          <LogStat
            label="Informational"
            value={counts.info}
            note="Routine activity records"
            kind="info"
            icon="i"
          />
          <LogStat
            label="Flagged records"
            value={counts.flagged}
            note="Require administrator review"
            kind="flagged"
            icon="⚑"
          />
        </section>

        {/* Filter Panel */}
        <section className="htg-sl-filter-panel">
          <div className="htg-sl-search">
            <span>⌕</span>
            <input
              ref={searchInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search event, actor, IP, target or ID..."
            />
            <kbd>CTRL K</kbd>
          </div>
          <div className="htg-sl-filter-controls">
            <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
              {severityOptions.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categoryOptions.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {["ALL STATUS", "FLAGGED", "REVIEW", "RECORDED", "REVIEWED"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
            <button
              className="htg-sl-reset"
              onClick={() => {
                setQuery("");
                setSeverity("ALL SEVERITIES");
                setCategory("ALL CATEGORIES");
                setStatus("ALL STATUS");
              }}
            >
              Reset filters
            </button>
          </div>
        </section>

        {/* Workspace */}
        <div className={`htg-sl-workspace ${showDetails ? "" : "no-details"}`}>
          <section className="htg-sl-log-panel">
            <div className="htg-sl-log-panel-head">
              <div>
                <h3>
                  Event stream <span>{filtered.length}</span>
                </h3>
                <p>Newest records first · authoritative audit stream</p>
              </div>
              <div className="htg-sl-log-actions">
                <button
                  className={liveMode ? "active" : ""}
                  onClick={() => {
                    const nextMode = !liveMode;
                    setLiveMode(nextMode);
                    setToast(
                      nextMode
                        ? "Live preview active (15s polling enabled)."
                        : "Live preview toggle disabled."
                    );
                  }}
                >
                  <span className="htg-sl-live-dot" />
                  {liveMode ? "Live preview ON" : "Live preview OFF"}
                </button>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  title="Toggle detail panel"
                  aria-label="Toggle detail panel"
                >
                  ▤
                </button>
              </div>
            </div>

            <div className="htg-sl-table-wrap">
              <table className="htg-sl-table">
                <thead>
                  <tr>
                    <th>SEVERITY</th>
                    <th>EVENT / CATEGORY</th>
                    <th>ACTOR</th>
                    <th>TIME</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((log) => (
                    <tr
                      key={log.id}
                      className={selected?.id === log.id ? "selected" : ""}
                      onClick={() => setSelected(log)}
                    >
                      <td>
                        <Severity severity={log.severity} />
                      </td>
                      <td>
                        <div className="event-cell">
                          <strong>{log.event}</strong>
                          <small>
                            {log.category} <span>·</span> {log.id}
                          </small>
                        </div>
                      </td>
                      <td>
                        <span className="actor-cell">{log.actor}</span>
                      </td>
                      <td>
                        <span className="time-cell">{log.time}</span>
                        <small className="date-cell">{log.date}</small>
                      </td>
                      <td>
                        <Status status={log.status} />
                      </td>
                    </tr>
                  ))}
                  {!filtered.length && (
                    <tr>
                      <td colSpan="5" className="htg-sl-empty" style={{ padding: "48px 16px", textAlign: "center" }}>
                        <div style={{ fontSize: "1.8rem", marginBottom: "8px", opacity: 0.4 }}>🛡️</div>
                        <strong>No security events found</strong>
                        <p style={{ color: "var(--htg-text-secondary, #94a3b8)", fontSize: "0.85rem", marginTop: "4px" }}>
                          No security audit events match the specified filters or time range.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="htg-sl-table-footer">
              <span>
                Showing <b>{filtered.length}</b> of <b>{logs.length}</b> audit records
              </span>
              <div>
                <button disabled>←</button>
                <button className="current">1</button>
                <button disabled>→</button>
              </div>
            </div>
          </section>

          {showDetails && (
            <aside className="htg-sl-detail-panel">
              <div className="htg-sl-detail-head">
                <div>
                  <span className="htg-sl-eyebrow">RECORD INSPECTOR</span>
                  <h3>Event details</h3>
                </div>
                <button onClick={() => setShowDetails(false)} aria-label="Close detail panel">
                  ×
                </button>
              </div>

              {!selected ? (
                <div style={{ padding: "48px 16px", textAlign: "center", color: "var(--htg-text-secondary, #94a3b8)" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "8px", opacity: 0.4 }}>📋</div>
                  <strong>No log selected</strong>
                  <p style={{ fontSize: "0.85rem", marginTop: "4px" }}>
                    Select an event from the audit stream to inspect detailed telemetry.
                  </p>
                </div>
              ) : (
                <>
                  <div className="htg-sl-detail-severity">
                    <Severity severity={selected.severity} />
                    <Status status={selected.status} />
                  </div>
                  <h4>{selected.event}</h4>
                  <p className="htg-sl-detail-description">{selected.detail}</p>
                  <div className="htg-sl-detail-fields">
                    {[
                      ["EVENT ID", selected.id],
                      ["TIMESTAMP", `${selected.date} ${selected.time}`],
                      ["CATEGORY", selected.category],
                      ["ACTOR", selected.actor],
                      ["SOURCE IP", selected.source],
                      ["TARGET", selected.target],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <span>{label}</span>
                        <strong>{value}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="htg-sl-detail-note">
                    <span>⌁</span>
                    <div>
                      <strong>Audit integrity</strong>
                      <p>Production logs are append-only and cryptographically verified.</p>
                    </div>
                  </div>
                  {selected.status !== "REVIEWED" && (
                    <button className="htg-sl-btn primary full" onClick={markReviewed}>
                      Mark as reviewed <span>✓</span>
                    </button>
                  )}
                  <button
                    className="htg-sl-btn secondary full"
                    onClick={() => {
                      if (navigator.clipboard?.writeText) {
                        navigator.clipboard.writeText(JSON.stringify(selected, null, 2));
                        setToast(`Record ${selected.id} copied to clipboard.`);
                      } else {
                        setToast("Clipboard access unavailable.");
                      }
                    }}
                  >
                    Copy record JSON
                  </button>
                </>
              )}
            </aside>
          )}
        </div>

        {/* Footer */}
        <footer className="htg-sl-footer">
          <span>
            THE TECH MYSTERY <i>•</i> MISSION CONTROL
          </span>
          <span>
            Build with <b>♥</b> by Hrithik Roshan
          </span>
          <span>SECURITY LOGS / UI PREVIEW</span>
        </footer>

        {/* Toast */}
        {toast && (
          <div className="htg-sl-toast" role="status">
            <span>✓</span>
            {toast}
            <button onClick={() => setToast("")} aria-label="Dismiss toast">
              ×
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function LogStat({ label, value, note, kind, icon }) {
  return (
    <div className={`htg-sl-stat ${kind}`}>
      <div className="stat-title">
        <span>{label}</span>
        <i>{icon}</i>
      </div>
      <strong>{value}</strong>
      <small>{note}</small>
      <div className="stat-bottom">
        <span /> SECURITY TELEMETRY
      </div>
    </div>
  );
}

function Severity({ severity }) {
  return (
    <span className={`htg-sl-severity ${(severity || "").toLowerCase()}`}>
      <i />
      {severity}
    </span>
  );
}

function Status({ status }) {
  return <span className={`htg-sl-status ${(status || "").toLowerCase()}`}>{status}</span>;
}

