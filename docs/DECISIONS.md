# ARCHITECTURAL DECISION RECORDS (ADR): THE TECH MYSTERY

## Clerk authentication preparation ? 19 October 2026

Clerk integration is implemented as an explicit opt-in provider; existing JWT mode remains the
default and its implementation is retained. No live connection, data migration, deployment,
account linking or registration opening occurred. MongoDB still owns roles, membership and
active status. Linking requires verified matching email plus existing password; ADMIN recovery
requires organizer approval. New Clerk participants remain unteamed and registration-gated.
See [implementation, exact files, setup, verification and rollback](CLERK_AUTHENTICATION.md).
Real Clerk credentials, browser acceptance, index setup, transaction-capable deployment and cutover
remain approval-gated. Earlier phase status statements below describe those phases historically.


This document logs significant architectural and design choices, their context, rationale, and consequences.

---

## ADR-0001: Decoupled Monorepo Structure (`client/` + `server/`)
- **Status**: ACCEPTED
- **Context**: The project requires independent deployment targets (Vercel for React frontend, Render/Railway for Express backend, MongoDB Atlas for database) while maintaining a unified repository for developer productivity.
- **Decision**: Adopt a root workspace monorepo layout containing `client/`, `server/`, and `docs/`.
- **Consequences**: Easy local development with unified script management, while allowing independent build pipelines on hosting platforms.

---

## ADR-0002: Persistent Question Allocation via `TeamChallenge` Pivot Model
- **Status**: ACCEPTED
- **Context**: The core requirement dictates that every team receives different questions where possible, but refreshing the page or re-scanning the QR must NEVER regenerate a new question.
- **Decision**: Introduce `TeamChallenge` as a dedicated pivot collection with a compound unique index on `{ teamId, levelNumber }`.
- **Consequences**: Guarantees strict idempotency. Once a question is selected for a team at Level $N$, any subsequent query retrieves the existing document.

---

## ADR-0003: Opaque Physical QR Codes with HMAC-SHA256 Signatures
- **Status**: ACCEPTED
- **Context**: Physical QR stickers placed in university public spaces could be photographed, shared online, or enumerated sequentially by participants.
- **Decision**: QR codes encode only opaque randomized codes and HMAC-SHA256 tokens (`CP-XXXX&token=<HMAC>`) generated using a server-side secret salt (`QR_SECRET_SALT`).
- **Consequences**: Physical placards contain no questions or flags. Tampering or guessing invalid tokens is computationally impossible.

---

## ADR-0004: Zero-Leakage Architecture via `select: false`
- **Status**: ACCEPTED
- **Context**: In CTF competitions, tech-savvy participants inspect browser DevTools, Redux/Context state, and API network payloads to discover flags.
- **Decision**: The `flag` property on the `Question` model is marked `select: false`. It is never loaded by Mongoose unless explicitly overridden in server-side validation functions.
- **Consequences**: Eliminates accidental exposure of flags across any public or participant endpoint.

---

## ADR-0005: High-Speed Scoreboard Snapshot Model
- **Status**: ACCEPTED
- **Context**: Leaderboard queries during a live competition with hundreds of students can cause high database load if recalculating aggregates on every query.
- **Decision**: Maintain a dedicated `Score` collection updated atomically upon each solve, indexed on `{ currentScore: -1, lastSolveTimestamp: 1 }`.
- **Consequences**: Queries for live rank standings execute in sub-millisecond time.

---

## ADR-0006: Timing-Safe Flag Verification
- **Status**: ACCEPTED
- **Context**: Standard string equality (`a === b`) short-circuits on the first mismatched character, allowing attackers to deduce characters via timing latency analysis.
- **Decision**: Use Node's built-in `crypto.timingSafeEqual` after length normalization.
- **Consequences**: Prevents timing side-channel attacks against flag verification.

---

