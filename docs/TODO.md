# ACTIONABLE IMPLEMENTATION BACKLOG (TODO): THE TECH MYSTERY

## Clerk authentication preparation ? 19 October 2026

Clerk integration is implemented as an explicit opt-in provider; existing JWT mode remains the
default and its implementation is retained. No live connection, data migration, deployment,
account linking or registration opening occurred. MongoDB still owns roles, membership and
active status. Linking requires verified matching email plus existing password; ADMIN recovery
requires organizer approval. New Clerk participants remain unteamed and registration-gated.
See [implementation, exact files, setup, verification and rollback](CLERK_AUTHENTICATION.md).
Real Clerk credentials, browser acceptance, index setup, transaction-capable deployment and cutover
remain approval-gated. Earlier phase status statements below describe those phases historically.


## Event-data preparation - 19 October 2026

- [x] Save read-only historical evidence with original IDs and no private fields.
- [x] Record the confirmed running/public leaderboard difference and verification limits.
- [x] Prepare authenticated, isolated replica-set staging templates and target guards.
- [x] Validate Compose configuration without creating services or data.
- [x] Test complete admin roster creation/rollback and registration privilege isolation.
- [x] Run combined server suite (51/51) and 10 preparation safeguards in the final run.
- [x] Propose smallest safe approved-roster wizard changes and shared Public QR policy.
- [ ] Organizer approval: staging provisioning/initialization and production target.
- [ ] Organizer approval: historical records retained/archived/reconciled and backup plan.
- [ ] Organizer approval: dates, content/assets, roster/enrollment and QR issuance policies.
- [ ] Implement approved account/pending-team wizard and server-side enrollment mode.
- [ ] Perform approved staging runtime/transaction/browser/load acceptance checks.
- [ ] Approve exact migration/rotation/deployment manifests separately.
- [ ] Approve real data ingestion and registration opening only after acceptance.

No unchecked operation above was executed by preparation.


## Security remediation ? latest status (19 October 2026)

- [x] Recheck findings against current implementation before editing.
- [x] Withhold answer-bearing content and omit private fields from participant DTOs.
- [x] Protect invitations; add leader/admin rotation with 128-bit replacement codes.
- [x] Require expiring, scoped signed QR payloads; reject missing/legacy/tampered tokens.
- [x] Make enrollment, attempts, solves, score corrections and reversals transactional.
- [x] Block duplicate approvals and deletion of records with gameplay history.
- [x] Enforce LIVE, registration controls, team eligibility and publication state.
- [x] Verify token purpose/version; implement logout/password/admin session revocation.
- [x] Reject unsafe production signing configuration and production demo seeding.
- [x] Execute isolated security integration tests (38/38), server lint and client build.
- [x] Keep the existing event database untouched; do not begin Clerk integration.
- [ ] Approve and perform replica-set setup, deployment and unique-index verification.
- [ ] Review legacy challenge content; publish real artifacts instead of withheld prompts.
- [ ] Configure team-bound checkpoints or explicitly select signed shared Public QR mode.
- [ ] Regenerate/reprint expiring placards and rotate previously exposed invitations.
- [ ] Review historical scoring ownership and reconcile records before old-solve corrections.
- [ ] Validate browser/camera/logout flows and run production-like load tests.
- [ ] Address remaining development dependency advisories without an unreviewed UI migration.
- [ ] Implement real leaderboard freeze snapshots and separately scope MFA/refresh/recovery.

These entries supersede older broad completion claims. Pending data operations require
approval and were not performed as part of the code remediation.


> **RULE:** As tasks are implemented in future phases, update this file to reflect current progress.

---

## Phase 2: Frontend UI & Design System (Homepage, Login, Register & Rules Integration) (COMPLETED)
- [x] Run `npm install` across workspaces and verify Vite development server startup.
- [x] Integrate reference `HomePage.jsx` with full typography, 10 levels, stats, mission, and how-it-works sections.
- [x] Integrate reference `HomePage.css` preserving dark + electric-lime visual identity.
- [x] Integrate authentic campus hero image `client/public/campus-hero.png`.
- [x] Connect active routes (`/login`, `/register`, `/leaderboard`) and in-page anchor navigation.
- [x] Integrate reference `LoginPage.jsx` at `client/src/pages/public/LoginPage.jsx`.
- [x] Integrate reference `LoginPage.css` at `client/src/styles/LoginPage.css` with responsive breakpoints (1200px, 900px, 560px).
- [x] Mount `ROUTES.LOGIN` as standalone full-bleed route in `AppRoutes.jsx`.
- [x] Connect `authService.login` API and `useAuth` hook into login card submit handler.
- [x] Fix Login Page responsiveness across 5 distinct screen tiers:
  - [x] Desktop (1200px+): 3-column layout, zero horizontal overflow.
  - [x] Tablet landscape (769px–1199px): 2-column layout, compact navbar.
  - [x] Tablet portrait (600px–768px): 1-column centered layout, 16px–24px safe padding.
  - [x] Mobile (390px–599px): 1-column fluid layout with mobile menu drawer and clamped typography.
  - [x] Small mobile (320px–389px): 2-column tabs, no button clipping, full scroll accessibility.
