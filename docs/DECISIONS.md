# ARCHITECTURAL DECISION RECORDS (ADR): HACK THE GRID

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
- **Context**: Viewport sizes ranging from 320px ultra-compact phones to 1440px+ ultra-wide desktops require seamless accessibility. A single mobile breakpoint caused cut-off vertical scrolling (due to `overflow: hidden`), clipped `HACK THE GRID` headers, overlapping nav items, and tab overflow on narrow cards.
- **Decision**:
  - Established a 5-tier responsive design system:
    1. **Desktop (>=1200px)**: 3-column layout (Intro + Card + Highlights), fluid `clamp()` gaps and typography.
    2. **Tablet Landscape (769px–1199px)**: 2-column layout (Intro + Card), feature highlights hidden, compact navbar.
    3. **Tablet Portrait (600px–768px)**: 1-column centered layout (Nav -> Intro -> Card), 16px–24px safe padding, card `width: min(100%, 560px)`.
    4. **Mobile (390px–599px)**: Fluid 1-column layout, hamburger menu with backdrop blur drawer, `HACK THE GRID` clamped heading, card padding `28px 20px`.
    5. **Small Mobile (320px–389px)**: Ultra-compact layout tested specifically at 320px, 360px, 375px. 2-equal-column tabs with 11px font, touch-friendly 44px+ inputs, compact register button, and card padding `22px 14px`.
  - Replaced root `overflow: hidden` with `overflow-x: hidden; min-height: 100dvh;` allowing smooth, natural vertical scrolling on all touch devices.
  - Adjusted mobile campus hero background position to `50% 18%` to retain prominent visibility of the university architecture.
---

## ADR-0012: Standalone Full-Bleed Multi-Step Register Page UI Integration
- **Status**: ACCEPTED
- **Context**: Hack the Grid requires an intuitive 4-step squad registration wizard (Team Details, Team Leader, Team Members, Review & Terms). The reference UI includes its own full-bleed header (`.htg-register-nav`), campus background overlay (`campus-hero.png`), and 3-column layout (event intro, central progress card, and right-side benefits blockquote).
- **Decision**:
  - Integrate `RegisterPage.jsx` under `client/src/pages/public/` and import `client/src/styles/RegisterPage.css`.
  - Mount `ROUTES.REGISTER` as a top-level standalone full-bleed route alongside `ROUTES.HOME` and `ROUTES.LOGIN` in `AppRoutes.jsx`, eliminating duplicate headers/footers from `PublicLayout`.
  - Preserve UI-only multi-step state progression (`step` 0 to 3) without connecting backend APIs prematurely.
  - Wire client-side SPA navigation to `/`, `/login`, `/register`, and `/leaderboard` with responsive hamburger menu support.
- **Consequences**: Delivers seamless 4-step enrollment UX, responsive fidelity from 320px to 1440px+, and leaves `HomePage` and `LoginPage` completely untouched.

---

