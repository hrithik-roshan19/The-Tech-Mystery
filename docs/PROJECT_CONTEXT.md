# PROJECT CONTEXT & MASTER BLUEPRINT: HACK THE GRID

> **CRITICAL CONTINUITY DIRECTIVE FOR AI AGENTS & DEVELOPERS:**  
> This file is the primary single source of truth for **Hack the Grid**. If you are resuming work on this repository after a context window reset, session transfer, or model change, **READ THIS DOCUMENT FIRST IN ITS ENTIRETY**. Do not make architectural modifications without consulting the Architectural Decision Records in `docs/DECISIONS.md` and logging progress in `docs/DEVELOPMENT_PROGRESS.md`.

---

## 1. Project Overview
**Hack the Grid** is a production-grade, hybrid cybersecurity Capture-the-Flag (CTF) web platform created for the flagship annual competition hosted by the **CodeSphere Coding Club** at **Tula's University, Dehradun**. 

The platform bridges virtual cybersecurity problem-solving with the physical university campus by pairing digital challenges with physical QR code checkpoints placed at strategic campus locations. Teams navigate 10 tiered containment levels to breach the grid and capture the final Master Flag.

---

## 2. Project Goal
The primary objective of Hack the Grid is to provide a cheat-resilient, scalable, high-adrenaline competition platform that:
1. Prevents cross-team answer trading by dynamically assigning unique challenge variations to every team.
2. Integrates physical campus geography into digital gameplay via tamper-proof QR beacons.
3. Completely prevents client-side answer leakage through strict zero-trust server validation.
4. Provides real-time live telemetry, scoring, and leaderboard updates with sub-millisecond tie-break resolution.
5. Equips organizers with an administrative Command SOC for real-time monitoring and event control.

---

## 3. Event Concept
- **Theme**: Infiltration of a rogue containment grid on the Tula's University campus.
- **Structure**: 10 progressive defense levels.
- **Team Size**: 2 to 4 registered participants per team.
- **Physical Nodes**: Physical checkpoint stations (Block B, Server Labs, Library, Auditorium, etc.).
- **Master Flag**: The climactic 10th-level objective requiring multi-stage cryptographic assembly.

---

## 4. Target Users & Personas
1. **Participants / Operatives**: Undergraduate students and cybersecurity enthusiasts with varying skill levels (beginner to advanced). They interact through the Participant Portal HUD.
2. **Squad Commanders (Team Leaders)**: Operatives who register the squad, manage team rosters via invite tokens, and coordinate submissions.
3. **Event Administrators & Faculty Organizers (CodeSphere Command SOC)**: Organizers overseeing the event, monitoring submission audit streams, toggling leaderboard freeze, and disqualifying bad actors.

---

## 5. Complete Feature List
- **Public Event Portal**:
  - Tactical landing page with cyber HUD aesthetics, mission narrative, and event countdown.
  - Standardized Global Navigation Bar: Unified `Navbar.jsx` with strict 7-link sequence across all pages: `HOME` (`/`), `LEADERBOARD` (`/leaderboard`), `MISSION` (`/mission`), `CHALLENGES` (`/challenges`), `QR CHECKPOINT` (`/qr-checkpoint`), `FINAL FLAG` (`/final-flag`), `RULES` (`/rules`). Includes dynamic active route indicators (`#b8ff3d`), responsive mobile drawer, and dynamic auth CTAs (`DASHBOARD`, `REGISTER`).
  - Interactive "How It Works" operational walkthrough (`/mission#how-it-works`).
  - People Behind the Grid: Team showcase featuring Faculty Coordinators (CSE Department) and Student Coordinators (CodeSphere Core Team) with responsive cards.
  - Rules of Engagement & Code of Conduct (`/rules`).
  - Event day timeline and schedule breakdown.
  - Frequently Asked Questions (FAQ).
  - Public view of live / frozen leaderboard (`/leaderboard`).
  - Footer with author credit: `Built with ♥ by Hrithik Roshan`.
