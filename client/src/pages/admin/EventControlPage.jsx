import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import adminService from "../../services/admin.service";
import AdminSidebar from "../../components/navigation/AdminSidebar";
import "../../styles/EventControlPage.css";

const initialSettings = {
  eventName: "THE TECH MYSTERY",
  subtitle: "CodeSphere × UTKRISHT 2026",
  status: "Draft",
  startDate: "",
  endDate: "",
  duration: "120",
  maxTeams: "50",
  teamSizeMin: "2",
  teamSizeMax: "4",
  registrationOpen: true,
  publicLeaderboard: true,
  qrCheckpoints: true,
  hintsEnabled: true,
  maintenanceMode: false,
  announcements: true,
};


export default function EventControlPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState(initialSettings);
  const [statsData, setStatsData] = useState({
    registeredTeams: 0,
    activeParticipants: 0,
    checkpointsCleared: 0,
    submissionsToday: 0,
  });
  const [activityList, setActivityList] = useState([]);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState("");
  const [activeTab, setActiveTab] = useState("Overview");
  const [announcement, setAnnouncement] = useState("");
  const [announcementSent, setAnnouncementSent] = useState(false);
  const [announcementsList, setAnnouncementsList] = useState([]);
  const [isPublishingAnnouncement, setIsPublishingAnnouncement] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLiveDb, setIsLiveDb] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync event configuration & metrics from backend
  const fetchEventConfig = useCallback(async (silent = false) => {
    try {
      const res = await adminService.getDashboardStats();
      if (res?.data) {
        setIsLiveDb(true);
        const { stats, eventConfig } = res.data;

        if (stats) {
          setStatsData({
            registeredTeams: Number(stats.totalTeams ?? 0),
            activeParticipants: Number(stats.totalUsers ?? 0),
            checkpointsCleared: Number(stats.totalScans ?? 0),
            submissionsToday: Number(stats.totalSubmissions ?? 0),
          });

          setActivityList(Array.isArray(stats.recentActivity) ? stats.recentActivity : []);
        }

        if (eventConfig) {
          const cfg = eventConfig;
          setSettings((curr) => ({
            ...curr,
            eventName: cfg.eventName || curr.eventName,
            subtitle: cfg.subtitle || curr.subtitle,
            status:
              cfg.state === "LIVE"
                ? "Live"
                : cfg.state === "PAUSED"
                ? "Paused"
                : cfg.state === "CONCLUDED"
                ? "Concluded"
                : cfg.state === "REGISTRATION_OPEN"
                ? "Registration Open"
                : cfg.state === "REGISTRATION_CLOSED"
                ? "Registration Closed"
                : "Draft",
            startDate: cfg.startTime
              ? new Date(cfg.startTime).toISOString().slice(0, 16)
              : "",
            endDate: cfg.endTime
              ? new Date(cfg.endTime).toISOString().slice(0, 16)
              : "",
            duration: String(cfg.duration || curr.duration),
            maxTeams: String(cfg.maxTeams || curr.maxTeams),
            teamSizeMin: String(cfg.minTeamSize || curr.teamSizeMin),
            teamSizeMax: String(cfg.maxTeamSize || curr.teamSizeMax),
            registrationOpen:
              cfg.registrationOpen !== undefined ? cfg.registrationOpen : true,
            publicLeaderboard:
              cfg.isLeaderboardFrozen !== undefined
                ? !cfg.isLeaderboardFrozen
                : true,
            qrCheckpoints:
              cfg.qrCheckpoints !== undefined ? cfg.qrCheckpoints : true,
            hintsEnabled:
              cfg.hintsEnabled !== undefined ? cfg.hintsEnabled : true,
            maintenanceMode: Boolean(cfg.maintenanceMode),
            announcements:
              cfg.announcementsEnabled !== undefined
                ? cfg.announcementsEnabled
                : true,
          }));

          if (Array.isArray(cfg.announcements)) {
            setAnnouncementsList(cfg.announcements);
          }
        }
      }
    } catch {
      if (!silent) {
        setIsLiveDb(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchEventConfig(false);
  }, [fetchEventConfig]);

  const update = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const handleQuickStateChange = async (targetState) => {
    setIsSaving(true);
    try {
      const res = await adminService.updateEventConfig({ state: targetState });
      const updated = res?.data?.config || res?.data?.eventConfig;
      const displayStatus =
        targetState === "LIVE"
          ? "Live"
          : targetState === "PAUSED"
          ? "Paused"
          : targetState === "CONCLUDED"
          ? "Concluded"
          : targetState === "REGISTRATION_OPEN"
          ? "Registration Open"
          : targetState === "REGISTRATION_CLOSED"
          ? "Registration Closed"
          : "Draft";

      setSettings((curr) => ({
        ...curr,
        status: displayStatus,
        maintenanceMode: updated?.maintenanceMode ?? curr.maintenanceMode,
      }));
      setIsLiveDb(true);
      setNotice(`Event state successfully transitioned to ${targetState}.`);
      setSaved(true);
      fetchEventConfig(true);
    } catch (err) {
      setNotice(
        `Failed to transition event state: ${
          err?.response?.data?.message || err?.message || "Server error"
        }`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        eventName: settings.eventName,
        subtitle: settings.subtitle,
        duration: Number(settings.duration) || 120,
        maxTeams: Number(settings.maxTeams) || 50,
        minTeamSize: Number(settings.teamSizeMin) || 2,
        maxTeamSize: Number(settings.teamSizeMax) || 4,
        registrationOpen: Boolean(settings.registrationOpen),
        isLeaderboardVisible: Boolean(settings.publicLeaderboard),
        isLeaderboardFrozen: !settings.publicLeaderboard,
        frozenAt: !settings.publicLeaderboard ? new Date() : null,
        qrCheckpoints: Boolean(settings.qrCheckpoints),
        hintsEnabled: Boolean(settings.hintsEnabled),
        maintenanceMode: Boolean(settings.maintenanceMode),
        announcementsEnabled: Boolean(settings.announcements),
        state:
          settings.status === "Live"
            ? "LIVE"
            : settings.status === "Paused"
            ? "PAUSED"
            : settings.status === "Concluded"
            ? "CONCLUDED"
            : settings.status === "Registration Open"
            ? "REGISTRATION_OPEN"
            : settings.status === "Registration Closed"
            ? "REGISTRATION_CLOSED"
            : "DRAFT",
        startTime: settings.startDate ? new Date(settings.startDate) : null,
        endTime: settings.endDate ? new Date(settings.endDate) : null,
      };

      const res = await adminService.updateEventConfig(payload);
      setIsLiveDb(true);
      setNotice("Event configuration successfully persisted to live database.");
      setSaved(true);
      if (res?.data?.config || res?.data?.eventConfig) {
        fetchEventConfig(true);
      }
    } catch (err) {
      setNotice(
        `Failed to save configuration: ${
          err?.response?.data?.message || err?.message || "Server error"
        }`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleBroadcastAnnouncement = async () => {
    if (!announcement.trim()) return;
    setIsPublishingAnnouncement(true);
    try {
      const res = await adminService.broadcastAnnouncement({
        title: "Audience Announcement",
        content: announcement.trim(),
        priority: "HIGH",
      });
      if (res?.data?.announcements) {
        setAnnouncementsList(res.data.announcements);
      }
      setIsLiveDb(true);
      setNotice("Announcement successfully published to all registered teams.");
      setAnnouncement("");
      setAnnouncementSent(true);
      setTimeout(() => setAnnouncementSent(false), 4000);
    } catch (err) {
      setNotice(
        `Failed to publish announcement: ${
          err?.response?.data?.message || err?.message || "Server error"
        }`
      );
    } finally {
      setIsPublishingAnnouncement(false);
    }
  };

  const statusLabel = settings.maintenanceMode ? "Maintenance" : settings.status;
  const statusClass = settings.maintenanceMode ? "maintenance" : settings.status.toLowerCase();

  const tabs = ["Overview", "Event Settings", "Access & Safety", "Announcements"];
  const health = useMemo(
    () => [
      {
        label: "API service",
        value: isLiveDb ? "Operational" : "Local Demo Mode",
        state: "ok",
      },
      {
        label: "Database",
        value: isLiveDb ? "Connected" : "Simulated Storage",
        state: "ok",
      },
      {
        label: "QR validation",
        value: settings.qrCheckpoints ? "Enabled" : "Paused",
        state: settings.qrCheckpoints ? "ok" : "warn",
      },
      {
        label: "Submissions",
        value: settings.maintenanceMode ? "Paused" : "Accepting",
        state: settings.maintenanceMode ? "warn" : "ok",
      },
    ],
    [settings.qrCheckpoints, settings.maintenanceMode, isLiveDb]
  );

  const adminName = user?.fullName || user?.username || "Event Admin";
  const avatarInitials = (adminName || "EA")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="htg-event-control">
      {/* Shared Mission Control Sidebar */}
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <main className="htg-ec-main">
        {/* Topbar */}
        <header className="htg-ec-topbar">
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              type="button"
              className="htg-mobile-menu-btn"
              aria-label="Open navigation menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              ☰
            </button>
            <div className="htg-ec-breadcrumb">
              MISSION CONTROL <span>/</span> <b>EVENT CONTROL</b>
              <span className="htg-ec-data-pill live">● LIVE DATABASE</span>
            </div>
          </div>
          <div className="htg-ec-top-actions">
            <span className="htg-ec-live-dot" /> LIVE EVENT <i />{" "}
            <button className="htg-ec-icon-button" aria-label="Notifications">
              ♧
            </button>
            <div className="htg-ec-avatar small">{avatarInitials}</div>
          </div>
        </header>

        {/* Heading Section */}
        <section className="htg-ec-heading">
          <div>
            <div className="htg-ec-eyebrow">CONTROL ROOM / 01</div>
            <h1>
              Event <span>Control</span>
            </h1>
            <p>Manage event operations, access, and live-state settings from one place.</p>
          </div>
          <div className="htg-ec-heading-actions">
            <span className={`htg-ec-status-pill ${statusClass}`}>
              <span /> {statusLabel}
            </span>
            {settings.status === "Live" ? (
              <button
                type="button"
                className="htg-ec-btn"
                style={{ background: "#f59e0b", color: "#000", fontWeight: "bold" }}
                disabled={isSaving}
                onClick={() => handleQuickStateChange("PAUSED")}
              >
                ⏸ Pause Event
              </button>
            ) : (
              <button
                type="button"
                className="htg-ec-btn"
                style={{ background: "#10b981", color: "#000", fontWeight: "bold" }}
                disabled={isSaving}
                onClick={() => handleQuickStateChange("LIVE")}
              >
                🚀 Make Event LIVE
              </button>
            )}
            <button
              type="button"
              className="htg-ec-btn primary"
              disabled={isSaving}
              onClick={handleSave}
            >
              {isSaving ? "Saving..." : "Save changes"} <span>↗</span>
            </button>
          </div>
        </section>

        {/* Status Notice Toast / Banner */}
        {notice && (
          <div
            className="htg-ec-toast"
            style={{
              position: "static",
              marginBottom: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              <b>✓</b> {notice}
            </span>
            <button
              type="button"
              onClick={() => setNotice("")}
              style={{
                background: "transparent",
                border: 0,
                color: "var(--lime)",
                cursor: "pointer",
                marginLeft: "12px",
                fontSize: "14px",
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Current Event Banner */}
        <section className="htg-ec-event-banner">
          <div className="htg-ec-banner-art">
            <div className="grid-orb" />
            <div className="banner-crosshair">+</div>
          </div>
          <div className="htg-ec-banner-copy">
            <span className="htg-ec-tag">CURRENT EVENT</span>
            <h2>{settings.eventName}</h2>
            <p>{settings.subtitle}</p>
            <div className="htg-ec-banner-meta">
              <span>◷ {settings.duration} MINUTES</span>
              <span>⌁ 10 LEVELS</span>
              <span>⌖ TULA'S UNIVERSITY, DEHRADUN</span>
            </div>
          </div>
          <div className="htg-ec-banner-right">
            <span>EVENT STATE</span>
            <strong style={{ color: settings.maintenanceMode ? "#ef4444" : (settings.status === "Live" ? "#10b981" : "#f59e0b") }}>
              {settings.maintenanceMode
                ? "MAINTENANCE"
                : settings.status === "Live"
                ? "LIVE"
                : settings.status === "Paused"
                ? "PAUSED"
                : settings.status === "Registration Open"
                ? "REGISTRATION OPEN"
                : settings.status === "Registration Closed"
                ? "REGISTRATION CLOSED"
                : settings.status === "Concluded"
                ? "CONCLUDED"
                : "DRAFT"}
            </strong>
            <small>
              {settings.maintenanceMode
                ? "Participant actions are paused (maintenance mode active)"
                : settings.status === "Live"
                ? "Event is LIVE. Participants can scan checkpoints & play"
                : settings.status === "Paused"
                ? "Gameplay paused by administrators"
                : settings.status === "Registration Open"
                ? "Registration open; QR scanning begins when LIVE"
                : settings.status === "Registration Closed"
                ? "Registration closed; QR scanning begins when LIVE"
                : settings.status === "Concluded"
                ? "Competition finished; submissions closed"
                : "Event is in draft/setup mode"}
            </small>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="htg-ec-tabs" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={activeTab === tab ? "selected" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB 1: Overview */}
        {activeTab === "Overview" && (
          <>
            <section className="htg-ec-stat-grid">
              <Stat
                label="Registered teams"
                value={String(statsData.registeredTeams)}
                note={`of ${settings.maxTeams} team capacity`}
                icon="♙"
                progress={Math.min(
                  100,
                  Math.round(
                    (statsData.registeredTeams / (Number(settings.maxTeams) || 50)) * 100
                  )
                )}
              />
              <Stat
                label="Active participants"
                value={String(statsData.activeParticipants)}
                note="Across 10 levels"
                icon="◉"
                progress={72}
              />
              <Stat
                label="Checkpoints cleared"
                value={String(statsData.checkpointsCleared)}
                note="Total successful scans"
                icon="▣"
                progress={58}
              />
              <Stat
                label="Submissions today"
                value={String(statsData.submissionsToday)}
                note="+12.8% this hour"
                icon="⇄"
                progress={81}
              />
            </section>

            <div className="htg-ec-content-grid">
              <section className="htg-ec-panel">
                <PanelHeading
                  title="Operational controls"
                  subtitle="Quick controls for the live event"
                />
                <div className="htg-ec-control-list">
                  <Toggle
                    label="Registration"
                    description="Allow new teams to register"
                    checked={settings.registrationOpen}
                    onChange={(v) => update("registrationOpen", v)}
                  />
                  <Toggle
                    label="QR checkpoints"
                    description="Allow eligible teams to scan checkpoints"
                    checked={settings.qrCheckpoints}
                    onChange={(v) => update("qrCheckpoints", v)}
                  />
                  <Toggle
                    label="Public leaderboard"
                    description="Show live rankings on the public page"
                    checked={settings.publicLeaderboard}
                    onChange={(v) => update("publicLeaderboard", v)}
                  />
                  <Toggle
                    label="Hints system"
                    description="Let teams request challenge hints"
                    checked={settings.hintsEnabled}
                    onChange={(v) => update("hintsEnabled", v)}
                  />
                </div>
                <div className="htg-ec-panel-foot">
                  <span>
                    "Settings auto-sync upon clicking Save changes."
                  </span>
                  <button
                    type="button"
                    className="htg-ec-text-btn"
                    onClick={() => setActiveTab("Event Settings")}
                  >
                    All settings ↗
                  </button>
                </div>
              </section>

              <section className="htg-ec-panel">
                <PanelHeading
                  title="System health"
                  subtitle="Service status overview"
                  right={
                    <span className="htg-ec-health-summary">
                      <span /> 4 CHECKS
                    </span>
                  }
                />
                <div className="htg-ec-health-list">
                  {health.map((item) => (
                    <div className="htg-ec-health-row" key={item.label}>
                      <div className={`health-icon ${item.state}`}>
                        {item.state === "ok" ? "✓" : "!"}
                      </div>
                      <div className="health-copy">
                        <strong>{item.label}</strong>
                        <small>{item.value}</small>
                      </div>
                      <span className={`health-state ${item.state}`}>
                        {item.state === "ok" ? "HEALTHY" : "ATTENTION"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="htg-ec-health-footer">
                  <span>Last checked just now</span>
                  <button
                    type="button"
                    className="htg-ec-text-btn"
                    onClick={() => fetchEventConfig(false)}
                  >
                    ↻ Refresh view
                  </button>
                </div>
              </section>
            </div>

            <section className="htg-ec-panel htg-ec-activity-panel">
              <PanelHeading
                title="Live activity"
                subtitle="Recent event signals"
                right={
                  <button
                    type="button"
                    className="htg-ec-text-btn"
                    onClick={() => setActiveTab("Access & Safety")}
                  >
                    View event controls ↗
                  </button>
                }
              />
              <div className="htg-ec-activity-list">
                {activityList.length === 0 ? (
                  <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--htg-text-secondary, #94a3b8)" }}>
                    <div style={{ fontSize: "1.8rem", marginBottom: "8px", opacity: 0.4 }}>📡</div>
                    <strong>No event activity recorded yet</strong>
                    <p style={{ fontSize: "0.85rem", marginTop: "4px" }}>
                      Real-time activity logs will populate here once teams join and start scanning checkpoints.
                    </p>
                  </div>
                ) : (
                  activityList.map((item, idx) => (
                  <div className="htg-ec-activity-row" key={`${item.time}-${idx}`}>
                    <span className={`activity-marker ${item.type || "info"}`} />
                    <span className="activity-time">{item.time}</span>
                    <div className="activity-copy">
                      <strong>{item.title}</strong>
                      <small>{item.detail}</small>
                    </div>
                    <span className={`activity-type ${item.type || "info"}`}>
                      {(item.type || "INFO").toUpperCase()}
                    </span>
                  </div>
                ))
              )}
              </div>
            </section>
          </>
        )}

        {/* TAB 2: Event Settings */}
        {activeTab === "Event Settings" && (
          <section className="htg-ec-panel htg-ec-settings-panel">
            <PanelHeading
              title="Event configuration"
              subtitle="Core event information and capacity limits"
            />
            <div className="htg-ec-form-grid">
              <Field label="Event name">
                <input
                  value={settings.eventName}
                  onChange={(e) => update("eventName", e.target.value)}
                  placeholder="THE TECH MYSTERY"
                />
              </Field>
              <Field label="Event subtitle">
                <input
                  value={settings.subtitle}
                  onChange={(e) => update("subtitle", e.target.value)}
                  placeholder="CodeSphere × UTKRISHT 2026"
                />
              </Field>
              <Field label="Competition Lifecycle State">
                <select
                  value={settings.status}
                  onChange={(e) => update("status", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "#0c0f0c",
                    border: "1px solid #252b25",
                    borderRadius: "6px",
                    color: settings.status === "Live" ? "#10b981" : "#eef4ec",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "13px"
                  }}
                >
                  <option value="Live">🟢 LIVE — Active gameplay & QR scanning</option>
                  <option value="Registration Open">🔵 REGISTRATION OPEN — Teams join, gameplay locked</option>
                  <option value="Registration Closed">🟡 REGISTRATION CLOSED — Reg locked, gameplay locked</option>
                  <option value="Paused">🟠 PAUSED — Temporarily suspended</option>
                  <option value="Concluded">⚪ CONCLUDED — Event finished, read-only</option>
                  <option value="Draft">⚪ DRAFT — Setup phase</option>
                </select>
              </Field>
              <Field label="Start date & time">
                <input
                  type="datetime-local"
                  value={settings.startDate}
                  onChange={(e) => update("startDate", e.target.value)}
                />
              </Field>
              <Field label="End date & time">
                <input
                  type="datetime-local"
                  value={settings.endDate}
                  onChange={(e) => update("endDate", e.target.value)}
                />
              </Field>
              <Field label="Duration (minutes)">
                <input
                  type="number"
                  min="1"
                  value={settings.duration}
                  onChange={(e) => update("duration", e.target.value)}
                />
              </Field>
              <Field label="Maximum teams">
                <input
                  type="number"
                  min="1"
                  value={settings.maxTeams}
                  onChange={(e) => update("maxTeams", e.target.value)}
                />
              </Field>
              <Field label="Minimum team size">
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={settings.teamSizeMin}
                  onChange={(e) => update("teamSizeMin", e.target.value)}
                />
              </Field>
              <Field label="Maximum team size">
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={settings.teamSizeMax}
                  onChange={(e) => update("teamSizeMax", e.target.value)}
                />
              </Field>
            </div>
            <div className="htg-ec-form-actions">
              <span>Review date, capacity, and team-size values before publishing.</span>
              <button
                type="button"
                className="htg-ec-btn primary"
                disabled={isSaving}
                onClick={handleSave}
              >
                {isSaving ? "Saving..." : "Save configuration ↗"}
              </button>
            </div>
          </section>
        )}

        {/* TAB 3: Access & Safety */}
        {activeTab === "Access & Safety" && (
          <section className="htg-ec-panel">
            <PanelHeading
              title="Access & safety controls"
              subtitle="Manage event availability and participant-facing systems"
            />
            <div className="htg-ec-control-list">
              <Toggle
                label="Maintenance mode"
                description="Pause participant actions while keeping admin access available"
                checked={settings.maintenanceMode}
                onChange={(v) => update("maintenanceMode", v)}
                danger
              />
              <Toggle
                label="Registration"
                description="Allow new teams to register"
                checked={settings.registrationOpen}
                onChange={(v) => update("registrationOpen", v)}
              />
              <Toggle
                label="QR checkpoints"
                description="Enable checkpoint scan validation"
                checked={settings.qrCheckpoints}
                onChange={(v) => update("qrCheckpoints", v)}
              />
              <Toggle
                label="Public leaderboard"
                description="Display team rankings publicly"
                checked={settings.publicLeaderboard}
                onChange={(v) => update("publicLeaderboard", v)}
              />
              <Toggle
                label="Hints system"
                description="Enable hints for eligible teams"
                checked={settings.hintsEnabled}
                onChange={(v) => update("hintsEnabled", v)}
              />
            </div>
            <div className="htg-ec-warning">
              <strong>⚠ Production safety</strong>
              <p>
                Maintenance mode halts participant actions without restricting authorized administrators. Every state transition is recorded in server-side audit logs.
              </p>
            </div>
            <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="htg-ec-btn primary"
                disabled={isSaving}
                onClick={handleSave}
              >
                {isSaving ? "Saving..." : "Apply Access Controls ↗"}
              </button>
            </div>
          </section>
        )}

        {/* TAB 4: Announcements */}
        {activeTab === "Announcements" && (
          <section className="htg-ec-panel">
            <PanelHeading
              title="Participant announcement"
              subtitle="Compose a message for the event audience"
            />
            <div className="htg-ec-announcement-form">
              <label>Message</label>
              <textarea
                rows="5"
                maxLength="500"
                value={announcement}
                onChange={(e) => {
                  setAnnouncement(e.target.value);
                  setAnnouncementSent(false);
                }}
                placeholder="Example: Checkpoint 05 is now open. Follow the event rules and submit answers through the official portal."
              />
              <div className="announcement-meta">
                <span>{announcement.length}/500 characters</span>
                <span>Audience: all registered teams</span>
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="htg-ec-btn"
                  disabled={!announcement.trim()}
                  onClick={() => setAnnouncementSent(true)}
                >
                  Preview announcement ↗
                </button>
                <button
                  type="button"
                  className="htg-ec-btn primary"
                  disabled={!announcement.trim() || isPublishingAnnouncement}
                  onClick={handleBroadcastAnnouncement}
                >
                  {isPublishingAnnouncement ? "Publishing..." : "Broadcast Announcement 📢"}
                </button>
              </div>

              {announcementSent && (
                <div className="htg-ec-preview">
                  <span className="htg-ec-tag">PREVIEW ONLY</span>
                  <p>{announcement}</p>
                  <small>
                    Click "Broadcast Announcement 📢" above to publish to live event participants.
                  </small>
                </div>
              )}

              {/* Broadcast history */}
              {announcementsList.length > 0 && (
                <div style={{ marginTop: "24px" }}>
                  <h4
                    style={{
                      fontSize: "12px",
                      color: "var(--lime)",
                      fontFamily: "'DM Mono', monospace",
                      marginBottom: "10px",
                    }}
                  >
                    RECENT BROADCASTS ({announcementsList.length})
                  </h4>
                  <div style={{ display: "grid", gap: "10px" }}>
                    {announcementsList.slice(0, 5).map((a, i) => (
                      <div
                        key={i}
                        style={{
                          background: "#0c0f0c",
                          border: "1px solid #252b25",
                          borderRadius: "7px",
                          padding: "12px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "10px",
                            color: "#859085",
                            marginBottom: "5px",
                          }}
                        >
                          <strong>{a.title || "Announcement"}</strong>
                          <span>
                            {a.createdAt ? new Date(a.createdAt).toLocaleTimeString() : "Recent"}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: "11px", color: "#eef4ec" }}>
                          {a.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {saved && (
          <div className="htg-ec-toast">
            <span>✓</span> {isLiveDb ? "Event configuration saved to server." : "Preview updated. Connect backend to persist changes."}
          </div>
        )}

        <footer className="htg-ec-footer">
          <span>
            THE TECH MYSTERY <i>•</i> MISSION CONTROL
          </span>
          <span>
            Build with <b>♥</b> by Hrithik Roshan
          </span>
          <span>UI VERSION / v1.0</span>
        </footer>
      </main>
    </div>
  );
}

function Stat({ label, value, note, icon, progress }) {
  return (
    <div className="htg-ec-stat">
      <div className="stat-top">
        <span>{label}</span>
        <i>{icon}</i>
      </div>
      <strong>{value}</strong>
      <div className="stat-note">{note}</div>
      <div className="stat-progress">
        <span style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function PanelHeading({ title, subtitle, right }) {
  return (
    <div className="htg-ec-panel-heading">
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

function Toggle({ label, description, checked, onChange, danger }) {
  return (
    <div className="htg-ec-toggle-row">
      <div>
        <strong>{label}</strong>
        <small>{description}</small>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`htg-ec-switch ${checked ? "on" : ""} ${danger ? "danger" : ""}`}
      >
        <span />
      </button>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="htg-ec-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

