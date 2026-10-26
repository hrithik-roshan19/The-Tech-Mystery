import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/navigation/AdminSidebar";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { adminService } from "../../services/admin.service";
import "../../styles/TeamManagementPage.css";

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

  const memberCount = mappedMembers.length || 0;
  const rawStatus = typeof team.status === "string" ? team.status.trim() : "";
  const isDisqualified = Boolean(
    team.isDisqualified ||
    rawStatus.toLowerCase() === "disqualified"
  );

  let canonicalStatus = "Pending";
  if (isDisqualified) {
    canonicalStatus = "Disqualified";
  } else if (rawStatus.toLowerCase() === "active") {
    canonicalStatus = "Active";
  } else if (rawStatus.toLowerCase() === "pending") {
    canonicalStatus = "Pending";
  } else {
    // If no explicit status exists, unapproved squads remain Pending
    canonicalStatus = "Pending";
  }

  return {
    id: team._id || index + 1,
    emblemIndex: index + 1,
    joinCode: team.joinCode || "",
    name: team.name || `Team ${index + 1}`,
    college: team.college || "Tula's University",
    members: memberCount,
    status: canonicalStatus,
    isDisqualified,
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

  const [teams, setTeams] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
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
  const [dataSource, setDataSource] = useState("live");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Admin Modal States
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [modalBusy, setModalBusy] = useState(false);

  const [teamDraft, setTeamDraft] = useState({
    name: "",
    college: "Tula's University",
    leader: "",
    members: "",
    currentLevel: 1,
    totalScore: 0,
  });

  const [memberDraft, setMemberDraft] = useState({ identifier: "" });

  const [editDraft, setEditDraft] = useState({
    name: "",
    college: "Tula's University",
    currentLevel: 1,
    totalScore: 0,
  });

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
          setSelectedId((prev) => (prev && mapped.some((t) => t.id === prev) ? prev : mapped[0].id));
        } else {
          setSelectedId(null);
        }
        if (showSuccessNotice) {
          setNotice(`Synchronized ${mapped.length} team record(s) from the live Admin API.`);
        }
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      setDataSource("live");
      setTeams([]);
      setSelectedId(null);
      setApiError(serverMsg || "Failed to load team records from the live database.");
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
    return [];
  }, [selectedTeam]);

  const stats = [
    {
      label: "Total Teams",
      value: teams.length,
      icon: "♧",
      tone: "lime",
      trend: "Live",
    },
    {
      label: "Total Participants",
      value: teams.reduce((sum, team) => sum + (Number(team.members) || 0), 0),
      icon: "♙",
      tone: "lime",
      trend: "Live",
    },
    {
      label: "Active Teams",
      value: teams.filter((team) => team.status === "Active").length,
      icon: "ϟ",
      tone: "lime",
      trend: "",
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
      "Live Database",
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
    link.download = "the-tech-mystery-teams.csv";
    link.click();
    URL.revokeObjectURL(url);
    setNotice(
      `Exported ${filteredTeams.length} filtered team(s) (${
        "live database records"
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
    if (selectedTeam?._mongoId || selectedTeam?.id) {
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

  const handleApproveTeam = async (team) => {
    if (!team || actionBusy) return;
    if (team.members < 2) {
      setApiError(
        `Team "${team.name}" cannot be approved: Event rules require a minimum of 2 verified members (currently ${team.members}). Add another member before approving.`
      );
      return;
    }
    const confirmed = window.confirm(
      `Approve team "${team.name}" for live gameplay? This will activate the squad and unlock QR checkpoint scanning.`
    );
    if (!confirmed) return;
    setActionBusy(true);
    setApiError("");
    try {
      if (team.id) {
        const res = await adminService.approveTeam(team.id);
        const updatedDoc = res?.data?.team;
        if (updatedDoc) {
          const mapped = mapApiTeamToUi(updatedDoc, (team.emblemIndex || 1) - 1);
          setTeams((prev) => prev.map((t) => (t.id === team.id ? mapped : t)));
        } else {
          setTeams((prev) =>
            prev.map((t) => (t.id === team.id ? { ...t, status: "Active" } : t))
          );
        }
        setNotice(res?.message || `Team "${team.name}" approved and activated!`);
      }
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || "Failed to approve team.");
    } finally {
      setActionBusy(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamDraft.name.trim() || !teamDraft.leader.trim()) {
      setApiError("Team name and Team Leader (email or username) are required.");
      return;
    }
    setModalBusy(true);
    setApiError("");
    try {
      if (dataSource === "live") {
        const payload = {
          name: teamDraft.name.trim(),
          college: teamDraft.college.trim() || "Tula's University",
          leaderEmailOrUsername: teamDraft.leader.trim(),
          memberIdentifiers: teamDraft.members
            ? teamDraft.members.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
          currentLevel: Number(teamDraft.currentLevel) || 1,
          totalScore: Number(teamDraft.totalScore) || 0,
        };
        const res = await adminService.createTeam(payload);
        const newTeamDoc = res?.data?.team;
        if (newTeamDoc) {
          const mapped = mapApiTeamToUi(newTeamDoc, teams.length);
          setTeams((prev) => [mapped, ...prev]);
          setSelectedId(mapped.id);
        }
        setNotice(res?.message || `Team "${teamDraft.name}" created on live database.`);
      } else {
        const newId = Date.now();
        const demoTeam = {
          id: newId,
          emblemIndex: (teams.length % 4) + 1,
          joinCode: "HTG-DEMO" + Math.floor(Math.random() * 900 + 100),
          name: teamDraft.name.trim(),
          college: teamDraft.college.trim() || "Tula's University",
          members: 1,
          status: "Pending",
          level: Number(teamDraft.currentLevel) || 1,
          score: Number(teamDraft.totalScore) || 0,
          registered: "Just now",
          email: teamDraft.leader.trim(),
          leader: teamDraft.leader.trim(),
          disqualificationReason: null,
          isDemo: false,
          memberList: [
            { id: newId + "_m1", name: teamDraft.leader.trim(), role: "Team Leader", initials: teamDraft.leader.trim().slice(0, 1).toUpperCase(), verified: true },
          ],
        };
        setTeams((prev) => [demoTeam, ...prev]);
        setSelectedId(demoTeam.id);
        setNotice(`Team "${teamDraft.name}" created in demo state.`);
      }
      setShowAddTeamModal(false);
      setTeamDraft({
        name: "",
        college: "Tula's University",
        leader: "",
        members: "",
        currentLevel: 1,
        totalScore: 0,
      });
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || "Failed to create team.");
    } finally {
      setModalBusy(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberDraft.identifier.trim()) {
      setApiError("Member email or username is required.");
      return;
    }
    setModalBusy(true);
    setApiError("");
    try {
      if (selectedTeam) {
        const res = await adminService.addTeamMember(selectedTeam.id, {
          userIdentifier: memberDraft.identifier.trim(),
        });
        const updatedDoc = res?.data?.team;
        if (updatedDoc) {
          const mapped = mapApiTeamToUi(updatedDoc, (selectedTeam.emblemIndex || 1) - 1);
          setTeams((prev) => prev.map((t) => (t.id === selectedTeam.id ? mapped : t)));
        }
        setNotice(res?.message || `Member "${memberDraft.identifier}" added to ${selectedTeam.name}.`);
      } else {
        const identifier = memberDraft.identifier.trim();
        const newMember = {
          id: Date.now(),
          name: identifier,
          role: "Member",
          initials: identifier.slice(0, 1).toUpperCase(),
          verified: true,
        };
        setTeams((prev) =>
          prev.map((t) => {
            if (t.id !== selectedTeam.id) return t;
            const updatedMembers = [...(t.memberList || []), newMember];
            return {
              ...t,
              members: updatedMembers.length,
              status: updatedMembers.length >= 2 && t.status === "Pending" ? "Active" : t.status,
              memberList: updatedMembers,
            };
          })
        );
        setNotice(`Member "${identifier}" added to ${selectedTeam.name} (Demo).`);
      }
      setShowAddMemberModal(false);
      setMemberDraft({ identifier: "" });
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || "Failed to add team member.");
    } finally {
      setModalBusy(false);
    }
  };

  const handleRemoveMember = async (member) => {
    if (!selectedTeam) return;
    if (member.role === "Team Leader") {
      setApiError("Cannot remove the team leader. Transfer leadership or delete the team.");
      return;
    }
    setActionBusy(true);
    setApiError("");
    try {
      if (selectedTeam?._mongoId || selectedTeam?.id) {
        const res = await adminService.removeTeamMember(selectedTeam.id, member.id);
        const updatedDoc = res?.data?.team;
        if (updatedDoc) {
          const mapped = mapApiTeamToUi(updatedDoc, (selectedTeam.emblemIndex || 1) - 1);
          setTeams((prev) => prev.map((t) => (t.id === selectedTeam.id ? mapped : t)));
        }
        setNotice(res?.message || `Removed ${member.name} from ${selectedTeam.name}.`);
      } else {
        setTeams((prev) =>
          prev.map((t) => {
            if (t.id !== selectedTeam.id) return t;
            const filtered = (t.memberList || []).filter((m) => m.id !== member.id);
            return {
              ...t,
              members: filtered.length,
              status: filtered.length < 2 && t.status === "Active" ? "Pending" : t.status,
              memberList: filtered,
            };
          })
        );
        setNotice(`Removed ${member.name} from ${selectedTeam.name} (Demo).`);
      }
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || "Failed to remove member.");
    } finally {
      setActionBusy(false);
    }
  };

  const openEditTeamModal = (team) => {
    if (!team) return;
    setEditDraft({
      name: team.name || "",
      college: team.college || "Tula's University",
      currentLevel: team.level || 1,
      totalScore: team.score || 0,
    });
    setShowEditTeamModal(true);
  };

  const handleSaveEditTeam = async (e) => {
    e.preventDefault();
    if (!editDraft.name.trim()) {
      setApiError("Team name cannot be empty.");
      return;
    }
    setModalBusy(true);
    setApiError("");
    try {
      if (selectedTeam) {
        const res = await adminService.updateTeam(selectedTeam.id, editDraft);
        const updatedDoc = res?.data?.team;
        if (updatedDoc) {
          const mapped = mapApiTeamToUi(updatedDoc, (selectedTeam.emblemIndex || 1) - 1);
          setTeams((prev) => prev.map((t) => (t.id === selectedTeam.id ? mapped : t)));
        }
        setNotice(res?.message || `Team "${editDraft.name}" updated successfully.`);
      } else {
        setTeams((prev) =>
          prev.map((t) =>
            t.id === selectedTeam.id
              ? {
                  ...t,
                  name: editDraft.name.trim(),
                  college: editDraft.college.trim(),
                  level: Number(editDraft.currentLevel) || 1,
                  score: Number(editDraft.totalScore) || 0,
                }
              : t
          )
        );
        setNotice(`Team "${editDraft.name}" updated (Demo).`);
      }
      setShowEditTeamModal(false);
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || "Failed to update team.");
    } finally {
      setModalBusy(false);
    }
  };

  const handleDeleteTeam = async (team) => {
    if (!team) return;
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete team "${team.name}"? This removes all squad progression and resets members.`
    );
    if (!confirmed) return;
    setActionBusy(true);
    setApiError("");
    try {
      if (team) {
        await adminService.deleteTeam(team.id);
        setNotice(`Team "${team.name}" deleted from database.`);
        setTeams((prev) => {
          const filtered = prev.filter((t) => t.id !== team.id);
          if (filtered.length > 0) setSelectedId(filtered[0].id);
          return filtered;
        });
      } else {
        setTeams((prev) => {
          const filtered = prev.filter((t) => t.id !== team.id);
          if (filtered.length > 0) setSelectedId(filtered[0].id);
          return filtered;
        });
        setNotice(`Team "${team.name}" removed (Demo).`);
      }
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || "Failed to delete team.");
    } finally {
      setActionBusy(false);
    }
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
            <em className="htg-data-pill live">{loading ? "SYNCING API..." : "● LIVE DATABASE"}</em>
          </div>
          <div className="htg-heading-row">
            <div>
              <h1>
                Teams <em>Management</em>
              </h1>
              <p>
                View, manage and monitor all registered teams for The Tech Mystery.
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
                onClick={() => setShowAddTeamModal(true)}
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
                            : teams.length === 0 ? "No teams have registered yet." : "No teams match these filters."}
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

          {selectedTeam ? (
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
                    onClick={() => setShowAddMemberModal(true)}
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
                      <small>{member.role}{member.email ? ` · ${member.email}` : ""}</small>
                    </span>
                    <span className="htg-verified">
                      {member.verified !== false ? "Verified" : "Pending"}
                    </span>
                    {member.role !== "Team Leader" && (
                      <button
                        type="button"
                        className="htg-remove-member-btn"
                        title={`Remove ${member.name}`}
                        disabled={actionBusy}
                        onClick={() => handleRemoveMember(member)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </section>

              <section className="htg-detail-actions" style={{ flexWrap: "wrap", gap: "8px" }}>
                {selectedTeam.status === "Pending" && !selectedTeam.isDisqualified && (
                  selectedTeam.members >= 2 ? (
                    <button
                      type="button"
                      className="htg-primary-button"
                      style={{ background: "var(--htg-lime, #b8ff3d)", color: "#080b0a", fontWeight: "700" }}
                      disabled={actionBusy}
                      onClick={() => handleApproveTeam(selectedTeam)}
                    >
                      {actionBusy ? "Approving..." : "✓ Approve Team"}
                    </button>
                  ) : (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div
                        className="htg-eligibility-notice"
                        style={{
                          padding: "8px 10px",
                          background: "rgba(255, 187, 0, 0.12)",
                          border: "1px solid rgba(255, 187, 0, 0.35)",
                          borderRadius: "6px",
                          color: "#ffd066",
                          fontSize: "11px",
                          lineHeight: "1.4",
                        }}
                      >
                        ⚠ <strong>Approval requirement:</strong> Squad requires at least 2 members for gameplay approval (currently {selectedTeam.members} of 2). Add another operative to enable squad approval.
                      </div>
                      <button
                        type="button"
                        className="htg-primary-button"
                        style={{
                          background: "#242d26",
                          color: "#8a968c",
                          fontWeight: "700",
                          cursor: "not-allowed",
                          border: "1px solid #334436",
                        }}
                        disabled={true}
                        title="Squad requires at least 2 members for approval"
                      >
                        ✓ Approve Team (Requires 2+ Members)
                      </button>
                    </div>
                  )
                )}
                <button
                  type="button"
                  className="htg-outline-button"
                  onClick={() => openEditTeamModal(selectedTeam)}
                >
                  ✎ Edit Team
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
                <button
                  type="button"
                  className="htg-danger-button"
                  style={{ background: "#2e1212", borderColor: "#7a2b2b" }}
                  disabled={actionBusy}
                  onClick={() => handleDeleteTeam(selectedTeam)}
                >
                  🗑 Delete
                </button>
              </section>
            </aside>
          ) : (
            <aside className="htg-team-detail" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "3rem 1.5rem", color: "#8a968c" }}>
              <div style={{ fontSize: "36px", marginBottom: "16px" }}>👥</div>
              <h3 style={{ color: "#f5f5f0", marginBottom: "8px", fontSize: "16px" }}>No Team Selected</h3>
              <p style={{ fontSize: "13px", lineHeight: "1.5", margin: "0 0 16px", color: "#8a968c" }}>
                {teams.length === 0
                  ? "No teams have registered yet. Use the button below to register a team or wait for participants to complete registration."
                  : "Select a team from the list to inspect its roster, join code, and progress."}
              </p>
              {teams.length === 0 && (
                <button
                  type="button"
                  className="htg-primary-button"
                  onClick={() => setShowAddTeamModal(true)}
                >
                  + Register First Team
                </button>
              )}
            </aside>
          )}
        </section>

        <footer className="htg-page-footer">
          Build with <span>♥</span> by Hrithik Roshan{" "}
          <small>THE TECH MYSTERY · ADMIN CONSOLE</small>
        </footer>
      </main>

      {/* Add Team Modal */}
      {showAddTeamModal && (
        <div
          className="htg-modal-backdrop"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowAddTeamModal(false);
          }}
        >
          <form className="htg-team-modal" onSubmit={handleCreateTeam}>
            <div className="htg-modal-header">
              <div>
                <small>ADMIN SQUAD PROVISIONING</small>
                <h2>Register New Team</h2>
              </div>
              <button type="button" onClick={() => setShowAddTeamModal(false)}>×</button>
            </div>
            <label>
              Team Name *
              <input
                required
                value={teamDraft.name}
                onChange={(e) => setTeamDraft({ ...teamDraft, name: e.target.value })}
                placeholder="e.g. CyberVanguard"
              />
            </label>
            <div className="htg-modal-row">
              <label>
                College / Institution
                <input
                  value={teamDraft.college}
                  onChange={(e) => setTeamDraft({ ...teamDraft, college: e.target.value })}
                  placeholder="Tula's University"
                />
              </label>
              <label>
                Team Leader (Username/Email) *
                <input
                  required
                  value={teamDraft.leader}
                  onChange={(e) => setTeamDraft({ ...teamDraft, leader: e.target.value })}
                  placeholder="Leader username or email"
                />
              </label>
            </div>
            <label>
              Additional Members (comma separated emails or usernames)
              <input
                value={teamDraft.members}
                onChange={(e) => setTeamDraft({ ...teamDraft, members: e.target.value })}
                placeholder="member1@tulas.edu.in, member2"
              />
            </label>
            <div className="htg-modal-row">
              <label>
                Initial Level
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={teamDraft.currentLevel}
                  onChange={(e) => setTeamDraft({ ...teamDraft, currentLevel: e.target.value })}
                />
              </label>
              <label>
                Initial Score
                <input
                  type="number"
                  min="0"
                  value={teamDraft.totalScore}
                  onChange={(e) => setTeamDraft({ ...teamDraft, totalScore: e.target.value })}
                />
              </label>
            </div>
            <p className="htg-modal-note">
              Each team requires 2–4 verified members for full eligibility. Auto-generates cryptographic join code (HTG-XXXXXX).
            </p>
            <div className="htg-modal-actions">
              <button type="button" className="htg-outline-button" onClick={() => setShowAddTeamModal(false)}>
                Cancel
              </button>
              <button type="submit" className="htg-primary-button" disabled={modalBusy}>
                {modalBusy ? "Registering..." : "Provision Team"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div
          className="htg-modal-backdrop"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowAddMemberModal(false);
          }}
        >
          <form className="htg-team-modal" onSubmit={handleAddMember}>
            <div className="htg-modal-header">
              <div>
                <small>ROSTER ENROLLMENT</small>
                <h2>Add Team Member</h2>
              </div>
              <button type="button" onClick={() => setShowAddMemberModal(false)}>×</button>
            </div>
            <p style={{ margin: "0 0 16px", color: "var(--htg-muted)", fontSize: "12px" }}>
              Enrolling operative into <strong>{selectedTeam?.name}</strong> (Max 4 members).
            </p>
            <label>
              Operative Email or Username *
              <input
                required
                autoFocus
                value={memberDraft.identifier}
                onChange={(e) => setMemberDraft({ identifier: e.target.value })}
                placeholder="operative@tulas.edu.in or username"
              />
            </label>
            <div className="htg-modal-actions">
              <button type="button" className="htg-outline-button" onClick={() => setShowAddMemberModal(false)}>
                Cancel
              </button>
              <button type="submit" className="htg-primary-button" disabled={modalBusy}>
                {modalBusy ? "Enrolling..." : "Enroll Member"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Team Modal */}
      {showEditTeamModal && (
        <div
          className="htg-modal-backdrop"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowEditTeamModal(false);
          }}
        >
          <form className="htg-team-modal" onSubmit={handleSaveEditTeam}>
            <div className="htg-modal-header">
              <div>
                <small>SQUAD METADATA</small>
                <h2>Edit Team Details</h2>
              </div>
              <button type="button" onClick={() => setShowEditTeamModal(false)}>×</button>
            </div>
            <label>
              Team Name *
              <input
                required
                value={editDraft.name}
                onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
              />
            </label>
            <label>
              College / Institution
              <input
                value={editDraft.college}
                onChange={(e) => setEditDraft({ ...editDraft, college: e.target.value })}
              />
            </label>
            <div className="htg-modal-row">
              <label>
                Current Level
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={editDraft.currentLevel}
                  onChange={(e) => setEditDraft({ ...editDraft, currentLevel: e.target.value })}
                />
              </label>
              <label>
                Total Score
                <input
                  type="number"
                  min="0"
                  value={editDraft.totalScore}
                  onChange={(e) => setEditDraft({ ...editDraft, totalScore: e.target.value })}
                />
              </label>
            </div>
            <div className="htg-modal-actions">
              <button type="button" className="htg-outline-button" onClick={() => setShowEditTeamModal(false)}>
                Cancel
              </button>
              <button type="submit" className="htg-primary-button" disabled={modalBusy}>
                {modalBusy ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeamManagementPage;
