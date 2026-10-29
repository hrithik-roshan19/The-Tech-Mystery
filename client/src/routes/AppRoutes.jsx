import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
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
import { LoginPage, RegisterPage, AuthCompletePage } from '../pages/auth/ClerkPages';

// Participant Pages
import ParticipantDashboard from '../pages/participant/ParticipantDashboard';
import QRCheckpointPage from '../pages/participant/QRCheckpointPage';
import LeaderboardPage from '../pages/public/LeaderboardPage';
import UserProfilePage from '../pages/participant/UserProfilePage';
import FinalFlagPage from '../pages/participant/FinalFlagPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import TeamManagementPage from '../pages/admin/TeamManagementPage';
import ChallengeManagementPage from '../pages/admin/ChallengeManagementPage';
import QuestionManagementPage from '../pages/admin/QuestionManagementPage';
import QRCheckpointManagementPage from '../pages/admin/QRCheckpointManagementPage';
import SubmissionManagementPage from '../pages/admin/SubmissionManagementPage';
import LeaderboardManagementPage from '../pages/admin/LeaderboardManagementPage';
import EventControlPage from '../pages/admin/EventControlPage';
import SecurityLogsPage from '../pages/admin/SecurityLogsPage';
import AdminProfilePage from '../pages/admin/AdminProfilePage';

// Fallback
import NotFoundPage from '../pages/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Standalone Full-Bleed Public, Auth & Participant Pages */}
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.MISSION} element={<MissionPage />} />
      <Route path={ROUTES.CHALLENGES} element={<ChallengeLevelsPage />} />
      <Route path={ROUTES.QR_CHECKPOINT} element={<QRCheckpointPage />} />
      <Route path="/qr-checkpoint/:checkpointId" element={<QRCheckpointPage />} />
      <Route path="/checkpoint/scan" element={<QRCheckpointPage />} />
      <Route path="/checkpoint/:checkpointId" element={<QRCheckpointPage />} />
      <Route path={ROUTES.LEADERBOARD} element={<LeaderboardPage />} />
      <Route path={ROUTES.FINAL_FLAG} element={<FinalFlagPage />} />
      <Route path="/challenge" element={<Navigate to={ROUTES.QR_CHECKPOINT} replace />} />
      <Route path="/challenges/:levelNumber" element={<Navigate to={ROUTES.QR_CHECKPOINT} replace />} />
      <Route path={ROUTES.PORTAL_DASHBOARD} element={<ProtectedRoute><ParticipantDashboard /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><ParticipantDashboard /></ProtectedRoute>} />
      <Route path="/auth/complete" element={<AuthCompletePage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.ADMIN_LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.RULES} element={<RulesPage />} />
      <Route path={ROUTES.PROFILE} element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />

      {/* 2. Public Pages using Shared PublicLayout (Navbar + Content + Footer) */}
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.HOW_IT_WORKS} element={<Navigate to="/mission#how-it-works" replace />} />
        <Route path="/mission-map" element={<Navigate to={ROUTES.CHALLENGES} replace />} />
        <Route path="/master-flag" element={<Navigate to={ROUTES.FINAL_FLAG} replace />} />
        <Route path={ROUTES.SCHEDULE} element={<SchedulePage />} />
        <Route path={ROUTES.FAQ} element={<FAQPage />} />
        <Route path="/team" element={<Navigate to={ROUTES.PORTAL_DASHBOARD} replace />} />
        <Route path="/resources" element={<Navigate to={ROUTES.FAQ} replace />} />
      </Route>

      {/* 3. Participant Portal Direct & Legacy Aliases */}
      <Route path="/portal" element={<Navigate to={ROUTES.PORTAL_DASHBOARD} replace />} />
      <Route path="/portal/dashboard" element={<ProtectedRoute><ParticipantDashboard /></ProtectedRoute>} />
      <Route path="/portal/missions" element={<Navigate to={ROUTES.CHALLENGES} replace />} />
      <Route path="/portal/challenge" element={<Navigate to={ROUTES.QR_CHECKPOINT} replace />} />
      <Route path="/portal/challenges/:levelNumber" element={<Navigate to={ROUTES.QR_CHECKPOINT} replace />} />
      <Route path="/portal/checkpoint" element={<Navigate to={ROUTES.QR_CHECKPOINT} replace />} />
      <Route path="/portal/team" element={<Navigate to={ROUTES.PORTAL_DASHBOARD} replace />} />
      <Route path="/portal/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
      <Route path="/portal/master-flag" element={<Navigate to={ROUTES.FINAL_FLAG} replace />} />
      <Route path="/portal/final-flag" element={<Navigate to={ROUTES.FINAL_FLAG} replace />} />
      <Route path="/question" element={<Navigate to={ROUTES.QR_CHECKPOINT} replace />} />
      <Route path="/portal/question" element={<Navigate to={ROUTES.QR_CHECKPOINT} replace />} />
      <Route path="/questions" element={<Navigate to={ROUTES.CHALLENGES} replace />} />
      <Route path="/submission" element={<Navigate to={ROUTES.QR_CHECKPOINT} replace />} />
      <Route path="/portal/submission" element={<Navigate to={ROUTES.QR_CHECKPOINT} replace />} />
      <Route path="/challenges/current" element={<Navigate to={ROUTES.QR_CHECKPOINT} replace />} />
      <Route path="/portal/challenge/current" element={<Navigate to={ROUTES.QR_CHECKPOINT} replace />} />

      {/* 4. Admin Command SOC Protected Routes (AdminLayout strictly guarded by ADMIN role) */}
      <Route
        element={
          <ProtectedRoute requiredRole="ADMIN" requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
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
        <Route path={ROUTES.ADMIN_PROFILE} element={<AdminProfilePage />} />
      </Route>

      {/* 5. 404 Catch-All */}
      <Route path="*" element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
