# ACTIONABLE IMPLEMENTATION BACKLOG (TODO): HACK THE GRID

> **RULE:** As tasks are implemented in future phases, update this file to reflect current progress.

---

## Phase 2: Frontend UI & Design System Polish (High Priority)
- [ ] Run `npm install` inside `client/` and verify Vite development server startup.
- [ ] Verify Tailwind cyber theme compilation and custom colors (`cyber-bg`, `cyber-cyan`, `cyber-panel`).
- [ ] Enhance interactive micro-interactions (subtle hover sounds, terminal typing effects using Framer Motion).
- [ ] Add SVG circuit board background illustration to `client/src/assets/`.

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