- [x] Integrate reference `RegisterPage.jsx` at `client/src/pages/public/RegisterPage.jsx`:
  - [x] 4-step wizard progression (Team Details -> Team Leader -> Team Members -> Review & Terms).
  - [x] UI-only flow with confirmation view upon final step submission.
  - [x] Responsive navigation with mobile hamburger menu and drawer.
- [x] Integrate reference `RegisterPage.css` at `client/src/styles/RegisterPage.css`:
  - [x] Namespaced `--rg-*` styling and campus background integration.
  - [x] Responsive breakpoints (1250px, 900px, 560px, 380px) tested down to 320px width.
- [x] Mount `ROUTES.REGISTER` as standalone full-bleed route in `AppRoutes.jsx`.
- [x] Integrate reference `RulesPage.jsx` at `client/src/pages/public/RulesPage.jsx`:
  - [x] 6-category interactive accordion (independent toggle state).
  - [x] Acknowledgment checkbox gating before register button enables.
  - [x] Mobile hamburger toggle and navigation drawer.
- [x] Integrate reference `RulesPage.css` at `client/src/styles/RulesPage.css`:
  - [x] Fixed campus hero background layer (`/campus-hero.png`) and glassmorphic stats.
  - [x] Responsive breakpoints (1200px, 900px, 600px, 360px, 330px) verified down to 320px width.
- [x] Mount `ROUTES.RULES` as standalone full-bleed route in `AppRoutes.jsx`.
- [x] Fix cross-page Rules navigation: replace `#rules` / `/#rules` with dedicated `<Link to={ROUTES.RULES}>` across `HomePage`, `LoginPage`, and `RegisterPage`.
- [x] Integrate reference `MissionPage.jsx` at `client/src/pages/public/MissionPage.jsx`:
  - [x] Interactive 6-step mission playbook with cycling Next Step controls.
  - [x] Expandable 10-level Challenge Map.
  - [x] Smooth hash scrolling to `#how-it-works` and `#challenges`.
  - [x] Responsive hamburger menu drawer.
- [x] Integrate reference `MissionPage.css` at `client/src/styles/MissionPage.css`:
  - [x] Scoped `--lime`, `--white`, `--muted` variables and campus background integration.
  - [x] Responsive breakpoints (1200px, 900px, 600px, 360px, 330px) verified down to 320px width.
- [x] Mount `ROUTES.MISSION` (`/mission`) as standalone full-bleed route in `AppRoutes.jsx`.
- [x] Fix cross-page Mission and How It Works navigation:
  - [x] Convert anchor tags to React Router `<Link>` across `HomePage`, `LoginPage`, `RegisterPage`, and `RulesPage`.
  - [x] Point `MISSION` to `/mission` across all desktop and mobile navbars.
  - [x] Point `HOW IT WORKS` to `/mission#how-it-works` with smooth hash scroll.
  - [x] Update `Navbar.jsx` to map `MISSION` and `HOW IT WORKS` to `/mission` and `/mission#how-it-works`.
  - [x] Add fallback redirects for `/how-it-works` and `/mission-map` in `AppRoutes.jsx`.
- [x] Integrate reference `ChallengeLevelsPage.jsx` at `client/src/pages/public/ChallengeLevelsPage.jsx`:
  - [x] 10 challenge rows with interactive accordion click-to-expand briefings.
  - [x] UI-only presentation (zero sensitive flags/secrets exposed).
  - [x] Full-bleed header and 4-pillar benefits showcase.
- [x] Integrate reference `ChallengeLevelsPage.css` at `client/src/styles/ChallengeLevelsPage.css`:
  - [x] Scoped `--htg-lime` variables and `/campus-hero.png` reuse.
  - [x] Responsive `overflow-x: hidden` and stats wrapping.
