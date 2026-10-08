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
import AboutPage from '../pages/public/AboutPage';
import HowItWorksPage from '../pages/public/HowItWorksPage';
import RulesPage from '../pages/public/RulesPage';
import SchedulePage from '../pages/public/SchedulePage';
import FAQPage from '../pages/public/FAQPage';

// Auth Pages
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Participant Pages
import TeamDashboardPage from '../pages/participant/TeamDashboardPage';
import MissionMapPage from '../pages/participant/MissionMapPage';
import ChallengeViewPage from '../pages/participant/ChallengeViewPage';
import CheckpointScannerPage from '../pages/participant/CheckpointScannerPage';
import LeaderboardPage from '../pages/participant/LeaderboardPage';
import TeamProfilePage from '../pages/participant/TeamProfilePage';
import MasterFlagPage from '../pages/participant/MasterFlagPage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import TeamManagementPage from '../pages/admin/TeamManagementPage';
import ChallengePoolPage from '../pages/admin/ChallengePoolPage';
import CheckpointManagerPage from '../pages/admin/CheckpointManagerPage';
import SubmissionLogsPage from '../pages/admin/SubmissionLogsPage';
import EventControlsPage from '../pages/admin/EventControlsPage';

// Fallback
import NotFoundPage from '../pages/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Standalone Full-Bleed Pages (Preserves custom hero navigation, overlays & glass panels) */}
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      {/* 2. Public Pages using Shared Layout */}
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.HOW_IT_WORKS} element={<HowItWorksPage />} />
        <Route path={ROUTES.RULES} element={<RulesPage />} />
        <Route path={ROUTES.SCHEDULE} element={<SchedulePage />} />
        <Route path={ROUTES.FAQ} element={<FAQPage />} />
        <Route path={ROUTES.LEADERBOARD} element={<LeaderboardPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      </Route>


      {/* 2. Participant Portal Protected Routes */}
      <Route
        path="/portal"
        element={
          <ProtectedRoute>
            <ParticipantLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path="dashboard" element={<TeamDashboardPage />} />
        <Route path="missions" element={<MissionMapPage />} />
        <Route path="challenge" element={<ChallengeViewPage />} />
        <Route path="checkpoint" element={<CheckpointScannerPage />} />
        <Route path="team" element={<TeamProfilePage />} />
        <Route path="master-flag" element={<MasterFlagPage />} />
      </Route>

      {/* 3. Admin Command SOC Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="teams" element={<TeamManagementPage />} />
        <Route path="challenges" element={<ChallengePoolPage />} />
        <Route path="checkpoints" element={<CheckpointManagerPage />} />
        <Route path="submissions" element={<SubmissionLogsPage />} />
        <Route path="controls" element={<EventControlsPage />} />
      </Route>

      {/* 4. 404 Catch-All */}
      <Route path="*" element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