- **Authentication & Team Management**:
  - JWT-based authentication (access token + refresh token workflow).
  - bcrypt password hashing with automatic salt generation.
  - Team creation with auto-generated cryptographic join codes (`HTG-XXXXXX`).
  - Team joining with capacity enforcement (2–4 members).
  - Role-Based Access Control (`ADMIN`, `TEAM_LEADER`, `TEAM_MEMBER`).
- **Challenge Engine & Persistent Pool**:
  - 10 structured levels covering Cryptography, Binary/ASCII, Base64, Web Inspection, Steganography, Debugging, Logic Puzzles, Multi-stage Ciphers, and Master Flag.
  - Question pools per level containing multiple unique variations.
  - Persistent, idempotent assignment: a team is assigned one variation per level which remains fixed across refreshes, re-logins, or re-scans.
  - Balanced allocation algorithm ensuring equal distribution across pool variations.
- **Physical QR Checkpoint System**:
  - Physical QR codes encode only HMAC-signed checkpoint URLs (e.g., `/checkpoint/scan?code=CP-XXXX&token=...`).
  - Zero flags, answers, or challenge prompts inside physical QR data.
  - Server-side scan verification requiring prerequisite level completion before unlocking.
- **Scoring & Leaderboard Engine**:
  - Atomic server-side score calculation and incrementing.
  - Solved history timeline tracking with timestamp down to the millisecond.
  - Deterministic tie-breaking: higher score first; earlier timestamp wins on point ties.
  - Leaderboard freeze switch: cloaks live score movement in final 30 minutes to preserve suspense.
