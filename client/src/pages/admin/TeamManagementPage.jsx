import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/navigation/AdminSidebar";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { adminService } from "../../services/admin.service";
import "../../styles/TeamManagementPage.css";

const initialTeams = [
  {
    id: 1,
    name: "CodeRaiders",
    college: "Tula's University",
    members: 4,
    status: "Active",
    level: 8,
    score: 850,
    registered: "Oct 10, 10:24 AM",
    email: "coderaiders@example.com",
    leader: "Aryan Singh",
    isDemo: true,
    memberList: [
      { name: "Aryan Singh", role: "Team Leader", initials: "A", verified: true },
      { name: "Rahul Mehta", role: "Member", initials: "R", verified: true },
      { name: "Priya Sharma", role: "Member", initials: "P", verified: true },
      { name: "Karan Verma", role: "Member", initials: "K", verified: true },
    ],
  },
  {
    id: 2,
    name: "ByteBrigade",
    college: "Tula's University",
    members: 3,
    status: "Active",
    level: 7,
    score: 720,
    registered: "Oct 10, 10:18 AM",
    email: "bytebrigade@example.com",
    leader: "Riya Sharma",
    isDemo: true,
    memberList: [
      { name: "Riya Sharma", role: "Team Leader", initials: "R", verified: true },
      { name: "Rahul Mehta", role: "Member", initials: "R", verified: true },
      { name: "Priya Sharma", role: "Member", initials: "P", verified: true },
    ],
  },
  {
    id: 3,
    name: "Null Pointers",
    college: "DIT University",
    members: 4,
    status: "Active",
    level: 6,
    score: 610,
    registered: "Oct 10, 10:05 AM",
    email: "nullpointers@example.com",
    leader: "Kabir Joshi",
    isDemo: true,
    memberList: [
      { name: "Kabir Joshi", role: "Team Leader", initials: "K", verified: true },
      { name: "Rahul Mehta", role: "Member", initials: "R", verified: true },
      { name: "Priya Sharma", role: "Member", initials: "P", verified: true },
      { name: "Karan Verma", role: "Member", initials: "K", verified: true },
    ],
  },
  {
    id: 4,
    name: "Debug Dynasty",
    college: "Tula's University",
    members: 3,
    status: "Pending",
    level: 4,
    score: 340,
    registered: "Oct 10, 09:52 AM",
    email: "debugdynasty@example.com",
    leader: "Ananya Verma",
    isDemo: true,
    memberList: [
      { name: "Ananya Verma", role: "Team Leader", initials: "A", verified: true },
      { name: "Rahul Mehta", role: "Member", initials: "R", verified: true },
      { name: "Priya Sharma", role: "Member", initials: "P", verified: true },
    ],
  },
  {
    id: 5,
    name: "Syntax Squad",
    college: "Tula's University",
    members: 4,
    status: "Active",
    level: 5,
    score: 500,
    registered: "Oct 10, 09:41 AM",
    email: "syntaxsquad@example.com",
    leader: "Dev Malhotra",
    isDemo: true,
    memberList: [
      { name: "Dev Malhotra", role: "Team Leader", initials: "D", verified: true },
      { name: "Rahul Mehta", role: "Member", initials: "R", verified: true },
      { name: "Priya Sharma", role: "Member", initials: "P", verified: true },
      { name: "Karan Verma", role: "Member", initials: "K", verified: true },
    ],
  },
  {
    id: 6,
    name: "Bit Benders",
    college: "UPES",
    members: 3,
    status: "Active",
    level: 4,
    score: 420,
    registered: "Oct 10, 09:20 AM",
    email: "bitbenders@example.com",
    leader: "Ishaan Kapoor",
    isDemo: true,
    memberList: [
      { name: "Ishaan Kapoor", role: "Team Leader", initials: "I", verified: true },
      { name: "Rahul Mehta", role: "Member", initials: "R", verified: true },
      { name: "Priya Sharma", role: "Member", initials: "P", verified: true },
    ],
  },
  {
    id: 7,
    name: "Tech Titans",
    college: "Graphic Era",
    members: 4,
    status: "Active",
    level: 3,
    score: 310,
    registered: "Oct 10, 09:12 AM",
    email: "techtitans@example.com",
    leader: "Meera Negi",
    isDemo: true,
    memberList: [
      { name: "Meera Negi", role: "Team Leader", initials: "M", verified: true },
      { name: "Rahul Mehta", role: "Member", initials: "R", verified: true },
      { name: "Priya Sharma", role: "Member", initials: "P", verified: true },
      { name: "Karan Verma", role: "Member", initials: "K", verified: true },
    ],
  },
  {
    id: 8,
    name: "Quantum Bytes",
    college: "Tula's University",
    members: 2,
    status: "Disqualified",
    level: 2,
    score: 150,
    registered: "Oct 10, 09:05 AM",
    email: "quantumbytes@example.com",
    leader: "Arjun Rawat",
    isDemo: true,
    memberList: [
      { name: "Arjun Rawat", role: "Team Leader", initials: "A", verified: true },
      { name: "Rahul Mehta", role: "Member", initials: "R", verified: true },
    ],
  },
  {
    id: 9,
    name: "Loop Legends",
    college: "DIT University",
    members: 3,
    status: "Active",
    level: 3,
    score: 290,
    registered: "Oct 10, 08:50 AM",
    email: "looplegends@example.com",
    leader: "Tanya Singh",
    isDemo: true,
    memberList: [
      { name: "Tanya Singh", role: "Team Leader", initials: "T", verified: true },
      { name: "Rahul Mehta", role: "Member", initials: "R", verified: true },
      { name: "Priya Sharma", role: "Member", initials: "P", verified: true },
    ],
  },
  {
    id: 10,
    name: "Array Avengers",
    college: "Tula's University",
    members: 4,
    status: "Pending",
    level: 1,
    score: 120,
    registered: "Oct 10, 08:32 AM",
    email: "arrayavengers@example.com",
    leader: "Rahul Negi",
    isDemo: true,
    memberList: [
      { name: "Rahul Negi", role: "Team Leader", initials: "R", verified: true },
      { name: "Rahul Mehta", role: "Member", initials: "R", verified: true },
      { name: "Priya Sharma", role: "Member", initials: "P", verified: true },
      { name: "Karan Verma", role: "Member", initials: "K", verified: true },
    ],
  },
];

