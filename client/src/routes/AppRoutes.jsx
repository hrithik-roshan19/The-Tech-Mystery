import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import ParticipantLayout from '../layouts/ParticipantLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public Pages
import HomePage from '../pages/public/HomePage';
import MissionPage from '../pages/public/MissionPage';
import ChallengeLevelsPage from '../pages/public/ChallengeLevelsPage';
import AboutPage from '../pages/public/AboutPage';
import HowItWorksPage from '../pages/public/HowItWorksPage';
import RulesPage from '../pages/public/RulesPage';
import SchedulePage from '../pages/public/SchedulePage';
import FAQPage from '../pages/public/FAQPage';

// Auth Pages
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';

// Participant Pages
import ParticipantDashboard from '../pages/participant/ParticipantDashboard';
import QRCheckpointPage from '../pages/participant/QRCheckpointPage';
import TeamDashboardPage from '../pages/participant/TeamDashboardPage';
import MissionMapPage from '../pages/participant/MissionMapPage';
import ChallengeViewPage from '../pages/participant/ChallengeViewPage';
import CheckpointScannerPage from '../pages/participant/CheckpointScannerPage';
import LeaderboardPage from '../pages/public/LeaderboardPage';
import TeamProfilePage from '../pages/participant/TeamProfilePage';
import FinalFlagPage from '../pages/participant/FinalFlagPage';
import MasterFlagPage from '../pages/participant/MasterFlagPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import TeamManagementPage from '../pages/admin/TeamManagementPage';
import ChallengeManagementPage from '../pages/admin/ChallengeManagementPage';
import QuestionManagementPage from '../pages/admin/QuestionManagementPage';
import QRCheckpointManagementPage from '../pages/admin/QRCheckpointManagementPage';
import SubmissionManagementPage from '../pages/admin/SubmissionManagementPage';
import LeaderboardManagementPage from '../pages/admin/LeaderboardManagementPage';
import ChallengePoolPage from '../pages/admin/ChallengePoolPage';
import CheckpointManagerPage from '../pages/admin/CheckpointManagerPage';
import SubmissionLogsPage from '../pages/admin/SubmissionLogsPage';
import EventControlsPage from '../pages/admin/EventControlsPage';
import EventControlPage from '../pages/admin/EventControlPage';
import SecurityLogsPage from '../pages/admin/SecurityLogsPage';

// Fallback

import NotFoundPage from '../pages/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Standalone Full-Bleed Pages (Preserves custom hero navigation, overlays & glass panels) */}
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.MISSION} element={<MissionPage />} />
      <Route path={ROUTES.CHALLENGES} element={<ChallengeLevelsPage />} />
      <Route path={ROUTES.QR_CHECKPOINT} element={<QRCheckpointPage />} />
      <Route path={ROUTES.LEADERBOARD} element={<LeaderboardPage />} />
      <Route path={ROUTES.FINAL_FLAG} element={<FinalFlagPage />} />
      <Route path={ROUTES.DASHBOARD} element={<ParticipantDashboard />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.ADMIN_LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
      <Route path={ROUTES.ADMIN_TEAMS} element={<TeamManagementPage />} />
      <Route path={ROUTES.ADMIN_CHALLENGES} element={<ChallengeManagementPage />} />
      <Route path={ROUTES.ADMIN_QUESTIONS} element={<QuestionManagementPage />} />
      <Route path={ROUTES.ADMIN_CHECKPOINTS} element={<QRCheckpointManagementPage />} />
      <Route path={ROUTES.ADMIN_SUBMISSIONS} element={<SubmissionManagementPage />} />
      <Route path={ROUTES.ADMIN_LEADERBOARD} element={<LeaderboardManagementPage />} />
      <Route path={ROUTES.ADMIN_EVENT_CONTROL} element={<EventControlPage />} />
      <Route path={ROUTES.ADMIN_CONTROLS} element={<Navigate to={ROUTES.ADMIN_EVENT_CONTROL} replace />} />
      <Route path={ROUTES.ADMIN_SECURITY_LOGS} element={<SecurityLogsPage />} />
      <Route path="/admin/logs" element={<Navigate to={ROUTES.ADMIN_SECURITY_LOGS} replace />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.RULES} element={<RulesPage />} />

      {/* 2. Public Pages using Shared Layout */}
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.HOW_IT_WORKS} element={<Navigate to="/mission#how-it-works" replace />} />
        <Route path="/mission-map" element={<Navigate to={ROUTES.MISSION_MAP} replace />} />
        <Route path="/master-flag" element={<Navigate to={ROUTES.FINAL_FLAG} replace />} />
        <Route path={ROUTES.SCHEDULE} element={<SchedulePage />} />
        <Route path={ROUTES.FAQ} element={<FAQPage />} />
        <Route path="/team" element={<Navigate to={ROUTES.TEAM_PROFILE} replace />} />
        <Route path="/profile" element={<Navigate to={ROUTES.TEAM_PROFILE} replace />} />
        <Route path="/resources" element={<Navigate to={ROUTES.FAQ} replace />} />
      </Route>


      {/* 3. Participant Portal Protected Routes */}
      <Route
        path="/portal"
        element={
          <ProtectedRoute>
            <ParticipantLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={ROUTES.PORTAL_DASHBOARD} replace />} />
        <Route path="dashboard" element={<TeamDashboardPage />} />
        <Route path="missions" element={<MissionMapPage />} />
        <Route path="challenge" element={<ChallengeViewPage />} />
        <Route path="checkpoint" element={<CheckpointScannerPage />} />
        <Route path="team" element={<TeamProfilePage />} />
        <Route path="master-flag" element={<Navigate to={ROUTES.FINAL_FLAG} replace />} />
        <Route path="final-flag" element={<Navigate to={ROUTES.FINAL_FLAG} replace />} />
      </Route>

      {/* 4. Admin Command SOC Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="questions" element={<ChallengePoolPage />} />
        <Route path="checkpoints" element={<CheckpointManagerPage />} />
        <Route path="submissions" element={<SubmissionLogsPage />} />
        <Route path="security-logs" element={<SecurityLogsPage />} />
        <Route path="logs" element={<Navigate to={ROUTES.ADMIN_SECURITY_LOGS} replace />} />
        <Route path="controls" element={<EventControlPage />} />
        <Route path="event-control" element={<EventControlPage />} />
        <Route path="leaderboard" element={<LeaderboardManagementPage />} />
      </Route>

      {/* 5. 404 Catch-All */}
      <Route path="*" element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