- **Admin Command SOC**:
  - Standalone redesigned Admin Mission Control Dashboard (`/admin/dashboard`) with `/campus-hero.png` banner, overview metrics, challenge activity SVG chart, mission level progress ring/bars, demo event controls, searchable team overview table, recent submissions, activity feed, and quick actions (`DEMO MODE` preview layer).
  - Shared Mission Control Sidebar (`AdminSidebar.jsx`) with rotated diamond emblem, `HACK THE GRID` / `MISSION CONTROL` lockup, `ADMIN CONSOLE` live indicator, 9 navigation items (`Overview`, `Teams` with badge, `Challenges`, `Questions`, `QR Checkpoints`, `Submissions` with badge, `Leaderboard`, `Event Control`, `Security Logs`), `All systems operational` card, and `Event Admin` footer card.
  - Standalone reference-matched Team Management Console (`/admin/teams` -> `TeamManagementPage.jsx` + `TeamManagementPage.css`) with 5 summary cards (`Total Teams`, `Total Participants`, `Active Teams`, `Pending Verification`, `Disqualified`), member-aware search, status/level/college filters, reset, CSV export, Table/Grid view toggle, pagination, right-hand selected team detail panel (`Overview`, `Members`, `Progress`, `Submissions` tabs), and live backend integration (`GET /api/v1/admin/teams`, `PATCH /api/v1/admin/teams/:teamId/disqualify` via `admin.service.js`) with explicit `● LIVE DATABASE` vs `● DEMO PREVIEW DATA` labeling.
  - Standalone reference-matched Challenge Management Console (`/admin/challenges` -> `ChallengeManagementPage.jsx` + `ChallengeManagementPage.css`) with 5 KPI cards (`Total Levels`, `Published`, `Draft`, `Paused`, `Total Points`), search/status/difficulty/category filters, reset, CSV export, List/Grid view toggle, Add/Edit Challenge modal, publish/pause toggle switches, right-hand selected challenge detail panel (`Overview`, `Questions (N)`, `QR Checkpoints (N)` tabs), and live backend integration (`GET /api/v1/admin/challenges`, `POST /api/v1/admin/challenges`, `PATCH /api/v1/admin/challenges/:challengeId`, `GET /api/v1/admin/questions`) keeping secret flags strictly server-side (`select: false`).
  - Standalone reference-matched Question Management Console (`/admin/questions` -> `QuestionManagementPage.jsx` + `QuestionManagementPage.css`) with 5 KPI cards (`Total Questions`, `Published`, `Drafts`, `Paused`, `Available Points`), search/status/type/level filters, Table/Grid views, Add/Edit modal, hint & attempts controls, and admin secret answer preview with explicit "Reveal" toggle while keeping participant APIs strictly flag-free (`select: false`).
  - Standalone reference-matched QR Checkpoint Management Console (`/admin/checkpoints` -> `QRCheckpointManagementPage.jsx` + `QRCheckpointManagementPage.css`) with 5 KPI cards (`Total Checkpoints`, `Active`, `Drafts`, `Paused`, `Total Scans`), search/status/mode filters, Table/Grid views, Add/Edit Checkpoint modal, physical location and volunteer notes, genuine scannable QR code generation via `qrcode`, and downloadable high-resolution printable station placards (`HTG-Placard-${code}.png`).
  - Standalone reference-matched Submission Management Console (`/admin/submissions` -> `SubmissionManagementPage.jsx` + `SubmissionManagementPage.css`) with 5 KPI cards (`Total Submissions`, `Correct`, `Incorrect`, `Pending Review`, `Points Awarded`), pending review queue shortcut, multi-filter toolbar, answer mask/reveal, and server-authorized review actions (`PATCH /api/v1/admin/submissions/:submissionId/review`) that update scores atomically with duplicate award prevention.
  - Standalone reference-matched Leaderboard Management Console (`/admin/leaderboard` -> `LeaderboardManagementPage.jsx` + `LeaderboardManagementPage.css`) with ranking KPI cards (`Total Points`, `Challenges Solved`, `Recently Active`), live database synchronization, deterministic server-side ranking (`totalScore DESC, lastSolveTimestamp ASC`), public freeze visibility toggle (`EventConfig.isLeaderboardFrozen`), 15s auto-refresh polling, search, level filtering (1-10), Table/Grid views, team performance inspection panel, and RFC 4180 CSV export.
  - Standalone reference-matched Event Control Console (`/admin/event-control` & `/admin/controls` -> `EventControlPage.jsx` + `EventControlPage.css`) with tactical radar HUD, live vs demo mode indicator, overview statistics (`Registered teams`, `Active participants`, `Checkpoints cleared`, `Submissions today`), tabbed navigation (`Overview`, `Event Settings`, `Access & Safety`, `Announcements`), live database synchronization (`PATCH /api/v1/admin/event-config`), participant announcement broadcasting (`POST /api/v1/admin/announcements`), and dynamic maintenance mode controls that pause gameplay without locking out organizers.
  - Standalone reference-matched Security Logs Console (`/admin/security-logs` & `/admin/logs` -> `SecurityLogsPage.jsx` + `SecurityLogsPage.css`) with 4 audit telemetry cards (`Critical events`, `Warnings`, `Informational`, `Flagged records`), urgent alert banner with one-click critical filtering, multi-criteria filters (severity, category, status, time window), `Ctrl+K` search, Record Inspector with detailed metadata, "Mark as reviewed ✓" persistence (`PATCH /api/v1/admin/security-logs/:logId/review`), "Copy record JSON", and RFC 4180 CSV export.
  - Real-time event statistics: team count, operative count, solve counts, accuracy rate.
  - Submission forensic log streaming with IP address and user tracking (`/admin/submissions` & `/admin/security-logs`).
  - Master event controls: Start (LIVE), Pause, Conclude, Leaderboard Freeze (`/admin/controls` & `/admin/event-control`).

---

## 6. Technology Stack
- **Frontend Client**:
  - Framework: React 19 + Vite 6
  - Styling: Tailwind CSS (Custom Cybersecurity SOC theme)
  - Routing: React Router v7
  - Animation: Framer Motion
  - QR Scanner: html5-qrcode (cross-browser live camera detection & file decode)
  - API Client: Axios (with Bearer JWT interceptors and auto-error handling)
  - Icons: Lucide React
- **Backend API**:
  - Runtime: Node.js (v20+ LTS / v26 compatible)
  - Server Framework: Express.js
  - Database ODM: Mongoose v8
  - Security: Helmet, CORS, Express-Rate-Limit, bcryptjs, jsonwebtoken, crypto (timing-safe comparisons)
  - Validation: Express-Validator
  - Logging: Morgan & custom structured ANSI logger
- **Database**:
  - MongoDB Atlas (Cloud) / Local MongoDB instance