## ADR-0013: Standalone Full-Bleed Rules Page UI Integration
- **Status**: ACCEPTED
- **Context**: Hack the Grid requires a comprehensive Participant Handbook and Fair Play Protocol page (`/rules`). The reference design features its own full-bleed header (`.rp-nav`), fixed campus hero background (`campus-hero.png`), stats counter bar, 6 interactive rule accordion categories, a golden rule sandbox sidebar, and an acknowledgment checkbox gate before registering. Nesting it inside `PublicLayout` would duplicate headers and footers.
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
- **Context**: Hack the Grid requires an immersive Mission Playbook and operational walkthrough page (`/mission` and `/mission#how-it-works`). The reference UI features its own self-contained top header (`.mp-nav`), multi-layered background (`campus-hero.png`, scanlines, grid overlay), orbital visual hero animation, 4 quick metrics cards, interactive 6-stage mission selector with cycling Next Step controls, 4 core pillars of play, and an expandable 10-level challenge map.
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
- **Context**: Hack the Grid requires a dedicated Challenge Levels / Mission Map discovery page (`/challenges`). The design includes its own full-bleed header (`.htg-levels-nav`), layered campus background overlay (`/campus-hero.png`), stats counter bar, an interactive 10-level Mission Map panel with accordion click-to-expand briefings, difficulty badges, and a 4-pillar benefits showcase with event quotation.
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
- **Context**: The climax of the Hack the Grid competition requires an authenticated Final Flag / Victory UI for Level 10 (Master Flag). The reference design (`Hack-The-Grid-Final-Flag-Victory-UI.zip`) provides a cyber endgame aesthetic featuring "SYSTEM BREACHED." typography, master flag radar targeting art, secure flag submission form with HTG input prefix, pre-submission checklist drawer, Victory Protocol sidebar, and an animated "MISSION ACCOMPLISHED" victory state.
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
- **Context**: The Admin Command SOC required replacing the placeholder Tailwind `TeamManagementPage.jsx` with the reference-matched Hack the Grid Team Management UI (`Hack-The-Grid-Team-Management-UI-Reference-Match.zip`), featuring the Mission Control sidebar, 5 KPI summary cards, filter/search toolbar, Table/Grid view switcher, pagination, and a right-hand selected-team inspection panel with live backend synchronization where endpoints exist.
- **Decision**:
  - Extract the Mission Control sidebar into a reusable [`AdminSidebar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/AdminSidebar.jsx) component that uses `useLocation()` to automatically highlight the active admin route (`Overview`, `Teams`, `Challenges`, `Questions`, `QR Checkpoints`, `Submissions`, `Leaderboard`, `Event Control`, `Security Logs`), displays dynamic badge counts, and provides a mobile slide-over drawer.
  - Mount `ROUTES.ADMIN_TEAMS` (`/admin/teams`) as a standalone full-bleed route in `AppRoutes.jsx` alongside `/admin/dashboard` so `TeamManagementPage` renders its own `.htg-team-page` shell without duplicate sidebars or headers from `AdminLayout.jsx`.
  - Connect [`TeamManagementPage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/admin/TeamManagementPage.jsx) to `GET /api/v1/admin/teams` and `PATCH /api/v1/admin/teams/:teamId/disqualify` via [`admin.service.js`](file:///c:/projects/Hack-The-Grid/client/src/services/admin.service.js), enhancing [`admin.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/admin.controller.js) to populate `leaderId` and `members` (`username email fullName role collegeRollNo isActive`) and to validate ObjectId parameters when disqualifying or restoring teams.
  - Explicitly distinguish live database data (`● LIVE DATABASE`) from demo fallback data (`● DEMO PREVIEW DATA`) when unauthenticated or when the backend is offline, and surface clear informational notices for UI actions whose backend endpoints are not yet implemented (`Add Team`, `Edit Team`, `Add Member`).
- **Consequences**: Delivers a pixel-accurate match to the Mission Control Team Management reference across desktop, tablet, and mobile viewports, enables real-time server-validated team disqualification/restoration for authenticated admins, and preserves strict separation between live production records and demo preview state.

---

## ADR-0025: Reference-Matched Admin Challenge Management UI & Backend Integration (`/admin/challenges`)
- **Status**: ACCEPTED
- **Context**: The Admin Command SOC required integrating the reference-matched Hack the Grid Challenge Management UI (`Hack-The-Grid-Challenge-Management-UI.zip`) at `/admin/challenges`, supporting challenge statistics, search/status/difficulty/category filtering, List/Grid view switching, Add/Edit Challenge modal configuration, publish/pause toggling, and inspection of linked questions and QR checkpoints without exposing flags or unpublished challenges to participants.
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
- **Context**: The Admin Command SOC required integrating the reference-matched Hack the Grid Question Management UI (`Hack-The-Grid-Question-Management-UI.zip`) at `/admin/questions`, supporting question statistics (total, published, drafts, paused, available points), search across titles/IDs/challenges/prompts, status/type/level filtering, Table/Grid view toggling, Add/Edit Question modal, hint & max attempts configuration, pause/publish controls, CSV export, and an admin-only secret answer preview with an explicit "Reveal" toggle while ensuring secret flags are never exposed to participants.
- **Decision**:
  - Implement [`QuestionManagementPage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/admin/QuestionManagementPage.jsx) and [`QuestionManagementPage.css`](file:///c:/projects/Hack-The-Grid/client/src/styles/QuestionManagementPage.css), reusing the shared [`AdminSidebar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/AdminSidebar.jsx) with `Questions` (`☰`) highlighted as active on `/admin/questions`.
  - Mount `ROUTES.ADMIN_QUESTIONS` (`/admin/questions`) as a standalone full-bleed route in [`AppRoutes.jsx`](file:///c:/projects/Hack-The-Grid/client/src/routes/AppRoutes.jsx) (preventing duplicate sidebars/headers from `AdminLayout.jsx`).
  - Extend [`Question.js`](file:///c:/projects/Hack-The-Grid/server/src/models/Question.js) and [`challengeTypes.js`](file:///c:/projects/Hack-The-Grid/server/src/constants/challengeTypes.js) with `type` (`Text Answer`, `Flag`, `Multiple Choice`, `File Upload`), `points`, `status` (`Published`, `Draft`, `Paused`), `attempts`, `required`, and category constants, maintaining `isActive: status === 'Published'` synchronization and `flag: { select: false }`.
  - Add `PATCH /api/v1/admin/questions/:questionId` and enhance `GET /api/v1/admin/questions` and `POST /api/v1/admin/questions` in [`admin.routes.js`](file:///c:/projects/Hack-The-Grid/server/src/routes/admin.routes.js) and [`admin.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/admin.controller.js). Support `.select('+flag')` only for authorized admins via `includeFlag=true`, while strictly preserving `.select('-flag')` for participant-facing APIs (`/mission-map`, `/current`, `/checkpoints/scan`).
  - Distinguish live database state (`● LIVE DATABASE`) from demo preview fallback (`● DEMO PREVIEW DATA`) with clear UI badges and dismissible banners when unauthenticated or when the backend is offline.
- **Consequences**: Enables full admin question authoring and pool configuration with zero chance of flag leakage to participants, complete visual fidelity with the Mission Control design system, and full responsiveness across desktop, tablet, and mobile devices.
















