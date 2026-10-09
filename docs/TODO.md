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
- [ ] Support downloadable challenge asset artifacts (binary dumps, stego images).

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
- [ ] Verify admin authentication guard (`requireAdmin`).
- [ ] Implement live submission stream polling in Admin SOC.
- [ ] Implement one-click squad disqualification action.

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