- **Hosting Targets**:
  - Frontend: Vercel / Netlify
  - Backend: Render / Railway / AWS ECS
  - Database: MongoDB Atlas (M0 / Dedicated Cluster)

---

## 7. Architecture Overview
Hack the Grid follows a decoupled, monorepo-structured client-server architecture:

```
[ Physical Campus QR ]  ───>  [ Participant Mobile/Laptop ]
                                          │
                                 HTTPS (Axios + JWT)
                                          ▼
                               [ Express.js REST API ]
                                          │
                  ┌───────────────────────┼────────────────────────┐
                  ▼                       ▼                        ▼
         [ Auth & RBAC ]         [ QR & Pool Engine ]     [ Atomic Scoring ]
                  │                       │                        │
                  └───────────────────────┼────────────────────────┘
                                          ▼
                                  [ MongoDB Atlas ]
```

---

## 8. Folder Structure
```text
hack-the-grid/
├── client/                     # Frontend React (Vite) Application
│   ├── public/                 # Static assets (favicon.svg, icons)
│   ├── src/
│   │   ├── assets/             # Brand logos, badges
│   │   ├── components/
│   │   │   ├── common/         # CyberButton, CyberCard, StatusBadge, TerminalWindow, LoadingSpinner
│   │   │   ├── hud/            # HUDHeader, ScanlineOverlay
│   │   │   └── navigation/     # Navbar, Footer
│   │   ├── constants/          # routes.js, theme.js
│   │   ├── context/            # AuthContext.jsx, EventContext.jsx
│   │   ├── hooks/              # useAuth.js, useCountdown.js
│   │   ├── layouts/            # PublicLayout.jsx, ParticipantLayout.jsx, AdminLayout.jsx
│   │   ├── pages/
│   │   │   ├── auth/           # LoginPage.jsx, RegisterPage.jsx
│   │   │   ├── participant/    # ParticipantDashboard, QRCheckpointPage, TeamDashboardPage, MissionMapPage,
│   │   │   │                   # ChallengeViewPage, CheckpointScannerPage, LeaderboardPage, TeamProfilePage, MasterFlagPage, FinalFlagPage
│   │   │   ├── admin/          # AdminDashboardPage, TeamManagementPage, ChallengeManagementPage, QuestionManagementPage,
│   │   │   │                   # ChallengePoolPage, CheckpointManagerPage, SubmissionLogsPage, EventControlsPage
│   │   │   ├── public/         # HomePage, MissionPage, ChallengeLevelsPage, RulesPage, LeaderboardPage, AboutPage, SchedulePage, FAQPage
│   │   │   └── NotFoundPage.jsx
│   │   ├── routes/             # AppRoutes.jsx, ProtectedRoute.jsx
│   │   ├── services/           # api.js, auth.service.js, challenge.service.js, team.service.js, admin.service.js, etc.
│   │   ├── styles/             # Navbar.css, HomePage.css, LoginPage.css, RegisterPage.css, RulesPage.css, MissionPage.css, ChallengeLevelsPage.css, ParticipantDashboard.css, QRCheckpointPage.css, LeaderboardPage.css, FinalFlagPage.css, AdminDashboard.css, TeamManagementPage.css, ChallengeManagementPage.css, QuestionManagementPage.css, index.css
│   │   ├── utils/              # storage.js, formatters.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── .env.example
│   └── README.md
│
├── server/                     # Backend Express.js REST Engine
│   ├── src/
│   │   ├── config/             # environment.js, db.js
│   │   ├── constants/          # roles.js, challengeTypes.js, submissionStatus.js, eventStates.js
│   │   ├── controllers/        # auth, team, challenge, submission, checkpoint, leaderboard, admin, health
│   │   ├── middleware/         # auth.middleware, role.middleware, rateLimiter, errorHandler, validate
│   │   ├── models/             # User, Team, Challenge, Question, TeamChallenge, Submission, Checkpoint, Score, EventConfig
│   │   ├── routes/             # REST endpoints (/api/v1)
│   │   ├── services/           # auth, team, questionAssignment, scoring, checkpoint
│   │   ├── utils/              # apiResponse.js, crypto.js, logger.js
│   │   ├── validators/         # auth, team, submission validators
│   │   └── server.js           # Server bootstrap and middleware pipeline
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── docs/                       # Comprehensive Architecture & Continuity Documentation
│   ├── PROJECT_CONTEXT.md      # Master context document (THIS FILE)
│   ├── ARCHITECTURE.md         # System topology, sequence flows, data contracts
│   ├── DATABASE_SCHEMA.md      # Schema dictionary, relations, indexing, constraints
│   ├── API_DOCUMENTATION.md    # REST API specification for all /api/v1 routes
│   ├── GAMEPLAY_LOGIC.md       # Level progression, tie-breaking, pool algorithms
│   ├── QR_SYSTEM.md            # Checkpoint token design, HMAC verification, anti-spoofing
│   ├── SECURITY.md             # Threat modeling, anti-cheat, rate-limiting, audit logging
│   ├── ADMIN_SYSTEM.md         # God-mode admin controls, monitoring, override protocols
│   ├── FRONTEND_GUIDELINES.md  # Cyber SOC visual identity, color tokens, typography
│   ├── DEVELOPMENT_PROGRESS.md # Phase completion log
│   ├── DECISIONS.md            # Architectural Decision Records (ADRs)
│   └── TODO.md                 # Granular future implementation backlog
│
├── .env.example                # Combined environment variable template
├── .gitignore                  # Git ignore rules for node, dist, and secrets
├── package.json                # Monorepo workspaces config
└── README.md                   # Repository landing README
```