## ADR-0009: Visual Source of Truth Homepage Integration
- **Status**: ACCEPTED
- **Context**: The landing page design identity was finalized with a specific aesthetic (dark palette, electric-lime accent `#b8ff3d`, Manrope + Geist Mono typography, and authentic Tula's University campus hero imagery).
- **Decision**: Integrate the reference `HomePage.jsx` and `HomePage.css` directly as the visual source of truth without redesigning or altering the visual direction. Mount `HomePage` as a dedicated standalone route at `/` while connecting existing SPA routes (`/login`, `/register`, `/leaderboard`) and preserving in-page anchor navigation.
- **Consequences**: Preserves full-bleed hero aesthetics and prevents duplicate headers/footers with `PublicLayout`, while maintaining complete compatibility with existing application routes.

---

## ADR-0010: Standalone Full-Bleed Login Page UI Integration
- **Status**: ACCEPTED
- **Context**: The reference Login Page implementation includes its own self-contained top navigation (`.htg-login-nav`), full-bleed campus background overlay (`campus-hero.png`), and specialized 3-column layout (event intro, central login card, feature highlights). Nesting it inside `PublicLayout` would introduce duplicate navbars, conflicting layout containers, and footer clutter.
- **Decision**:
  - Integrate `LoginPage.jsx` directly under `client/src/pages/public/` and import `client/src/styles/LoginPage.css`.
  - Mount `ROUTES.LOGIN` as a top-level standalone full-bleed route alongside `ROUTES.HOME` in `AppRoutes.jsx`, removing it from `PublicLayout`.
  - Wire the login form submission to the existing `authService.login({ emailOrUsername, password })` endpoint and `useAuth` session manager without altering visual elements.
  - Wire internal SPA navigation to `/`, `/login`, `/register`, and `/leaderboard` using React Router `Link`.
- **Consequences**: Preserves pixel-perfect fidelity of the dark + electric-lime design system, delivers full-bleed responsiveness across desktop/tablet/mobile, eliminates layout duplication, and provides seamless authentication state transitions.

---

## ADR-0011: Multi-Tier Responsive Architecture for Login Experience
- **Status**: ACCEPTED
- **Context**: Viewport sizes ranging from 320px ultra-compact phones to 1440px+ ultra-wide desktops require seamless accessibility. A single mobile breakpoint caused cut-off vertical scrolling (due to `overflow: hidden`), clipped `THE TECH MYSTERY` headers, overlapping nav items, and tab overflow on narrow cards.
- **Decision**:
  - Established a 5-tier responsive design system:
    1. **Desktop (>=1200px)**: 3-column layout (Intro + Card + Highlights), fluid `clamp()` gaps and typography.
    2. **Tablet Landscape (769px–1199px)**: 2-column layout (Intro + Card), feature highlights hidden, compact navbar.
    3. **Tablet Portrait (600px–768px)**: 1-column centered layout (Nav -> Intro -> Card), 16px–24px safe padding, card `width: min(100%, 560px)`.
    4. **Mobile (390px–599px)**: Fluid 1-column layout, hamburger menu with backdrop blur drawer, `THE TECH MYSTERY` clamped heading, card padding `28px 20px`.
    5. **Small Mobile (320px–389px)**: Ultra-compact layout tested specifically at 320px, 360px, 375px. 2-equal-column tabs with 11px font, touch-friendly 44px+ inputs, compact register button, and card padding `22px 14px`.
  - Replaced root `overflow: hidden` with `overflow-x: hidden; min-height: 100dvh;` allowing smooth, natural vertical scrolling on all touch devices.
  - Adjusted mobile campus hero background position to `50% 18%` to retain prominent visibility of the university architecture.
---

## ADR-0012: Standalone Full-Bleed Multi-Step Register Page UI Integration
- **Status**: ACCEPTED
- **Context**: The Tech Mystery requires an intuitive 4-step squad registration wizard (Team Details, Team Leader, Team Members, Review & Terms). The reference UI includes its own full-bleed header (`.htg-register-nav`), campus background overlay (`campus-hero.png`), and 3-column layout (event intro, central progress card, and right-side benefits blockquote).
- **Decision**:
  - Integrate `RegisterPage.jsx` under `client/src/pages/public/` and import `client/src/styles/RegisterPage.css`.
  - Mount `ROUTES.REGISTER` as a top-level standalone full-bleed route alongside `ROUTES.HOME` and `ROUTES.LOGIN` in `AppRoutes.jsx`, eliminating duplicate headers/footers from `PublicLayout`.
  - Preserve UI-only multi-step state progression (`step` 0 to 3) without connecting backend APIs prematurely.
  - Wire client-side SPA navigation to `/`, `/login`, `/register`, and `/leaderboard` with responsive hamburger menu support.
- **Consequences**: Delivers seamless 4-step enrollment UX, responsive fidelity from 320px to 1440px+, and leaves `HomePage` and `LoginPage` completely untouched.

---

## ADR-0013: Standalone Full-Bleed Rules Page UI Integration
- **Status**: ACCEPTED
- **Context**: The Tech Mystery requires a comprehensive Participant Handbook and Fair Play Protocol page (`/rules`). The reference design features its own full-bleed header (`.rp-nav`), fixed campus hero background (`campus-hero.png`), stats counter bar, 6 interactive rule accordion categories, a golden rule sandbox sidebar, and an acknowledgment checkbox gate before registering. Nesting it inside `PublicLayout` would duplicate headers and footers.
- **Decision**:
  - Integrate `RulesPage.jsx` directly under `client/src/pages/public/` and import `client/src/styles/RulesPage.css`.
  - Mount `ROUTES.RULES` as a top-level standalone full-bleed route alongside `ROUTES.HOME`, `ROUTES.LOGIN`, and `ROUTES.REGISTER` in `AppRoutes.jsx`, removing it from `PublicLayout`.
  - Implement independent multi-accordion toggle logic with `team` and `fair` open by default.
  - Enforce acknowledgment gating: the confirmation link remains disabled and prevents navigation until the agreement checkbox is checked.
  - Add responsive hamburger toggle button (`.rp-mobile-menu`) and navigation drawer (`.rp-mobile-drawer`) on viewports <= 900px.
  - Include responsive media queries (1200px, 900px, 600px, 360px, 330px) ensuring flawless rendering across 1440px down to 320px with zero horizontal scroll.
- **Consequences**: Delivers high-fidelity rule discovery, strict acknowledgment enforcement, full-bleed visual consistency with dark + electric-lime aesthetics, and guarantees zero side effects on `HomePage`, `LoginPage`, or `RegisterPage`.

---

## ADR-0014: Standalone Full-Bleed Mission & How It Works Page UI Integration
- **Status**: ACCEPTED
- **Context**: The Tech Mystery requires an immersive Mission Playbook and operational walkthrough page (`/mission` and `/mission#how-it-works`). The reference UI features its own self-contained top header (`.mp-nav`), multi-layered background (`campus-hero.png`, scanlines, grid overlay), orbital visual hero animation, 4 quick metrics cards, interactive 6-stage mission selector with cycling Next Step controls, 4 core pillars of play, and an expandable 10-level challenge map.
- **Decision**:
  - Integrate `MissionPage.jsx` directly under `client/src/pages/public/` and import `client/src/styles/MissionPage.css`.
  - Add `MISSION: '/mission'` to `client/src/constants/routes.js`.
  - Mount `ROUTES.MISSION` as a top-level standalone full-bleed route in `AppRoutes.jsx`, preserving custom overlays and avoiding header duplication.
  - Implement smooth hash scrolling (`useEffect` on `location.hash`) so deep links to `/mission#how-it-works` and `/mission#challenges` scroll smoothly into view.
  - Preserve interactive state: 6-stage playbook selection with looping Next Step button, and 5 vs 10 level expansion toggle.
  - Add responsive mobile hamburger menu button (`.mp-mobile-menu`) and backdrop drawer (`.mp-mobile-drawer`) for viewports <= 900px.
  - Update cross-page navigation links (`LoginPage.jsx`, `RegisterPage.jsx`, `RulesPage.jsx`) to point Mission to `/mission` and How It Works to `/mission#how-it-works`, while preserving Home Page's existing in-page anchors.
- **Consequences**: Delivers complete mission operational discovery, responsive fidelity from 320px to 1440px+, and zero regressions across existing routes.

---

## ADR-0015: Cross-Page Mission and How It Works Navigation Routing Fix
- **Status**: ACCEPTED
- **Context**: In the existing application, clicking "Mission" or "How It Works" from various pages (`HomePage`, `LoginPage`, `RegisterPage`, `RulesPage`, and shared `Navbar`) either resulted in in-page anchor jumps (`#mission`, `#how-it-works`) remaining on the home page, or did not open the dedicated Mission page (`/mission` and `/mission#how-it-works`). Furthermore, `Navbar.jsx` referenced `ABOUT` and an unstyled stub route `/how-it-works`.
- **Decision**:
  - Update all desktop navbars and mobile drawer links across `HomePage.jsx`, `LoginPage.jsx`, `RegisterPage.jsx`, `RulesPage.jsx`, and `Navbar.jsx`:
    - Point `MISSION` to React Router `<Link to={ROUTES.MISSION}>MISSION</Link>`.
    - Point `HOW IT WORKS` to React Router `<Link to="/mission#how-it-works">HOW IT WORKS</Link>`.
  - In `MissionPage.jsx`:
    - Implement robust hash scrolling in `useEffect` with multi-tier timeout retry (0ms, 60ms, 200ms) keyed to `[location.hash, location.pathname]`.
    - Support clicking `MISSION` while on the Mission page to smoothly scroll to the top (`window.scrollTo({ top: 0, behavior: "smooth" })`).
    - Support clicking `HOW IT WORKS` while on the Mission page to trigger direct smooth scrolling to `#how-it-works` without page reloading.
  - In `AppRoutes.jsx`:
    - Mount `ROUTES.MISSION` (`/mission`) as a standalone full-bleed route.
    - Redirect deprecated `ROUTES.HOW_IT_WORKS` (`/how-it-works`) to `/mission#how-it-works`.
    - Redirect `/mission-map` to `ROUTES.MISSION_MAP` (`/portal/missions`).
- **Consequences**:
  - Single-page application navigation is completely preserved without full browser reloads.
  - "Mission" consistently routes to `/mission` across all entry points.
  - "How It Works" consistently routes to `/mission#how-it-works` and auto-scrolls directly to the 6-stage operational walkthrough.
  - Zero side effects on `HomePage`, `LoginPage`, `RegisterPage`, or `RulesPage` styling.

---

## ADR-0016: Standalone Full-Bleed Challenge Levels & Mission Map UI Integration
- **Status**: ACCEPTED
- **Context**: The Tech Mystery requires a dedicated Challenge Levels / Mission Map discovery page (`/challenges`). The design includes its own full-bleed header (`.htg-levels-nav`), layered campus background overlay (`/campus-hero.png`), stats counter bar, an interactive 10-level Mission Map panel with accordion click-to-expand briefings, difficulty badges, and a 4-pillar benefits showcase with event quotation.
- **Decision**:
  - Integrate `ChallengeLevelsPage.jsx` directly under `client/src/pages/public/` and import `client/src/styles/ChallengeLevelsPage.css`.
  - Add `CHALLENGES: '/challenges'` to `client/src/constants/routes.js`.
  - Mount `ROUTES.CHALLENGES` as a standalone full-bleed route in `AppRoutes.jsx`, preserving custom overlays and avoiding layout duplication.
  - Retain the UI-only 10-challenge matrix with interactive click-to-expand state (`selectedLevel`), without exposing actual challenge flags, answers, or secrets in frontend code.
  - Reuse the existing `client/public/campus-hero.png` asset without adding new redundant image files.
  - Set `overflow-x: hidden` on root `.htg-levels-page` and `flex-wrap: wrap` on stats chips to guarantee zero horizontal overflow and smooth vertical scrolling across all viewports (320px to 1440px+).
  - Wire React Router `Link` navigation to `/mission`, `/mission#how-it-works`, `/challenges`, `/rules`, `/leaderboard`, `/login`, `/register`, and `/`.
- **Consequences**: Delivers high-fidelity challenge discovery, interactive level briefings, visual consistency with dark + electric-lime aesthetics, and zero side effects on existing routes.

---

## ADR-0017: Unified Cross-Page Challenge Levels Navigation & Dashboard Routing Integration
- **Status**: ACCEPTED
- **Context**: The Challenge Levels / Mission Map page (`/challenges`) required full cross-page discoverability across all public pages (`HomePage`, `MissionPage`, `RulesPage`, `LoginPage`, `RegisterPage`), the shared public `Navbar`, the participant HUD (`ParticipantLayout`), and the active operative cockpit (`TeamDashboardPage`). Additionally, direct traffic navigating to `/dashboard` needed clean alias mapping to the internal participant route `/portal/dashboard`.
- **Decision**:
  - Update `Navbar.jsx`: Add `{ label: 'CHALLENGES', path: ROUTES.CHALLENGES }` to `navLinks`.
  - Update `ParticipantLayout.jsx`: Add `{ label: 'CHALLENGES', path: ROUTES.CHALLENGES, icon: Target }` to the secondary tactical HUD navigation.
  - Update `TeamDashboardPage.jsx`: Add visible `CHALLENGE LEVELS` CyberButton in the header banner and direct link in the `MISSION DIRECTIVE` card.
  - Update public navigation bars across `HomePage.jsx`, `MissionPage.jsx`, `RulesPage.jsx`, `LoginPage.jsx`, and `RegisterPage.jsx` to route `CHALLENGES` directly to `ROUTES.CHALLENGES` via React Router `<Link>`.
  - Update `ChallengeLevelsPage.jsx`: Integrate `useAuth` hook for context-aware CTA buttons (`Dashboard` when authenticated, `Login` / `Register` when unauthenticated), and add hero action row.
  - In `AppRoutes.jsx`: Map `/dashboard` to `<Navigate to={ROUTES.DASHBOARD} replace />`.
- **Consequences**: Eliminates dead ends, connects all pages to `/challenges` via SPA `<Link>` navigation with zero page reloads, and prevents 404s on `/dashboard`.

---

## ADR-0018: Standalone Participant Dashboard UI Integration & Route Decoupling
- **Status**: ACCEPTED
- **Context**: The hackathon experience required integrating a dedicated, full-bleed standalone Participant Dashboard UI (`ParticipantDashboard.jsx` & `ParticipantDashboard.css`) featuring a custom dark + electric-lime theme, quick stat cards, interactive current challenge focus, a 10-level challenge progression overview, progress donut breakdown, Top 5 leaderboard preview, and activity feed. The codebase also contained an existing protected tactical squad cockpit (`TeamDashboardPage.jsx`) inside `ParticipantLayout` at `/portal/dashboard`.
- **Decision**:
  - Integrate `ParticipantDashboard.jsx` at `client/src/pages/participant/ParticipantDashboard.jsx` and styling at `client/src/styles/ParticipantDashboard.css`.
  - Update `client/src/constants/routes.js` to decouple `DASHBOARD: '/dashboard'` (standalone participant overview dashboard) and `PORTAL_DASHBOARD: '/portal/dashboard'` (tactical squad cockpit).
  - Mount `ROUTES.DASHBOARD` as a top-level Standalone Full-Bleed Page in `AppRoutes.jsx`, allowing its custom topbar (`.pd-topbar`), collapsable sidebar (`.pd-sidebar`), and layered campus background (`/campus-hero.png`) to render unconstrained without nested layout conflicts.
  - Retain `/portal/dashboard` and nested portal routes under `ParticipantLayout` for team creation, join codes, and live challenge submission cockpits.
  - In `ParticipantLayout.jsx`, update the internal navigation item to `ROUTES.PORTAL_DASHBOARD`.
  - Add fallback redirects in `AppRoutes.jsx` for `/team` -> `/portal/team`, `/profile` -> `/portal/team`, and `/resources` -> `/faq` to ensure all sidebar links navigate cleanly without 404s.
  - Connect `useAuth` hook in `ParticipantDashboard.jsx` to dynamically display operative team name and initials, while clearly flagging sample telemetry with a `[PREVIEW MODE // SAMPLE DATA]` badge to avoid misrepresenting mock metrics as live server state.
  - Set root `.pd-page` `overflow-x: hidden` with responsive drawer toggles for mobile viewports.
- **Consequences**: Provides participants with a high-fidelity overview dashboard, preserves live squad flows intact, avoids route conflicts, and ensures seamless responsive cross-page navigation.

---

## ADR-0019: Standalone QR Checkpoint Discovery UI Integration
- **Status**: ACCEPTED
- **Context**: The campus-wide physical scavenger component requires a dedicated public/participant checkpoint discovery page (`/qr-checkpoint`). The reference design (`Hack-The-Grid-QR-Checkpoint-UI-Full-Code.zip`) features a 3-column cyber layout: left campus intro & stats, center QR scanner viewfinder simulation with file upload and recent checkpoint status cards, and right "How It Works" 4-step walkthrough with event rules and Challenge Map CTA.
- **Decision**:
  - Integrate `QRCheckpointPage.jsx` at `client/src/pages/participant/QRCheckpointPage.jsx` and `QRCheckpointPage.css` at `client/src/styles/QRCheckpointPage.css`.
  - Add `QR_CHECKPOINT: '/qr-checkpoint'` to `client/src/constants/routes.js`.
  - Mount `ROUTES.QR_CHECKPOINT` as a top-level Standalone Full-Bleed Page in `AppRoutes.jsx`, allowing its custom navbar (`.htg-qr-navbar`) and layered background (`/campus-hero.png`) to render unconstrained.
  - Connect `QR CHECKPOINT` in `Navbar.jsx` (`navLinks`) so the link is available across all pages utilizing the shared navigation bar.
  - Set root `.htg-qr-page` to `overflow-x: hidden` instead of `overflow: hidden`, guaranteeing smooth vertical scrolling down to the rules and recent checkpoint panels while preventing mobile horizontal overflow.
  - Keep the upload control scoped to image preview with explicit user messaging (`"Image selected. QR decoding is not connected yet."`), without installing unvetted scanner dependencies or falsely claiming camera scanning is operative.
  - Explicitly label recent checkpoint cards as `(Sample Preview)` data, avoiding confusion with live server telemetry.
  - Wire all links to project registry routes: `ROUTES.HOME`, `ROUTES.MISSION`, `ROUTES.CHALLENGES`, `ROUTES.LEADERBOARD`, `ROUTES.DASHBOARD`, and `ROUTES.REGISTER`.
- **Consequences**: Delivers pixel-accurate checkpoint discovery and file preview UI, preserves existing authenticated portal scanner (`/portal/checkpoint`) intact, maintains monorepo build cleanliness (0 errors), and leaves clear architectural requirements for future QR decode integration.

---

## ADR-0020: Functional Live Camera QR Scanning & Backend Verification Integration
- **Status**: ACCEPTED
- **Context**: The QR Checkpoint experience required advancing from a static preview UI to functional live QR code detection. Operating in physical environments across campus requires camera access, rear-facing camera preference on mobile, frame-by-frame QR detection, and secure server-side verification without awarding points on the client.
- **Decision**:
  - Implement live camera QR scanning in `QRCheckpointPage.jsx` using the browser's native `BarcodeDetector` API (`formats: ["qr_code"]`) and `navigator.mediaDevices.getUserMedia` with `facingMode: { ideal: "environment" }`.
  - Provide graceful degradation: when `BarcodeDetector` is unsupported (e.g. non-Chromium browsers), surface a clear fallback message while keeping image preview active.
  - Implement strict stream management: camera tracks are stopped and animation frames are canceled immediately upon QR detection, when the user clicks "Stop Camera", or when the component unmounts.
  - Integrate server verification: parse scanned URLs (`/checkpoint/scan?code=...&token=...`), JSON payloads, or raw codes and connect authenticated participants to `checkpointService.scanCheckpoint(code, token)`.
  - Display detection results with clear unverified labeling; require authenticated server response before confirming level unlock.
  - Provide an inline "Verify with Server" trigger for authenticated users and a "Login to Verify" redirect for unauthenticated guests.
- **Consequences**: Enables zero-dependency live camera QR decoding on Chromium browsers, eliminates client-side trust vectors, prevents camera resource leaks, and seamlessly bridges the physical checkpoint scanning flow with the backend scoring engine.

---

## ADR-0021: Universal Cross-Browser QR Scanner Integration via html5-qrcode
- **Status**: ACCEPTED
- **Context**: The initial live camera implementation relied on the browser-native `BarcodeDetector` API. While efficient on recent Chromium builds, `BarcodeDetector` is unsupported in Firefox, older Safari/iOS versions, and several mobile WebViews, resulting in a blocking error ("Live QR decoding via BarcodeDetector is not supported by this browser"). The hackathon requires cross-platform compatibility across all mobile and desktop browsers used by participants.
- **Decision**:
  - Install `html5-qrcode` in the `client` workspace.
  - Refactor `QRCheckpointPage.jsx` to replace `BarcodeDetector` with `Html5Qrcode`.
  - Maintain a single scanner instance reference (`scannerRef`) with unmount and React Strict Mode cleanup routines to prevent memory leaks and duplicate media streams.
  - Auto-enumerate video input devices using `Html5Qrcode.getCameras()` and prioritize rear/environment cameras (`facingMode: "environment"`) while offering camera selection when multiple lenses are detected.
  - Guard scan callbacks with `hasScannedRef` to guarantee idempotency and prevent multiple triggers per frame.
  - Extend image file upload handling to attempt automated QR decoding via `Html5Qrcode.scanFile()` alongside image preview.
  - Connect verified QR payloads to `checkpointService.scanCheckpoint(code, token)` while maintaining unverified client-side labeling.
- **Consequences**: Resolves the "BarcodeDetector is not supported" blocker across all browsers (Chrome, Firefox, Safari, Edge, mobile browsers), preserves the electric-lime cyber UI, guarantees clean camera lifecycle teardown, and maintains build integrity (0 compilation errors).

---

## ADR-0022: Standalone Full-Bleed Leaderboard UI Integration (`/leaderboard`)
- **Status**: ACCEPTED
- **Context**: The competition requires an immersive, high-impact public and participant Leaderboard page (`/leaderboard`). The reference design (`Hack-The-Grid-Leaderboard-UI-Full-Code.zip`) provides a standalone cyber layout featuring an integrated top navbar (`.htg-lb-navbar`), layered campus hero backdrop (`/campus-hero.png`), top-3 podium highlight cards (`.htg-lb-podium`), full live standings table with real-time search, filter tabs (All Teams, Top 5, My Team), sort dropdown (Rank, Points, Solved), personal squad ranking snippet, and event quote.
- **Decision**:
  - Integrate `LeaderboardPage.jsx` at `client/src/pages/public/LeaderboardPage.jsx` and `LeaderboardPage.css` at `client/src/styles/LeaderboardPage.css`.
  - Mount `ROUTES.LEADERBOARD` (`/leaderboard`) under Standalone Full-Bleed Pages in `AppRoutes.jsx`, removing the former nested placeholder inside `PublicLayout` to prevent duplicate navigation bars and footers.
  - Implement the desktop 3-column composition matching the original reference:
    - **Left Hero (~28%)**: `TOP TEAMS RISE TO THE GRID`, white heading with `THE GRID` in electric lime, accent bar, supporting telemetry paragraph, participant / challenge / champion stats, and motivational quotation on dark overlay.
    - **Center Column (~47%)**: Compact top podium with 3 ranked teams (silver runner-up left, taller gold champion center with subtle lime glow, bronze 3rd place right) with emblems, ranks, points, and solve progress; followed immediately by the full standings panel with live search, All Teams / Top 5 / My Team filters, sort dropdown, and highlighted current-team row (`#04 ByteForce`).
    - **Right Sidebar (~25%)**: Your Squad status card with rank badge, solve progress, and dashboard link; Leaderboard Stats card (Total Teams, Challenges, Participants, Highest Points); and Recent Activity feed with live marker and View All toggle.
  - Set root `.htg-lb-page` to `overflow-x: hidden` preventing mobile horizontal clipping while guaranteeing smooth vertical scrolling.
  - Connect all action and navigation links to canonical routes (`ROUTES.HOME`, `ROUTES.MISSION`, `ROUTES.CHALLENGES`, `ROUTES.QR_CHECKPOINT`, `ROUTES.RULES`, `ROUTES.LEADERBOARD`, `ROUTES.DASHBOARD`, `ROUTES.REGISTER`) with zero `href="#"` or broken hash references.
- **Consequences**: Matches original reference layout and dashboard proportions, provides verified headless Chrome visual rendering, maintains clean build integrity (0 errors), and leaves live backend WebSocket/REST score streaming ready for future phase hookup.

---

## ADR-0023: Final Flag / Victory UI Integration (`/final-flag`)
- **Status**: ACCEPTED
- **Context**: The climax of the The Tech Mystery competition requires an authenticated Final Flag / Victory UI for Level 10 (Master Flag). The reference design (`Hack-The-Grid-Final-Flag-Victory-UI.zip`) provides a cyber endgame aesthetic featuring "SYSTEM BREACHED." typography, master flag radar targeting art, secure flag submission form with HTG input prefix, pre-submission checklist drawer, Victory Protocol sidebar, and an animated "MISSION ACCOMPLISHED" victory state.
- **Decision**:
  - Integrate `FinalFlagPage.jsx` at `client/src/pages/participant/FinalFlagPage.jsx` and `FinalFlagPage.css` at `client/src/styles/FinalFlagPage.css`.
  - Add `FINAL_FLAG: '/final-flag'` to `client/src/constants/routes.js` and mount it under Standalone Full-Bleed Pages in `AppRoutes.jsx`, with portal redirects for `/portal/master-flag` and `/portal/final-flag`.
  - Connect flag verification directly to the existing authenticated backend API `challengeService.submitFlag(10, flag)` (`POST /api/v1/submissions/submit`).
  - Gated victory state: Display "MISSION ACCOMPLISHED" strictly after server confirmation of flag validity (`res.data.isCorrect === true`), or if `team.currentLevel > 10` confirms prior solve.
  - Progression protection: Query `teamService.getMyTeam()` to detect current progression level. If `team.currentLevel < 10`, informatively block submission and guide the squad to conquer preceding levels first.
  - Set root `.final-flag-page` to `overflow-x: hidden` allowing smooth vertical scrolling through all viewports down to the footer.
  - Link from participant surfaces: Add "Final Flag" item to `ParticipantDashboard.jsx` sidebar, wire Level 10 card in the dashboard level grid, add direct action button on Level 10 in `ChallengeLevelsPage.jsx`, and map `MASTER FLAG` in `ParticipantLayout.jsx`.
- **Consequences**: Guarantees zero frontend flag leaks or simulated wins, prevents duplicate points through backend atomic solve transactions, enforces strict sequential level progression, and delivers a visually compelling victory experience with 0 compilation errors.

---

## ADR-0024: Reference-Matched Admin Team Management UI & Shared Mission Control Sidebar (`/admin/teams`)
- **Status**: ACCEPTED
- **Context**: The Admin Command SOC required replacing the placeholder Tailwind `TeamManagementPage.jsx` with the reference-matched The Tech Mystery Team Management UI (`Hack-The-Grid-Team-Management-UI-Reference-Match.zip`), featuring the Mission Control sidebar, 5 KPI summary cards, filter/search toolbar, Table/Grid view switcher, pagination, and a right-hand selected-team inspection panel with live backend synchronization where endpoints exist.
- **Decision**:
  - Extract the Mission Control sidebar into a reusable [`AdminSidebar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/AdminSidebar.jsx) component that uses `useLocation()` to automatically highlight the active admin route (`Overview`, `Teams`, `Challenges`, `Questions`, `QR Checkpoints`, `Submissions`, `Leaderboard`, `Event Control`, `Security Logs`), displays dynamic badge counts, and provides a mobile slide-over drawer.
  - Mount `ROUTES.ADMIN_TEAMS` (`/admin/teams`) as a standalone full-bleed route in `AppRoutes.jsx` alongside `/admin/dashboard` so `TeamManagementPage` renders its own `.htg-team-page` shell without duplicate sidebars or headers from `AdminLayout.jsx`.
  - Connect [`TeamManagementPage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/admin/TeamManagementPage.jsx) to `GET /api/v1/admin/teams` and `PATCH /api/v1/admin/teams/:teamId/disqualify` via [`admin.service.js`](file:///c:/projects/Hack-The-Grid/client/src/services/admin.service.js), enhancing [`admin.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/admin.controller.js) to populate `leaderId` and `members` (`username email fullName role collegeRollNo isActive`) and to validate ObjectId parameters when disqualifying or restoring teams.
  - Explicitly distinguish live database data (`● LIVE DATABASE`) from demo fallback data (`● DEMO PREVIEW DATA`) when unauthenticated or when the backend is offline, and surface clear informational notices for UI actions whose backend endpoints are not yet implemented (`Add Team`, `Edit Team`, `Add Member`).
- **Consequences**: Delivers a pixel-accurate match to the Mission Control Team Management reference across desktop, tablet, and mobile viewports, enables real-time server-validated team disqualification/restoration for authenticated admins, and preserves strict separation between live production records and demo preview state.

---

## ADR-0025: Reference-Matched Admin Challenge Management UI & Backend Integration (`/admin/challenges`)
- **Status**: ACCEPTED
- **Context**: The Admin Command SOC required integrating the reference-matched The Tech Mystery Challenge Management UI (`Hack-The-Grid-Challenge-Management-UI.zip`) at `/admin/challenges`, supporting challenge statistics, search/status/difficulty/category filtering, List/Grid view switching, Add/Edit Challenge modal configuration, publish/pause toggling, and inspection of linked questions and QR checkpoints without exposing flags or unpublished challenges to participants.
- **Decision**:
  - Create [`ChallengeManagementPage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/admin/ChallengeManagementPage.jsx) and [`ChallengeManagementPage.css`](file:///c:/projects/Hack-The-Grid/client/src/styles/ChallengeManagementPage.css), reusing the shared [`AdminSidebar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/AdminSidebar.jsx) so `Challenges` is highlighted automatically on `/admin/challenges`.
  - Mount `ROUTES.ADMIN_CHALLENGES` (`/admin/challenges`) as a standalone full-bleed route in [`AppRoutes.jsx`](file:///c:/projects/Hack-The-Grid/client/src/routes/AppRoutes.jsx) (avoiding duplicate sidebars/headers from `AdminLayout.jsx`), while keeping `/admin/questions` routed to `ChallengePoolPage.jsx` for question pool authoring.
  - Extend [`Challenge.js`](file:///c:/projects/Hack-The-Grid/server/src/models/Challenge.js) and [`challengeTypes.js`](file:///c:/projects/Hack-The-Grid/server/src/constants/challengeTypes.js) with backward-compatible fields (`subtitle`, `status`, `objectives`, `image`, and UI category tags) synchronized with `isActive: status === 'Published'` so participant endpoints (`Challenge.find({ isActive: true })`) never expose `Draft` or `Paused` challenges.
  - Add `GET /api/v1/admin/challenges`, `PATCH /api/v1/admin/challenges/:challengeId`, and `GET /api/v1/admin/questions` (with `.select('-flag')`) in [`admin.routes.js`](file:///c:/projects/Hack-The-Grid/server/src/routes/admin.routes.js) and [`admin.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/admin.controller.js), enriching each challenge with `questionCount`, `linkedQuestions` (without secret flags), and `linkedCheckpoints`.
  - Clearly distinguish live database state (`● LIVE DATABASE`) from demo preview fallback (`● DEMO PREVIEW DATA`) when unauthenticated or when the backend is offline, and label the `challenge-materials.zip` attachment card as a non-uploaded demo placeholder until binary storage is configured.
- **Consequences**: Provides full end-to-end admin challenge lifecycle management (`Create`, `Edit`, `Publish`, `Pause`, `Filter`, `Export CSV`, and `Questions`/`QR Checkpoints` inspection) while preserving sequential level progression and zero-trust server-side flag storage.

---

## ADR-0026: Reference-Matched Admin Question Management UI & Backend Integration (`/admin/questions`)
- **Status**: ACCEPTED
- **Context**: The Admin Command SOC required integrating the reference-matched The Tech Mystery Question Management UI (`Hack-The-Grid-Question-Management-UI.zip`) at `/admin/questions`, supporting question statistics (total, published, drafts, paused, available points), search across titles/IDs/challenges/prompts, status/type/level filtering, Table/Grid view toggling, Add/Edit Question modal, hint & max attempts configuration, pause/publish controls, CSV export, and an admin-only secret answer preview with an explicit "Reveal" toggle while ensuring secret flags are never exposed to participants.
- **Decision**:
  - Implement [`QuestionManagementPage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/admin/QuestionManagementPage.jsx) and [`QuestionManagementPage.css`](file:///c:/projects/Hack-The-Grid/client/src/styles/QuestionManagementPage.css), reusing the shared [`AdminSidebar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/AdminSidebar.jsx) with `Questions` (`☰`) highlighted as active on `/admin/questions`.
  - Mount `ROUTES.ADMIN_QUESTIONS` (`/admin/questions`) as a standalone full-bleed route in [`AppRoutes.jsx`](file:///c:/projects/Hack-The-Grid/client/src/routes/AppRoutes.jsx) (preventing duplicate sidebars/headers from `AdminLayout.jsx`).
  - Extend [`Question.js`](file:///c:/projects/Hack-The-Grid/server/src/models/Question.js) and [`challengeTypes.js`](file:///c:/projects/Hack-The-Grid/server/src/constants/challengeTypes.js) with `type` (`Text Answer`, `Flag`, `Multiple Choice`, `File Upload`), `points`, `status` (`Published`, `Draft`, `Paused`), `attempts`, `required`, and category constants, maintaining `isActive: status === 'Published'` synchronization and `flag: { select: false }`.
  - Add `PATCH /api/v1/admin/questions/:questionId` and enhance `GET /api/v1/admin/questions` and `POST /api/v1/admin/questions` in [`admin.routes.js`](file:///c:/projects/Hack-The-Grid/server/src/routes/admin.routes.js) and [`admin.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/admin.controller.js). Support `.select('+flag')` only for authorized admins via `includeFlag=true`, while strictly preserving `.select('-flag')` for participant-facing APIs (`/mission-map`, `/current`, `/checkpoints/scan`).
  - Distinguish live database state (`● LIVE DATABASE`) from demo preview fallback (`● DEMO PREVIEW DATA`) with clear UI badges and dismissible banners when unauthenticated or when the backend is offline.
- **Consequences**: Enables full admin question authoring and pool configuration with zero chance of flag leakage to participants, complete visual fidelity with the Mission Control design system, and full responsiveness across desktop, tablet, and mobile devices.

---

## ADR-0027: Reference-Matched Admin QR Checkpoint Management UI & Real QR Placard Generation (`/admin/checkpoints`)
- **Status**: ACCEPTED
- **Context**: The Admin Command SOC required integrating the reference-matched The Tech Mystery QR Checkpoint Management UI (`Hack-The-Grid-QR-Checkpoint-Management-UI.zip`) at `/admin/checkpoints`, supporting checkpoint statistics (total checkpoints, active, drafts, paused, total scans), search across checkpoints/codes/challenges/locations, status/mode filtering, Table/Grid view toggling, Add/Edit Checkpoint modal, physical location and volunteer notes configuration, pause/activate toggles, CSV export, and an inspection panel. A critical requirement was replacing decorative SVG placeholders with genuine scannable QR code generation using `qrcode`, encoding server-validated checkpoint URLs (`/checkpoint/scan?code=...&token=...`), supporting high-resolution printable placard downloads, and enforcing strict server-side authorization so physical QR scans only initiate eligibility checks rather than client-side awards.
- **Decision**:
  - Implement [`QRCheckpointManagementPage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/admin/QRCheckpointManagementPage.jsx) and [`QRCheckpointManagementPage.css`](file:///c:/projects/Hack-The-Grid/client/src/styles/QRCheckpointManagementPage.css), reusing the shared [`AdminSidebar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/AdminSidebar.jsx) with `QR Checkpoints` (`▦`) highlighted as active on `/admin/checkpoints`.
  - Install `qrcode` in the `client` workspace to generate authentic, scannable PNG data URLs rendered in both thumbnail and full inspector views via `ScannableQrImage`.
  - Implement a high-resolution printable placard generator (`downloadPlacard`) producing a canvas with official HTG branding, checkpoint code, station name, instructions, and scannable QR code.
  - Mount `ROUTES.ADMIN_CHECKPOINTS` (`/admin/checkpoints`) as a standalone full-bleed route in [`AppRoutes.jsx`](file:///c:/projects/Hack-The-Grid/client/src/routes/AppRoutes.jsx), preventing duplicate sidebars/headers from `AdminLayout.jsx`.
  - Extend [`Checkpoint.js`](file:///c:/projects/Hack-The-Grid/server/src/models/Checkpoint.js) with `status` (`Active`, `Paused`, `Draft`), `mode` (`Public QR`, `Team-bound QR`), and `lastScanAt` (`Date`), maintaining synchronization with `isActive`.
  - Add `PATCH /api/v1/admin/checkpoints/:checkpointId` and enhance `GET /api/v1/admin/checkpoints` and `POST /api/v1/admin/checkpoints` in [`admin.routes.js`](file:///c:/projects/Hack-The-Grid/server/src/routes/admin.routes.js) and [`admin.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/admin.controller.js). Checkpoints are enriched with `teamsCount`, server-generated HMAC token, and canonical `sampleQrUrl`.
  - Distinguish live database state (`● LIVE DATABASE`) from demo preview fallback (`● DEMO PREVIEW DATA`) with clear UI badges and dismissible banners when unauthenticated or offline.
- **Consequences**: Provides full checkpoint lifecycle management, authentic physical QR code generation for competition deployment, printable placards for campus stations, zero-trust server validation flow, and complete responsive fidelity across desktop, tablet, and mobile devices.

---

## ADR-0028: Reference-Matched Admin Submission Management UI & Secure Review Actions (`/admin/submissions`)
- **Status**: ACCEPTED
- **Context**: The Admin Command SOC required integrating the reference-matched The Tech Mystery Submission Management UI (`SubmissionManagementPage.jsx` and `SubmissionManagementPage.css`) at `/admin/submissions`, supporting submission statistics (total submissions, correct, incorrect, pending review, points awarded), multi-criteria filtering (result, level, team), text search, Table/Grid view toggling, CSV export, a pending review queue shortcut, and a detailed inspector panel with answer mask/reveal and manual review controls (awarded points and review note). A critical requirement was implementing secure review actions on the server (`PATCH /api/v1/admin/submissions/:submissionId/review`) that enforce administrator authorization, prevent duplicate scoring, validate points against the question's maximum allowed points, atomically update team scores and score snapshot history, and maintain complete audit traceability.
- **Decision**:
  - Implement [`SubmissionManagementPage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/admin/SubmissionManagementPage.jsx) and [`SubmissionManagementPage.css`](file:///c:/projects/Hack-The-Grid/client/src/styles/SubmissionManagementPage.css), reusing the shared [`AdminSidebar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/AdminSidebar.jsx) with `Submissions` (`⇧`) highlighted as active on `/admin/submissions` and showing the real-time pending submissions badge count.
  - Mount `ROUTES.ADMIN_SUBMISSIONS` (`/admin/submissions`) as a standalone full-bleed route in [`AppRoutes.jsx`](file:///c:/projects/Hack-The-Grid/client/src/routes/AppRoutes.jsx), avoiding duplicate sidebars or headers from `AdminLayout.jsx`.
  - Extend [`Submission.js`](file:///c:/projects/Hack-The-Grid/server/src/models/Submission.js) schema with review tracking fields (`reviewed`, `reviewedBy`, `reviewedAt`, `reviewNote`, and `updatedAt: true`) and add `PENDING_REVIEW` to [`submissionStatus.js`](file:///c:/projects/Hack-The-Grid/server/src/constants/submissionStatus.js).
  - Enhance `GET /api/v1/admin/submissions` in [`admin.routes.js`](file:///c:/projects/Hack-The-Grid/server/src/routes/admin.routes.js) and [`admin.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/admin.controller.js) to populate team, challenge, question, user, and reviewer data, support query filters (result, level, team, search), and return global summary statistics for dashboard KPI cards.
  - Implement `PATCH /api/v1/admin/submissions/:submissionId/review` in [`admin.routes.js`](file:///c:/projects/Hack-The-Grid/server/src/routes/admin.routes.js) and [`admin.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/admin.controller.js), enforcing server-side admin validation, points bounding against `question.points`, duplicate award prevention, atomic `TeamChallenge`, `Team.totalScore`, and `Score.currentScore` updates, and structured logging.
  - Add `reviewSubmission` to [`admin.service.js`](file:///c:/projects/Hack-The-Grid/client/src/services/admin.service.js).
  - Clearly distinguish live database state (`● LIVE DATABASE`) from demo preview fallback (`● DEMO PREVIEW DATA`) with badges and banners when unauthenticated or offline.
---

## ADR-0029: Reference-Matched Admin Leaderboard Management UI, Deterministic Server-Side Ranking & Public Freeze Controls (`/admin/leaderboard`)
- **Status**: ACCEPTED
- **Context**: The Admin Command SOC required integrating the reference-matched The Tech Mystery Leaderboard Management UI (`LeaderboardManagementPage.jsx` and `LeaderboardManagementPage.css`) at `/admin/leaderboard`, providing ranking statistics (total points, challenges solved, recently active teams), live vs demo mode awareness, public visibility toggle synchronized with `EventConfig.isLeaderboardFrozen`, configurable auto-refresh polling (15s interval), search across teams and codes, level filtering (All Levels, 1..10), sort ordering (Highest score, Challenges solved, Highest level), Table/Grid view toggling, CSV export, and a team performance detail panel with medals (gold, silver, bronze crowns), level progress, and security notes on ranking integrity. Critical requirements were:
  1. Enforcing ranking integrity: official rankings must derive strictly from server-verified data using deterministic tie-breaking (`totalScore DESC, lastSolveTimestamp ASC`), with client-side demo score manipulation strictly disabled in live database mode.
  2. Synchronizing the public visibility toggle with backend event settings (`PATCH /api/v1/admin/event-config`).
  3. Reusing the shared `AdminSidebar` with `Leaderboard` (`♜`) highlighted as active without duplicate headers or sidebars.
  4. Preserving the public participant leaderboard (`/leaderboard`) and ensuring both admin and public views reflect identical ranking logic.
- **Decision**:
  - Implement [`LeaderboardManagementPage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/admin/LeaderboardManagementPage.jsx) and [`LeaderboardManagementPage.css`](file:///c:/projects/Hack-The-Grid/client/src/styles/LeaderboardManagementPage.css), reusing the shared [`AdminSidebar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/AdminSidebar.jsx) with `Leaderboard` (`♜`) highlighted as active on `/admin/leaderboard`.
  - Mount `ROUTES.ADMIN_LEADERBOARD` (`/admin/leaderboard`) as a standalone full-bleed route in [`AppRoutes.jsx`](file:///c:/projects/Hack-The-Grid/client/src/routes/AppRoutes.jsx) (preventing duplicate sidebars/headers from `AdminLayout.jsx`).
  - Connect live data fetching to [`adminService.getAllTeams()`](file:///c:/projects/Hack-The-Grid/client/src/services/admin.service.js), `adminService.getDashboardStats()`, and [`leaderboardService.getLeaderboard()`](file:///c:/projects/Hack-The-Grid/client/src/services/leaderboard.service.js), implementing deterministic tie-breaking: `(b.score - a.score) || ((a.lastSolveTimestamp || 0) - (b.lastSolveTimestamp || 0))` which directly mirrors [`LeaderboardController.getLiveLeaderboard`](file:///c:/projects/Hack-The-Grid/server/src/controllers/leaderboard.controller.js).
  - Synchronize the public visibility switch directly with `adminService.updateEventConfig({ isLeaderboardFrozen: nextFrozen, frozenAt: nextFrozen ? new Date() : null })`, mapping `isLeaderboardFrozen: false` to `Public` and `true` to `Hidden`.
  - Strictly disable the client-side demo rank adjustment action (`↑ Demo Move Up`) in live database mode to preserve ranking integrity, with clear UI tooltips and status alerts explaining that official ranks derive strictly from server-verified submissions.
  - Implement 15-second background polling for live score updates when auto-refresh is toggled on, and provide a manual refresh trigger.
  - Enable table and grid views, search by team name or join code, level filtering (1-10), medals for top 3 teams, detail inspection pane with challenge and level progress bars, and RFC 4180 compliant CSV export.
  - Connect "View Team Profile ↗" in the detail panel to navigate directly to `/admin/teams?search=...`.
- **Consequences**: Equips competition organizers with an audit-ready, real-time leaderboard control console, guarantees zero client-side score forgery or conflicting ranks with the participant-facing leaderboard, enforces deterministic tie-breaking, synchronizes freeze state across the entire event lifecycle, and delivers full responsive fidelity across desktop, tablet, and mobile devices.

---

## ADR-0030: Reference-Matched Admin Event Control Console, Operational Switches & Announcement Broadcasting (`/admin/event-control`)
- **Status**: ACCEPTED
- **Context**: The Admin Command SOC required integrating the reference-matched The Tech Mystery Event Control UI (`EventControlPage.jsx` and `EventControlPage.css`) at `/admin/event-control` (and legacy alias `/admin/controls`), supporting event state oversight (radar HUD, live status badge, metrics), operational control switches (registration, QR checkpoint validation, public leaderboard freeze, hints system, maintenance mode), event configuration parameters (event name, subtitle, start/end dates, duration, maximum teams, team size constraints), system health checks, live activity feed, and participant announcement broadcasting with preview. Critical requirements were:
  1. Reusing the shared `AdminSidebar` with `EventControl` (`◉`) highlighted as active without duplicate headers or sidebars.
  2. Connecting all operational switches and configuration fields to authenticated backend endpoints (`PATCH /api/v1/admin/event-config`), validating inputs server-side, and logging sensitive transitions in audit logs.
  3. Guaranteeing maintenance mode halts participant actions without restricting authorized administrators from accessing the admin panel.
  4. Wiring announcement broadcasting to a secure endpoint (`POST /api/v1/admin/announcements`) with history auditing, without claiming unverified client-side delivery.
  5. Sourcing overview KPI cards (`Registered teams`, `Active participants`, `Checkpoints cleared`, `Submissions today`) and activity items from live backend data (`adminService.getDashboardStats()`), falling back gracefully to reference preview values.
- **Decision**:
  - Implement [`EventControlPage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/admin/EventControlPage.jsx) and [`EventControlPage.css`](file:///c:/projects/Hack-The-Grid/client/src/styles/EventControlPage.css), reusing the shared [`AdminSidebar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/AdminSidebar.jsx) with `Event Control` (`◉`) highlighted as active on both `/admin/event-control` and `/admin/controls`.
  - Mount `ROUTES.ADMIN_EVENT_CONTROL` (`/admin/event-control`) as a standalone full-bleed route in [`AppRoutes.jsx`](file:///c:/projects/Hack-The-Grid/client/src/routes/AppRoutes.jsx) and redirect `ROUTES.ADMIN_CONTROLS` (`/admin/controls`) to `/admin/event-control`.
  - Extend [`EventConfig.js`](file:///c:/projects/Hack-The-Grid/server/src/models/EventConfig.js) with `subtitle`, `duration`, `maxTeams`, `registrationOpen`, `qrCheckpoints`, `hintsEnabled`, `maintenanceMode`, `announcementsEnabled`, and `location`.
  - Enhance `updateEventConfig` in [`admin.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/admin.controller.js) to validate parameters (`duration > 0`, `maxTeams > 0`, `minTeamSize 1..4`, `maxTeamSize 1..4`, `minTeamSize <= maxTeamSize`) and write audit log entries (`logger.warn`/`logger.info`) for state, freeze, and maintenance mode transitions.
  - Implement `createAnnouncement` at `POST /api/v1/admin/announcements`, validating content, appending to `EventConfig.announcements` history (capped at 50), and writing structured audit logs.
  - Enhance `getDashboardStats` to compute `totalScans` across checkpoints and retrieve the latest live submission records for the activity feed.
  - Ensure administrative access to `/api/v1/admin/*` is governed strictly by `authenticate` and `requireAdmin`, guaranteeing maintenance mode never locks out organizers.
  - Implement dynamic status badges: switching `maintenanceMode` instantly reflects a glowing amber `PAUSED` radar status and header pill.
  - Add announcement preview container with explicit "PREVIEW ONLY" badge so operators review broadcasts before publishing.
- **Consequences**: Delivers a resilient Mission Control console for live competition orchestration, provides end-to-end audit logging for critical administrative actions, guarantees uninterrupted admin access during maintenance windows, and upholds strict responsive visual standards across all devices.

---

## ADR-0031: Reference-Matched Admin Security Logs Console, Audit Stream & Review Actions (`/admin/security-logs`)
- **Status**: ACCEPTED
- **Context**: The Admin Command SOC required integrating the reference-matched The Tech Mystery Security Logs UI (`SecurityLogsPage.jsx` and `SecurityLogsPage.css`) at `/admin/security-logs` (and legacy alias `/admin/logs`), providing security operations oversight, event stream inspection, multi-criteria filtering (severity, category, status, time window), text search with `Ctrl+K` keyboard shortcut, critical event review shortcut, telemetry metric cards (critical events, warnings, informational, flagged records), live database vs demo preview awareness, 15-second background auto-refresh polling, RFC 4180 CSV export, detail inspector panel with key-value metadata and copy JSON action, and server-authorized review actions ("Mark as reviewed ✓"). Critical requirements were:
  1. Reusing the shared `AdminSidebar` with `Security Logs` (`⛨`) highlighted as active without duplicate headers or sidebars.
  2. Introducing an append-only `SecurityLog` schema on the server (`server/src/models/SecurityLog.js`) and admin REST endpoints (`GET /api/v1/admin/security-logs`, `PATCH /api/v1/admin/security-logs/:logId/review`).
  3. Guaranteeing complete audit integrity: audit records track actor, IP source, target route, category, severity, and event details.
  4. Sourcing telemetry counts dynamically and updating record status on live review with structured audit logging (`logger.security`).
- **Decision**:
  - Implement [`SecurityLogsPage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/admin/SecurityLogsPage.jsx) and [`SecurityLogsPage.css`](file:///c:/projects/Hack-The-Grid/client/src/styles/SecurityLogsPage.css), reusing the shared [`AdminSidebar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/AdminSidebar.jsx) with `Security Logs` (`⛨`) highlighted as active on `/admin/security-logs` and `/admin/logs`.
  - Mount `ROUTES.ADMIN_SECURITY_LOGS` (`/admin/security-logs`) as a standalone full-bleed route in [`AppRoutes.jsx`](file:///c:/projects/Hack-The-Grid/client/src/routes/AppRoutes.jsx) and redirect `/admin/logs` to `/admin/security-logs`.
  - Create [`SecurityLog.js`](file:///c:/projects/Hack-The-Grid/server/src/models/SecurityLog.js) Mongoose model with fields for `eventId`, `severity`, `category`, `event`, `actor`, `target`, `source`, `detail`, `status`, `reviewedBy`, `reviewedAt`, and compound indices for chronological timeline queries.
  - Implement `getSecurityLogs` and `reviewSecurityLog` in [`admin.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/admin.controller.js) and mount them in [`admin.routes.js`](file:///c:/projects/Hack-The-Grid/server/src/routes/admin.routes.js) guarded by `authenticate` and `requireAdmin`.
  - Add `getSecurityLogs` and `reviewSecurityLog` methods to [`admin.service.js`](file:///c:/projects/Hack-The-Grid/client/src/services/admin.service.js).
  - Clearly distinguish live database state (`● LIVE DATABASE`) from demo preview fallback (`● DEMO PREVIEW DATA`) with badges and interactive fallback handling.
- **Consequences**: Equips competition organizers with an audit-ready, real-time Security Operations Center (SOC) telemetry feed, provides one-click incident review and CSV export capabilities, guarantees zero tampering with append-only security trails, and maintains visual and functional parity across all 12 responsive breakpoints.

---

## ADR-0032: Participant User Profile Console, Identity Management & Account Security (`/profile` & `/portal/profile`)
- **Status**: ACCEPTED
- **Context**: The participant experience required integrating the reference The Tech Mystery User Profile page (`UserProfilePage.jsx` and `UserProfilePage.css`) at `/profile` (and `/portal/profile`), providing individual player identity inspection, player card hero presentation with radial radar grid, live/preview data status badge (`● LIVE DATABASE` vs `● DEMO PREVIEW`), stat grid (Total XP, Challenges solved, Checkpoints explored, Team contribution), tabbed workspace (`Overview`, `Achievements`, `Settings`), player identity card, badges preview, and account security controls. Critical constraints were:
  1. Reusing the dedicated participant cyber navbar (`.htg-up-navbar`) with React Router navigation (`Link` to `/`, `/challenges`, `/leaderboard`, `/rules`, `/portal/team`, `/profile`), mobile drawer toggle, and user avatar dropdown with sign-out.
  2. Resolving the previous route redirect where `/profile` previously redirected to `/portal/team`.
  3. Extending the backend `User` schema (`server/src/models/User.js`) with identity and preference fields (`college`, `course`, `year`, `bio`, `github`, `linkedin`, `publicProfile`, `emailUpdates`, `avatar`).
  4. Implementing authenticated API endpoints (`GET /api/v1/auth/profile`, `PATCH /api/v1/auth/profile`, `POST /api/v1/auth/avatar`, `POST /api/v1/auth/change-password`) guarded by `authenticate`.
  5. Strictly enforcing read-only boundaries: participants can update their personal details and privacy preferences, but official score, current level, leaderboard rank, team membership, role, and verification status are strictly calculated server-side and immutable via client profile payloads.
  6. Secure account management: changing password requires `currentPassword` verification against bcrypt hash, validates `newPassword` length (min 6 characters), never returns or leaks hashes/tokens, and records security audit logs.
- **Decision**:
  - Implement [`UserProfilePage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/participant/UserProfilePage.jsx) and [`UserProfilePage.css`](file:///c:/projects/Hack-The-Grid/client/src/styles/UserProfilePage.css), matching the dark charcoal (`#0a0c0b` / `#111412`) and electric-lime (`#b8ff3d`) cybersecurity theme.
  - Mount `ROUTES.PROFILE` (`/profile`) as a standalone full-bleed route and `/portal/profile` in [`AppRoutes.jsx`](file:///c:/projects/Hack-The-Grid/client/src/routes/AppRoutes.jsx), eliminating the previous redirect.
  - Extend [`User.js`](file:///c:/projects/Hack-The-Grid/server/src/models/User.js) schema and implement `getProfile`, `updateProfile`, `updateAvatar`, and `changePassword` in [`auth.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/auth.controller.js) and [`auth.routes.js`](file:///c:/projects/Hack-The-Grid/server/src/routes/auth.routes.js).
  - Add API client bindings in [`auth.service.js`](file:///c:/projects/Hack-The-Grid/client/src/services/auth.service.js).
  - Integrate modal password change flow with client validation, progress state, and backdrop dismissal.
  - Distinguish live database state (`● LIVE DATABASE`) from offline demo preview (`● DEMO PREVIEW`) with responsive pill badges and fallback handling.
- **Consequences**: Delivers a complete, secure participant identity hub that respects event score integrity, provides seamless mobile navigation, and enables participants to manage preferences and credentials without exposing sensitive security data.

---

## ADR-0033: Reference-Matched Admin Profile Console & Security Operations Identity Management (`/admin/profile`)
- **Status**: ACCEPTED
- **Context**: The Admin Command SOC required integrating the reference The Tech Mystery Admin Profile page (`AdminProfilePage.jsx` and `AdminProfilePage.css`) at `/admin/profile`, providing administrator identity overview, privileged account status inspection (`ACCESS LEVEL 04`), telemetry cards (`Admin actions`, `Security reviews`, `Managed teams`, `Session status`), tabbed workspace (`Overview`, `Settings`, `Security`), side inspector panels (`Access & permissions`, `Current session`, `Need access help?`), and account security controls. Critical constraints were:
  1. Reusing the shared `AdminSidebar` without duplicate sidebars or headers, ensuring seamless navigation across all 9 mission control items (`Overview`, `Teams`, `Challenges`, `Questions`, `QR Checkpoints`, `Submissions`, `Leaderboard`, `Event Control`, `Security Logs`) and linking the user footer card directly to `/admin/profile`.
  2. Extending the backend `User` schema (`server/src/models/User.js`) with admin identity and security fields (`department`, `twoFactor`, `securityAlerts`, `emailAlerts`, `sessionAlerts`).
  3. Implementing authenticated admin endpoints (`GET /api/v1/admin/profile`, `PATCH /api/v1/admin/profile`, `POST /api/v1/admin/sessions/revoke`) guarded by `authenticate` and `requireAdmin`.
  4. Strictly enforcing role and permission immutability: an administrator is never permitted to grant themselves additional roles or elevate their privileges through profile updates; any attempts to submit `role`, `permissions`, or `accessLevel` in the payload are rejected server-side and trigger security audit warnings.
  5. Connecting password management via `authService.changePassword` requiring current password verification with bcrypt, session revocation via `adminService.revokeSessions` with audit logging (`logger.security`), and avatar photo uploads with a 500KB client limit.
- **Decision**:
  - Implement [`AdminProfilePage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/admin/AdminProfilePage.jsx) and [`AdminProfilePage.css`](file:///c:/projects/Hack-The-Grid/client/src/styles/AdminProfilePage.css), matching the dark charcoal and electric-lime aesthetic with responsive layout (desktop, tablet, and mobile).
  - Register `ROUTES.ADMIN_PROFILE` (`/admin/profile`) as a standalone full-bleed page and under `/admin/profile` in [`AppRoutes.jsx`](file:///c:/projects/Hack-The-Grid/client/src/routes/AppRoutes.jsx).
  - Update [`AdminSidebar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/AdminSidebar.jsx) so clicking the administrator card navigates directly to `/admin/profile` and displays an active highlight when on the profile page.
  - Implement `getAdminProfile`, `updateAdminProfile`, and `revokeSession` in [`admin.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/admin.controller.js) and mount them in [`admin.routes.js`](file:///c:/projects/Hack-The-Grid/server/src/routes/admin.routes.js).
  - Add API client bindings in [`admin.service.js`](file:///c:/projects/Hack-The-Grid/client/src/services/admin.service.js).
  - Clearly distinguish live database state (`● LIVE DATABASE`) from demo preview (`● DEMO PREVIEW`) with responsive pill badges and fallback handling.
- **Consequences**: Equips event organizers and SOC administrators with a dedicated administrative command identity console, guarantees zero privilege escalation, enforces security audit trails across profile and credential updates, and provides responsive mobile drawer navigation.

---

## ADR-0034: Unified Site Navbar Component & Global CSS Scoping Resolution
- **Status**: ACCEPTED
- **Context**: The homepage navbar exhibited a layout breakdown where navigation links stacked vertically in the center and overlapped the hero content. Investigation revealed two root causes:
  1. `HomePage.jsx` contained duplicate, inlined navbar markup (`<header className="htg-header">` and `<nav className="htg-nav">`) rather than reusing the shared [`Navbar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/Navbar.jsx) component used across the rest of the public pages (`/mission`, `/challenges`, `/leaderboard`, `/rules`, etc.).
  2. Unscoped CSS in `TeamManagementPage.css` defined global rules (`.htg-nav { display: grid; gap: 5px; padding-top: 20px; }` and `.htg-nav { padding-top: 0; gap: 4px; }`), which leaked into the global stylesheet bundle and overrode `.htg-nav` with a single-column CSS Grid layout, causing links to stack vertically and overflow down into the hero image.
- **Decision**:
  - Refactor [`Navbar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/Navbar.jsx) and [`Navbar.css`](file:///c:/projects/Hack-The-Grid/client/src/styles/Navbar.css) into a robust, standardized site header with three horizontally aligned sections:
    - **Left — Branding (`.nav-brand`)**: `THE TECH MYSTERY` with “GRID” in electric lime (`#B8FF3D`) and `CODESPHERE × UTKRISHT 2026` monospace subtitle.
    - **Center — Navigation Links (`.nav-links`)**: Exactly seven links in a single horizontal row (`HOME`, `LEADERBOARD`, `MISSION`, `CHALLENGES`, `QR CHECKPOINT`, `FINAL FLAG`, `RULES`) using React Router `Link`, active indicator bar (`.site-navbar__active-bar`), and responsive gap scaling.
    - **Right — Authentication Actions (`.nav-actions`)**: `LOGIN` (dark transparent with subtle border) and `REGISTER ↗` (electric lime `#B8FF3D` background with dark text) for guests, or `DASHBOARD` / `DISCONNECT` for authenticated users.
  - Mount `<Navbar />` directly into [`HomePage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/public/HomePage.jsx), eliminating duplicated navbar markup.
  - Remove obsolete `.htg-header` and `.htg-nav` rules from [`HomePage.css`](file:///c:/projects/Hack-The-Grid/client/src/styles/HomePage.css) and align the fixed hero background offset to 72px (`inset: 72px 0 0`).
  - Scope all sidebar navigation styles in [`TeamManagementPage.css`](file:///c:/projects/Hack-The-Grid/client/src/styles/TeamManagementPage.css) under `.htg-sidebar` (e.g. `.htg-sidebar .htg-nav`, `.htg-sidebar .htg-brand`), completely preventing global selector collisions.
  - Provide full responsive support: horizontal row for desktop and tablet landscape (`>= 980px`), and a keyboard-accessible drawer with Escape key handling, route transition closing, and hamburger toggle for mobile devices.
- **Consequences**: Resolves the vertical stacking bug at the root cause, guarantees cross-page navigation consistency across all public routes, prevents future CSS cascade pollution, and aligns with the near-black and electric-lime design system without layout shifts.

---

## ADR-0035: Phase 3 Complete Backend Integration & Monorepo Live Data Synchronization
- **Status**: ACCEPTED
- **Context**: The web application required full end-to-end integration between the React 19 frontend, Node.js/Express REST backend, and local/Atlas MongoDB database. Key requirements included:
  1. Bootstrapping a live MongoDB database with 10 structured challenges, multiple question variations per level, scannable QR checkpoints with HMAC signatures, administrative operator accounts, and active participating squads.
  2. Stateless JWT authentication with dynamic team synchronization in middleware so that newly created teams immediately reflect on active participant tokens without requiring manual re-login.
  3. Strict zero-trust server validation ensuring challenge flags, secret answers, and password hashes remain strictly server-side (`flag: { select: false }`, `passwordHash: { select: false }`).
  4. Wiring participant pages (`RegisterPage`, `LeaderboardPage`, `ParticipantDashboard`, `ChallengeLevelsPage`, `FinalFlagPage`, `QRCheckpointPage`) to live backend APIs with graceful demo fallbacks and live state pills (`● LIVE DATABASE`).
- **Decision**:
  - Implement comprehensive database seed script [`server/src/utils/seed.js`](file:///c:/projects/Hack-The-Grid/server/src/utils/seed.js) initializing `EventConfig` (LIVE), admin account, 10 challenge stages, 17 questions across pools, 10 physical checkpoints (`HTG-CP01` to `HTG-CP10`), 5 active teams, scores, and security audit logs.
  - Enhance [`auth.middleware.js`](file:///c:/projects/Hack-The-Grid/server/src/middleware/auth.middleware.js) to look up fresh user teamId from MongoDB if absent in token payload, and update [`team.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/team.controller.js) to issue refreshed JWT tokens upon team creation and join.
  - Wire [`RegisterPage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/public/RegisterPage.jsx) to live `authService.register` and `teamService.createTeam` with generated join code display and clipboard copy action.
  - Wire [`LeaderboardPage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/public/LeaderboardPage.jsx) to live `leaderboardService.getLeaderboard` with 15s auto-refresh polling and dynamic user team detection.
  - Wire [`ParticipantDashboard.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/participant/ParticipantDashboard.jsx) and [`ChallengeLevelsPage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/public/ChallengeLevelsPage.jsx) to live team, mission map, and challenge APIs.
  - Validate with a comprehensive 16-point automated integration test suite ([`test_phase3_integration.js`](file:///c:/projects/Hack-The-Grid/test_phase3_integration.js)) confirming 100% pass rate.
- **Consequences**: Successfully completes Phase 3 of the master roadmap, delivers a fully integrated, live-backed CTF platform while preserving the cyber SOC design identity and strict security guarantees.

---

## ADR-0036: Separate Role-Aware Navigation Systems and Hardened Route Authorization
- **Status**: ACCEPTED
- **Context**:
  - Administrative consoles and participant interfaces require strict boundary isolation: admin consoles must never render the public navbar or footer, and public/participant interfaces must never expose administrative sidebar navigation.
  - The admin sidebar must contain exactly 9 links in an immutable sequence, backed by real live API telemetry for notification count badges (strictly forbidding hardcoded mock counts such as "32" or "8").
  - The public/participant navbar must contain exactly 7 links in an immutable single-row horizontal layout on desktop.
  - Zero-trust security: client storage must never be trusted for access control. The backend must authoritatively verify user roles against the database on every authenticated request, and participant registration must never allow privilege escalation to administrator.
- **Decision**:
  - Authored self-contained [`AdminSidebar.css`](file:///c:/projects/Hack-The-Grid/client/src/styles/AdminSidebar.css) and updated canonical [`AdminSidebar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/AdminSidebar.jsx) with the exact 9 links in canonical sequence:
    1. Overview (`/admin/dashboard`)
    2. Teams (`/admin/teams`)
    3. Challenges (`/admin/challenges`)
    4. Questions (`/admin/questions`)
    5. QR Checkpoints (`/admin/checkpoints`)
    6. Submissions (`/admin/submissions`)
    7. Leaderboard (`/admin/leaderboard`)
    8. Event Control (`/admin/event-control`)
    9. Security Logs (`/admin/security-logs`)
  - Connected real telemetry via `adminService.getDashboardStats()` for dynamic team and submission count badges, hiding badges gracefully when data is unavailable.
  - Refactored [`AdminDashboard.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/admin/AdminDashboard.jsx) to eliminate 50 lines of duplicate inlined `<aside>` markup in favor of `<AdminSidebar />`.
  - Refactored [`AdminLayout.jsx`](file:///c:/projects/Hack-The-Grid/client/src/layouts/AdminLayout.jsx) to isolate admin consoles in a Cyber SOC shell that renders only the admin sidebar and page content.
  - Upgraded [`ProtectedRoute.jsx`](file:///c:/projects/Hack-The-Grid/client/src/routes/ProtectedRoute.jsx) to display a cyber HUD loading state, redirect unauthenticated users to `/admin/login` (preserving deep links via `state.from`), and redirect unauthorized participants to `/dashboard`.
  - Hardened server authentication in [`auth.middleware.js`](file:///c:/projects/Hack-The-Grid/server/src/middleware/auth.middleware.js): performs a database lookup on `User.findById` and authoritatively enforces `req.user.role = freshUser.role`, neutralizing forged JWT role claims.
  - Hardened client authentication in [`AuthContext.jsx`](file:///c:/projects/Hack-The-Grid/client/src/context/AuthContext.jsx): wipes storage if tokens are missing or invalid, verifying sessions against `/api/v1/auth/me`.
  - Reorganized [`AppRoutes.jsx`](file:///c:/projects/Hack-The-Grid/client/src/routes/AppRoutes.jsx): grouped all 10 admin consoles under `<Route element={<ProtectedRoute requiredRole="ADMIN"><AdminLayout /></ProtectedRoute>}>`.
  - Updated [`Navbar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/Navbar.jsx) to render role-aware right action buttons (Guest: `LOGIN` + `REGISTER ↗`, Participant: `DASHBOARD` + `DISCONNECT`, Admin: `ADMIN SOC` + `DISCONNECT`).
- **Consequences**:
  - Full architectural separation between admin and participant experiences.
  - Zero privilege escalation vulnerabilities; verified with 100% automated test suite covering backend authorization, route bounces, link sequences, badge telemetry, and headless browser rendering across desktop, tablet, and mobile.

---

## ADR-0037: Comprehensive Team, Challenge, and Question Lifecycle Integration
- **Status**: ACCEPTED
- **Context**:
  - Transition the platform from static demo preview states into a fully integrated live database operations platform across Team Management, Challenge Management, Question Management, and Participant Dashboard.
  - Required team membership limits (min 2, max 4) and duplicate enrollment guards on both server and client.
  - Challenges require full lifecycle statuses ('Draft', 'Published', 'Paused', 'Archived') and checkpoint associations, gating unpublished/archived challenges from participant endpoints.
  - Question bank items require flexible campus QR checkpoint links, attempt limits, hints with point penalties, and zero-leakage flag protection (`select: false`).
- **Decision**:
  - **Schema Updates**:
    - `Team`: Added `college` field (String, trim, default "Tula's University").
    - `Challenge`: Added `'Archived'` to status enum (`['Published', 'Draft', 'Paused', 'Archived']`) and retained indexed `checkpointId`.
    - `Question`: Added `checkpointId` (`ObjectId`, ref: `'Checkpoint'`, indexed) and added `'Archived'` to status enum.
  - **Backend Services & Controllers**:
    - `team.service.js`: Expanded with `createAdminTeam`, `updateTeam` (name, college, totalScore, isDisqualified with Score collection sync), `addMemberToTeam` (capacity & duplicate enrollment check), `removeMemberFromTeam` (protects team leader), and `deleteTeam` (cascading cleanup).
    - `admin.controller.js`: Implemented endpoints for team CRUD, challenge CRUD (`checkpointId`, `requiresCheckpointScan`, status), and question CRUD (`checkpointId`, `+flag` authorized inclusion). Added cascading resource cleanup on deletion.
    - `challenge.controller.js` & `questionAssignment.service.js`: Strictly enforced `{ status: 'Published', isActive: true }` so drafts, paused, and archived challenges are inaccessible to participants.
  - **Frontend Client Integration**:
    - `admin.service.js`: Added client methods for all team, challenge, and question CRUD endpoints.
    - `TeamManagementPage.jsx`: Added interactive modals for Add Team, Edit Team, Add Member, Remove Member, and Delete Team with loading/error states.
    - `ChallengeManagementPage.jsx`: Added Checkpoint association selector, `requiresCheckpointScan` toggle, `'Archived'` status support, and Delete Challenge confirmation action.
    - `QuestionManagementPage.jsx`: Added Checkpoint selector, interactive detail tabs (Preview, Answer Settings, QR Mapping), `'Archived'` status, and Delete Question action.
    - `ParticipantDashboard.jsx`: Connected live `getCurrentChallenge()` and dynamic team member avatars from `team.members`.
- **Consequences**:
  - Complete end-to-end CRUD persistence across MongoDB, Express, and React.
  - Zero-leakage flag security preserved with 100% test coverage (20/20 tests passed in `test_team_challenge_question_integration.js`).

---

## ADR-0038: Physical QR Checkpoint Verification and Atomic Submission Engine
- **Status**: ACCEPTED
- **Context**:
  - Phase 4 of the The Tech Mystery CTF roadmap requires physical QR checkpoint scanning, token verification, challenge unlocking, and an atomic submission scoring engine.
  - Security requirements:
    1. QR codes must encode opaque checkpoint URLs with cryptographic HMAC-SHA256 signatures (`verifyCheckpointToken`), preventing tampering, guessing, or enumeration.
    2. Checkpoints must be gated by level prerequisites: teams cannot scan higher-level checkpoints ahead of their progression.
    3. Checkpoint scanning must NEVER award points merely for physical arrival; points are only awarded upon valid flag submission.
    4. Secret challenge flags and expected answers must NEVER be returned in checkpoint payloads or participant challenge responses (`flag: { select: false }`).
    5. Flag submissions must be validated server-side using constant-time string comparisons (`crypto.timingSafeEqual`) with optional case-sensitivity handling.
    6. Submissions must enforce attempt limits (lockout after max attempts) and rate limits to prevent brute-forcing.
    7. Concurrent submission race conditions and duplicate rewards must be blocked with atomic database operations (`findOneAndUpdate({ _id, status: { $ne: 'SOLVED' } })`).
- **Decision**:
  - **Backend Implementation**:
    - `crypto.js`: Enhanced `safeFlagCompare` with constant-time equality and configurable `caseSensitive` support. Fortified `verifyCheckpointToken` with type guards.
    - `checkpoint.service.js`: Validates checkpoint existence, active state, HMAC token signature, and team level eligibility. Unlocks `TeamChallenge` and tracks `alreadyScanned` state and metrics (`scanCount`, `lastScanAt`) without awarding points.
    - `submission.controller.js`: Enforces level progression matching, physical checkpoint scan prerequisite (`challenge.requiresCheckpointScan && !teamChallenge.checkpointScanned`), attempt limits lockout with remaining attempts reported, and immutable audit logs (`Submission`).
    - `scoring.service.js`: Implemented atomic `findOneAndUpdate` with `{ status: { $ne: 'SOLVED' } }` check to guarantee idempotent exactly-once scoring, updating team total score and level progression atomically.
    - `apiResponse.js` & `team.routes.js`: Ensured error responses return metadata in both `errors` and `data` fields; added `/my-team` alias to `/teams/me`.
  - **Frontend Implementation**:
    - `QRCheckpointPage.jsx`: Added dual-mode scanning supporting both live camera (`Html5Qrcode`) / image upload and fallback manual code entry. Added URL query parameter detection (`/checkpoint/scan?code=...&token=...`) enabling native smartphone camera scans. Displayed rich unlocked station cards with question prompt preview (without flag) and direct navigation to `/portal/challenge`.
    - `QRCheckpointManagementPage.jsx`: Connected live MongoDB checkpoint synchronization via `adminService.getCheckpoints()`, `createCheckpoint()`, and `updateCheckpoint()`, preserving printable placard generation with real HMAC QR codes.
    - `submission.service.js`: Created dedicated client service for `/submissions/submit`.
    - `AppRoutes.jsx`: Added route `/checkpoint/scan` mapping to `QRCheckpointPage`.
  - **Verification & Testing**:
    - Created comprehensive test suite `test_phase4_qr_submission.js` covering 51 assertions across admin QR generation, participant scanner security (invalid codes, forged tokens, locked levels, attempt limits), atomic solve, anti-replay, and leaderboard sync (51/51 PASSED).
    - Executed regression suites `test_phase3_integration.js` (16/16 PASSED) and `test_team_challenge_question_integration.js` (20/20 PASSED).
    - Verified clean client production build with `npm run build:client` (exit code 0 in 7.51s).
- **Consequences**:
  - Delivers a secure, anti-cheat physical-digital CTF competition platform.
  - Prevents all replay, double-scoring, and timing side-channel vulnerabilities.

---

## ADR-0039: Authoritative Public & Admin Leaderboard, Event State Gating, and Final Flag Engine (Phase 5)
- **Status**: ACCEPTED
- **Context**:
  Phase 5 requires full end-to-end operational readiness for The Tech Mystery:
  1. The public leaderboard must connect to the authoritative backend API with deterministic tie-breaking (`totalScore DESC, lastSolveTimestamp ASC, createdAt ASC, _id ASC`), loading/empty/error states, and respect the backend's visibility setting (`isLeaderboardVisible === false` conceals standings).
  2. The admin leaderboard must use live database data consistent with public scores, while allowing administrators to view full standings (including concealed states and disqualified teams).
  3. Administrative actions (configuration updates, freeze toggles, team disqualifications) must be recorded in `SecurityLog` audit records.
  4. Event lifecycle state restrictions must be enforced on the backend: submissions and checkpoint scans blocked when `PAUSED`, `CONCLUDED`, or in `maintenanceMode`; team creation blocked when `registrationOpen === false` or `maxTeams` reached.
  5. The Final Flag (Level 10) must validate prerequisite completion, verify secret flags in constant time, block duplicate rewards, advance teams to Level 11 upon victory, and transition `FinalFlagPage` to the celebration victory HUD.
  6. End-to-end verification must prove complete gameplay from registration through Level 10 capture with 0 security leaks and clean test teardown.
- **Decision**:
  - **Backend Implementation**:
    - `EventConfig.js`: Added `isLeaderboardVisible: { type: Boolean, default: true }`.
    - `leaderboard.controller.js`: Implemented deterministic sorting across all rank queries using official competition tie-breakers: `totalScore DESC`, earlier `lastSolveTimestamp ASC`, earlier `createdAt ASC`, and stable `_id ASC`. Implemented `getLiveLeaderboard` (conceals when `!isVisible`) and `getAdminLeaderboard` (returns full standings with team details, member counts, and disqualification states).
    - `admin.routes.js`: Added `GET /admin/leaderboard` protected by `authenticate` and `requireAdmin`.
    - `admin.controller.js`: Added audit trail generation in `updateEventConfig` (`category: 'CONFIGURATION'`) and `disqualifyTeam` (`category: 'ADMIN ACTION'`) in `SecurityLog`.
    - `submission.controller.js`: Enforced event state gating (rejects with 403 when `maintenanceMode: true`, `state === 'PAUSED'`, or `state === 'CONCLUDED'`); supports fallback assignment for Level 10 final flag; enforces attempts lockout and exactly-once atomic solve.
    - `checkpoint.service.js`: Enforced event state gating (rejects with 400 when `maintenanceMode: true`, `state === 'PAUSED'`, `state === 'CONCLUDED'`, or `qrCheckpoints === false`).
    - `team.service.js`: Enforced registration limits (`registrationOpen === false`, `maxTeams`, `state === 'CONCLUDED'`, `maintenanceMode`).
    - `team.routes.js`: Added support for both `POST /teams` and `POST /teams/create`.
  - **Frontend Implementation**:
    - `LeaderboardPage.jsx`: Connected directly to `leaderboardService.getLeaderboard()`. Added loading spinner, error banner with retry button, empty arena state ("THE ARENA IS OPEN"), concealed standings alert banner ("LEADERBOARD CONCEALED BY SOC"), frozen state badge, and manual instant refresh button alongside 15s auto-polling. Removed demo mock data fallbacks when live database data is loaded.
    - `LeaderboardManagementPage.jsx`: Connected to `adminService.getLeaderboard()`. Removed demo client-side rank adjustment controls (`moveTeam`) to uphold competition integrity. Connected visibility switch to persist `isLeaderboardVisible` and `isLeaderboardFrozen` directly to backend `EventConfig`.
    - `EventControlPage.jsx`: Updated `handleSave` and `handleBroadcastAnnouncement` to always persist to live backend database and set `isLiveDb: true`.
    - `FinalFlagPage.jsx`: Connected to `challengeService.submitFlag(10, normalizedFlag)`, verifying attempts remaining, level gating, constant-time verification, and victory HUD celebration transition.
  - **Verification & Testing**:
    - Created `test_phase5_e2e_gameplay.js` verifying 48 distinct assertions across admin inspection, public leaderboard tie-breaking, concealment gating, event state enforcement (PAUSED, MAINTENANCE, REGISTRATION_CLOSED), Level 1 to Level 10 gameplay, Master Flag solve, anti-replay, and RBAC security (48/48 PASSED).
    - Ran all regression suites: `test_phase4_qr_submission.js` (51/51 PASSED), `test_team_challenge_question_integration.js` (20/20 PASSED), `test_phase3_integration.js` (16/16 PASSED) — 135/135 total passed.
    - Production client build verified with `npm run build:client` (exit code 0).
- **Consequences**:
  - The The Tech Mystery platform is fully integrated, resilient, and competition-ready with zero client score modifications, zero flag leaks, and complete administrative lifecycle control.

---

## ADR-0040: Hardened JWT Authentication, Real-Time MongoDB State Synchronization, and Admin Authorization
- **Status**: ACCEPTED
- **Context**:
  - Authentication tokens are issued with user claims (`userId`, `role`, `teamId`), but static claim trust creates severe security vulnerabilities if user privileges, account status, or team membership change during a live competition.
  - Specifically:
    1. If an account is deactivated (`isActive: false`) or deleted after token issuance, stale JWTs must not grant continued access.
    2. If an administrative user is downgraded or a participant's role is updated, the change must take effect on the very next request without waiting for token expiry.
    3. If a participant is removed from a team, stale `teamId` claims inside the JWT must be cleared immediately so they cannot submit flags or access team-only challenges.
    4. Optional authentication (`optionalAuth`) on public routes must synchronize user state when valid tokens are provided, must not authenticate inactive or deleted users, must preserve public access for unauthenticated requests, and must not silently swallow database errors into unverified authenticated sessions.
- **Decision**:
  - **Hardened `authenticate` middleware (`server/src/middleware/auth.middleware.js`)**:
    - Continues validating JWT signature and expiry, returning standardized 401 responses for missing, malformed, invalid, or expired tokens.
    - Validates `decoded.userId` against MongoDB using `User.findById(decoded.userId).select('role teamId isActive')`.
    - Explicitly rejects deleted users with HTTP 401 (`User account no longer exists`).
    - Explicitly rejects deactivated accounts with HTTP 401 (`Account has been deactivated. Please contact an administrator.`).
    - Overwrites `req.user.role` with `freshUser.role` authoritatively from MongoDB.
    - Synchronizes `req.user.teamId` with `freshUser.teamId ? freshUser.teamId.toString() : null`, explicitly clearing stale token claims when teamId is null in the database.
    - Sets `_id`, `userId`, and `isActive` consistently on `req.user`.
  - **Hardened `optionalAuth` middleware (`server/src/middleware/auth.middleware.js`)**:
    - Initializes `req.user = null` and preserves public access if no Authorization header or token is supplied.
    - Ignores malformed, invalid, or expired tokens to allow public viewing.
    - If a valid token contains `userId`, performs authoritative MongoDB lookup and verifies `freshUser.isActive`.
    - If user is missing or inactive, leaves `req.user = null` and does not retain stale token role/team data.
    - Catches database connection/query errors, sets `req.user = null`, and forwards the error via `next(error)` so database outages are not silently converted into unverified authenticated sessions.
  - **Verified Admin Route RBAC (`server/src/routes/admin.routes.js`)**:
    - Preserved `router.use(authenticate)` followed immediately by `router.use(requireAdmin)` across all 21 administrative API endpoints.
    - Verified non-admin roles (`TEAM_MEMBER`, `TEAM_LEADER`) receive HTTP 403 Forbidden on all administrative consoles.
  - **Automated Verification Suite (`test_jwt_admin_auth.js`)**:
    - Implemented and executed 18 assertions covering all required test vectors:
      1. Missing token -> 401.
      2. Malformed tokens (non-Bearer, empty Bearer, corrupted string) -> 401.
      3. Invalid/forged signature -> 401.
      4. Expired token -> 401.
      5. Deleted user -> 401.
      6. Inactive user -> 401.
      7. Active admin -> 200 OK.
      8. Active non-admin -> 403 Forbidden.
      9. Role changed in MongoDB (upgrade to ADMIN and downgrade to TEAM_MEMBER) reflected immediately with same token.
      10. Team membership removed in MongoDB reflected immediately (403 on team-required routes, 404 on `/teams/my-team`).
      11. Optional auth with no token remains public (200 OK).
      12. Optional auth with inactive or deleted user does not authenticate (graceful public view).
- **Consequences**:
  - Eliminates stale claim attacks, privilege persistence after role changes, and deactivated account access.
  - 18/18 tests in `test_jwt_admin_auth.js` passed (100% success rate). All platform regression suites (`test_phase3_integration.js`, `test_team_challenge_question_integration.js`, `test_phase4_qr_submission.js`, `test_phase5_e2e_gameplay.js`) continue passing with 100% success (153/153 total tests).
























## ADR-0041: Transactional gameplay, explicit participant DTOs, scoped QR and revocable JWTs

- **Status:** IMPLEMENTED in the working tree, 19 October 2026. Deployment/data migration
  remains pending; this supersedes unconditional security/completion statements in earlier ADRs.
- **Revalidated findings:** literal answers in legacy participant prompts, public/member
  invitation disclosure, optional QR signature checking, nontransactional solve/review writes,
  attempt/member races, lifecycle gaps, ineffective revocation and unsafe production defaults.
  Existing inactive-account checks and authoritative role/team refresh were already implemented
  and preserved. No Clerk integration was present or added.
- **Decision:** use allowlisted participant DTOs with known-answer containment, preserve private
  admin answer access, require expiry/scope-bound HMAC payloads, and require MongoDB transactions
  for coordinated writes. Mongoose's transaction AsyncLocalStorage propagates the session.
  Revision writes prevent conflicting lifecycle/membership/content edits from being ignored.
  No unsafe standalone fallback is permitted. Scores and progression share one canonical
  scoring submission per assignment; correction history and security audit writes commit with
  the change. New teams start at zero/level one; direct score/level overrides are rejected.
- **Sessions:** retain the existing JWT architecture with HS256 purpose/version checks against
  MongoDB. Revoke previous versions on logout, password change and admin session revocation.
  Admin revocation issues a new current-client credential. Stop issuing unused refresh tokens;
  keep MFA as explicitly unimplemented rather than equating a preference to verification.
- **Compatibility:** old JWTs require re-login; old QR signatures require regeneration. Bound
  checkpoints need an explicit boundTeamId; shared signed checkpoints use Public QR mode.
  Existing solved assignments without scoringSubmissionId need reviewed data reconciliation
  before review/correction. Unsafe legacy prompt content is withheld without modifying it.
  Leader/admin invitation rotation is explicit and audited; existing codes are not auto-rotated.
- **Consequences:** replica-set deployment is required. Event-level serialization favors
  correctness over throughput and needs load testing. Runtime answer matching is conservative;
  human review is still required for artifact quality and encoded/semantic answer leakage.
  Existing event data is unchanged. Real leaderboard freezing and browser/camera verification
  remain outside this implemented phase.
- **Evidence:** isolated real-HTTP test suite: 38 passed, 0 failed; lint passed; client build
  passed with a large-chunk warning. Runtime dependency audit: zero; full development-tool
  audit: 6 high and 2 moderate advisories. Tests never connect to the existing event database.

## ADR-0042: Isolated preparation artifacts and approval-separated ingestion

- **Status:** Preparation tooling implemented; operational/enrollment/QR decisions proposed.
- **Decision:** preserve the configured event database. Reconciliation uses native-driver
  read commands and inclusion projections, producing redacted evidence with original IDs,
  never an executable repair. Candidate mappings require unique matching submission,
  association/history/total/progression evidence; ambiguous amounts remain manual decisions.
- **Staging:** authenticated single-node replica-set templates use an isolated database,
  port, volume, credentials and explicit launcher/init guards. No automatic startup or
  seed. Production TLS/redundancy and actual container startup remain separate work.
- **Deployment evidence:** anonymous GETs confirm public invitation disclosure. Source
  mtimes/hashes versus approximate process start support stale deployment diagnosis.
  OPTIONS is globally handled by CORS and cannot establish POST route presence. No claim
  of complete loaded-source identity or mutation-tested live behavior is made.
- **Proposals, not implemented behavior:** individual self-registration with pending-team
  status, organizer-approved roster assembly reusing existing admin transactions, and a
  backend enrollment-mode gate before strict approval can be promised. Shared campus
  checkpoints should use explicitly approved signed Public QR after dates/TTL/policy
  approval. Static QR signatures do not prove physical presence.
- **Evidence:** 51 combined server tests passed; 10 preparation safeguards included in the final combined run;
  lint and Compose configuration validation passed. No live records/configuration,
  connection, invitation, score, registration state, deployment or real QR output changed.
