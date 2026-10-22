import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { adminService } from "../../services/admin.service";
import "../../styles/AdminSidebar.css";

/**
 * Required Admin Navigation links in canonical order:
 * 1. Overview → /admin/dashboard
 * 2. Teams → /admin/teams
 * 3. Challenges → /admin/challenges
 * 4. Questions → /admin/questions
 * 5. QR Checkpoints → /admin/checkpoints
 * 6. Submissions → /admin/submissions
 * 7. Leaderboard → /admin/leaderboard
 * 8. Event Control → /admin/event-control
 * 9. Security Logs → /admin/security-logs
 */
export const ADMIN_NAV_ITEMS = [
  { icon: "◫", label: "Overview", href: ROUTES.ADMIN_DASHBOARD, match: (p) => p === "/admin" || p === "/admin/dashboard" },
  { icon: "♧", label: "Teams", href: ROUTES.ADMIN_TEAMS, match: (p) => p.startsWith("/admin/teams") },
  { icon: "⌘", label: "Challenges", href: ROUTES.ADMIN_CHALLENGES, match: (p) => p.startsWith("/admin/challenges") },
  { icon: "☰", label: "Questions", href: ROUTES.ADMIN_QUESTIONS, match: (p) => p.startsWith("/admin/questions") },
  { icon: "▦", label: "QR Checkpoints", href: ROUTES.ADMIN_CHECKPOINTS, match: (p) => p.startsWith("/admin/checkpoints") },
  { icon: "⇧", label: "Submissions", href: ROUTES.ADMIN_SUBMISSIONS, match: (p) => p.startsWith("/admin/submissions") },
  { icon: "♜", label: "Leaderboard", href: ROUTES.ADMIN_LEADERBOARD, match: (p) => p.startsWith("/admin/leaderboard") },
  { icon: "◉", label: "Event Control", href: ROUTES.ADMIN_EVENT_CONTROL, match: (p) => p.startsWith("/admin/event-control") || p.startsWith("/admin/controls") },
  { icon: "⛨", label: "Security Logs", href: ROUTES.ADMIN_SECURITY_LOGS, match: (p) => p.startsWith("/admin/security-logs") || p.startsWith("/admin/logs") },
];

export default function AdminSidebar({
  teamsCount,
  submissionsCount,
  mobileOpen = false,
  onCloseMobile,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [liveStats, setLiveStats] = useState(null);

  // Fetch real counts from backend if props not directly supplied
  useEffect(() => {
    let isMounted = true;
    if (isAuthenticated && user?.role === "ADMIN") {
      adminService
        .getDashboardStats()
        .then((res) => {
          if (isMounted && res?.data?.stats) {
            setLiveStats(res.data.stats);
          }
        })
        .catch(() => {
          // Keep liveStats null if unauthenticated or error; never show fabricated count
        });
    }
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user?.role]);

  const pathname = location.pathname;
  const adminName = user?.fullName || user?.username || "Event Admin";
  const adminRole = user?.role === "ADMIN" ? "Administrator" : "Administrator";
  const avatarInitial = (adminName || "A").slice(0, 1).toUpperCase();

  const handleAccountAction = () => {
    if (onCloseMobile) onCloseMobile();
    if (isAuthenticated) {
      logout();
    }
    navigate(ROUTES.ADMIN_LOGIN);
  };

  // Determine badge values strictly from real data
  const resolvedTeamsCount =
    teamsCount !== undefined && teamsCount !== null
      ? String(teamsCount)
      : liveStats?.totalTeams !== undefined
      ? String(liveStats.totalTeams)
      : null;

  const resolvedSubmissionsCount =
    submissionsCount !== undefined && submissionsCount !== null
      ? String(submissionsCount)
      : liveStats?.totalSubmissions !== undefined
      ? String(liveStats.totalSubmissions)
      : null;

  return (
    <>
      <aside className={`htg-sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="htg-brand">
          <Link
            to={ROUTES.ADMIN_DASHBOARD}
            className="htg-brand-lockup"
            onClick={() => onCloseMobile && onCloseMobile()}
          >
            <span className="htg-brand-mark">
              <i />
            </span>
            <span className="htg-brand-title">
              THE TECH <b>MYSTERY</b>
              <small>MISSION CONTROL</small>
            </span>
          </Link>
        </div>

        <div className="htg-sidebar-section-label">
          ADMIN CONSOLE <span className="htg-live-dot" />
        </div>

        <nav className="htg-nav" aria-label="Admin navigation">
          {ADMIN_NAV_ITEMS.map((item) => {
            const isActive = item.match(pathname);
            const badge =
              item.label === "Teams"
                ? resolvedTeamsCount
                : item.label === "Submissions"
                ? resolvedSubmissionsCount
                : null;

            return (
              <Link
                key={item.label}
                to={item.href}
                className={`htg-nav-item ${isActive ? "active" : ""}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => onCloseMobile && onCloseMobile()}
              >
                <span className="htg-nav-icon">{item.icon}</span>
                <span className="htg-nav-label">{item.label}</span>
                {badge && <span className="htg-nav-count">{badge}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="htg-sidebar-bottom">
          <div className="htg-system-status">
            <span className="htg-live-dot" />
            <div>
              <strong>All systems operational</strong>
              <small>API · DATABASE · SCORING</small>
            </div>
          </div>
          <div className={`htg-sidebar-user ${pathname.startsWith('/admin/profile') ? 'active' : ''}`}>
            <Link
              to={ROUTES.ADMIN_PROFILE}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0, textDecoration: 'none', color: 'inherit' }}
              title="Admin Profile"
              onClick={() => onCloseMobile && onCloseMobile()}
            >
              <span className="htg-admin-avatar">{avatarInitial}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <strong>{adminName}</strong>
                <small>{adminRole}</small>
              </span>
            </Link>
            <button
              type="button"
              aria-label="Account options"
              title={isAuthenticated ? "Sign out / Switch admin account" : "Admin Login"}
              onClick={handleAccountAction}
            >
              ···
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="htg-sidebar-scrim"
          aria-label="Close navigation menu"
          onClick={() => onCloseMobile && onCloseMobile()}
        />
      )}
    </>
  );
}