- [x] Register `ROUTES.CHALLENGES` (`/challenges`) and mount as standalone route in `AppRoutes.jsx`.
- [x] Cross-page Challenge Levels navigation integration:
  - [x] Add `CHALLENGES` to shared `Navbar.jsx` in desktop and mobile drawer.
  - [x] Add `CHALLENGES` to `ParticipantLayout.jsx` tactical nav bar.
  - [x] Add `CHALLENGE LEVELS` CTA buttons and links to `TeamDashboardPage.jsx`.
  - [x] Update `CHALLENGES` links across `HomePage.jsx`, `MissionPage.jsx`, `RulesPage.jsx`, `LoginPage.jsx`, and `RegisterPage.jsx` to `ROUTES.CHALLENGES`.
  - [x] Map `/dashboard` route alias to `/portal/dashboard` in `AppRoutes.jsx`.
  - [x] Integrate `useAuth` dynamic CTA buttons (Login/Register vs Dashboard) on `ChallengeLevelsPage.jsx`.
- [x] Standalone Participant Dashboard UI Integration:
  - [x] Integrate reference `ParticipantDashboard.jsx` at `client/src/pages/participant/ParticipantDashboard.jsx`.
  - [x] Integrate reference `ParticipantDashboard.css` at `client/src/styles/ParticipantDashboard.css` with responsive breakpoints (1400px, 1120px, 700px, 390px).
  - [x] Decouple routes in `routes.js`: `DASHBOARD: '/dashboard'` and `PORTAL_DASHBOARD: '/portal/dashboard'`.
  - [x] Mount `ROUTES.DASHBOARD` as standalone full-bleed route in `AppRoutes.jsx`.
  - [x] Add route aliases for `/team`, `/profile`, and `/resources` to prevent 404s.
  - [x] Integrate `useAuth` hook for operative identity, team initials, and explicit `[PREVIEW MODE // SAMPLE DATA]` badge.
- [x] Standalone QR Checkpoint UI Integration:
  - [x] Integrate reference `QRCheckpointPage.jsx` at `client/src/pages/participant/QRCheckpointPage.jsx`.
  - [x] Integrate reference `QRCheckpointPage.css` at `client/src/styles/QRCheckpointPage.css` with responsive breakpoints (1300px, 850px, 560px, 360px).
  - [x] Register `QR_CHECKPOINT: '/qr-checkpoint'` in `client/src/constants/routes.js`.
  - [x] Mount `ROUTES.QR_CHECKPOINT` as standalone full-bleed route in `AppRoutes.jsx`.
  - [x] Connect `QR CHECKPOINT` in shared `Navbar.jsx` (`navLinks`).
  - [x] Configure image preview with object URL and integrated client-side file QR decoding (`Html5Qrcode.scanFile`).
  - [x] Integrate universal cross-browser live camera scanning via `html5-qrcode` with rear camera priority and camera switcher.
  - [x] Add camera permission handling, error states, and unmount stream cleanup.
  - [x] Connect scanned QR payload to backend `checkpointService.scanCheckpoint(code, token)` verification workflow.
  - [x] Flag recent checkpoint status cards as sample preview data.
  - [x] Set `overflow-x: hidden` to allow vertical scrolling down to rules and recent panels while preventing mobile overflow.
- [x] Standalone Leaderboard UI Integration:
  - [x] Integrate reference `LeaderboardPage.jsx` at `client/src/pages/public/LeaderboardPage.jsx`.
  - [x] Integrate reference `LeaderboardPage.css` at `client/src/styles/LeaderboardPage.css` with responsive breakpoints (1200px, 800px, 520px).
  - [x] Mount `ROUTES.LEADERBOARD` (`/leaderboard`) as standalone full-bleed route in `AppRoutes.jsx`.
  - [x] Connect working search, filter tabs (All Teams, Top 5, My Team), and sort dropdown over demo data.
  - [x] Add clear `EVENT RANKINGS DEMO DATA` badge and telemetry notes.
  - [x] Connect internal links to `ROUTES.HOME`, `ROUTES.MISSION`, `ROUTES.CHALLENGES`, `ROUTES.QR_CHECKPOINT`, `ROUTES.LEADERBOARD`, `ROUTES.DASHBOARD`, and `ROUTES.REGISTER`.
