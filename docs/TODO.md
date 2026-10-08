# ACTIONABLE IMPLEMENTATION BACKLOG (TODO): HACK THE GRID

> **RULE:** As tasks are implemented in future phases, update this file to reflect current progress.

---

## Phase 2: Frontend UI & Design System (Homepage, Login & Register Integration) (COMPLETED)
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