---

## 9. Database Model Overview
1. **User**: Credentials, hashed password (`select: false`), role (`ADMIN`, `TEAM_LEADER`, `TEAM_MEMBER`), team link.
2. **Team**: Squad designation, join code, leader, roster (2–4), current level, total score, `lastSolveTimestamp` (for tie-breaking), disqualification status.
3. **Challenge**: Stage level (1 to 10), title, category, points, `requiresCheckpointScan`, difficulty.
4. **Question**: Pool variation belonging to a challenge, prompt markdown, asset URLs, `flag` (`select: false`), hint array.
5. **TeamChallenge**: **The core pivot.** Maps `teamId` to `challengeId`, `levelNumber`, and `assignedQuestionId`. Compound unique indexes guarantee that a team cannot receive two different questions for the same level.
6. **Submission**: Immutable forensic log of all attempts: submitted string, correct/incorrect flag, timestamp, submitting user, IP address.
7. **Checkpoint**: Physical location, unique code, target level number, and scan counter.
8. **Score**: Aggregated scoreboard snapshot with history timeline and compound index for high-speed live leaderboard ranking.
9. **EventConfig**: Singleton configuration governing event state (`DRAFT`, `LIVE`, `PAUSED`, `CONCLUDED`), start/end times, and leaderboard freeze.

---

## 10. Authentication Approach
- **Stateless JWTs**: Access tokens carry `{ userId, username, role, teamId }` and expire in 7 days (or configurable window).
- **Password Security**: Passwords are saved only as bcrypt hashes (salt rounds = 10) and are excluded by default in Mongoose queries (`select: false`).
- **Client Handling**: Stored in `localStorage` under `htg_access_token` and attached as `Authorization: Bearer <token>` on all Axios requests.

---

## 11. Team System
- Teams contain 2 to 4 members.
- Creating a team assigns the creator as `TEAM_LEADER` and generates an uppercase join code (`HTG-XXXXXX`).
- Joining an existing team requires the join code and validates team capacity `< maxMembers` and non-disqualification.
- All team members share the team's level progression and total score. Any team member can submit a flag or scan a checkpoint.

---

## 12. Team-Specific Question Assignment Logic
- **Requirement**: Teams must receive different questions where possible.
- **Persistence**: Question assignment must never change upon browser refresh or re-scanning.
- **Mechanism**:
  1. When a team unlocks Level $N$, `questionAssignmentService.getOrAssignQuestion(teamId, levelNumber)` is invoked.
  2. Queries `TeamChallenge` for `{ teamId, levelNumber }`.
  3. If already exists: returns the previously assigned question.
  4. If not exists: queries all active questions in the pool for Level $N$, aggregates existing assignments across all other teams, and selects the least assigned variation (balanced round-robin).
  5. Atomically inserts the `TeamChallenge` record. The unique compound index on `{ teamId, levelNumber }` prevents race conditions if multiple team members trigger the endpoint simultaneously.