- [x] Final Flag / Victory UI Integration:
  - [x] Integrate reference `FinalFlagPage.jsx` at `client/src/pages/participant/FinalFlagPage.jsx`.
  - [x] Integrate reference `FinalFlagPage.css` at `client/src/styles/FinalFlagPage.css` with `overflow-x: hidden` and responsive design.
  - [x] Register `FINAL_FLAG: '/final-flag'` and mount standalone route in `AppRoutes.jsx`.
  - [x] Connect flag submission directly to authenticated backend endpoint `challengeService.submitFlag(10, flag)` (`POST /api/v1/submissions/submit`).
  - [x] Display "MISSION ACCOMPLISHED" strictly after server confirms flag validity or confirms previous solve.
  - [x] Enforce progression requirements and prevent client-side scoring simulation.
  - [x] Add navigation links from `ParticipantDashboard.jsx`, `ChallengeLevelsPage.jsx`, and `ParticipantLayout.jsx`.
- [x] Standardize Shared Navbar Navigation Across All Pages:
  - [x] Enforce canonical 7-item navigation order: HOME (`/`), LEADERBOARD (`/leaderboard`), MISSION (`/mission`), CHALLENGES (`/challenges`), QR CHECKPOINT (`/qr-checkpoint`), FINAL FLAG (`/final-flag`), RULES (`/rules`).
  - [x] Remove standalone HOW IT WORKS link (preserved at `/mission#how-it-works`).
  - [x] Add HOME and RULES to shared navigation link sequence.
  - [x] Replace duplicate inlined `<header>` implementations with single shared `Navbar.jsx` across 9 pages (`HomePage`, `LeaderboardPage`, `MissionPage`, `ChallengeLevelsPage`, `QRCheckpointPage`, `FinalFlagPage`, `RulesPage`, `LoginPage`, `RegisterPage`).
  - [x] Implement standardized `Navbar.css` with 13px uppercase typography, 600 weight, electric lime `#b8ff3d` active underline, and responsive hamburger drawer.
  - [x] Fix mobile horizontal overflow with `overflow-x: hidden` in `index.css`.
  - [x] Integrate Responsive Homepage Full-Code ZIP:
  - [x] Integrate reference `HomePage.jsx` with BEM architecture, 10 levels, 4 mission steps, and responsive header/footer.
  - [x] Integrate reference `HomePage.css` preserving static campus hero background (`position: fixed; inset: 86px 0 0`).
  - [x] Preserve static `client/public/campus-hero.png` asset and verify 200 OK loading.
  - [x] Maintain canonical 7-link navbar sequence (Home, Leaderboard, Mission, Challenges, QR Checkpoint, Final Flag, Rules).
  - [x] Verify mobile navigation drawer and interactive hamburger toggle on 390px viewport.
  - [x] Verify clean build `npm run build --workspace=client` (0 errors).
- [x] Integrate Updated Spacing & Team Section Package (`Hack-The-Grid-Homepage-Updated-Spacing-Team.zip`):
  - [x] Reduce vertical section gaps (`clamp(48px, 5vw, 76px)`) for a compact, premium layout.
  - [x] Increase typography scale across headings and descriptions for enhanced readability.
  - [x] Configure sticky navbar (`position: sticky; top: 0`) with smooth scroll padding.
  - [x] Add dedicated Team section (`#team`) with faculty and student coordinator cards and styled placeholder photos.
  - [x] Add footer credit: `Built with ♥ by Hrithik Roshan`.
  - [x] Verify zero build errors on `npm run build --workspace=client`.
- [x] Fix Homepage Sticky Navbar & Enlarged Footer Root Causes:
  - [x] Remove `overflow: clip;` on `.htg-home` that prevented child elements from sticking to the viewport.
  - [x] Remove `overflow-x: hidden;` on `#root` in `index.css` that created an unintended internal scroll container.
  - [x] Apply `position: sticky; top: 0; z-index: 1000; height: 82px; background: #040806; box-shadow: 0 4px 24px rgba(0,0,0,0.6);` to `.htg-header`.
  - [x] Add `html { scroll-behavior: smooth; scroll-padding-top: 88px; }` to keep anchor headings visible beneath sticky header.
  - [x] Fix footer document flow below CTA section with solid `#030706; z-index: 10;` background preventing fixed campus hero bleed-through.
  - [x] Enlarge footer padding to `38px clamp(24px, 5.5vw, 94px)` (desktop) and `34px 22px` (mobile).
  - [x] Enlarge footer brand logo to `24px` and set exact credit: `Built with ♥ by Hrithik Roshan` with `#ff4d64` red heart.
  - [x] Verify across desktop, tablet, and mobile with automated CDP tests and clean production build.
