import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth.service";
import { ROUTES } from "../../constants/routes";
import "../../styles/UserProfilePage.css";

const defaultProfile = {
  fullName: "",
  username: "",
  email: "",
  college: "Tula's University",
  course: "B.Tech CSE",
  year: "3rd Year",
  teamName: "No Squad Joined",
  teamCode: "—",
  bio: "",
  github: "",
  linkedin: "",
  publicProfile: true,
  emailUpdates: true,
  avatar: ""
};

const defaultStats = {
  totalXp: "0",
  challengesSolved: "00 / 10",
  checkpoints: "00 / 10",
  contribution: "0%",
  rankNumber: "UNRANKED",
  rankPercentile: "UNRANKED",
  teamScore: 0,
  teamRank: "UNRANKED",
  teamProgress: 0
};

export default function UserProfilePage() {
  const { user, logout, manageAccount } = useAuth();
  const navigate = useNavigate();

  // State
  const [profile, setProfile] = useState(defaultProfile);
  const [stats, setStats] = useState(defaultStats);
  const [achievements, setAchievements] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isLiveDatabase, setIsLiveDatabase] = useState(false);
  const [apiError, setApiError] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [tab, setTab] = useState("Overview");
  const [saved, setSaved] = useState(false);
  const [avatarMenu, setAvatarMenu] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToast] = useState("");

  // Security modal
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // File upload ref for avatar
  const avatarInputRef = useRef(null);

  // Fetch profile on mount
  useEffect(() => {
    let isMounted = true;
    const fetchUserProfile = async () => {
      setLoading(true);
      setApiError("");
      try {
        const res = await authService.getProfile();
        if (isMounted && res?.data?.profile) {
          const p = res.data.profile;
          setProfile({
            fullName: p.fullName || initialProfile.fullName,
            username: p.username || initialProfile.username,
            email: p.email || initialProfile.email,
            college: p.college || initialProfile.college,
            course: p.course || initialProfile.course,
            year: p.year || initialProfile.year,
            teamName: p.teamName || initialProfile.teamName,
            teamCode: p.teamCode || initialProfile.teamCode,
            bio: p.bio !== undefined ? p.bio : initialProfile.bio,
            github: p.github || "",
            linkedin: p.linkedin || "",
            publicProfile: p.publicProfile !== undefined ? p.publicProfile : true,
            emailUpdates: p.emailUpdates !== undefined ? p.emailUpdates : true,
            avatar: p.avatar || ""
          });

          if (res.data.stats) {
            setStats({
              totalXp: String(res.data.stats.totalXp ?? "0"),
              challengesSolved: res.data.stats.challengesSolved || "00 / 10",
              checkpoints: res.data.stats.checkpoints || "00 / 10",
              contribution: res.data.stats.contribution || "0%",
              rankNumber: res.data.stats.rankNumber || "UNRANKED",
              rankPercentile: res.data.stats.rankPercentile || "UNRANKED",
              teamScore: Number(res.data.stats.teamScore ?? 0),
              teamRank: res.data.team?.rank ? `#${String(res.data.team.rank).padStart(2, '0')}` : "UNRANKED",
              teamProgress: Number(res.data.stats.teamProgress ?? 0)
            });
          }

          if (Array.isArray(res.data.achievements)) {
            setAchievements(res.data.achievements);
          }

          if (Array.isArray(res.data.recentActivity)) {
            setRecentActivity(res.data.recentActivity);
          }

          setIsLiveDatabase(true);
        }
      } catch (err) {
        if (isMounted) {
          console.warn("Using offline / preview user profile data:", err.message);
          setIsLiveDatabase(false);
          // If auth context has user data, fill in what we have
          if (user) {
            setProfile((prev) => ({
              ...prev,
              fullName: user.name || user.fullName || prev.fullName,
              email: user.email || prev.email,
              username: user.username || prev.username
            }));
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Initials calculation
  const initials = useMemo(() => {
    return (
      profile.fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase() || "HT"
    );
  }, [profile.fullName]);

  // Field updater
  const update = (key, value) => {
    setProfile((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  // Profile save handler
  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setApiError("");

    // Client-side validations
    if (!profile.fullName.trim() || profile.fullName.trim().length < 2) {
      setToast("Full name must be at least 2 characters.");
      setSaving(false);
      return;
    }
    if (!profile.username.trim() || profile.username.trim().length < 3) {
      setToast("Username must be at least 3 characters.");
      setSaving(false);
      return;
    }

    try {
      if (isLiveDatabase) {
        await authService.updateProfile({
          fullName: profile.fullName.trim(),
          username: profile.username.trim(),
          email: profile.email.trim(),
          college: profile.college.trim(),
          course: profile.course.trim(),
          year: profile.year.trim(),
          bio: profile.bio.trim(),
          github: profile.github.trim(),
          linkedin: profile.linkedin.trim(),
          publicProfile: profile.publicProfile,
          emailUpdates: profile.emailUpdates
        });
        setToast("Profile successfully saved to live database.");
      } else {
        setToast("Profile preview updated. Connect backend to persist across sessions.");
      }
      setEditMode(false);
      setSaved(true);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update profile";
      setToast(`Error: ${msg}`);
      setApiError(msg);
    } finally {
      setSaving(false);
    }
  };

  // Avatar upload handler
  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setToast("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 500 * 1024) {
      setToast("Image size must be less than 500 KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      setProfile((prev) => ({ ...prev, avatar: base64Data }));
      if (isLiveDatabase) {
        try {
          await authService.updateAvatar(base64Data);
          setToast("Avatar updated successfully.");
        } catch (err) {
          setToast("Failed to upload avatar to server.");
        }
      } else {
        setToast("Avatar preview loaded.");
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
        setToast("Account password updated successfully.");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setSecurityModalOpen(false), 1200);
      } else {
        setPasswordSuccess("Password change verified in preview mode.");
        setToast("Password simulation passed.");
        setTimeout(() => setSecurityModalOpen(false), 1200);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update password.";
      setPasswordError(msg);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSignOut = () => {
    if (logout) {
      logout();
    }
    setAvatarMenu(false);
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="htg-user-profile">
      {/* Hidden file input for avatar upload */}
      <input
        type="file"
        ref={avatarInputRef}
        style={{ display: "none" }}
        accept="image/png,image/jpeg,image/webp"
        onChange={handleAvatarFile}
      />

      {/* Top Navbar */}
      <header className="htg-up-navbar">
        <Link className="htg-up-brand" to={ROUTES.HOME}>
          <span className="htg-up-brand-mark">H</span>
          <span>
            THE TECH MYSTERY<small>PARTICIPANT PORTAL</small>
          </span>
        </Link>

        <nav className="htg-up-nav">
          <Link to={ROUTES.HOME}>Home</Link>
          <Link to={ROUTES.CHALLENGES}>Challenges</Link>
          <Link to={ROUTES.LEADERBOARD}>Leaderboard</Link>
          <Link to={ROUTES.RULES}>Rules</Link>
          <Link to={ROUTES.TEAM_PROFILE}>Team</Link>
          <Link to={ROUTES.PROFILE} className="active">Profile</Link>
        </nav>

        <div className="htg-up-nav-right">
          {/* Data source indicator */}
          <span className="htg-up-data-pill live"><i /> LIVE DATABASE</span>

          <span className="htg-up-live">
            <i /> EVENT LIVE
          </span>

          {/* User mini avatar button with dropdown */}
          <button
            type="button"
            className="htg-up-avatar-mini"
            onClick={() => setAvatarMenu(!avatarMenu)}
            title="User menu"
            aria-label="User menu"
          >
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="Avatar"
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              initials
            )}
          </button>

          {avatarMenu && (
            <div className="htg-up-avatar-pop">
              <strong>{profile.fullName}</strong>
              <small style={{ color: "#7f8a7d", padding: "0 5px 6px", display: "block", fontSize: "9px" }}>
                @{profile.username}
              </small>
              <button
                type="button"
                onClick={() => {
                  setTab("Settings");
                  setEditMode(true);
                  setAvatarMenu(false);
                }}
              >
                Profile settings
              </button>
              <button
                type="button"
                onClick={() => {
                  setSecurityModalOpen(true);
                  setAvatarMenu(false);
                }}
              >
                Account security
              </button>
              <button
                type="button"
                onClick={() => {
                  setAvatarMenu(false);
                  navigate(ROUTES.TEAM_PROFILE);
                }}
              >
                Team dashboard
              </button>
              <button
                type="button"
                style={{ color: "#ff8282" }}
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </div>
          )}

          {/* Mobile navigation toggle */}
          <button
            type="button"
            className="htg-up-mobile-toggle"
            aria-label="Toggle navigation drawer"
            onClick={() => setMobileNavOpen((prev) => !prev)}
          >
            {mobileNavOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`htg-up-mobile-drawer ${mobileNavOpen ? "open" : ""}`}>
        <Link to={ROUTES.HOME} onClick={() => setMobileNavOpen(false)}>Home</Link>
        <Link to={ROUTES.CHALLENGES} onClick={() => setMobileNavOpen(false)}>Challenges</Link>
        <Link to={ROUTES.LEADERBOARD} onClick={() => setMobileNavOpen(false)}>Leaderboard</Link>
        <Link to={ROUTES.RULES} onClick={() => setMobileNavOpen(false)}>Rules</Link>
        <Link to={ROUTES.TEAM_PROFILE} onClick={() => setMobileNavOpen(false)}>Team</Link>
        <Link to={ROUTES.PROFILE} className="active" onClick={() => setMobileNavOpen(false)}>Profile</Link>
        <button
          type="button"
          onClick={() => {
            setMobileNavOpen(false);
            setSecurityModalOpen(true);
          }}
          style={{
            background: "transparent",
            border: "none",
            color: "#9aa49a",
            textAlign: "left",
            padding: "8px 0",
            fontSize: "12px",
            fontFamily: "inherit"
          }}
        >
          Security settings
        </button>
      </div>

      {/* Main Content */}
      <main className="htg-up-main">
        {/* Breadcrumb */}
        <div className="htg-up-breadcrumb">
          <span>PARTICIPANT PORTAL</span>
          <i>/</i>
          <b>MY PROFILE</b>
        </div>

        {/* Page Heading */}
        <section className="htg-up-page-heading">
          <div>
            <div className="htg-up-eyebrow">IDENTITY / PLAYER CARD</div>
            <h1>
              My <span>Profile</span>
            </h1>
            <p>Your player identity, progress, and event preferences in one place.</p>
          </div>
          <div className="htg-up-heading-actions">
            <span className="htg-up-member-pill">
              <i /> ACTIVE PARTICIPANT
            </span>
            <button
              className="htg-up-btn primary"
              type="button"
              onClick={() => {
                if (editMode) {
                  setEditMode(false);
                } else {
                  setTab("Settings");
                  setEditMode(true);
                }
              }}
            >
              {editMode ? "Cancel editing" : "Edit profile"} <span>↗</span>
            </button>
          </div>
        </section>

        {/* Hero Section */}
        <section className="htg-up-profile-hero">
          <div className="htg-up-hero-grid" />
          <div className="htg-up-avatar-wrap">
            <div className="htg-up-avatar-large">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.fullName}
                  style={{ width: "100%", height: "100%", borderRadius: "24px", objectFit: "cover" }}
                />
              ) : (
                initials
              )}
              <span className="avatar-status" />
            </div>
            <button
              className="htg-up-avatar-edit"
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              title="Upload avatar photo"
              aria-label="Upload avatar"
            >
              ＋
            </button>
          </div>

          <div className="htg-up-hero-identity">
            <div className="htg-up-verified">◈ VERIFIED PLAYER</div>
            <h2>{profile.fullName}</h2>
            <p>@{profile.username}</p>
            <div className="htg-up-identity-meta">
              <span>⌖ {profile.college || "College not set"}</span>
              <span>⌘ {profile.course || "Course not set"}</span>
              <span>♙ {profile.teamName || "No team assigned"}</span>
            </div>
          </div>

          <div className="htg-up-hero-rank">
            <span>CURRENT RANK</span>
            <strong>{stats.rankNumber}</strong>
            <small>{stats.rankPercentile}</small>
            <div className="htg-up-rank-bar">
              <span />
            </div>
          </div>
        </section>

        {/* Quick Stats Grid */}
        <section className="htg-up-stat-grid">
          <ProfileStat icon="⚑" label="Total XP" value={stats.totalXp} note="+230 this session" />
          <ProfileStat icon="⌘" label="Challenges solved" value={stats.challengesSolved} note="2 levels remaining" />
          <ProfileStat icon="▣" label="Checkpoints" value={stats.checkpoints} note="40% explored" />
          <ProfileStat icon="♙" label="Team contribution" value={stats.contribution} note="Of team XP" />
        </section>

        {/* 2-Column Content Grid */}
        <div className="htg-up-content-grid">
          {/* Main Column */}
          <section className="htg-up-panel htg-up-main-panel">
            {/* Tabs */}
            <div className="htg-up-tabs">
              {["Overview", "Achievements", "Settings"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={tab === item ? "selected" : ""}
                  onClick={() => {
                    setTab(item);
                    if (item !== "Settings") setEditMode(false);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* TAB: OVERVIEW */}
            {tab === "Overview" && (
              <>
                <div className="htg-up-panel-title">
                  <div>
                    <h3>Player information</h3>
                    <p>Your registered participant details</p>
                  </div>
                  <button
                    className="htg-up-text-btn"
                    type="button"
                    onClick={() => {
                      setTab("Settings");
                      setEditMode(true);
                    }}
                  >
                    Edit details ↗
                  </button>
                </div>

                <div className="htg-up-info-grid">
                  <Info label="FULL NAME" value={profile.fullName} />
                  <Info label="USERNAME" value={`@${profile.username}`} />
                  <Info label="EMAIL ADDRESS" value={profile.email} />
                  <Info label="COLLEGE / UNIVERSITY" value={profile.college} />
                  <Info label="COURSE" value={profile.course} />
                  <Info label="ACADEMIC YEAR" value={profile.year} />
                  <Info label="TEAM" value={profile.teamName} />
                  <Info label="GITHUB" value={profile.github ? `@${profile.github}` : "Not linked"} />
                </div>

                <div className="htg-up-bio">
                  <span>ABOUT ME</span>
                  <p>{profile.bio || "Add a short introduction to your player profile."}</p>
                </div>

                <div className="htg-up-panel-title activity-heading">
                  <div>
                    <h3>Recent activity</h3>
                    <p>Your latest actions in the grid</p>
                  </div>
                  <span className="htg-up-count">LAST {recentActivity.length} EVENTS</span>
                </div>

                <div className="htg-up-activity-list">
                  {recentActivity.length === 0 ? (
                    <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--htg-text-secondary, #94a3b8)" }}>
                      <div style={{ fontSize: "1.6rem", marginBottom: "8px", opacity: 0.4 }}>📋</div>
                      <strong>No recent activity</strong>
                      <p style={{ fontSize: "0.85rem", marginTop: "4px" }}>
                        Your challenge solves, hint unlocks, and checkpoint scans will appear here.
                      </p>
                    </div>
                  ) : (
                    recentActivity.map((item, idx) => (
                      <div className="htg-up-activity" key={`${item.time}-${idx}`}>
                        <div className={`htg-up-activity-icon ${item.kind}`}>
                          {item.kind === "checkpoint" ? "▣" : item.kind === "challenge" ? "⌘" : "?"}
                        </div>
                        <div className="htg-up-activity-copy">
                          <strong>{item.title}</strong>
                          <small>{item.detail}</small>
                        </div>
                        <div className={`htg-up-xp ${item.kind}`}>{item.points}</div>
                        <time>{item.time}</time>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {/* TAB: ACHIEVEMENTS */}
            {tab === "Achievements" && (
              <>
                <div className="htg-up-panel-title">
                  <div>
                    <h3>Achievements & badges</h3>
                    <p>Milestones earned during your run</p>
                  </div>
                  <span className="htg-up-count">
                    {achievements.filter((a) => a.date !== "IN PROGRESS").length} UNLOCKED ·{" "}
                    {achievements.filter((a) => a.date === "IN PROGRESS").length} IN PROGRESS
                  </span>
                </div>

                <div className="htg-up-achievements">
                  {achievements.length === 0 ? (
                    <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--htg-text-secondary, #94a3b8)", gridColumn: "1/-1" }}>
                      <div style={{ fontSize: "1.6rem", marginBottom: "8px", opacity: 0.4 }}>🏅</div>
                      <strong>No achievements yet</strong>
                      <p style={{ fontSize: "0.85rem", marginTop: "4px" }}>
                        Solve challenges and scan physical QR checkpoints on campus to unlock honors.
                      </p>
                    </div>
                  ) : (
                    achievements.map((item) => (
                      <div className={`htg-up-achievement ${item.tone}`} key={item.name}>
                        <div className="achievement-icon">{item.icon}</div>
                        <div>
                          <strong>{item.name}</strong>
                          <p>{item.detail}</p>
                          <small>{item.date}</small>
                        </div>
                        {item.date !== "IN PROGRESS" && <span className="achievement-check">✓</span>}
                      </div>
                    ))
                  )}
                </div>

                <div className="htg-up-achievement-note">
                  <span>✦</span>
                  <div>
                    <strong>Keep exploring</strong>
                    <p>Clear more levels and checkpoints to unlock additional badges.</p>
                  </div>
                </div>
              </>
            )}

            {/* TAB: SETTINGS */}
            {tab === "Settings" && (
              <form onSubmit={saveProfile} className="htg-up-settings-form">
                <div className="htg-up-panel-title">
                  <div>
                    <h3>Profile settings</h3>
                    <p>Manage your public identity and contact details</p>
                  </div>
                  <span className="htg-up-count">
                    "LIVE DATABASE"
                  </span>
                </div>

                {apiError && (
                  <div
                    style={{
                      background: "#2a1515",
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

                <div className="htg-up-edit-grid">
                  <EditField
                    label="Full name"
                    value={profile.fullName}
                    onChange={(v) => update("fullName", v)}
                    disabled={!editMode}
                  />
                  <EditField
                    label="Username"
                    value={profile.username}
                    onChange={(v) => update("username", v)}
                    disabled={!editMode}
                  />
                  <EditField
                    label="Email address"
                    value={profile.email}
                    onChange={(v) => update("email", v)}
                    disabled={!editMode}
                    type="email"
                  />
                  <EditField
                    label="College / University"
                    value={profile.college}
                    onChange={(v) => update("college", v)}
                    disabled={!editMode}
                  />
                  <EditField
                    label="Course"
                    value={profile.course}
                    onChange={(v) => update("course", v)}
                    disabled={!editMode}
                  />
                  <EditField
                    label="Academic year"
                    value={profile.year}
                    onChange={(v) => update("year", v)}
                    disabled={!editMode}
                  />
                  <EditField
                    label="Team name (Managed by team captain)"
                    value={profile.teamName}
                    onChange={(v) => update("teamName", v)}
                    disabled
                  />
                  <EditField
                    label="GitHub username"
                    value={profile.github}
                    onChange={(v) => update("github", v)}
                    disabled={!editMode}
                  />
                  <EditField
                    label="LinkedIn username"
                    value={profile.linkedin}
                    onChange={(v) => update("linkedin", v)}
                    disabled={!editMode}
                  />
                </div>

                <label className="htg-up-edit-field bio-field">
                  <span>Short bio (max 180 characters)</span>
                  <textarea
                    rows="3"
                    value={profile.bio}
                    onChange={(e) => update("bio", e.target.value)}
                    disabled={!editMode}
                    maxLength={180}
                  />
                </label>

                <div className="htg-up-pref-list">
                  <Preference
                    title="Public profile"
                    description="Let other participants view your player card"
                    checked={profile.publicProfile}
                    onChange={(v) => update("publicProfile", v)}
                    disabled={!editMode}
                  />
                  <Preference
                    title="Event email updates"
                    description="Receive event announcements and important updates"
                    checked={profile.emailUpdates}
                    onChange={(v) => update("emailUpdates", v)}
                    disabled={!editMode}
                  />
                </div>

                <div className="htg-up-form-actions">
                  {!editMode && <span>Click “Edit profile” to enable fields.</span>}
                  {editMode && (
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <button
                        className="htg-up-btn secondary"
                        type="button"
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </button>
                      <button className="htg-up-btn primary" type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save profile"} <span>✓</span>
                      </button>
                    </div>
                  )}
                </div>
              </form>
            )}
          </section>

          {/* Right Side Column */}
          <aside className="htg-up-side-column">
            {/* Team Identity Card */}
            <section className="htg-up-panel htg-up-team-card">
              <div className="htg-up-side-title">
                <h3>Team identity</h3>
                <span className="htg-up-online">
                  <i /> IN EVENT
                </span>
              </div>
              <div className="htg-up-team-emblem">
                PR<span>+</span>
              </div>
              <h3 className="htg-up-team-name">{profile.teamName || "Unassigned team"}</h3>
              <p className="htg-up-team-sub">TEAM CODE · {profile.teamCode || "HTG-1038"}</p>
              <div className="htg-up-team-stats">
                <div>
                  <span>TEAM RANK</span>
                  <strong>{stats.teamRank}</strong>
                </div>
                <div>
                  <span>TEAM XP</span>
                  <strong>{stats.teamScore.toLocaleString()}</strong>
                </div>
              </div>
              <div className="htg-up-team-progress">
                <div>
                  <span>Team progress</span>
                  <b>{stats.teamProgress}%</b>
                </div>
                <div className="team-progress-track">
                  <span style={{ width: `${stats.teamProgress}%` }} />
                </div>
              </div>
              <button
                className="htg-up-btn secondary full"
                type="button"
                onClick={() => navigate(ROUTES.TEAM_PROFILE)}
              >
                View team dashboard ↗
              </button>
            </section>

            {/* Badges Card */}
            <section className="htg-up-panel htg-up-badges-card">
              <div className="htg-up-panel-title">
                <div>
                  <h3>Recent badges</h3>
                  <p>Your latest milestones</p>
                </div>
                <button
                  className="htg-up-text-btn"
                  type="button"
                  onClick={() => setTab("Achievements")}
                >
                  View all ↗
                </button>
              </div>
              <div className="htg-up-mini-badges">
                {achievements.slice(0, 2).map((item) => (
                  <div className={`htg-up-mini-badge ${item.tone}`} key={item.name}>
                    <div>{item.icon}</div>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Account Security Card */}
            <section className="htg-up-panel htg-up-account-card">
              <div className="htg-up-side-title">
                <h3>Account security</h3>
                <span className="htg-up-security-icon">⌑</span>
              </div>
              <div className="htg-up-security-row">
                <span>
                  <i /> Email verification
                </span>
                <b>VERIFIED</b>
              </div>
              <div className="htg-up-security-row">
                <span>
                  <i /> Login security
                </span>
                <b>ACTIVE</b>
              </div>
              <button
                className="htg-up-text-btn"
                type="button"
                onClick={() => manageAccount ? manageAccount() : setSecurityModalOpen(true)}
              >
                Manage account security ↗
              </button>
            </section>
          </aside>
        </div>

        {/* Footer */}
        <footer className="htg-up-footer">
          <span>THE TECH MYSTERY <i>•</i> PARTICIPANT PORTAL</span>
          <span>Built with <b>♥</b> by Hrithik Roshan</span>
          <span>PLAYER PROFILE / IDENTITY CONSOLE</span>
        </footer>
      </main>

      {/* Account Security / Password Change Modal */}
      {securityModalOpen && (
        <div className="htg-up-modal-backdrop" onClick={() => setSecurityModalOpen(false)}>
          <div className="htg-up-modal" onClick={(e) => e.stopPropagation()}>
            <div className="htg-up-modal-head">
              <h3>Change Password</h3>
              <button
                type="button"
                onClick={() => setSecurityModalOpen(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <div className="htg-up-modal-body">
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
                <label className="htg-up-edit-field">
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
                <label className="htg-up-edit-field">
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
                <label className="htg-up-edit-field">
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
              <div className="htg-up-modal-actions">
                <button
                  type="button"
                  className="htg-up-btn secondary"
                  onClick={() => setSecurityModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="htg-up-btn primary"
                  disabled={changingPassword}
                >
                  {changingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Notifications */}
      {toast && (
        <div className="htg-up-toast">
          <span>✓</span>
          {toast}
          <button type="button" onClick={() => setToast("")}>
            ×
          </button>
        </div>
      )}
      {saved && <div className="htg-up-saved-mark">✓ Profile saved</div>}
    </div>
  );
}

function ProfileStat({ icon, label, value, note }) {
  return (
    <div className="htg-up-stat">
      <div>
        <span>{label}</span>
        <i>{icon}</i>
      </div>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="htg-up-info">
      <span>{label}</span>
      <strong>{value || "Not provided"}</strong>
    </div>
  );
}

function EditField({ label, value, onChange, disabled, type = "text" }) {
  return (
    <label className="htg-up-edit-field">
      <span>{label}</span>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </label>
  );
}

function Preference({ title, description, checked, onChange, disabled }) {
  return (
    <div className="htg-up-preference">
      <div>
        <strong>{title}</strong>
        <small>{description}</small>
      </div>
      <button
        type="button"
        disabled={disabled}
        role="switch"
        aria-checked={checked}
        className={`htg-up-switch ${checked ? "on" : ""}`}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    </div>
  );
}