---

## 13. QR Checkpoint Architecture
- Physical QR codes encode **ONLY** a URL pointing to the web app:
  `https://hackthegrid.codesphere.org/checkpoint/scan?code=CP-A7F92B&token=<HMAC>`
- **No Answers Inside QR**: The physical placard contains no clues, flags, or questions.
- **Verification Flow**:
  1. Participant scans QR.
  2. Frontend sends `code` and `token` to `POST /api/v1/checkpoints/scan`.
  3. Server validates HMAC against `QR_SECRET_SALT`.
  4. Server validates that the team is at least on the required level (`team.currentLevel >= checkpoint.levelNumber`).
  5. If valid, marks checkpoint scanned on `TeamChallenge` and returns the persistent challenge question.

---

## 14. Challenge Progression Logic
- Linear progression through 10 levels.
- Teams start at Level 1.
- Level $N+1$ unlocks **only** after a correct flag is submitted for Level $N$.
- If Level $N+1$ requires a checkpoint scan, its prompt remains locked until the physical QR for Level $N+1$ is scanned.

---

## 15. Scoring Logic
- Each solved level awards the challenge's base points (e.g., 100 to 500 PTS).
- If hints are unlocked, hint penalty points are deducted from the solve award: $\text{Net Points} = \max(0, \text{Base Points} - \text{Penalties})$.
- Points and level progression update atomically via Mongoose transactions or `$inc` updates.

---

## 16. Leaderboard Logic
- Ranks teams primarily by `totalScore` descending.
- **Tie-Breaker**: In the event of equal scores, the team with the earlier `lastSolveTimestamp` is ranked higher.
- **Freeze State**: When `isLeaderboardFrozen = true`, the public and participant leaderboard API returns scores snapshotted at freeze time, while backend scoring continues uninterrupted.

---

## 17. Admin Functionality
- **God-Mode Dashboard**: Live telemetry on active users, teams, submissions, and accuracy.
- **Team Management**: Real-time roster inspection and instant disqualification.
- **Challenge & Pool Management**: Dynamic stage definition and question pool population.
- **Checkpoint Beacon Management**: QR token generation and printable URL creation.
- **Submission Audit Stream**: Live feed of all attempts with IP addresses and timestamps.
- **Master Controls**: Event state toggling (`LIVE`, `PAUSED`, `CONCLUDED`) and leaderboard freeze.

---

## 18. Security Requirements & Threat Modeling
- **Zero Client Leakage**: Challenge flags, answers, and solution logic are NEVER sent to the client. Questions schemas mark `flag: { select: false }`.
- **Timing-Safe Comparison**: `crypto.timingSafeEqual` is used for all flag string comparisons to eliminate timing side channels.
- **Anti-Brute-Force Rate Limiting**: Strict limits on submissions (10 attempts per minute per team per level) to stop automated brute-forcing.
- **Anti-QR Enumeration**: HMAC SHA-256 signatures on checkpoint codes prevent guessing sequential checkpoint numbers.
- **Audit Logging**: Every single submission attempt is saved in MongoDB with IP address and user ID for forensic review.

---

## 19. API Architecture
All endpoints are nested under `/api/v1` and return a standardized JSON envelope:
```json
{
  "success": true,
  "message": "Human readable status",
  "data": { ... },
  "meta": { ... } // Optional pagination / telemetry
}
```
Error format:
```json
{
  "success": false,
  "message": "Error description",
  "errorCode": "ERROR_CODE_STRING",
  "errors": [] // Optional field validation errors
}
```

---

## 20. Frontend Architecture
- **SOC / Game HUD Aesthetic**: Dark cyber palette (`#05070A`, `#0B1017`, `#0F1720`, `#00E5FF`, `#39FF88`, `#FF6A00`).
- **Component Architecture**: Atomic reusable HUD components (`CyberButton`, `CyberCard`, `StatusBadge`, `TerminalWindow`, `HUDHeader`).
- **Context & State**: `AuthContext` provides authentication, role checking, and team state across all views.
- **Layouts**: Distinct `PublicLayout`, `ParticipantLayout` (with fixed HUD), and `AdminLayout` (with command sidebar).