- [x] Integrate Redesigned Admin Mission Control Dashboard (`Hack-The-Grid-Admin-Dashboard-Redesigned.zip`):
  - [x] Create `client/src/pages/admin/AdminDashboard.jsx` and `client/src/styles/AdminDashboard.css`.
  - [x] Mount `/admin/dashboard` as standalone route without duplicate `AdminLayout` sidebars/headers, and preserve `/admin/login` (`Admin Login` tab).
  - [x] Reuse `/campus-hero.png` in `.ad-hero-banner` with dark + electric-lime `#b8ff3d` theme.
  - [x] Verify all sections: overview statistics, challenge activity, level progress, event controls, team overview, recent submissions, recent activity, and quick actions.
  - [x] Point Questions (`/admin/questions`) and QR Checkpoints (`/admin/checkpoints`) to configured route constants and document unimplemented standalone admin subpages (`/admin/questions`, `/admin/security-logs`, `/admin/analytics`).
  - [x] Keep dashboard statistics, submissions, charts, and toggles clearly marked as demo-only preview data until connected to authenticated admin APIs.
- [x] Integrate Reference-Matched Admin Team Management UI (`Hack-The-Grid-Team-Management-UI-Reference-Match.zip`):
  - [x] Create shared Mission Control sidebar (`AdminSidebar.jsx`) with active route highlighting and all 9 admin navigation links.
  - [x] Integrate `TeamManagementPage.jsx` and `TeamManagementPage.css` at `/admin/teams` without duplicate sidebars/headers.
  - [x] Connect `GET /api/v1/admin/teams` and `PATCH /api/v1/admin/teams/:teamId/disqualify` via `admin.service.js` with populated member rosters and explicit `● LIVE DATABASE` vs `● DEMO PREVIEW DATA` badges.
  - [x] Verify search (by team, member, email, college), status/level/college filters, reset, CSV export, Table/Grid toggle, pagination, and responsive desktop/tablet/mobile layouts.
- [x] Integrate Reference-Matched Admin Challenge Management UI (`Hack-The-Grid-Challenge-Management-UI.zip`):
  - [x] Integrate `ChallengeManagementPage.jsx` and `ChallengeManagementPage.css` at `/admin/challenges` using shared `AdminSidebar.jsx`.
  - [x] Implement `GET /api/v1/admin/challenges`, `PATCH /api/v1/admin/challenges/:challengeId`, and `GET /api/v1/admin/questions` (with `.select('-flag')`) in `admin.controller.js`.
  - [x] Connect challenge listing, creation, editing, publish/pause toggle, linked question counts, and linked QR checkpoints in `ChallengeManagementPage.jsx`.
  - [x] Verify search, status/difficulty/category filters, reset, CSV export, List/Grid toggle, Add/Edit modal, and responsive desktop/tablet/mobile layouts.
- [x] Verify all 12 target viewports (1440px, 1366px, 1280px, 1024px, 900px, 768px, 600px, 480px, 430px, 390px, 360px, 320px).
- [x] Verify zero build or console errors.
- [x] Integrate Reference-Matched Participant User Profile UI (`Hack-The-Grid-User-Profile-UI.zip`):
  - [x] Implement `client/src/pages/participant/UserProfilePage.jsx` and `client/src/styles/UserProfilePage.css` with responsive cyber layout.
  - [x] Mount at `ROUTES.PROFILE` (`/profile`) and `/portal/profile`, resolving previous redirect to `/portal/team`.
  - [x] Integrate participant cyber navbar (`.htg-up-navbar`) with React Router navigation, active links, mobile drawer, and user menu dropdown.
  - [x] Connect backend `User` schema extension with `college`, `course`, `year`, `bio`, `github`, `linkedin`, `publicProfile`, `emailUpdates`, `avatar`.
  - [x] Implement authenticated profile endpoints (`GET /api/v1/auth/profile`, `PATCH /api/v1/auth/profile`, `POST /api/v1/auth/avatar`, `POST /api/v1/auth/change-password`).
  - [x] Strictly preserve read-only constraints for official rank, total XP, challenges solved, checkpoints scanned, team membership, and role.
  - [x] Connect secure avatar upload (base64, 500KB client limit) and password change modal with current password verification and zero secret leakage.
  - [x] Support 3 interactive tabs (`Overview`, `Achievements`, `Settings`), right-side telemetry cards (Team identity, Badges, Account security), and live database vs demo preview state pills.
  - [x] Verified build (`npm run build --workspace=client`) with 0 errors and captured 7 headless Chrome CDP screenshots across desktop, tabs, modal, tablet, and mobile.

