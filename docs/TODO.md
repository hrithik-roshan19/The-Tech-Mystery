# ACTIONABLE IMPLEMENTATION BACKLOG (TODO): HACK THE GRID

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

---


## Phase 3: Authentication & Registration System (High Priority)
- [ ] Connect backend to local/Atlas MongoDB database.
- [ ] Test `/api/v1/auth/register` with input validation rules.
- [ ] Test `/api/v1/auth/login` and verify JWT token issuance.
- [ ] Connect client login and register forms to live API endpoints.
- [ ] Test session persistence across page reload via `localStorage`.

---

## Phase 4: Team Management Engine (High Priority)
- [ ] Verify squad creation flow and join code generation (`HTG-XXXXXX`).
- [ ] Enforce team size limits (minimum 2, maximum 4 operatives).
- [ ] Test team joining via join code.
- [ ] Build UI toast notification for successful team enrollment.

---

## Phase 5: Challenge Engine & Asset Pipeline (High Priority)
- [ ] Create seed script with sample challenges for Levels 1 through 10.
- [ ] Support rich Markdown rendering for challenge prompts (syntax highlighting for code snippets).
- [ ] Support downloadable challenge asset artifacts (binary dumps, stego images) and backend file attachment upload endpoint (`POST /api/v1/admin/challenges/:challengeId/attachments`).

---

## Phase 6: Team-Specific Question Allocation (Critical Priority)
- [ ] Populate at least 3 question variations for each level in the database.
- [ ] Write integration test verifying that Team A and Team B receive different questions.
- [ ] Write test verifying that Team A always receives the same question upon repeated requests or page refreshes.

---

## Phase 7: QR Checkpoint Cryptographic System (High Priority)
- [ ] Connect smartphone HTML5 camera QR scanner library in `CheckpointScannerPage.jsx`.
- [ ] Test HMAC token verification on `/api/v1/checkpoints/scan`.
- [ ] Generate printable PDF/SVG placards for campus checkpoints.

---

## Phase 8: Timer, Scoring Engine & Hint System (Medium Priority)
- [ ] Test atomic score incrementing upon successful flag submission.
- [ ] Implement hint unlock modal with confirmation warning for point penalties.
- [ ] Test sub-millisecond tie-breaker timestamp precision.

---

## Phase 9: Live Leaderboard & Freeze Engine (Medium Priority)
- [ ] Implement live polling / Server-Sent Events (SSE) for automatic leaderboard updates.
- [ ] Test freeze switch toggle: ensure scores continue logging in database while public view freezes.

---

## Phase 10: Admin Command SOC (Medium Priority)
- [x] Verify admin authentication guard (`requireAdmin`).
- [ ] Implement live submission stream polling in Admin SOC.
- [x] Implement one-click squad disqualification and restoration action (`PATCH /api/v1/admin/teams/:teamId/disqualify`).
- [x] Implement admin challenge listing, creation, editing, and publish/pause status management (`GET / POST / PATCH /api/v1/admin/challenges`).
- [x] Implement admin question listing, creation, editing, and publish/pause status management (`GET / POST / PATCH /api/v1/admin/questions`).
- [x] Integrate reference Question Management page (`/admin/questions`) with search, status/type/level filtering, table/grid views, answer reveal toggle, CSV export, and live/demo state sync.
- [ ] Implement admin challenge deletion (`DELETE /api/v1/admin/challenges/:challengeId`) and question deletion (`DELETE /api/v1/admin/questions/:questionId`).
- [ ] Implement admin team creation endpoint (`POST /api/v1/admin/teams`), admin team details edit endpoint (`PATCH /api/v1/admin/teams/:teamId`), admin member assignment endpoint (`POST /api/v1/admin/teams/:teamId/members`), and add `college` field to `Team` Mongoose schema (`server/src/models/Team.js`).

---

## Phase 11: Security Hardening & Anti-Cheat (High Priority)
- [ ] Test rate limiters on submissions (verify 429 response on rapid attempts).
- [ ] Run security scanner (npm audit, OWASP top 10 review).
- [ ] Verify zero flag exposure in API network inspector.

---

## Phase 12: Testing & QA (Medium Priority)
- [ ] Write backend unit tests (Jest/Supertest) for auth, assignment, and submissions.
- [ ] Write frontend component tests for key pages.

---

## Phase 13: Production Deployment (High Priority)
- [ ] Setup production MongoDB Atlas cluster.
- [ ] Deploy backend to Render/Railway.
- [ ] Deploy frontend to Vercel with SPA routing rewrite.
- [ ] Conduct end-to-end dry run on campus network.