---

## 21. Environment Variables
Defined in `.env.example` at root, `server/.env.example`, and `client/.env.example`.
Key variables: `MONGODB_URI`, `JWT_SECRET`, `QR_SECRET_SALT`, `PORT`, `CORS_ORIGIN`, `VITE_API_BASE_URL`.

---

## 22. Deployment Plan
- **Frontend**: Vercel (SPA routing rewrite in `vercel.json`).
- **Backend**: Render / Railway (Node.js web service).
- **Database**: MongoDB Atlas Cluster with IP allowlist enabled.

---

## 23. Current Development Status
- **Phase**: **PHASE 2 COMPLETE (Frontend UI & Design System - Homepage Integration)**
- **Completed**:
  1. Monorepo folder and file structure initialized.
  2. Full backend API scaffolded: Express server, Mongoose models (9 models), controllers, routes, middleware, validation rules, cryptographic helpers.
  3. Integrated visual source of truth homepage:
     - `client/src/pages/public/HomePage.jsx` with full typography, 10 levels, stats, mission, and how-it-works sections.
     - `client/src/styles/HomePage.css` with dark + electric-lime theme (`#b8ff3d`).
     - Authentic university hero image `client/public/campus-hero.png`.
     - Direct client-side links to `/login`, `/register`, and `/leaderboard`.
  4. Verified zero compilation errors with `npm run build` and zero console/runtime errors on Vite dev server.
  5. Exhaustive documentation suite maintained across `docs/`.
- **In Progress**: Preparing for Phase 3 (Authentication & Registration End-to-End System).
- **Pending**: Phases 3 through 13.
- **Blockers**: None.

---

## 24. Completed Work
- Root configuration files: `package.json`, `.gitignore`, `.env.example`, `README.md`.
- Server foundation: `server/package.json`, `server/src/server.js`, 9 database models, 8 controllers, 8 route files, 4 middleware modules, 5 services.
- Client foundation: `client/package.json`, `client/vite.config.js`, `client/tailwind.config.js`, `client/src/App.jsx`, `client/src/routes/AppRoutes.jsx`, 21 pages and components.
- Integrated Homepage: Reference implementation with hero, stats, mission, process, 10-level challenge list, live leaderboard preview, and final CTA.
- Complete documentation suite in `docs/`.

---

## 25. Pending Work (By Phase)
- **Phase 3**: Authentication & Registration end-to-end integration with live database.
- **Phase 4**: Team Management (team creation, invite code validation, roster limits).
- **Phase 5**: Challenge Engine (markdown rendering, asset downloads).
- **Phase 6**: Team-Specific Question Assignment testing with sample question pools.
- **Phase 7**: QR Checkpoint camera scanner integration and testing.
- **Phase 8**: Timer + Scoring atomic transactions.
- **Phase 9**: Live Leaderboard polling / WebSocket integration.
- **Phase 10**: Admin Dashboard controls and real-time data feeds.
- **Phase 11**: Security hardening & penetration testing.
- **Phase 12**: Automated unit and end-to-end testing.
- **Phase 13**: Production deployment on Vercel + Render + MongoDB Atlas.

---

## 26. Known Issues / Considerations
- Currently running in local development mode; MongoDB connection requires valid Atlas URI in `.env` to execute live auth/submission queries.

---