---


## Phase 3: Authentication, Database & Registration System (COMPLETED)
- [x] Connect backend to local/Atlas MongoDB database (`mongodb://127.0.0.1:27017/hack_the_grid`).
- [x] Test `/api/v1/auth/register` with input validation rules.
- [x] Test `/api/v1/auth/login` and verify JWT token issuance.
- [x] Connect client login and register forms to live API endpoints.
- [x] Test session persistence across page reload via `localStorage`.

---

## Phase 4: Team Management Engine (High Priority)
- [x] Verify squad creation flow and join code generation (`HTG-XXXXXX`).
- [x] Enforce team size limits (minimum 2, maximum 4 operatives).
- [x] Test team joining via join code.
- [ ] Build UI toast notification for successful team enrollment.

---

## Phase 5: Challenge Engine & Asset Pipeline (High Priority)
- [x] Create seed script with sample challenges for Levels 1 through 10 (`server/src/utils/seed.js`).
- [ ] Support rich Markdown rendering for challenge prompts (syntax highlighting for code snippets).
- [ ] Support downloadable challenge asset artifacts (binary dumps, stego images) and backend file attachment upload endpoint (`POST /api/v1/admin/challenges/:challengeId/attachments`).

---

## Phase 6: Team-Specific Question Allocation (Critical Priority)
- [x] Populate question variations across levels in database (`server/src/utils/seed.js`).
- [ ] Write integration test verifying that Team A and Team B receive different questions.
- [x] Write test verifying that Team A always receives the same question upon repeated requests or page refreshes (idempotency verified).

---

## Phase 7: QR Checkpoint Cryptographic System (COMPLETED)
- [x] Connect smartphone HTML5 camera QR scanner library in `CheckpointScannerPage.jsx` and `QRCheckpointPage.jsx`.
- [x] Implement fallback manual code entry in `QRCheckpointPage.jsx`.
- [x] Support native phone camera scan URL detection (`/checkpoint/scan?code=...&token=...`).
- [x] Test HMAC token verification on `/api/v1/checkpoints/scan` with tampered token and locked level detection.
- [x] Generate printable placards with real scannable QR codes for campus checkpoints (`/admin/checkpoints`).
- [x] Strictly enforce 0 point award on checkpoint scan alone.

---

## Phase 8: Timer, Scoring Engine & Hint System (In Progress - Scoring & Submissions Completed)
- [x] Connect participant flag submission engine (`POST /api/v1/submissions/submit`).
- [x] Verify constant-time flag comparison (`crypto.timingSafeEqual`) and case sensitivity support.
- [x] Enforce checkpoint scan gating before accepting flag submissions on gated challenges.
- [x] Enforce attempt limits lockout with remaining attempts reported.
- [x] Test atomic score incrementing upon successful flag submission (`TeamChallenge.findOneAndUpdate`).
- [x] Block replay submissions and concurrent double-claims.
- [x] Synchronize team level progression and leaderboard rankings.
- [ ] Implement hint unlock modal with confirmation warning for point penalties.
- [ ] Test sub-millisecond tie-breaker timestamp precision.

---

## Phase 9: Live Leaderboard & Freeze Engine (COMPLETED)
- [x] Implement live polling / Server-Sent Events (SSE) for automatic leaderboard updates (15s auto-refresh polling implemented on `/admin/leaderboard`).
- [x] Test freeze switch toggle: ensure scores continue logging in database while public view freezes (`EventConfig.isLeaderboardFrozen` synchronized via `PATCH /api/v1/admin/event-config`).

---

