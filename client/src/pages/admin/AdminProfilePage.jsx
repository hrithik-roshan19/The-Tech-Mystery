import React, { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { adminService } from "../../services/admin.service";
import { authService } from "../../services/auth.service";
import AdminSidebar from "../../components/navigation/AdminSidebar";
import "../../styles/AdminProfilePage.css";

const seed = {
  name: "Hrithik Roshan",
  username: "hrx_admin",
  email: "hrithik@example.com",
  role: "Super Administrator",
  department: "CodeSphere · Event Operations",
  bio: "Managing event operations, team coordination, and platform integrity for Hack the Grid.",
  github: "ydv-hrx",
  linkedin: "hrithik-roshan",
  phone: "Not added",
  avatar: "",
  twoFactor: true,
  securityAlerts: true,
  emailAlerts: true,
  sessionAlerts: false
};

const fallbackStats = {
  adminActions: "128",
  securityReviews: "24",
  managedTeams: "32",
  sessionStatus: "ACTIVE",
  accessLevel: "LEVEL 04",
  privilege: "PRIVILEGED ACCOUNT"
};

const fallbackPermissions = [
  "Event configuration",
  "Team & submission review",
  "Leaderboard management",
  "Security log access"
];

const fallbackSession = {
  device: "Desktop · Browser",
  lastActive: "Just now · Demo value",
  ip: "127.0.0.1"
};

const fallbackActions = [
  ["14:02:51", "Leaderboard visibility updated", "Event Control · Public leaderboard", "settings"],
  ["13:51:26", "Security logs reviewed", "Security Logs · Audit stream", "security"],
  ["13:39:18", "Registration state checked", "Event Control · Registration", "event"]
];

export default function AdminProfilePage() {
  const { user } = useAuth();

  // State
  const [admin, setAdmin] = useState(seed);
  const [stats, setStats] = useState(fallbackStats);
  const [permissions, setPermissions] = useState(fallbackPermissions);
  const [session, setSession] = useState(fallbackSession);
  const [actions, setActions] = useState(fallbackActions);

  const [tab, setTab] = useState("Overview");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isLiveDatabase, setIsLiveDatabase] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [toast, setToast] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Security password modal
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Avatar upload ref
  const avatarInputRef = useRef(null);

  // Initials calculation
  const initials = useMemo(() => {
    return (
      (admin.name || "Event Admin")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((x) => x[0])
        .join("")
        .toUpperCase() || "AD"
    );
  }, [admin.name]);

  const notify = (message) => setToast(message);

  const update = (key, value) => setAdmin((p) => ({ ...p, [key]: value }));

  // Load Admin Profile
  const loadProfile = async () => {
    setLoading(true);
    setApiError("");
    try {
      const res = await adminService.getAdminProfile();
      if (res?.data?.admin) {
        const a = res.data.admin;
        setAdmin({
          name: a.name || seed.name,
          username: a.username || seed.username,
          email: a.email || seed.email,
          role: a.role || seed.role,
          department: a.department || seed.department,
          bio: a.bio !== undefined ? a.bio : seed.bio,
          github: a.github || "",
          linkedin: a.linkedin || "",
          phone: a.phone || "Not added",
          avatar: a.avatar || "",
          twoFactor: a.twoFactor !== undefined ? a.twoFactor : true,
          securityAlerts: a.securityAlerts !== undefined ? a.securityAlerts : true,
          emailAlerts: a.emailAlerts !== undefined ? a.emailAlerts : true,
          sessionAlerts: a.sessionAlerts !== undefined ? a.sessionAlerts : false
        });

        if (res.data.stats) {
          setStats({
            adminActions: res.data.stats.adminActions || fallbackStats.adminActions,
            securityReviews: res.data.stats.securityReviews || fallbackStats.securityReviews,
            managedTeams: res.data.stats.managedTeams || fallbackStats.managedTeams,
            sessionStatus: res.data.stats.sessionStatus || fallbackStats.sessionStatus,
            accessLevel: res.data.stats.accessLevel || fallbackStats.accessLevel,
            privilege: res.data.stats.privilege || fallbackStats.privilege
          });
        }

        if (res.data.permissions && Array.isArray(res.data.permissions)) {
          setPermissions(res.data.permissions);
        }

        if (res.data.session) {
          setSession({
            device: res.data.session.device || fallbackSession.device,
            lastActive: res.data.session.lastActive || fallbackSession.lastActive,
            ip: res.data.session.ip || fallbackSession.ip
          });
        }

        if (res.data.recentActivity && Array.isArray(res.data.recentActivity) && res.data.recentActivity.length > 0) {
          setActions(res.data.recentActivity);
        }

        setIsLiveDatabase(true);
      }
    } catch (err) {
      console.warn("Using offline demo admin profile:", err.message);
      setIsLiveDatabase(false);
      if (user) {
        setAdmin((prev) => ({
          ...prev,
          name: user.fullName || user.name || prev.name,
          username: user.username || prev.username,
          email: user.email || prev.email
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  // Save profile changes
  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setApiError("");

    // Validation
    if (!admin.name.trim() || admin.name.trim().length < 2) {
      notify("Full name must be at least 2 characters.");
      setSaving(false);
      return;
    }
    if (!admin.email.trim() || !/^\S+@\S+\.\S+$/.test(admin.email)) {
      notify("Please provide a valid email address.");
      setSaving(false);
      return;
    }

    try {
      if (isLiveDatabase) {
        // Enforce: role and permissions are strictly excluded from client payloads
        await adminService.updateAdminProfile({
          name: admin.name.trim(),
          email: admin.email.trim(),
          department: admin.department.trim(),
          bio: admin.bio.trim(),
          github: admin.github.trim(),
          linkedin: admin.linkedin.trim(),
          phone: admin.phone.trim(),
          twoFactor: admin.twoFactor,
          securityAlerts: admin.securityAlerts,
          emailAlerts: admin.emailAlerts,
          sessionAlerts: admin.sessionAlerts
        });
        notify("Admin profile updated successfully in live database.");
      } else {
        notify("Local preview updated. Connect the backend to persist changes.");
      }
      setEditing(false);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update profile";
      setApiError(msg);
      notify(`Error: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  // Toggle security preferences with persistence
  const handleTogglePreference = async (key) => {
    const nextVal = !admin[key];
    update(key, nextVal);

    if (isLiveDatabase) {
      try {
        await adminService.updateAdminProfile({ [key]: nextVal });
        notify(`Security preference updated.`);
      } catch (err) {
        notify("Failed to persist security preference on server.");
      }
    } else {
      notify(`Preview preference updated.`);
    }
  };

  // Avatar upload
  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 500 * 1024) {
      notify("Image size must be less than 500 KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      update("avatar", base64Data);
      if (isLiveDatabase) {
        try {
          await authService.updateAvatar(base64Data);
          notify("Administrator avatar updated successfully.");
        } catch (err) {
          notify("Failed to upload avatar to server.");
        }
      } else {
        notify("Avatar preview loaded.");
      }
    };
    reader.readAsDataURL(file);
  };

  // Password change handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!passwordForm.currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setChangingPassword(true);
    try {
      if (isLiveDatabase) {
        await authService.changePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        });
        setPasswordSuccess("Password updated successfully.");
        notify("Administrator password changed successfully.");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setPasswordModalOpen(false), 1200);
      } else {
        setPasswordSuccess("Password change verified in preview mode.");
        notify("Password simulation passed.");
        setTimeout(() => setPasswordModalOpen(false), 1200);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update password.";
      setPasswordError(msg);
    } finally {
      setChangingPassword(false);
    }
  };

  // Revoke other sessions
  const handleRevokeSessions = async () => {
    if (isLiveDatabase) {
      try {
        await adminService.revokeSessions();
        notify("Other active administrator sessions revoked successfully.");
      } catch (err) {
        notify("Failed to revoke secondary sessions.");
      }
    } else {
      notify("Session revocation simulated. Connect live backend to revoke tokens.");
    }
  };

  return (
    <div className="htg-admin-profile">
      {/* Hidden file input for avatar upload */}
      <input
        type="file"
        ref={avatarInputRef}
        style={{ display: "none" }}
        accept="image/png,image/jpeg,image/webp"
        onChange={handleAvatarFile}
      />

      {/* Shared Mission Control Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <main className="htg-ap-main">
        {/* Topbar */}
        <header className="htg-ap-topbar">
          <div className="htg-ap-breadcrumb-wrap">
            <button
              type="button"
              className="htg-ap-mobile-toggle"
              aria-label="Toggle navigation menu"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              ☰
            </button>
            <div className="htg-ap-crumb">
              MISSION CONTROL <span>/</span> <b>ADMIN PROFILE</b>
            </div>
            <span className={`htg-ap-data-pill ${isLiveDatabase ? "live" : "demo"}`}>
              <i /> {isLiveDatabase ? "LIVE DATABASE" : "DEMO PREVIEW"}
            </span>
          </div>

          <div className="htg-ap-top-right">
            <i /> ADMIN SESSION{" "}
            <span className="htg-ap-avatar small">
              {admin.avatar ? (
                <img
                  src={admin.avatar}
                  alt="Avatar"
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                initials
              )}
            </span>
          </div>
        </header>

        {/* Heading Section */}
        <section className="htg-ap-heading">
          <div>
            <div className="htg-ap-eyebrow">ACCOUNT / ADMINISTRATOR IDENTITY</div>
            <h1>
              Admin <span>Profile</span>
            </h1>
            <p>Manage administrator details, security preferences, and account activity.</p>
          </div>
          <div className="htg-ap-heading-actions">
            <span className="htg-ap-role-pill">● {admin.role.toUpperCase()}</span>
            <button
              className="htg-ap-btn primary"
              type="button"
              onClick={() => {
                setTab("Settings");
                setEditing(!editing);
              }}
            >
              {editing ? "Cancel editing" : "Edit profile"} ↗
            </button>
          </div>
        </section>

        {/* Hero Section */}
        <section className="htg-ap-hero">
          <div className="htg-ap-avatar-wrap">
            <div className="htg-ap-avatar-large">
              {admin.avatar ? (
                <img
                  src={admin.avatar}
                  alt={admin.name}
                  style={{ width: "100%", height: "100%", borderRadius: "22px", objectFit: "cover" }}
                />
              ) : (
                initials
              )}
              <span />
            </div>
            <button
              type="button"
              className="htg-ap-avatar-edit"
              onClick={() => avatarInputRef.current?.click()}
              title="Upload avatar photo"
              aria-label="Upload avatar"
            >
              ＋
            </button>
          </div>

          <div className="htg-ap-identity">
            <div className="htg-ap-verified">◈ VERIFIED ADMINISTRATOR</div>
            <h2>{admin.name}</h2>
            <p>@{admin.username}</p>
            <div className="htg-ap-identity-meta">
              <span>⌘ {admin.department}</span>
              <span>✉ {admin.email}</span>
            </div>
          </div>

          <div className="htg-ap-hero-side">
            <span>ACCESS LEVEL</span>
            <strong>{stats.accessLevel}</strong>
            <small>{stats.privilege}</small>
            <div className="htg-ap-access-bar">
              <i />
            </div>
          </div>
        </section>

        {/* Telemetry Stats Grid */}
        <section className="htg-ap-stats">
          <div className="htg-ap-stat">
            <div>
              <span>Admin actions</span>
              <i>⌘</i>
            </div>
            <strong>{stats.adminActions}</strong>
            <small>Across this event</small>
          </div>
          <div className="htg-ap-stat">
            <div>
              <span>Security reviews</span>
              <i>⌑</i>
            </div>
            <strong>{stats.securityReviews}</strong>
            <small>Audit records reviewed</small>
          </div>
          <div className="htg-ap-stat">
            <div>
              <span>Managed teams</span>
              <i>♙</i>
            </div>
            <strong>{stats.managedTeams}</strong>
            <small>Current event workspace</small>
          </div>
          <div className="htg-ap-stat">
            <div>
              <span>Session status</span>
              <i>◉</i>
            </div>
            <strong>{stats.sessionStatus}</strong>
            <small>Current session</small>
          </div>
        </section>

        {/* 2-Column Content Grid */}
        <div className="htg-ap-content">
          {/* Main Panel */}
          <section className="htg-ap-panel htg-ap-primary-panel">
            {/* Tabs */}
            <div className="htg-ap-tabs">
              {["Overview", "Settings", "Security"].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={tab === t ? "active" : ""}
                  onClick={() => {
                    setTab(t);
                    if (t !== "Settings") setEditing(false);
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* TAB: OVERVIEW */}
            {tab === "Overview" && (
              <>
                <div className="htg-ap-panel-title">
                  <div>
                    <h3>Administrator information</h3>
                    <p>Account details and assigned responsibilities</p>
                  </div>
                  <button
                    className="htg-ap-link"
                    type="button"
                    onClick={() => {
                      setTab("Settings");
                      setEditing(true);
                    }}
                  >
                    Edit details ↗
                  </button>
                </div>

                <div className="htg-ap-info-grid">
                  <div className="htg-ap-info">
                    <span>FULL NAME</span>
                    <strong>{admin.name}</strong>
                  </div>
                  <div className="htg-ap-info">
                    <span>USERNAME</span>
                    <strong>@{admin.username}</strong>
                  </div>
                  <div className="htg-ap-info">
                    <span>WORK EMAIL</span>
                    <strong>{admin.email}</strong>
                  </div>
                  <div className="htg-ap-info">
                    <span>ROLE</span>
                    <strong>{admin.role}</strong>
                  </div>
                  <div className="htg-ap-info">
                    <span>DEPARTMENT</span>
                    <strong>{admin.department}</strong>
                  </div>
                  <div className="htg-ap-info">
                    <span>PHONE NUMBER</span>
                    <strong>{admin.phone || "Not added"}</strong>
                  </div>
                  <div className="htg-ap-info">
                    <span>GITHUB</span>
                    <strong>{admin.github ? `@${admin.github}` : "Not linked"}</strong>
                  </div>
                  <div className="htg-ap-info">
                    <span>LINKEDIN</span>
                    <strong>{admin.linkedin ? `@${admin.linkedin}` : "Not linked"}</strong>
                  </div>
                </div>

                <div className="htg-ap-bio">
                  <span>ADMIN BIO</span>
                  <p>{admin.bio || "No biography provided."}</p>
                </div>

                <div className="htg-ap-panel-title recent-title">
                  <div>
                    <h3>Recent admin activity</h3>
                    <p>Latest actions in Mission Control</p>
                  </div>
                  <span className="htg-ap-muted-label">LAST {actions.length} ACTIONS</span>
                </div>

                <div className="htg-ap-activity-list">
                  {actions.map(([time, title, detail, type], idx) => (
                    <div className="htg-ap-activity" key={`${time}-${idx}`}>
                      <div className={`htg-ap-activity-icon ${type}`}>
                        {type === "security" ? "⌑" : type === "event" ? "◉" : "⌘"}
                      </div>
                      <div className="htg-ap-activity-copy">
                        <strong>{title}</strong>
                        <small>{detail}</small>
                      </div>
                      <time>{time}</time>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* TAB: SETTINGS */}
            {tab === "Settings" && (
              <form onSubmit={save}>
                <div className="htg-ap-panel-title">
                  <div>
                    <h3>Profile settings</h3>
                    <p>Update contact information and professional links</p>
                  </div>
                  <span className="htg-ap-muted-label">
                    {isLiveDatabase ? "LIVE DATABASE" : "LOCAL PREVIEW"}
                  </span>
                </div>

                {apiError && (
                  <div
                    style={{
                      background: "#2b1414",
                      border: "1px solid #732a2a",
                      color: "#ff9999",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      marginBottom: "16px",
                      fontSize: "11px"
                    }}
                  >
                    ⚠ {apiError}
                  </div>
                )}

                <div className="htg-ap-edit-grid">
                  <label className="htg-ap-field">
                    <span>Full name</span>
                    <input
                      type="text"
                      value={admin.name}
                      disabled={!editing}
                      onChange={(e) => update("name", e.target.value)}
                      required
                    />
                  </label>
                  <label className="htg-ap-field">
                    <span>Work email</span>
                    <input
                      type="email"
                      value={admin.email}
                      disabled={!editing}
                      onChange={(e) => update("email", e.target.value)}
                      required
                    />
                  </label>
                  <label className="htg-ap-field">
                    <span>Department</span>
                    <input
                      type="text"
                      value={admin.department}
                      disabled={!editing}
                      onChange={(e) => update("department", e.target.value)}
                    />
                  </label>
                  <label className="htg-ap-field">
                    <span>Phone number</span>
                    <input
                      type="text"
                      value={admin.phone === "Not added" ? "" : admin.phone}
                      placeholder="e.g. +91 98765 43210"
                      disabled={!editing}
                      onChange={(e) => update("phone", e.target.value)}
                    />
                  </label>
                  <label className="htg-ap-field">
                    <span>GitHub username</span>
                    <input
                      type="text"
                      value={admin.github}
                      disabled={!editing}
                      onChange={(e) => update("github", e.target.value)}
                    />
                  </label>
                  <label className="htg-ap-field">
                    <span>LinkedIn username</span>
                    <input
                      type="text"
                      value={admin.linkedin}
                      disabled={!editing}
                      onChange={(e) => update("linkedin", e.target.value)}
                    />
                  </label>
                </div>

                <label className="htg-ap-field bio-field">
                  <span>Admin bio (max 250 characters)</span>
                  <textarea
                    rows="3"
                    value={admin.bio}
                    disabled={!editing}
                    onChange={(e) => update("bio", e.target.value)}
                    maxLength={250}
                  />
                </label>

                <div className="htg-ap-form-footer">
                  {!editing && <span>Click “Edit profile” to enable fields.</span>}
                  {editing && (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        className="htg-ap-btn secondary"
                        type="button"
                        onClick={() => setEditing(false)}
                      >
                        Cancel
                      </button>
                      <button className="htg-ap-btn primary" type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save profile ✓"}
                      </button>
                    </div>
                  )}
                </div>
              </form>
            )}

            {/* TAB: SECURITY */}
            {tab === "Security" && (
              <>
                <div className="htg-ap-panel-title">
                  <div>
                    <h3>Security preferences</h3>
                    <p>Protect privileged access to event operations</p>
                  </div>
                  <span className="htg-ap-secure-tag">● SECURE SESSION</span>
                </div>

                <div className="htg-ap-preference">
                  <div>
                    <strong>Two-factor authentication</strong>
                    <small>Require a second verification step when signing in</small>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={admin.twoFactor}
                    className={`htg-ap-switch ${admin.twoFactor ? "on" : ""}`}
                    onClick={() => handleTogglePreference("twoFactor")}
                  >
                    <span />
                  </button>
                </div>

                <div className="htg-ap-preference">
                  <div>
                    <strong>Security alerts</strong>
                    <small>Notify me about unusual sign-in and permission activity</small>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={admin.securityAlerts}
                    className={`htg-ap-switch ${admin.securityAlerts ? "on" : ""}`}
                    onClick={() => handleTogglePreference("securityAlerts")}
                  >
                    <span />
                  </button>
                </div>

                <div className="htg-ap-preference">
                  <div>
                    <strong>Email notifications</strong>
                    <small>Receive important event and account updates</small>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={admin.emailAlerts}
                    className={`htg-ap-switch ${admin.emailAlerts ? "on" : ""}`}
                    onClick={() => handleTogglePreference("emailAlerts")}
                  >
                    <span />
                  </button>
                </div>

                <div className="htg-ap-preference">
                  <div>
                    <strong>New session alerts</strong>
                    <small>Notify me when a new device starts an admin session</small>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={admin.sessionAlerts}
                    className={`htg-ap-switch ${admin.sessionAlerts ? "on" : ""}`}
                    onClick={() => handleTogglePreference("sessionAlerts")}
                  >
                    <span />
                  </button>
                </div>

                <div className="htg-ap-warning">
                  <strong>Privileged account reminder</strong>
                  <p>
                    Administrators have elevated access across teams, scoring rules, and audit logs.
                    Always ensure 2FA remains active on production environments.
                  </p>
                </div>

                <div className="htg-ap-security-actions">
                  <button
                    type="button"
                    className="htg-ap-btn secondary"
                    onClick={handleRevokeSessions}
                  >
                    Manage active sessions ↗
                  </button>
                  <button
                    type="button"
                    className="htg-ap-btn secondary"
                    onClick={() => setPasswordModalOpen(true)}
                  >
                    Change password ↗
                  </button>
                </div>
              </>
            )}
          </section>

          {/* Right Sidebar Column */}
          <aside className="htg-ap-side">
            {/* Access & Permissions Card */}
            <section className="htg-ap-panel htg-ap-access-card">
              <div className="htg-ap-side-heading">
                <h3>Access & permissions</h3>
                <span>⌑</span>
              </div>
              <div className="htg-ap-permission-role">
                <div className="permission-emblem">A</div>
                <div>
                  <strong>{admin.role}</strong>
                  <small>Role verified by platform owner</small>
                </div>
              </div>
              <div className="htg-ap-permission-list">
                {permissions.map((p) => (
                  <div key={p}>
                    <span>{p}</span>
                    <b>GRANTED</b>
                  </div>
                ))}
              </div>
              <p className="htg-ap-side-note">
                Privileges are verified server-side. Role and permission escalations are strictly prohibited.
              </p>
            </section>

            {/* Current Session Card */}
            <section className="htg-ap-panel htg-ap-session-card">
              <div className="htg-ap-side-heading">
                <h3>Current session</h3>
                <span>◉</span>
              </div>
              <div className="htg-ap-session-status">
                <i />
                <strong>Active session</strong>
                <small>Current browser session</small>
              </div>
              <div className="htg-ap-session-detail">
                <span>DEVICE</span>
                <strong>{session.device}</strong>
              </div>
              <div className="htg-ap-session-detail">
                <span>IP ADDRESS</span>
                <strong>{session.ip}</strong>
              </div>
              <div className="htg-ap-session-detail">
                <span>LAST ACTIVE</span>
                <strong>{session.lastActive}</strong>
              </div>
              <button
                type="button"
                className="htg-ap-link"
                onClick={handleRevokeSessions}
              >
                Revoke other sessions ↗
              </button>
            </section>

            {/* Help Card */}
            <section className="htg-ap-panel htg-ap-help-card">
              <span className="htg-ap-help-icon">?</span>
              <div>
                <strong>Need access help?</strong>
                <p>Contact the platform owner if you need a permission change.</p>
                <button
                  type="button"
                  className="htg-ap-link"
                  onClick={() => notify("Official support: codesphere@tulas.edu.in")}
                >
                  Admin support ↗
                </button>
              </div>
            </section>
          </aside>
        </div>

        {/* Footer */}
        <footer className="htg-ap-footer">
          <span>HACK THE GRID <i>•</i> MISSION CONTROL</span>
          <span>Built with <b>♥</b> by Hrithik Roshan</span>
          <span>ADMIN PROFILE / MANAGEMENT CONSOLE</span>
        </footer>
      </main>

      {/* Password Modal */}
      {passwordModalOpen && (
        <div className="htg-ap-modal-backdrop" onClick={() => setPasswordModalOpen(false)}>
          <div className="htg-ap-modal" onClick={(e) => e.stopPropagation()}>
            <div className="htg-ap-modal-head">
              <h3>Change Admin Password</h3>
              <button
                type="button"
                onClick={() => setPasswordModalOpen(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <div className="htg-ap-modal-body">
                {passwordError && (
                  <div
                    style={{
                      background: "#2b1414",
                      border: "1px solid #732a2a",
                      color: "#ff9999",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      fontSize: "11px"
                    }}
                  >
                    ⚠ {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div
                    style={{
                      background: "#162816",
                      border: "1px solid #3d6a36",
                      color: "#b8ff3d",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      fontSize: "11px"
                    }}
                  >
                    ✓ {passwordSuccess}
                  </div>
                )}
                <label className="htg-ap-field">
                  <span>Current Password</span>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    placeholder="Enter current password"
                    required
                  />
                </label>
                <label className="htg-ap-field">
                  <span>New Password (min 6 characters)</span>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    placeholder="Enter new password"
                    required
                  />
                </label>
                <label className="htg-ap-field">
                  <span>Confirm New Password</span>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    placeholder="Confirm new password"
                    required
                  />
                </label>
              </div>
              <div className="htg-ap-modal-actions">
                <button
                  type="button"
                  className="htg-ap-btn secondary"
                  onClick={() => setPasswordModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="htg-ap-btn primary"
                  disabled={changingPassword}
                >
                  {changingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="htg-ap-toast">
          <span>✓</span>
          {toast}
          <button type="button" onClick={() => setToast("")}>
            ×
          </button>
        </div>
      )}
    </div>
  );
}