## 27. Important Design Decisions
Documented in detail in `docs/DECISIONS.md`:
- **ADR-0001**: Decoupled Monorepo Structure (`client/` + `server/`).
- **ADR-0002**: Persistent Question Assignment via `TeamChallenge` Pivot Model.
- **ADR-0003**: Opaque Physical QR Codes with HMAC Token Authentication.
- **ADR-0004**: Strict Zero-Leakage Architecture (`flag: { select: false }` and constant-time string comparison).
- **ADR-0005**: Compound Indexes for Leaderboard Query Performance.
- **ADR-0009**: Visual Source of Truth Homepage Integration (Electric-lime + Tula's University campus hero).
- **ADR-0010**: Standalone Full-Bleed Login Page UI Integration (Hero glass card, Team/Admin tabs, responsive breakpoints).
- **ADR-0011**: Multi-Tier Responsive Architecture for Login Experience (12 viewports tested, natural vertical scrolling, mobile menu drawer).
- **ADR-0012**: Standalone Full-Bleed Multi-Step Register Page UI Integration (4-step team enrollment wizard, responsive drawer).
- **ADR-0013**: Standalone Full-Bleed Rules Page UI Integration (Participant handbook, 6-category accordion, acknowledgment checkbox gate, zero horizontal overflow down to 320px).
- **ADR-0014**: Standalone Full-Bleed Mission & How It Works Page UI Integration (Mission Playbook, 6-stage interactive process, orbital animations, expandable challenge map).
- **ADR-0015**: Cross-Page Mission and How It Works Navigation Routing Fix (React Router `<Link>` transitions to `/mission` and `/mission#how-it-works`, multi-tier hash scroll retries, legacy redirect fallbacks).
- **ADR-0016**: Standalone Full-Bleed Challenge Levels & Mission Map UI Integration (10-level challenge matrix, accordion briefings, UI-only secrets preservation, /campus-hero.png asset reuse).
- **ADR-0017**: Unified Cross-Page Challenge Levels Navigation & Dashboard Routing Integration (Navbar, ParticipantLayout HUD, TeamDashboardPage, and public page links to /challenges, plus /dashboard alias mapping).

---

## 28. Future Improvements
- WebSockets (Socket.io) for instant leaderboard updates without polling.
- Offline-capable PWA scanner for checkpoints with spotty Wi-Fi coverage.
- Dynamic point decay (points decrease as more teams solve the challenge).

---

## 29. Exact Instructions for the Next AI / Developer
1. **Read `docs/PROJECT_CONTEXT.md` (this file)** and `docs/DEVELOPMENT_PROGRESS.md` before writing code.
2. **Review `docs/DECISIONS.md`** to understand the architectural rules (especially question assignment persistence, QR token validation, standalone full-bleed routes, and multi-tier responsive breakpoints).
3. **Do not deviate from the tech stack**: React 19 + Vite + Tailwind on client; Node.js + Express + Mongoose on server.
4. **Never hardcode challenge answers or flags in the client codebase**.
5. **Always update `docs/PROJECT_CONTEXT.md`, `docs/DEVELOPMENT_PROGRESS.md`, `docs/DECISIONS.md`, and `docs/TODO.md`** when completing a task or changing architecture.
6. **Next Development Target**: Proceed with **Phase 3: Authentication & Registration System** (wire up MongoDB instance, test `/api/v1/auth/register` and `/api/v1/auth/login`, link client forms to API).

---

```text
================================================================================
CURRENT STATUS:
- Phase: Phase 2 (Frontend UI & Design System - Homepage, Login, Register, Rules, Mission, Challenges) COMPLETE
- Completed: Full monorepo setup, backend architecture, reference Homepage UI,
             reference Login Page UI, reference Register Page UI (4-step wizard),
             reference Rules Page UI (6-category accordion + ack gate),
             reference Mission Page UI (6-stage playbook + interactive challenge map),
             reference Challenge Levels UI (10-level interactive Mission Map matrix),
             unified cross-page navigation routing for /mission, /challenges, /rules, /leaderboard,
             participant HUD and dashboard navigation to /challenges,
             alias redirection (/dashboard -> /portal/dashboard, /mission-map -> /portal/missions),
             campus hero asset, standalone full-bleed routing for /, /login, /register, /rules, /mission, /challenges,
             multi-tier responsive design (tested on viewports: 320px to 1440px),
             build & dev server verification.
- In Progress: Ready for Phase 3 (Authentication & Registration End-to-End System)
- Pending: Phases 3 through 13
- Blockers: None
================================================================================
NEXT STEP:
- Begin Phase 3: Connect MongoDB instance, verify backend registration/login API,
  and connect frontend auth pages to live backend tokens.
================================================================================
```