## Phase 10: Admin Command SOC (Medium Priority)
- [x] Verify admin authentication guard (`requireAdmin`).
- [x] Implement live submission stream querying and audit logs in Admin SOC (`GET /api/v1/admin/submissions`).
- [x] Implement one-click squad disqualification and restoration action (`PATCH /api/v1/admin/teams/:teamId/disqualify`).
- [x] Implement admin challenge listing, creation, editing, and publish/pause status management (`GET / POST / PATCH /api/v1/admin/challenges`).
- [x] Implement admin question listing, creation, editing, and publish/pause status management (`GET / POST / PATCH /api/v1/admin/questions`).
- [x] Integrate reference Question Management page (`/admin/questions`) with search, status/type/level filtering, table/grid views, answer reveal toggle, CSV export, and live/demo state sync.
- [x] Integrate reference QR Checkpoint Management page (`/admin/checkpoints`) with real scannable QR code generation (`qrcode`), high-resolution printable placard generator (`downloadPlacard`), status/mode filtering, table/grid views, and live/demo state sync.
- [x] Implement admin checkpoint listing, creation, and updating (`GET / POST / PATCH /api/v1/admin/checkpoints`).
- [x] Integrate reference Submission Management page (`/admin/submissions`) with search, result/level/team filtering, table/grid views, answer reveal toggle, pending review queue shortcut, CSV export, and live/demo state sync.
- [x] Implement admin submission review endpoint with server-side validation, duplicate scoring protection, and atomic team score updates (`PATCH /api/v1/admin/submissions/:submissionId/review`).
- [x] Integrate reference Leaderboard Management page (`/admin/leaderboard`) with deterministic server-side ranking, public visibility freeze toggle, 15s auto-refresh polling, search, level filtering, table/grid views, team performance inspector panel, and CSV export.
- [x] Integrate reference Event Control page (`/admin/event-control` and `/admin/controls`) with radar HUD, live dashboard statistics sync, operational switches (registration, QR validation, public leaderboard freeze, hints system, maintenance mode), event parameters (dates, duration, team capacity), system health checks, live activity feed, and participant announcement broadcasting (`POST /api/v1/admin/announcements`).
- [x] Extend `EventConfig` model with operational toggles (`maintenanceMode`, `registrationOpen`, `qrCheckpoints`, `hintsEnabled`, `announcementsEnabled`, `duration`, `maxTeams`, `subtitle`, `location`) and audit logging for sensitive state transitions.
- [x] Integrate reference Security Logs page (`/admin/security-logs` and `/admin/logs`) with audit telemetry stats, multi-criteria filtering (severity, category, status, range), search with Ctrl+K shortcut, CSV export, record inspector, and live review persistence (`PATCH /api/v1/admin/security-logs/:logId/review`).
- [x] Implement `SecurityLog` model and administrative endpoints (`GET /api/v1/admin/security-logs`, `PATCH /api/v1/admin/security-logs/:logId/review`) with structured security audit logging.
- [x] Integrate reference Admin Profile page (`/admin/profile`) with privileged account identity (`ACCESS LEVEL 04`), telemetry stats, Overview / Settings / Security tabs, permissions inspector, session card, and password change modal.
- [x] Implement admin profile endpoints (`GET /api/v1/admin/profile`, `PATCH /api/v1/admin/profile`, `POST /api/v1/admin/sessions/revoke`) with server-enforced role immutability and audit logging.
- [x] Update `AdminSidebar.jsx` to link the administrator user card directly to `ROUTES.ADMIN_PROFILE`.
- [x] Unify and standardize separate navigation systems:
  - [x] Canonical 9-link Admin Sidebar in exact order (Overview, Teams, Challenges, Questions, QR Checkpoints, Submissions, Leaderboard, Event Control, Security Logs) with real telemetry badges and zero fabricated mock counts.
  - [x] Canonical 7-link Public Navbar in single desktop horizontal row (HOME, LEADERBOARD, MISSION, CHALLENGES, QR CHECKPOINT, FINAL FLAG, RULES) with role-aware right action buttons.
  - [x] Strict layout isolation: `AdminLayout` (sidebar + content only), `PublicLayout` (navbar + content + footer only), `ParticipantLayout` (participant HUD).
  - [x] Server-authoritative role verification in `auth.middleware.js` via database lookup, neutralizing JWT role spoofing.
  - [x] Client route protection in `ProtectedRoute.jsx` bouncing unauthorized participants to `/dashboard` and unauthenticated visitors to `/admin/login` (preserving deep links).
- [x] Implement admin challenge deletion (`DELETE /api/v1/admin/challenges/:challengeId`) and question deletion (`DELETE /api/v1/admin/questions/:questionId`).
- [x] Implement admin team creation endpoint (`POST /api/v1/admin/teams`), admin team details edit endpoint (`PATCH /api/v1/admin/teams/:teamId`), admin member assignment endpoint (`POST /api/v1/admin/teams/:teamId/members`), member removal endpoint (`DELETE /api/v1/admin/teams/:teamId/members/:userId`), admin team deletion (`DELETE /api/v1/admin/teams/:teamId`), and added `college` field to `Team` Mongoose schema (`server/src/models/Team.js`).
- [x] Connect admin Team Management, Challenge Management, Question Management, and Participant Dashboard pages to live database endpoints with full CRUD operations, modal flows, and zero-leakage flag security.
- [x] Implement Phase 4: QR Checkpoint Management and Submission Engine:
  - [x] Connected QR Checkpoint Management page to backend with real HMAC-signed QR generation and printable placards.
  - [x] Implemented dual-mode QR Scanner (`QRCheckpointPage.jsx`) supporting live camera, image upload, fallback manual entry, and smartphone URL scanning (`/checkpoint/scan`).
  - [x] Enforced checkpoint validation: token verification, level progression gating, and zero-point scans.
  - [x] Built secure submission engine with constant-time flag comparison (`crypto.timingSafeEqual`), attempt limit lockouts, and atomic idempotent solve (`scoring.service.js`).
  - [x] Verified Phase 4 test suite with 51/51 tests passing.