const defaultMembers = [
  { name: "Aryan Singh", role: "Team Leader", initials: "A", verified: true },
  { name: "Rahul Mehta", role: "Member", initials: "R", verified: true },
  { name: "Priya Sharma", role: "Member", initials: "P", verified: true },
  { name: "Karan Verma", role: "Member", initials: "K", verified: true },
];

const statusClass = (status) => status.toLowerCase().replace(/\s+/g, "-");

function formatRegisteredDate(dateStr) {
  if (!dateStr) return "Oct 10, 10:00 AM";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function mapApiTeamToUi(team, index) {
  const leaderObj =
    team.leaderId && typeof team.leaderId === "object" ? team.leaderId : null;
  const leaderIdStr = leaderObj ? String(leaderObj._id) : String(team.leaderId || "");
  const rawMembers = Array.isArray(team.members) ? team.members : [];

  const mappedMembers = rawMembers.map((m, idx) => {
    if (m && typeof m === "object") {
      const displayName = m.fullName || m.username || `Operative ${idx + 1}`;
      const isLeader = String(m._id) === leaderIdStr || m.role === "TEAM_LEADER";
      return {
        id: m._id || idx,
        name: displayName,
        email: m.email || "",
        role: isLeader ? "Team Leader" : "Member",
        initials: displayName.slice(0, 1).toUpperCase(),
        verified: m.isActive !== false,
      };
    }
    return {
      id: String(m || idx),
      name: `Operative ${idx + 1}`,
      email: "",
      role: idx === 0 ? "Team Leader" : "Member",
      initials: "O",
      verified: true,
    };
  });

  const memberCount = mappedMembers.length || 1;
  const derivedStatus = team.isDisqualified
    ? "Disqualified"
    : team.status || (memberCount < 2 ? "Pending" : "Active");

  return {
    id: team._id || index + 1,
    emblemIndex: index + 1,
    joinCode: team.joinCode || "",
    name: team.name || `Team ${index + 1}`,
    college: team.college || "Tula's University",
    members: memberCount,
    status: derivedStatus,
    level: Number(team.currentLevel) || 1,
    score: Number(team.totalScore) || 0,
    registered: formatRegisteredDate(team.createdAt),
    email: leaderObj?.email || "—",
    leader: leaderObj?.fullName || leaderObj?.username || "Team Leader",
    disqualificationReason: team.disqualificationReason || null,
    isDemo: false,
    memberList: mappedMembers,
  };
}

const PAGE_SIZE = 10;

export const TeamManagementPage = () => {
  const { user, isAuthenticated } = useAuth();
  const globalSearchRef = useRef(null);

  const [teams, setTeams] = useState(initialTeams);
  const [selectedId, setSelectedId] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [levelFilter, setLevelFilter] = useState("All Levels");
  const [collegeFilter, setCollegeFilter] = useState("All Colleges");
  const [view, setView] = useState("table");
  const [activeTab, setActiveTab] = useState("Overview");
  const [notice, setNotice] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [dataSource, setDataSource] = useState("demo"); // "live" | "demo"
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchLiveTeams = useCallback(async (showSuccessNotice = false) => {
    setLoading(true);
    setApiError("");
    try {
      const res = await adminService.getAllTeams();
      const apiTeams = res?.data?.teams;
      if (Array.isArray(apiTeams)) {
        const mapped = apiTeams.map(mapApiTeamToUi);
        setTeams(mapped);
        setDataSource("live");
        if (mapped.length > 0) {
          setSelectedId(mapped[0].id);
        }
        if (showSuccessNotice) {
          setNotice(`Synchronized ${mapped.length} team record(s) from the live Admin API.`);
        }
      }
    } catch (err) {
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message;
      setDataSource("demo");
      setTeams((prev) => (prev.length > 0 && prev[0]?.isDemo ? prev : initialTeams));
      if (status === 401 || status === 403) {
        setApiError(
          serverMsg ||
            "Admin authorization required for live database records. Showing clearly labeled DEMO PREVIEW data."
        );
      } else {
        setApiError(
          serverMsg ||
            "Live Admin API (/api/v1/admin/teams) is currently unreachable. Showing clearly labeled DEMO PREVIEW data."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveTeams(false);
  }, [fetchLiveTeams]);

  // Ctrl+K shortcut to focus global search
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        globalSearchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filteredTeams = useMemo(
    () =>
      teams.filter((team) => {
        const term = search.trim().toLowerCase();
        const memberTokens = Array.isArray(team.memberList)
          ? team.memberList.flatMap((m) => [m.name || "", m.email || ""])
          : [];
        const matchesSearch =
          !term ||
          [
            team.name,
            team.college,
            team.leader,
            team.email,
            team.joinCode || "",
            ...memberTokens,
          ].some((value) => String(value || "").toLowerCase().includes(term));
        const matchesStatus =
          statusFilter === "All Status" || team.status === statusFilter;
        const matchesLevel =
          levelFilter === "All Levels" || team.level === Number(levelFilter);
        const matchesCollege =
          collegeFilter === "All Colleges" || team.college === collegeFilter;
        return matchesSearch && matchesStatus && matchesLevel && matchesCollege;
      }),
    [teams, search, statusFilter, levelFilter, collegeFilter]
  );

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, levelFilter, collegeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTeams.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedTeams = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredTeams.slice(start, start + PAGE_SIZE);
  }, [filteredTeams, safePage]);

  const selectedTeam =
    teams.find((team) => team.id === selectedId) ||
    filteredTeams[0] ||
    teams[0] ||
    null;

  const selectedTeamMembers = useMemo(() => {
    if (!selectedTeam) return [];
    if (Array.isArray(selectedTeam.memberList) && selectedTeam.memberList.length > 0) {
      return selectedTeam.memberList.slice(0, selectedTeam.members);
    }
    return defaultMembers.slice(0, selectedTeam.members);
  }, [selectedTeam]);

  const stats = [
    {
      label: "Total Teams",
      value: teams.length,
      icon: "♧",
      tone: "lime",
      trend: dataSource === "demo" ? "+12%" : "Live",
    },
    {
      label: "Total Participants",
      value: teams.reduce((sum, team) => sum + (Number(team.members) || 0), 0),
      icon: "♙",
      tone: "lime",
      trend: dataSource === "demo" ? "+8%" : "Live",
    },
    {
      label: "Active Teams",
      value: teams.filter((team) => team.status === "Active").length,
      icon: "ϟ",
      tone: "lime",
      trend: dataSource === "demo" ? "+20%" : "",
    },
    {
      label: "Pending Verification",
      value: teams.filter((team) => team.status === "Pending").length,
      icon: "◷",
      tone: "amber",
      trend: "",
    },
    {
      label: "Disqualified",
      value: teams.filter((team) => team.status === "Disqualified").length,
      icon: "⊗",
      tone: "red",
      trend: "",
    },
  ];

  const exportCsv = () => {
    const headers = [
      "Team",
      "College",
      "Members",
      "Status",
      "Level",
      "Score",
      "Leader",
      "Email",
      "Data Source",
    ];
    const rows = filteredTeams.map((team) => [
      team.name,
      team.college,
      team.members,
      team.status,
      team.level,
      team.score,
      team.leader,
      team.email,
      dataSource === "live" ? "Live Database" : "Demo Preview",
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hack-the-grid-teams.csv";
    link.click();
    URL.revokeObjectURL(url);
    setNotice(
      `Exported ${filteredTeams.length} filtered team(s) (${
        dataSource === "live" ? "live database records" : "demo preview records"
      }) as CSV.`
    );
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All Status");
    setLevelFilter("All Levels");
    setCollegeFilter("All Colleges");
    setCurrentPage(1);
  };

  const updateSelectedStatus = async (nextStatus) => {
    if (!selectedTeam || actionBusy) return;

    // Live database team: call PATCH /api/v1/admin/teams/:teamId/disqualify
    if (dataSource === "live" && !selectedTeam.isDemo) {
      const shouldDisqualify = nextStatus === "Disqualified";
      setActionBusy(true);
      setApiError("");
      try {
        const res = await adminService.updateTeamDisqualification(selectedTeam.id, {
          isDisqualified: shouldDisqualify,
          reason: shouldDisqualify
            ? "Administrative action from Teams Management console"
            : null,
        });
        const updatedDoc = res?.data?.team;
        setTeams((current) =>
          current.map((team) => {
            if (team.id !== selectedTeam.id) return team;
            if (updatedDoc) {
              return mapApiTeamToUi(updatedDoc, (team.emblemIndex || 1) - 1);
            }
            return { ...team, status: shouldDisqualify ? "Disqualified" : "Active" };
          })
        );
        setNotice(
          res?.message ||
            `${selectedTeam.name} marked as ${shouldDisqualify ? "Disqualified" : "Active"} on the server.`
        );
      } catch (err) {
        const errMsg =
          err.response?.data?.message ||
          "Failed to update team status on server. Ensure you are authenticated as an ADMIN.";
        setApiError(errMsg);
      } finally {
        setActionBusy(false);
      }
      return;
    }

    // Demo UI fallback
    setTeams((current) =>
      current.map((team) =>
        team.id === selectedTeam.id ? { ...team, status: nextStatus } : team
      )
    );
    setNotice(
      `${selectedTeam.name} marked as ${nextStatus}. Demo UI only — connect this action to the backend.`
    );
  };

  const adminDisplayName = user?.fullName || user?.username || "Admin";
  const adminAvatar = (adminDisplayName || "A").slice(0, 1).toUpperCase();
  const startRange = filteredTeams.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endRange = Math.min(safePage * PAGE_SIZE, filteredTeams.length);

  return (
    <div className="htg-team-page">
      <AdminSidebar
        teamsCount={dataSource === "live" ? teams.length : "32"}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <main className="htg-team-main">
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
              placeholder="Search teams by name, member, college..."
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

        <section className="htg-page-hero">
          <div className="htg-breadcrumb">
            Admin <span>›</span> Teams
            <em className={`htg-data-pill ${dataSource === "live" ? "live" : "demo"}`}>
              {loading
                ? "SYNCING API..."
                : dataSource === "live"
                ? "● LIVE DATABASE"
                : "● DEMO PREVIEW DATA"}
            </em>
          </div>
          <div className="htg-heading-row">
            <div>
              <h1>
                Teams <em>Management</em>
              </h1>
              <p>
                View, manage and monitor all registered teams for Hack the Grid.
              </p>
            </div>
            <div className="htg-hero-actions">
              <button
                type="button"
                className="htg-outline-button htg-sync-button"
                onClick={() => fetchLiveTeams(true)}
                disabled={loading}
              >
                {loading ? "Syncing..." : "↻ Sync API"}
              </button>
              <button
                type="button"
                className="htg-primary-button"
                onClick={() =>
                  setNotice(
                    "Add Team form is a UI placeholder. Admin team creation endpoint (POST /api/v1/admin/teams) is not yet implemented on the backend; teams currently self-register via /api/v1/teams/create."
                  )
                }
              >
                ＋ Add Team
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

        <section className="htg-stats-grid">
          {stats.map((stat) => (
            <article className={`htg-stat-card ${stat.tone}`} key={stat.label}>
              <div className="htg-stat-icon">{stat.icon}</div>
              <div className="htg-stat-copy">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
              {stat.trend && <small className="htg-trend">↗ {stat.trend}</small>}
              <div className="htg-stat-meter">
                <i
                  style={{
                    width: `${Math.min(
                      100,
                      (stat.value / Math.max(teams.length, 1)) * 100
                    )}%`,
                  }}
                />
              </div>
            </article>
          ))}
        </section>

        <section className="htg-filter-toolbar">
          <label className="htg-search-field">
            <span>⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search teams, members, email..."
            />
          </label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Disqualified</option>
          </select>
          <select
            value={levelFilter}
            onChange={(event) => setLevelFilter(event.target.value)}
            aria-label="Filter by level"
          >
            <option>All Levels</option>
            {Array.from({ length: 10 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                Level {index + 1}
              </option>
            ))}
          </select>
          <select
            value={collegeFilter}
            onChange={(event) => setCollegeFilter(event.target.value)}
            aria-label="Filter by college"
          >
            <option>All Colleges</option>
            {[...new Set(teams.map((team) => team.college))].map((college) => (
              <option key={college}>{college}</option>
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
              className={view === "grid" ? "selected" : ""}
              onClick={() => setView("grid")}
              aria-label="Grid view"
            >
              ▦
            </button>
            <button
              type="button"
              className={view === "table" ? "selected" : ""}
              onClick={() => setView("table")}
              aria-label="Table view"
            >
              ☷
            </button>
          </div>
        </section>

        <section
          className={`htg-content-grid ${view === "grid" ? "grid-mode" : ""}`}
        >
          <div className="htg-team-list-panel">
            {view === "table" ? (
              <div className="htg-table-wrap">
                <table className="htg-teams-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Team Name</th>
                      <th>Members</th>
                      <th>College</th>
                      <th>Status</th>
                      <th>Progress</th>
                      <th>Score</th>
                      <th>Registered At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTeams.map((team, index) => {
                      const rowNum = (safePage - 1) * PAGE_SIZE + index + 1;
                      const emblemMod =
                        (team.emblemIndex || Number(team.id) || index + 1) % 5;
                      return (
                        <tr
                          key={team.id}
                          className={
                            selectedTeam?.id === team.id ? "selected-row" : ""
                          }
                          onClick={() => setSelectedId(team.id)}
                        >
                          <td>{rowNum}</td>
                          <td>
                            <div className="htg-team-name-cell">
                              <span
                                className={`htg-team-emblem emblem-${emblemMod}`}
                              >
                                {team.name.slice(0, 1)}
                              </span>
                              <strong>{team.name}</strong>
                            </div>
                          </td>
                          <td>♙ {team.members}</td>
                          <td>{team.college}</td>
                          <td>
                            <span
                              className={`htg-status-badge ${statusClass(
                                team.status
                              )}`}
                            >
                              {team.status}
                            </span>
                          </td>
                          <td>
                            <div className="htg-progress-cell">
                              <span>{team.level}/10</span>
                              <div>
                                <i style={{ width: `${team.level * 10}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="htg-score">{team.score}</td>
                          <td>{team.registered}</td>
                          <td>
                            <button
                              type="button"
                              className="htg-row-action"
                              title="View team"
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedId(team.id);
                              }}
                            >
                              ◉
                            </button>
                            <button
                              type="button"
                              className="htg-row-action"
                              title="More actions"
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedId(team.id);
                                setNotice(
                                  `Selected ${team.name}. Use the right-hand details panel to inspect members or manage status.`
                                );
                              }}
                            >
                              ···
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredTeams.length === 0 && (
                      <tr>
                        <td colSpan="9" className="htg-empty-state">
                          {loading
                            ? "Loading team records..."
                            : "No teams match these filters."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="htg-team-cards">
                {paginatedTeams.map((team, index) => {
                  const emblemMod =
                    (team.emblemIndex || Number(team.id) || index + 1) % 5;
                  return (
                    <button
                      type="button"
                      key={team.id}
                      className={`htg-team-card ${
                        selectedTeam?.id === team.id ? "chosen" : ""
                      }`}
                      onClick={() => setSelectedId(team.id)}
                    >
                      <span className={`htg-team-emblem emblem-${emblemMod}`}>
                        {team.name.slice(0, 1)}
                      </span>
                      <strong>{team.name}</strong>
                      <span>{team.college}</span>
                      <span
                        className={`htg-status-badge ${statusClass(
                          team.status
                        )}`}
                      >
                        {team.status}
                      </span>
                      <div className="htg-card-meta">
                        <span>{team.members} members</span>
                        <b>{team.score} pts</b>
                      </div>
                      <div className="htg-progress-cell">
                        <span>Level {team.level}/10</span>
                        <div>
                          <i style={{ width: `${team.level * 10}%` }} />
                        </div>
                      </div>
                    </button>
                  );
                })}
                {filteredTeams.length === 0 && (
                  <p className="htg-empty-state">No teams match these filters.</p>
                )}
              </div>
            )}

            <footer className="htg-table-footer">
              <span>
                Showing {startRange}–{endRange} of {filteredTeams.length} teams
              </span>
              <div className="htg-pagination">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  aria-label="Previous page"
                >
                  ‹
                </button>
                {[1, 2, 3, 4].map((pageNum) => (
                  <button
                    type="button"
                    key={pageNum}
                    className={safePage === pageNum ? "current" : ""}
                    disabled={pageNum > totalPages}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  aria-label="Next page"
                >
                  ›
                </button>
              </div>
            </footer>
          </div>

          {selectedTeam && (
            <aside className="htg-team-detail">
              <div className="htg-detail-head">
                <span
                  className={`htg-team-emblem large emblem-${
                    (selectedTeam.emblemIndex || Number(selectedTeam.id) || 1) % 5
                  }`}
                >
                  {selectedTeam.name.slice(0, 1)}
                </span>
                <div>
                  <h2>{selectedTeam.name}</h2>
                  <p>{selectedTeam.college}</p>
                </div>
                <span
                  className={`htg-status-badge ${statusClass(
                    selectedTeam.status
                  )}`}
                >
                  {selectedTeam.status}
                </span>
              </div>

              <div className="htg-detail-tabs">
                <button
                  type="button"
                  className={activeTab === "Overview" ? "active" : ""}
                  onClick={() => setActiveTab("Overview")}
                >
                  Overview
                </button>
                <button
                  type="button"
                  className={activeTab === "Members" ? "active" : ""}
                  onClick={() => {
                    setActiveTab("Members");
                    setNotice(
                      dataSource === "live"
                        ? `Showing ${selectedTeamMembers.length} member(s) for ${selectedTeam.name}.`
                        : "Members tab selected — displaying demo member roster."
                    );
                  }}
                >
                  Members
                </button>
                <button
                  type="button"
                  className={activeTab === "Progress" ? "active" : ""}
                  onClick={() => {
                    setActiveTab("Progress");
                    setNotice(
                      "Progress tab selected — per-team level timestamp history endpoint (/api/v1/admin/teams/:id/progress) is pending backend implementation."
                    );
                  }}
                >
                  Progress
                </button>
                <button
                  type="button"
                  className={activeTab === "Submissions" ? "active" : ""}
                  onClick={() => {
                    setActiveTab("Submissions");
                    setNotice(
                      "Submissions tab selected — view full submission audit trail at /admin/submissions."
                    );
                  }}
                >
                  Submissions
                </button>
              </div>

              <section className="htg-detail-section">
                <div className="htg-section-title">
                  <h3>Team Details</h3>
                  <button
                    type="button"
                    onClick={() =>
                      setNotice(
                        "Edit Team form is a UI placeholder. Admin team update endpoint (PATCH /api/v1/admin/teams/:teamId) is not yet implemented on the backend."
                      )
                    }
                  >
                    Edit
                  </button>
                </div>
                <dl>
                  <div>
                    <dt>Team Name</dt>
                    <dd>{selectedTeam.name}</dd>
                  </div>
                  {selectedTeam.joinCode && (
                    <div>
                      <dt>Join Code</dt>
                      <dd className="htg-score">{selectedTeam.joinCode}</dd>
                    </div>
                  )}
                  <div>
                    <dt>College</dt>
                    <dd>{selectedTeam.college}, Dehradun</dd>
                  </div>
                  <div>
                    <dt>Registered At</dt>
                    <dd>{selectedTeam.registered}, 2026</dd>
                  </div>
                  <div>
                    <dt>Team Email</dt>
                    <dd>{selectedTeam.email}</dd>
                  </div>
                  <div>
                    <dt>Team Leader</dt>
                    <dd>{selectedTeam.leader}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>
                      <span
                        className={`htg-status-badge ${statusClass(
                          selectedTeam.status
                        )}`}
                      >
                        {selectedTeam.status}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt>Current Level</dt>
                    <dd>{selectedTeam.level} / 10</dd>
                  </div>
                  <div>
                    <dt>Total Score</dt>
                    <dd className="htg-score">{selectedTeam.score}</dd>
                  </div>
                </dl>
              </section>

              <section className="htg-detail-section members-section">
                <div className="htg-section-title">
                  <h3>Team Members ({selectedTeam.members})</h3>
                  <button
                    type="button"
                    onClick={() =>
                      setNotice(
                        "Add Member form is a UI placeholder. Admin member assignment endpoint (POST /api/v1/admin/teams/:teamId/members) is not yet implemented; operatives join via join code (/api/v1/teams/join)."
                      )
                    }
                  >
                    ＋ Add
                  </button>
                </div>
                {selectedTeamMembers.map((member, index) => (
                  <div
                    className="htg-member-row"
                    key={member.id || `${member.name}-${index}`}
                  >
                    <span
                      className={`htg-member-avatar avatar-${index % 4}`}
                    >
                      {member.initials}
                    </span>
                    <span className="htg-member-name">
                      <strong>{member.name}</strong>
                      <small>{member.role}</small>
                    </span>
                    <span className="htg-verified">
                      {member.verified !== false ? "Verified" : "Pending"}
                    </span>
                  </div>
                ))}
              </section>

              <section className="htg-detail-actions">
                <button
                  type="button"
                  className="htg-outline-button"
                  onClick={() =>
                    setNotice(
                      `Viewing full details for ${selectedTeam.name} (${
                        dataSource === "live" ? "Live record" : "Demo preview"
                      }).`
                    )
                  }
                >
                  View Full Profile
                </button>
                <button
                  type="button"
                  className="htg-danger-button"
                  disabled={actionBusy}
                  onClick={() =>
                    updateSelectedStatus(
                      selectedTeam.status === "Disqualified"
                        ? dataSource === "live"
                          ? "Active"
                          : "Pending"
                        : "Disqualified"
                    )
                  }
                >
                  {actionBusy
                    ? "Updating..."
                    : selectedTeam.status === "Disqualified"
                    ? "Restore Team"
                    : "Disqualify"}
                </button>
              </section>
            </aside>
          )}
        </section>

        <footer className="htg-page-footer">
          Build with <span>♥</span> by Hrithik Roshan{" "}
          <small>HACK THE GRID · ADMIN CONSOLE</small>
        </footer>
      </main>
    </div>
  );
};

export default TeamManagementPage;