- [x] Implement Phase 5: Leaderboard, Final Flag and End-to-End Verification:
  - [x] Connected Public Leaderboard (`LeaderboardPage.jsx`) to live `/api/v1/leaderboard` with deterministic tie-breaking (`totalScore DESC, lastSolveTimestamp ASC, createdAt ASC, _id ASC`).
  - [x] Handled all leaderboard UI states: loading spinner, connection error retry, empty arena, concealed standings banner, frozen badge, and manual instant refresh.
  - [x] Connected Admin Leaderboard (`LeaderboardManagementPage.jsx`) to live `/api/v1/admin/leaderboard` and removed client-side rank adjustment controls (`moveTeam`).
  - [x] Connected Event Control (`EventControlPage.jsx`) to live `EventConfig` API with automatic `SecurityLog` audit logging for privileged changes.
  - [x] Enforced backend event-state restrictions (submissions/scans blocked when `PAUSED`, `CONCLUDED`, or in `maintenanceMode`; team creation blocked when `registrationOpen === false` or `maxTeams` reached).
  - [x] Connected Final Flag (`FinalFlagPage.jsx`) for Level 10 capture with progression prerequisite gating, attempts lockout, constant-time verification, victory HUD transition (Level 11), and anti-replay protection.
  - [x] Executed end-to-end test suite (`test_phase5_e2e_gameplay.js`): 48/48 tests passing.
  - [x] Verified all platform test suites: 135/135 tests passing across all integration suites.
  - [x] Verified client production build (`npm run build:client` exit code 0).

---

## Phase 11: Security Hardening & Anti-Cheat (High Priority)
- [x] Test rate limiters on submissions and checkpoint endpoints.
- [x] Verify zero flag exposure across all participant and public API responses (`select: false`).
- [x] Constant-time flag comparison preventing timing attacks.
- [x] HMAC-SHA256 checkpoint token validation preventing QR tampering.
- [x] Idempotent atomic solve guard preventing race condition double-rewards.
- [x] Harden JWT authentication middleware (`auth.middleware.js`):
  - [x] Validate JWT signature and expiry.
  - [x] Query MongoDB using token `userId` and select `role`, `teamId`, `isActive`.
  - [x] Reject deleted users with 401 (`User account no longer exists`).
  - [x] Reject deactivated users (`isActive: false`) with 401 (`Account has been deactivated. Please contact an administrator.`).
  - [x] Authoritatively overwrite `req.user.role` from database.
  - [x] Explicitly clear stale `teamId` when user's database `teamId` is null.
- [x] Harden optional authentication middleware (`optionalAuth`):
  - [x] Preserve public access for unauthenticated requests.
  - [x] Synchronize active user state when valid token is supplied.
  - [x] Do not populate authenticated identity for inactive or deleted users.
  - [x] Forward database errors to error handling middleware instead of silently authenticating.
- [x] Verify admin authorization in `admin.routes.js` (`authenticate` before `requireAdmin`).

---

## Phase 12: Testing & QA (COMPLETED)
- [x] `test_jwt_admin_auth.js` (18/18 tests PASSED).
- [x] `test_phase5_e2e_gameplay.js` (48/48 tests PASSED).
- [x] `test_phase4_qr_submission.js` (51/51 tests PASSED).
- [x] `test_team_challenge_question_integration.js` (20/20 tests PASSED).
- [x] `test_phase3_integration.js` (16/16 tests PASSED).
- [x] Comprehensive platform regression: 153/153 tests passing (100% success rate).

---

## Phase 13: Production Deployment Readiness
- [x] Production client bundle verified (`npm run build:client` exit code 0).
- [ ] Setup production MongoDB Atlas cluster.
- [ ] Deploy backend to production environment (Render/Railway).
- [ ] Deploy frontend to Vercel with SPA routing rewrite.
- [ ] Conduct end-to-end dry run on campus network.

