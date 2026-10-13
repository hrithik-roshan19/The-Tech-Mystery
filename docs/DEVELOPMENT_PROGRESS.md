# DEVELOPMENT PROGRESS & PHASE TRACKER: HACK THE GRID

> **RULE:** Update this tracker every time a phase or major architectural milestone is advanced.

---

## Phase Matrix

| Phase | Description | Status | Completion Date |
|---|---|---|---|
| **Phase 1** | **Architecture & Project Setup** | **COMPLETED** | Oct 08, 2026 |
| **Phase 2** | **Frontend UI & Design System (Homepage)** | **COMPLETED** | Oct 08, 2026 |
| **Phase 3** | Authentication & Registration System | READY TO START | Pending |
| **Phase 4** | Team Management & Join Code Engine | Planned | Pending |

| **Phase 5** | Challenge Engine & Asset Pipeline | Planned | Pending |
| **Phase 6** | Team-Specific Question Allocation Engine | Planned | Pending |
| **Phase 7** | QR Checkpoint Cryptographic System | Planned | Pending |
| **Phase 8** | Timer, Scoring Engine & Hint System | Planned | Pending |
| **Phase 9** | Live Leaderboard & Freeze Engine | Planned | Pending |
| **Phase 10**| Admin Command SOC & Operations Dashboard | Planned | Pending |
| **Phase 11**| Security Hardening & Anti-Cheat Validation | Planned | Pending |
| **Phase 12**| Automated Testing & Quality Assurance | Planned | Pending |
| **Phase 13**| Production Deployment (Vercel + Render + Atlas) | Planned | Pending |

---

## Phase 1 Deliverables (Completed)
- [x] Initialized Git repository.
- [x] Configured monorepo workspaces structure (`package.json`, `.gitignore`, `.env.example`).
- [x] Scaffolded backend directory (`server/`):
  - [x] Dependencies & scripts in `package.json`.
  - [x] Configured Mongoose connection and environment parsing.
  - [x] Implemented 9 database schemas (`User`, `Team`, `Challenge`, `Question`, `TeamChallenge`, `Submission`, `Checkpoint`, `Score`, `EventConfig`).
  - [x] Implemented API controllers, routes, and validation schemas under `/api/v1`.
  - [x] Created rate limiters, JWT authentication, and centralized error handling middleware.
  - [x] Implemented core logic services (`QuestionAssignmentService`, `ScoringService`, `CheckpointService`, `AuthService`, `TeamService`).
- [x] Scaffolded frontend directory (`client/`):
  - [x] Configured Vite 6 + React 19 + Tailwind CSS with the exact Cyber SOC theme palette.
  - [x] Created common HUD components (`CyberButton`, `CyberCard`, `StatusBadge`, `TerminalWindow`, `HUDHeader`, `LoadingSpinner`).
  - [x] Created layout systems (`PublicLayout`, `ParticipantLayout`, `AdminLayout`).
  - [x] Built all 21 public, auth, participant, and admin portal page scaffolds.
  - [x] Configured React Router v7 with RBAC route protection.
  - [x] Implemented Axios API layer with JWT interceptors.
- [x] Authored complete documentation suite in `docs/`.

---

## Phase 2 Deliverables (Completed)
- [x] Integrated visual source of truth homepage components:
  - [x] Created `client/src/pages/public/HomePage.jsx` with full visual hierarchy, stats bar, and interactive sections.
  - [x] Integrated `client/src/styles/HomePage.css` with exact dark + electric-lime theme (`--lime: #b8ff3d`, `--bg: #080a09`, `--surface: #111412`).
  - [x] Placed high-resolution `campus-hero.png` in `client/public/` as the actual hero background.
- [x] Connected active React Router routes:
  - [x] Direct client-side links to `/login`, `/register`, and `/leaderboard`.
  - [x] Preserved smooth in-page anchor navigation for `#mission`, `#how-it-works`, `#challenges`, `#rules`, and `#leaderboard`.
- [x] Verified full responsive behavior across Desktop (1440px), Tablet (850px), and Mobile (520px).
- [x] Verified build output (`npm run build --workspace=client`) with zero compilation errors.
- [x] Verified live runtime execution on Vite dev server (`http://localhost:5173`) with zero console errors.

---

## Phase 2 UI Integration — Login Page Complete (Completed)
- [x] Integrated reference `LoginPage.jsx` at `client/src/pages/public/LoginPage.jsx`:
  - [x] Preserved 3-column architecture (left event introduction, center cyber login card, right feature highlights).
  - [x] Implemented interactive tab switching between Team Login and Admin Login modes.
  - [x] Added password visibility toggle with custom vector icons.
  - [x] Connected form submission to existing `authService.login({ emailOrUsername, password })` and `useAuth` hook without changing visual structure.
- [x] Integrated reference `LoginPage.css` at `client/src/styles/LoginPage.css`:
  - [x] Imported Manrope, Geist Mono, and Inter font families.
  - [x] Implemented `--lime: #b8ff3d` accent styling, subtle glowing panels, and translucent glass borders.
  - [x] Applied authentic `campus-hero.png` as full-bleed background with double gradient masking and cyber grid lines.
  - [x] Maintained exact responsive breakpoints (1200px hides highlights, 900px collapses to single column, 560px mobile view).
- [x] Routing Integration:
  - [x] Mounted `ROUTES.LOGIN` as a top-level standalone full-bleed route in `AppRoutes.jsx` to prevent double navbars or footer overlap with `PublicLayout`.
  - [x] Connected React Router `Link` navigation between Home (`/`), Login (`/login`), Register (`/register`), and Leaderboard (`/leaderboard`).
- [x] Responsive Design Optimization & Viewport Fixes:
  - [x] Replaced `overflow: hidden` with `overflow-x: hidden; min-height: 100dvh;` allowing smooth vertical scrolling on all mobile screens.
  - [x] Added responsive hamburger menu button and mobile drawer for navigation on screens <= 900px.
  - [x] Adjusted background position to `50% 18%` on mobile devices to keep Tula's University campus building recognizable.
  - [x] Implemented fluid clamp typography for title `HACK THE GRID` preventing text clipping on ultra-small screens.
  - [x] Compacted login card padding and tab buttons for 320px–389px viewports.
  - [x] Validated across all 12 target viewport sizes (1440x900, 1366x768, 1280x800, 1024x768, 900x800, 768x1024, 600x900, 480x932, 430x932, 390x844, 360x800, 320x740).
- [x] Verification:
  - [x] Production build clean (`npm run build --workspace=client`).
  - [x] Runtime HTTP 200 OK verified on `/login`, `/campus-hero.png`, and component modules.
  - [x] Zero console warnings or CSS conflicts.

---

## Phase 2 UI Integration — Register Page Complete (Completed)
- [x] Integrated reference `RegisterPage.jsx` at `client/src/pages/public/RegisterPage.jsx`:
  - [x] Preserved 3-column architecture (left event introduction, center 4-step registration card, right benefits & quote).
  - [x] Implemented 4-step wizard progression:
    - Step 0: Team Details (Name, Motto, College, Year, Domain) with character counter.
    - Step 1: Team Leader (Full Name, Email, Phone, Roll Number).
    - Step 2: Team Members (Members 2, 3, 4 names and emails with dynamic row numbers).
    - Step 3: Review & Terms (Summary box, rules agreement checkbox, submit).
  - [x] Preserved UI-only flow with confirmation view upon final step submission.
  - [x] Added responsive hamburger menu button and mobile drawer for navigation on screens <= 900px.
- [x] Integrated reference `RegisterPage.css` at `client/src/styles/RegisterPage.css`:
  - [x] Scoped variables with `--rg-*` namespace.
  - [x] Connected authentic `campus-hero.png` as full-bleed background.
  - [x] Implemented responsive breakpoints (1250px, 900px, 560px, 380px) with 320px verification.
- [x] Routing Integration:
  - [x] Mounted `ROUTES.REGISTER` as a top-level standalone full-bleed route in `AppRoutes.jsx`.
  - [x] Connected SPA `Link` navigation between Home (`/`), Login (`/login`), Register (`/register`), and Leaderboard (`/leaderboard`).
- [x] Verification:
  - [x] Tested across all 12 viewports (1440x900 down to 320x740) with zero horizontal overflow.
  - [x] Production build clean (`npm run build --workspace=client`).
  - [x] Both `HomePage` and `LoginPage` remain 100% untouched.

---

## Phase 2 UI Integration — Rules Page Complete (Completed)
- [x] Integrated reference `RulesPage.jsx` at `client/src/pages/public/RulesPage.jsx`:
  - [x] Self-contained top navbar (`.rp-nav`) with brand mark, anchor links, and action buttons.
  - [x] Background visual layers (`.rp-bg` with `/campus-hero.png`, `.rp-overlay`, `.rp-grid`).
  - [x] Tactical hero section with eyebrow badge, large clamped heading, subtitle, and fair play protocol seal.
  - [x] Quick metrics bar (`.rp-stats`) displaying 2–4 members, 10 levels, 90–120 mins, and single policy rule.
  - [x] 6-category interactive accordion (`.rp-accordion`):
    - 01 Team Eligibility
    - 02 Fair Play & Integrity
    - 03 QR Checkpoints & Challenges
    - 04 Safety & Cybersecurity
    - 05 Scoring & Leaderboard
    - 06 Conduct & Disqualification
  - [x] Independent multi-accordion state toggling (defaulting to sections 01 and 02 open).
  - [x] Sidebar cards with golden rule "Stay inside the sandbox" callout and organizer help link.
  - [x] Acknowledgment gate (`.rp-ack`): checkbox required before unlocking navigation button to `/register`.
  - [x] Responsive hamburger menu toggle (`.rp-mobile-menu`) and slide-down drawer (`.rp-mobile-drawer`) on viewports <= 900px.
- [x] Integrated reference `RulesPage.css` at `client/src/styles/RulesPage.css`:
  - [x] Scoped styles with `.htg-rules` root and `--lime: #b8ff3d`, `--white: #f5f5f0`, `--muted: #b4bbb6` variables.
  - [x] Connected fixed campus hero background (`/campus-hero.png`).
  - [x] Implemented responsive breakpoints (1200px, 900px, 600px, 360px, 330px) ensuring zero horizontal scroll down to 320px.
- [x] Routing Integration:
  - [x] Mounted `ROUTES.RULES` as a top-level standalone full-bleed route in `AppRoutes.jsx`, removing it from `PublicLayout` to prevent double navbars and footers.
  - [x] Connected React Router `Link` components for SPA navigation to `/`, `/login`, `/register`, and `/leaderboard`.
- [x] Verification:
  - [x] Tested across all 8 target viewports (1440px, 1024px, 768px, 600px, 430px, 390px, 360px, 320px) with zero horizontal overflow.
  - [x] Production build clean (`npm run build --workspace=client` built in 40s with 0 errors).
  - [x] Dev server loads `/rules` with status 200 OK and mounts successfully.
  - [x] `HomePage`, `LoginPage`, and `RegisterPage` remain 100% intact and untouched.

---

## Phase 2 Navigation Fix — Cross-Page Rules Routing to `/rules` (Completed)
- [x] Audited navigation links across all pages and layouts:
  - Identified anchor `#rules` / `/#rules` links in `HomePage.jsx`, `LoginPage.jsx`, and `RegisterPage.jsx`.
- [x] Replaced anchor links with React Router `<Link to={ROUTES.RULES}>`:
  - `client/src/pages/public/HomePage.jsx`: Updated desktop `<nav>` link and mobile drawer link to `ROUTES.RULES`.
  - `client/src/pages/public/LoginPage.jsx`: Updated desktop `<nav>` link and mobile drawer link to `ROUTES.RULES`.
  - `client/src/pages/public/RegisterPage.jsx`: Updated desktop `<nav>` link and mobile drawer link to `ROUTES.RULES`.
- [x] Confirmed `RulesPage.jsx` already routes to `ROUTES.RULES` and `Navbar.jsx` already maps `RULES` to `ROUTES.RULES`.
- [x] Verification:
  - Navigating to Rules from `/` opens `/rules` (SPA route transition without hash jump).
  - Navigating to Rules from `/login` opens `/rules`.
  - Navigating to Rules from `/register` opens `/rules`.
  - Navigating to Rules from `/rules` maintains `/rules` active view.
  - Direct refresh of `/rules` loads cleanly with HTTP 200 OK.
  - Zero build errors (`npm run build --workspace=client` completed in 7.00s) and zero console warnings.

---

## Phase 2 UI Integration — Mission Page Complete (Completed)
- [x] Integrated reference `MissionPage.jsx` at `client/src/pages/public/MissionPage.jsx`:
  - [x] Full-bleed header (`.mp-nav`) with brand mark, anchor navigation, and action buttons.
  - [x] Visual background stack (`.mp-bg` with `/campus-hero.png`, `.mp-overlay`, `.mp-grid`).
  - [x] Orbit visual animation with 3 rotating rings, central HTG 2026 core, and live status floating tags.
  - [x] 4 metrics summary cards (`.mp-stats`): 10 levels, 2–4 members, 90–120 mins, 01 master flag.
  - [x] Interactive 6-step mission playbook (`.mp-process`):
    - 01 Register Your Team
    - 02 Enter Mission Control
    - 03 Find Your Checkpoint
    - 04 Crack Each Level
    - 05 Unlock the Next Stage
    - 06 Capture the Master Flag
  - [x] Looping Next Step button cycling through all 6 stages (`(active + 1) % steps.length`).
  - [x] 4-pillar principles of play: Think Critically, Explore & Discover, Collaborate, Play Responsibly.
  - [x] Interactive Challenge Map with expansion toggle (5 levels default, 10 levels expanded).
  - [x] Hash-scroll support (`useEffect` listening to `location.hash`) for seamless deep linking to `#how-it-works` and `#challenges`.
  - [x] Responsive hamburger menu button (`.mp-mobile-menu`) and backdrop drawer (`.mp-mobile-drawer`).
- [x] Integrated reference `MissionPage.css` at `client/src/styles/MissionPage.css`:
  - [x] Scoped styles with `.htg-mission` root and `--lime`, `--white`, `--muted` variables.
  - [x] Connected campus hero background asset `/campus-hero.png`.
  - [x] Responsive breakpoints (1200px, 900px, 600px, 360px, 330px) verified down to 320px with zero horizontal scroll.
- [x] Routing Integration:
  - [x] Registered `MISSION: '/mission'` in `client/src/constants/routes.js`.
  - [x] Mounted `ROUTES.MISSION` as a standalone full-bleed route in `AppRoutes.jsx`.
  - [x] Updated cross-page nav links in `LoginPage.jsx`, `RegisterPage.jsx`, and `RulesPage.jsx` to route Mission to `/mission` and How It Works to `/mission#how-it-works`.
  - [x] Preserved existing in-page anchors on `HomePage.jsx` (`#mission`, `#how-it-works`).
- [x] Verification:
  - [x] Tested across all 7 target viewports (320px, 360px, 390px, 430px, 768px, 1024px, 1440px) with zero horizontal overflow.
  - [x] Production build clean (`npm run build --workspace=client` completed in 13.35s with 0 errors).
  - [x] Direct URL load of `/mission` returns HTTP 200 OK.
  - [x] Mission step selector and Next Step looping verified.
  - [x] Challenge map level expansion verified (5 to 10 levels toggle).

---

## Phase 2 Navigation Fix — Mission & How It Works Cross-Page Routing Complete (Completed)
- [x] Audited navigation links across all pages and layouts:
  - Identified in-page `#mission` and `#how-it-works` links on `HomePage.jsx` that failed to navigate to the dedicated Mission playbook page.
  - Identified standard anchor `<a>` tags on `LoginPage.jsx`, `RegisterPage.jsx`, and `RulesPage.jsx` that triggered full browser reloads.
  - Identified `Navbar.jsx` routing `ABOUT` and pointing `HOW IT WORKS` to deprecated stub `/how-it-works`.
- [x] Updated all navigation bars and mobile drawers to React Router `<Link>`:
  - `client/src/pages/public/HomePage.jsx`: Updated desktop `<nav>` and mobile drawer:
    - `MISSION` -> `<Link to={ROUTES.MISSION}>MISSION</Link>`
    - `HOW IT WORKS` -> `<Link to="/mission#how-it-works">HOW IT WORKS</Link>`
  - `client/src/pages/public/LoginPage.jsx`: Converted `HOW IT WORKS` anchor tag to `<Link to="/mission#how-it-works">`.
  - `client/src/pages/public/RegisterPage.jsx`: Converted `HOW IT WORKS` anchor tag to `<Link to="/mission#how-it-works">`.
  - `client/src/pages/public/RulesPage.jsx`: Converted `HOW IT WORKS` anchor tag to `<Link to="/mission#how-it-works">`.
  - `client/src/components/navigation/Navbar.jsx`: Updated `navLinks` list to `{ label: 'MISSION', path: ROUTES.MISSION }` and `{ label: 'HOW IT WORKS', path: '/mission#how-it-works' }`.
- [x] Enhanced `MissionPage.jsx` navigation handling:
  - Replaced single `useEffect` scroll with multi-tier retry (`0ms`, `60ms`, `200ms`) keyed to `[location.hash, location.pathname]`, guaranteeing accurate layout settling on SPA navigation.
  - Added `scrollToTop` handler when clicking `MISSION` while already on the Mission page.
  - Added direct `scrollToSection("#how-it-works")` handler when clicking `HOW IT WORKS` while already on the Mission page.
- [x] Configured fallback & redirect routes in `AppRoutes.jsx`:
  - Mounted `<Route path={ROUTES.MISSION} element={<MissionPage />} />`.
  - Redirected `<Route path={ROUTES.HOW_IT_WORKS} element={<Navigate to="/mission#how-it-works" replace />} />`.
  - Redirected `<Route path="/mission-map" element={<Navigate to={ROUTES.MISSION_MAP} replace />} />`.
- [x] Verification:
  - Tested clicking `MISSION` from `/`, `/login`, `/register`, `/rules` -> navigates to `/mission`.
  - Tested clicking `HOW IT WORKS` from `/`, `/login`, `/register`, `/rules` -> navigates to `/mission#how-it-works` and scrolls to Section 03 (`id="how-it-works"`).
  - Production build clean (`npm run build --workspace=client` built in 5.49s with 0 errors).
  - Dev server HTTP 200 OK verified across `/`, `/mission`, `/rules`, `/login`, `/register`, `/leaderboard`.

---

## Phase 2 UI Integration — Challenge Levels / Mission Map Page Complete (Completed)
- [x] Integrated reference `ChallengeLevelsPage.jsx` at `client/src/pages/public/ChallengeLevelsPage.jsx`:
  - [x] Full-bleed header (`.htg-levels-nav`) with brand mark, navigation links, and action buttons.
  - [x] Visual background stack (`.htg-levels-backdrop`) reusing authentic `/campus-hero.png` and cyber grid overlay.
  - [x] Intro panel with tactical eyebrow, large clamped typography, summary metrics (10 levels, 2–4 operatives, 90–120 mins), and event motto.
  - [x] Mission Map panel (`.htg-map-panel`) with 10 tiered challenge rows:
    - 01 Orientation (Easy)
    - 02 Web Exploitation (Easy)
    - 03 Cryptography (Medium)
    - 04 OSINT (Medium)
    - 05 Reverse Engineering (Medium)
    - 06 Forensics (Hard)
    - 07 Binary Exploitation (Hard)
    - 08 Network & Infrastructure (Hard)
    - 09 Logic & Steganography (Expert)
    - 10 Final Challenge (Expert)
  - [x] Interactive accordion click-to-expand behavior (`selectedLevel` state):
    - Toggles detailed mission briefings inline per challenge row.
    - Zero exposure of actual flags, answers, or sensitive secrets (UI-only presentation).
  - [x] 4-pillar benefits showcase (Explore, Progress, Learn, Compete) with quotation blockquote.
- [x] Integrated reference `ChallengeLevelsPage.css` at `client/src/styles/ChallengeLevelsPage.css`:
  - [x] Scoped styles with `.htg-levels-page` root and `--htg-lime`, `--htg-bg`, `--htg-panel` variables.
  - [x] Reused existing `/campus-hero.png` asset without adding redundant image files.
  - [x] Replaced `overflow: hidden` with `overflow-x: hidden` to allow natural vertical scrolling.
  - [x] Added `flex-wrap: wrap` to `.htg-levels-stats` for flawless responsiveness across ultra-small mobile screens.
- [x] Routing Integration:
  - [x] Registered `CHALLENGES: '/challenges'` in `client/src/constants/routes.js`.
  - [x] Mounted `ROUTES.CHALLENGES` as a standalone full-bleed route in `AppRoutes.jsx`.
- [x] Verification:
  - [x] Validated across all 12 target viewports (1440x900 down to 320x740) with zero horizontal overflow.
  - [x] Production build clean (`npm run build --workspace=client` completed in 7.42s with 0 errors).
  - [x] All existing pages (`HomePage`, `LoginPage`, `RegisterPage`, `RulesPage`, `MissionPage`) remain 100% intact.

---

## Phase 2 Navigation Fix — Challenge Levels Cross-Page Navigation & Dashboard Mapping Complete (Completed)
- [x] Connected Challenge Levels link across all major page entry points:
  - `client/src/components/navigation/Navbar.jsx`: Added `{ label: 'CHALLENGES', path: ROUTES.CHALLENGES }` to `navLinks`.
  - `client/src/layouts/ParticipantLayout.jsx`: Added `{ label: 'CHALLENGES', path: ROUTES.CHALLENGES, icon: Target }` to secondary tactical HUD nav.
  - `client/src/pages/participant/TeamDashboardPage.jsx`: Added `CHALLENGE LEVELS` CyberButton to header banner and direct link to `MISSION DIRECTIVE` card.
  - `client/src/pages/public/HomePage.jsx`: Updated desktop `<nav>` and mobile drawer to `<Link to={ROUTES.CHALLENGES}>CHALLENGES</Link>`.
  - `client/src/pages/public/MissionPage.jsx`: Updated desktop `<nav>` and mobile drawer to `<Link to={ROUTES.CHALLENGES}>CHALLENGES</Link>`.
  - `client/src/pages/public/RulesPage.jsx`: Updated desktop `<nav>` and mobile drawer to `<Link to={ROUTES.CHALLENGES}>CHALLENGES</Link>`.
  - `client/src/pages/public/LoginPage.jsx`: Updated desktop `<nav>` and mobile drawer to `<Link to={ROUTES.CHALLENGES}>CHALLENGES</Link>`.
  - `client/src/pages/public/RegisterPage.jsx`: Updated desktop `<nav>` and mobile drawer to `<Link to={ROUTES.CHALLENGES}>CHALLENGES</Link>`.
- [x] Enhanced `ChallengeLevelsPage.jsx` CTA buttons:
  - Integrated `useAuth` hook: dynamically renders `Dashboard` button when authenticated, or `Login` and `Register` when unauthenticated.
  - Added primary hero call-to-action buttons row linking to `/dashboard` (or `/register`) and `/rules`.
  - Mapped all navigation items to central `ROUTES` registry constants.
- [x] Routing alias configuration in `AppRoutes.jsx`:
  - Added `<Route path="/dashboard" element={<Navigate to={ROUTES.DASHBOARD} replace />} />` mapping direct `/dashboard` requests cleanly to `/portal/dashboard`.
- [x] Verification:
  - Tested clicking `CHALLENGES` from `/`, `/mission`, `/rules`, `/login`, `/register`, and `/portal/dashboard`.
  - Production build clean (`npm run build --workspace=client` completed in 6.67s with 0 errors).
  - Runtime HTTP 200 OK verified across `/challenges`, `/dashboard`, `/mission-map`, `/how-it-works`, `/rules`, `/login`, `/register`.

---

## Phase 2 UI Integration — Standalone Participant Dashboard UI Complete (Completed)
- [x] Integrated reference `ParticipantDashboard.jsx` at `client/src/pages/participant/ParticipantDashboard.jsx`:
  - [x] Full-bleed topbar with operative avatar/initials, dynamic team title, event sub-branding, and mobile drawer toggle button.
  - [x] Collapsible sidebar with active navigation state (`Dashboard`, `Challenges`, `Team`, `Leaderboard`, `Rules`, `Resources`, `Profile`), live sample countdown timer, and event quote.
  - [x] Welcome banner displaying authenticated operative's team name with explicit `[PREVIEW MODE // SAMPLE DATA]` badge.
  - [x] Telemetry stat cards: Challenges Solved (6/10), Total Points (1250), Team Members stack (3/4), Time Remaining.
  - [x] Current challenge highlight card: Level 07 Binary Exploitation with quick action buttons.
  - [x] 10-level challenge progression grid with completion indicators (`done`, `active`, `locked`).
  - [x] Category completion progress donut & difficulty bar distribution breakdown (Easy, Medium, Hard, Expert).
  - [x] Top 5 leaderboard standings preview with active team highlighting.
  - [x] Chronological activity feed showing recent solves and team events.
- [x] Integrated reference `ParticipantDashboard.css` at `client/src/styles/ParticipantDashboard.css`:
  - [x] Fully scoped under `.pd-page` with `--pd-lime: #b8ff3d` and `--pd-bg: #070b0a` cyber aesthetic tokens.
  - [x] Reused existing `/campus-hero.png` asset with layered gradients and cyber grid background overlay.
  - [x] Configured `overflow-x: hidden` for smooth vertical scrolling across all screen heights.
  - [x] Complete responsive breakpoints across Desktop (1400px), Tablet (1120px), Mobile (700px), and Small Mobile (390px).
  - [x] Added mobile navigation drawer overlay when `.is-open` is toggled.
- [x] Routing Integration:
  - [x] Decoupled route constants in `client/src/constants/routes.js`: `DASHBOARD: '/dashboard'` and `PORTAL_DASHBOARD: '/portal/dashboard'`.
  - [x] Mounted `ROUTES.DASHBOARD` as a top-level Standalone Full-Bleed route in `AppRoutes.jsx`.
  - [x] Added routing aliases for `/team` -> `/portal/team`, `/profile` -> `/portal/team`, and `/resources` -> `/faq` to avoid 404s.
  - [x] Updated `ParticipantLayout.jsx` to navigate internal dashboard links to `ROUTES.PORTAL_DASHBOARD`.
  - [x] Preserved existing tactical squad formation & mission workflows in `TeamDashboardPage.jsx` untouched.
- [x] Verification:
  - [x] Production build clean (`npm run build --workspace=client` completed in 25.19s with 0 errors).
  - [x] Runtime HTTP 200 OK verified across `/dashboard`, `/challenges`, `/team`, `/profile`, `/resources`, `/rules`, `/portal/dashboard`.

---

## Phase 2 UI Integration — Standalone QR Checkpoint Page Complete (Completed)
- [x] Integrated reference `QRCheckpointPage.jsx` at `client/src/pages/participant/QRCheckpointPage.jsx`:
  - [x] Three-column layout: left-side event intro & stats, center QR viewfinder card & recent checkpoints, right-side 4-step "How It Works" guide, rules list, and challenge map CTA.
  - [x] File upload image preview handler with dynamic object URL creation and safe revoke.
  - [x] Honest status reporting: clearly displays "Image selected. QR decoding is not connected yet." without fake scan completion.
  - [x] Recent checkpoint status cards with status indicators (`completed`, `pending`, `locked`) flagged as sample preview data.
  - [x] Integrated React Router `Link` navigation using central `ROUTES` registry (`/`, `/mission`, `/mission#how-it-works`, `/challenges`, `/qr-checkpoint`, `/leaderboard`, `/dashboard`, `/register`).
- [x] Integrated reference `QRCheckpointPage.css` at `client/src/styles/QRCheckpointPage.css`:
  - [x] Scoped styles with `.htg-qr-page` root and `--qr-lime: #b8ff3d` / `--qr-bg: #070b0a` theme tokens.
  - [x] Reused existing `/campus-hero.png` background image with double linear gradient masks and subtle grid lines.
  - [x] Replaced `overflow: hidden` with `overflow-x: hidden` to enable full vertical scrolling on mobile and prevent horizontal overflow.
  - [x] Responsive layout breakdown at 1300px, 850px, 560px, and 360px viewports.
- [x] Routing Integration:
  - [x] Registered `QR_CHECKPOINT: '/qr-checkpoint'` in `client/src/constants/routes.js`.
  - [x] Mounted `ROUTES.QR_CHECKPOINT` as a top-level Standalone Full-Bleed route in `AppRoutes.jsx`.
  - [x] Added `QR CHECKPOINT` to shared `Navbar.jsx` (`navLinks`).
  - [x] Preserved existing authenticated `/portal/checkpoint` scanner untouched.
- [x] Verification:
  - [x] Production build clean (`npm run build --workspace=client` completed in 5.50s with 0 errors).
  - [x] Runtime HTTP 200 OK verified across `/qr-checkpoint`, `/dashboard`, `/challenges`, `/mission`, `/rules`, `/register`, `/leaderboard`.

---

## Phase 2 / Phase 7 Engineering — Functional Live Camera QR Scanner Complete (Completed)
- [x] Upgraded `QRCheckpointPage.jsx` with real-time camera scanning:
  - [x] Integrated browser-native `BarcodeDetector` API for high-performance client-side QR code recognition.
  - [x] MediaStream acquisition with `{ facingMode: { ideal: "environment" } }` targeting mobile rear cameras.
  - [x] Live viewfinder with animated bounding corners and camera state indicator.
  - [x] Graceful fallbacks and comprehensive error handling: `NotAllowedError` (permissions denied), `NotFoundError` (no device camera), and non-Chromium fallback messages.
  - [x] Strict resource cleanup: camera tracks and requestAnimationFrame loops terminate immediately on detection, user cancel, or unmount.
- [x] Connected scanning to backend verification workflow:
  - [x] Intelligent payload parser for URL queries (`code` and `token`), JSON schemas, or raw strings.
  - [x] Integrated `checkpointService.scanCheckpoint(code, token)` for authenticated operatives.
  - [x] Unverified detection banner with explicit warning against client-side point awards.
  - [x] Inline server verification trigger with status feedback and Login redirect for unauthenticated guests.
- [x] Verification:
  - [x] Production build clean (`npm run build --workspace=client` completed in 13.78s with 0 errors).
  - [x] Runtime HTTP 200 OK verified across all routes.

---

## Phase 2 / Phase 7 Engineering — Cross-Browser QR Scanning (`html5-qrcode`) Complete (Completed)
- [x] Replaced `BarcodeDetector`-only scanner with `html5-qrcode` (^2.3.8):
  - [x] Eliminated "Live QR decoding via BarcodeDetector is not supported by this browser" limitation.
  - [x] Universal cross-browser support across Chrome, Firefox, Safari, Edge, and iOS/Android mobile WebViews.
  - [x] Camera device enumeration via `Html5Qrcode.getCameras()` with automatic rear/environment camera preference.
  - [x] Interactive camera switcher dropdown when multiple camera sensors are available.
  - [x] Idempotent callback locking via `hasScannedRef` preventing duplicate detection triggers.
  - [x] Safe lifecycle teardown handling unmounts and React Strict Mode rerenders without leaking media tracks.
  - [x] Dual-mode scanner: continuous live camera scanning + client-side image file QR decoding via `Html5Qrcode.scanFile()`.
- [x] Verification:
  - [x] Production build clean (`npm run build --workspace=client` completed in 8.71s with 0 errors).
  - [x] Runtime HTTP 200 OK verified across `/qr-checkpoint` and all 7 core routes.

---

## Phase 2 UI Integration — Standalone Leaderboard Page (`/leaderboard`) Complete (Completed)
- [x] Implemented reference 3-column desktop layout at `client/src/pages/public/LeaderboardPage.jsx` and `client/src/styles/LeaderboardPage.css`:
  - [x] **Left Hero (~28%)**:
    - [x] Eyebrow: `TOP TEAMS RISE TO THE GRID` in electric lime.
    - [x] Heading: White `LIVE STANDINGS` with `THE GRID` in electric lime `#b8ff3d`.
    - [x] Accent bar and supporting telemetry paragraph.
    - [x] Key metrics: Participants (`120+`), Challenges (`10`), Champion points (`1,850`).
    - [x] Motivational event quote on dark overlay card with lime border.
  - [x] **Center Column (~47%)**:
    - [x] Compact podium with 3 ranked teams:
      - Silver runner-up on the left (`#02 CyberTitans`, 1,620 PTS, 8/10 solved).
      - Taller gold champion in the center (`#01 NullPointers`, 1,850 PTS, 9/10 solved, lime glow).
      - Bronze third place on the right (`#03 HackOverflow`, 1,480 PTS, 8/10 solved).
      - Compact proportions preventing table push-down.
    - [x] Full live standings panel:
      - Search box with query matching.
      - Filter pills: All Teams / Top 5 / My Team.
      - Sort dropdown: Rank / Points / Solved.
      - Table columns: `RANK`, `TEAM NAME`, `CHALLENGES SOLVED`, `POINTS`, `LAST ACTIVITY`, `TREND`.
      - Highlighted current team row (`#04 ByteForce [YOU]`).
      - Responsive horizontal scroll wrapper.
  - [x] **Right Sidebar (~25%)**:
    - [x] Your Team status card with `#04` rank badge, points, 6/10 progress bar, trend, and `View Team Dashboard →` link.
    - [x] Leaderboard Stats panel with Total Teams (32), Challenges (10), Participants (128), and Highest Points (1,850 PTS).
    - [x] Recent Activity feed with live marker, team events, timestamps, and View All toggle.
- [x] Navbar and routing compliance:
  - [x] Connected all nav items (`Mission`, `How It Works`, `Challenges`, `QR Checkpoint`, `Rules`, `Leaderboard`) to canonical routes.
  - [x] Rules link points to `ROUTES.RULES` (`/rules`) with zero `href="#"` or broken hash links.
  - [x] Mobile drawer for screens below 860px.
- [x] Visual Verification & Build:
  - [x] Headless Chrome screenshot verified at 1440x900 capturing the complete 3-column layout, podium, rankings, and sidebar cards.
  - [x] Production build clean (`npm run build --workspace=client` built in 20.61s with 0 errors).
  - [x] Dev server runtime HTTP 200 OK verified.

---

## Phase 2 / Phase 5 Integration — Final Flag / Victory UI (`/final-flag`) Complete (Completed)
## Phase 2 / Phase 5 Integration — Final Flag UI Visual Alignment with Reference Design (Completed)
- [x] **Visual Redesign & Component Architecture (`FinalFlagPage.jsx`)**:
  - [x] Replaced previous generic HUD header with full-width top navigation bar (`HACK THE GRID`, `CODESPHERE × UTKRISHT 2026`, nav links: `MISSION`, `HOW IT WORKS`, `CHALLENGES`, `QR CHECKPOINT`, `LEADERBOARD`, active `FINAL FLAG` underlined in electric lime, `DASHBOARD` bordered button, and electric lime `REGISTER` button).
  - [x] **Hero Section**:
    - [x] Left column: Small lime flag icon + `FINAL CHALLENGE`, large bold heading `THE LAST FLAG` (white) / `AWAITS` (lime `#b8ff3d`), uppercase tracked tagline `YOU'VE SCANNED. YOU'VE SOLVED. NOW CLAIM VICTORY.`, description paragraph, and 3 stat cards in a row (`Level 10 — Final Challenge`, `1 Flag — Ultimate Goal`, `Maximum Points — 500 pts`).
    - [x] Right column: High-impact cinematic artwork with the dark tattered flag, glowing lime hood/skull emblem on rocks with green fissures, and Tula's University campus behind it (`/final-flag-hero-art.png`).
  - [x] **Lower Section (Two Prominent Panels)**:
    - [x] **Left Panel (57% width)**:
      - [x] Heading: `Submit Final Flag` (with `Final Flag` in lime) + subtitle.
      - [x] Key icon input field (`Enter your flag here (e.g. HTG{...})`).
      - [x] Bright electric lime `Submit Flag` button with paper plane icon.
      - [x] Centered `OR` divider.
      - [x] `Scan Final Flag QR` action card with QR icon, camera prompt, and chevron leading to `/qr-checkpoint`.
      - [x] Right sub-column: `Requirements` (4 checklist items with green circular checkmark badges) and `Important` (4 bullet warning points with alert icon).
    - [x] **Right Panel (43% width)**:
      - [x] Radial lime-glowing trophy icon, `VICTORY AWAITS` heading in lime, and subtitle.
      - [x] 6-checkpoint horizontal progression timeline with checkmark nodes (`CP-01 Main Gate`, `CP-02 Central Lawn`, `CP-03 Library Block`, `CP-04 CSE Block`, `CP-09 Final Room`), green connecting line, and glowing target node (`CP-10 Final Flag`).
      - [x] Centered quotation card with stylized lime quotes: *"It's not just a flag. It's proof that you conquered the grid." — Hack the Grid 2026*.
  - [x] Functional backend connection preserved to authenticated `challengeService.submitFlag(10, flag)` (`POST /api/v1/submissions/submit`) with error handling and victory alert banner.
- [x] **Stylesheet Updates (`FinalFlagPage.css`)**:
  - [x] Rebuilt with exact electric lime (`#b8ff3d`), obsidian backgrounds (`#070908`), glowing accents, DM Mono typography for badges and codes, and Manrope grotesque fonts.
  - [x] Responsive layout covering desktop (1536px/1440px), tablet (1024px/960px), and mobile (640px).
- [x] **Empirical Verification**:
  - [x] Clean client build: `npm run build --workspace=client` (1,744 modules transformed, 0 errors).
  - [x] Headless Chrome visual verification: Captured 1536×1024 screenshot (`final-flag-screenshot.png`) and verified visual fidelity against the target reference image.
  - [x] HTTP 200 OK verified on `/final-flag`.

---

## Phase 2 Milestone — Shared Navbar Standardization Across All Pages (Completed)
- [x] **Single Shared Navbar Component (`client/src/components/navigation/Navbar.jsx`)**:
  - [x] Enforced strict 7-item navigation order on both desktop and mobile views:
    1. `HOME` (`/`)
    2. `LEADERBOARD` (`/leaderboard`)
    3. `MISSION` (`/mission`)
    4. `CHALLENGES` (`/challenges`)
    5. `QR CHECKPOINT` (`/qr-checkpoint`)
    6. `FINAL FLAG` (`/final-flag`)
    7. `RULES` (`/rules`)
  - [x] Removed standalone `HOW IT WORKS` link from navbar (the operational section remains accessible via `/mission#how-it-works`).
  - [x] Added `HOME` and `RULES` into the global navbar link list.
  - [x] Implemented exact path matching for `HOME` (`pathname === '/'`) to prevent false-positive active indicators on sub-routes.
  - [x] Retained authenticated context awareness: dynamic `DASHBOARD` action button leading to `/dashboard` (or `/login`), and `REGISTER` CTA button leading to `/register`.
- [x] **Unified Stylesheet (`client/src/styles/Navbar.css`)**:
  - [x] Standardized typography: 13px font size, uppercase letter-spacing (0.05em–0.08em), 600 font weight, and muted state `#a3b899`.
  - [x] Active page indicator: 2px electric lime `#b8ff3d` underline with glowing box-shadow (`rgba(184, 255, 61, 0.4)`).
  - [x] Brand lockup: "HACK THE GRID" with neon dot + "CODESPHERE × UTKRISHT 2026" sub-badge.
  - [x] Responsive layout: full 7 links visible on desktop (≥1024px), hamburger toggle below 1024px opening dark slide-down mobile drawer with all 7 links in identical order.
  - [x] Fixed mobile horizontal blowout with `overflow-x: hidden` in `client/src/styles/index.css`.
- [x] **Complete Multi-Page Header Consolidation (Replaced Duplicate Inlined Navbars Across 9 Pages)**:
  - [x] `client/src/pages/public/HomePage.jsx`
  - [x] `client/src/pages/public/LeaderboardPage.jsx`
  - [x] `client/src/pages/public/MissionPage.jsx`
  - [x] `client/src/pages/public/ChallengeLevelsPage.jsx`
  - [x] `client/src/pages/participant/QRCheckpointPage.jsx`
  - [x] `client/src/pages/participant/FinalFlagPage.jsx`
  - [x] `client/src/pages/public/RulesPage.jsx`
  - [x] `client/src/pages/public/LoginPage.jsx`
  - [x] `client/src/pages/public/RegisterPage.jsx`
- [x] **Empirical Verification & Testing**:
  - [x] Production build clean: `npm run build --workspace=client` (1,745 modules transformed, 0 errors).
  - [x] Live route verification: Confirmed HTTP 200 OK across all 9 routes.
  - [x] Visual validation across Desktop (1536×1024), Tablet (1024×768), and Mobile (390×844 and 800×900) via automated screenshots.

---

## Phase 2 Milestone — Responsive Homepage ZIP Integration (Completed)
- [x] **Integration of Responsive Homepage Package (`Hack-The-Grid-Responsive-Homepage-Full-Code.zip`)**:
  - [x] Extracted and inspected `README-INTEGRATION.md` specifications.
  - [x] Updated `client/src/pages/public/HomePage.jsx` with full visual hierarchy, 10-level challenge grid, 4-step mission process, event stats, and responsive header/footer.
  - [x] Updated `client/src/styles/HomePage.css` with BEM class architecture, responsive breakpoints (1500px, 1180px, 900px, 600px), and dark/electric-lime palette.
  - [x] Verified static mountain-campus background layer (`client/public/campus-hero.png`) using `position: fixed; inset: 86px 0 0;` ensuring static positioning during page scroll.
  - [x] Enforced exact navbar link order on both desktop and mobile views:
    1. `Home` (`/`)
    2. `Leaderboard` (`/leaderboard`)
    3. `Mission` (`/mission`)
    4. `Challenges` (`/challenges`)
    5. `QR Checkpoint` (`/qr-checkpoint`)
    6. `Final Flag` (`/final-flag`)
    7. `Rules` (`/rules`)
  - [x] Retained action links: Login (`/login`) outline button, Register (`/register`) electric lime button.
  - [x] Preserved single global header per page without duplicating global navigation or breaking route layouts.
- [x] **Empirical Verification & Testing**:
  - [x] Clean client build: `npm run build --workspace=client` (1,745 modules transformed, 0 errors, built in 6.86s).
  - [x] Image asset verified: Confirmed HTTP 200 OK loading for `/campus-hero.png`.
  - [x] Route verification: Confirmed HTTP 200 OK across `/`, `/leaderboard`, `/mission`, `/challenges`, `/qr-checkpoint`, `/final-flag`, `/rules`, `/login`, `/register`.
  - [x] Headless Chrome visual verification:
    - Desktop (1536×1024): `homepage-desktop.png` capturing hero, static campus background, stats bar, and nav.
    - Tablet (1024×768): `homepage-tablet.png` capturing responsive proportions and layout integrity.
    - Mobile (390×844): `homepage-mobile-closed.png` capturing closed hamburger state with 0 horizontal overflow (`scrollWidth === 390px`).
    - Mobile Interactive (390×844): `homepage-mobile-open.png` capturing expanded drawer after toggle click with all 7 links and auth CTAs.

---

## Phase 2 Milestone — Sticky Navbar & Enlarged Footer Root Cause Resolution (Completed)
- [x] **Empirical Root Cause Identification**:
  - [x] Identified that `.htg-header` was failing sticky positioning because ancestor `.htg-home` had `overflow: clip;`, which cancels sticky behavior in modern CSS specs.
  - [x] Identified that `html, body, #root` had `overflow-x: hidden;` in `index.css`, which triggered automatic `overflow-y: auto` on `#root`, creating an internal scroll container and desynchronizing viewport scroll.
- [x] **Sticky Navbar Fixes**:
  - [x] Replaced `overflow-x: hidden;` on `html, body, #root` with `overflow-x: clip;` on `html, body` and clean `min-height: 100vh; display: flex; flex-direction: column;` on `#root` in `index.css`.
  - [x] Removed `overflow: clip;` from `.htg-home` in `HomePage.css`.
  - [x] Styled `.htg-header` with `position: sticky; top: 0; z-index: 1000; height: 82px; background: #040806; box-shadow: 0 4px 24px rgba(0,0,0,0.6);`.
  - [x] Added `html { scroll-behavior: smooth; scroll-padding-top: 88px; }` (and `80px` on mobile) to guarantee anchor links (`#mission`, `#how-it-works`, `#challenges`, `#team`, `#rules`) do not get obscured behind the sticky navbar.
  - [x] Preserved canonical 7-item navigation order (Home, Leaderboard, Mission, Challenges, QR Checkpoint, Final Flag, Rules) and mobile hamburger menu.
- [x] **Footer Fixes & Enlargement**:
  - [x] Kept footer in normal document flow at the bottom of the page (`position: relative; z-index: 10;`).
  - [x] Eliminated fixed hero background bleed-through with solid opaque `#030706` background.
  - [x] Enlarged vertical padding to `38px clamp(24px, 5.5vw, 94px)` (desktop) and `34px 22px` (mobile).
  - [x] Increased footer brand size to `24px` with clear tagline and spacing.
  - [x] Added exact creator credit: `Built with ♥ by Hrithik Roshan` with `#ff4d64` red heart and glowing hover effect.
- [x] **Empirical Verification & Testing**:
  - [x] Verified with headless Chrome CDP automated testing:
    - Stickiness confirmed at 7 scroll steps (0, 400, 1000, 1800, 2600, 3400, 4200px) with `headerTop === 0`.
    - Anchor headings tested for safe top offsets.
    - Verified mobile sticky scroll and stacked footer layout at 390×844.
  - [x] Visual artifacts saved:
    - `homepage-sticky-scrolled-desktop.png`: Sticky navbar over scrolled content.
    - `homepage-footer-enlarged-desktop.png`: Enlarged desktop footer with exact credit and solid background.
    - `homepage-sticky-scrolled-mobile.png`: Mobile sticky navbar during scrolling.
    - `homepage-footer-mobile-bottom.png`: Stacked mobile footer at bottom of viewport.
  - [x] Verified clean production build: `npm run build --workspace=client` (1,745 modules transformed, 0 errors in 9.53s).


---

## Phase 2 Milestone — Homepage Refinements: Compact Spacing, Sticky Navbar, Team Section & Footer Credit (Completed)
- [x] **Integration of Updated Homepage Package (`Hack-The-Grid-Homepage-Updated-Spacing-Team.zip`)**:
  - [x] Extracted and verified `README-INTEGRATION.md` specifications.
  - [x] Integrated `HomePage.jsx` with dedicated Team section (`#team`), updated footer credits, and preserved 7-link navbar sequence.
  - [x] Integrated `HomePage.css` with compact section spacing, larger typography scales, sticky header, and opaque section backgrounds.
  - [x] Confirmed static campus background (`/campus-hero.png`) remaining stationary at `position: fixed; inset: 82px 0 0;` behind opaque content.
- [x] **Spacing & Typography Polish**:
  - [x] Reduced vertical section padding from 140px/170px down to `clamp(48px, 5vw, 76px)`.
  - [x] Scaled up hero heading (`clamp(76px, 8.7vw, 142px)`), subheadings (`clamp(48px, 5.5vw, 82px)`), and description copy (`clamp(16px, 1.25vw, 20px)`).
  - [x] Configured sticky navbar (`position: sticky; top: 0; height: 82px`) with scroll padding (`scroll-padding-top: 88px` desktop, `76px` mobile) to prevent heading overlap.
- [x] **Team Section Implementation**:
  - [x] Added Faculty Coordinators (Mr. Shivam Paney, Mr. Mohit Saini, Mr. Abhishek Rawat — CSE Department).
  - [x] Added Student Coordinators (Hrithik Roshan — Advisor, Anshika Kumari — President, Ayush Kumar — Vice-President — CodeSphere Core Team).
  - [x] Implemented styled circular dashed-border placeholder badges (`PHOTO`) without dummy or invented avatars.
  - [x] 3-column responsive grid on desktop, neatly stacked cards on mobile.
- [x] **Footer Updates**:
  - [x] Added explicit credit: `Built with ♥ by Hrithik Roshan` with glowing accent styling.
  - [x] Preserved CodeSphere / Hack the Grid branding and copyright.
- [x] **Empirical Verification & Testing**:
  - [x] Clean client build: `npm run build --workspace=client` (1,745 modules transformed, 0 errors, built in 12.23s).
  - [x] Automated visual and layout tests:
    - Desktop hero: `homepage-updated-desktop.png`
    - Desktop team section: `homepage-team-desktop.png`
    - Desktop footer: `homepage-footer-desktop.png`
    - Mobile top: `homepage-updated-mobile.png` (verified `scrollWidth === 390px`, 0 overflowing elements)
    - Mobile drawer: `homepage-updated-mobile-open.png`
    - Mobile team section: `homepage-team-mobile.png`

---

## Phase 2 Milestone — Redesigned Admin Mission Control Dashboard Integration (Completed)
- [x] **Integration of `Hack-The-Grid-Admin-Dashboard-Redesigned.zip`**:
  - [x] Inspected `README-INTEGRATION.md`, React Router (`AppRoutes.jsx`, `routes.js`), and `AdminLayout.jsx`.
  - [x] Integrated `client/src/pages/admin/AdminDashboard.jsx` and `client/src/styles/AdminDashboard.css`.
  - [x] Registered standalone `/admin/dashboard` (`ROUTES.ADMIN_DASHBOARD`) to avoid duplicate sidebars/headers from `AdminLayout.jsx`.
  - [x] Registered `/admin/login` (`ROUTES.ADMIN_LOGIN`) rendering `LoginPage` with the `Admin Login` tab pre-selected while preserving `/login` unchanged.
- [x] **Theme, Assets & Dashboard Sections Verified**:
  - [x] Preserved Hack the Grid dark (`#080b0a` / `#0e1311`) + electric-lime (`#b8ff3d`) theme and reused `/campus-hero.png` in `.ad-hero-banner`.
  - [x] Verified all dashboard sections:
    - **Overview statistics** (`.ad-metrics`): Registered Teams (`32`), Total Participants (`128`), Flags Captured (`146`), Active Checkpoints (`10`).
    - **Challenge activity** (`.ad-chart-panel`): Live Event Pulse SVG area/line chart.
    - **Level progress** (`.ad-level-panel`): Mission Progress `60%` (`6/10` conic ring and Level 01–05 completion bars).
    - **Event controls** (`.ad-control-panel`): Local demo pause/resume toggle and subsystem status rows.
    - **Team overview** (`.ad-teams-panel`): Searchable, filterable demo squad table with immutable local `Review` / `Clear` toggle.
    - **Recent submissions** (`.ad-submissions-panel`): Answer validation list with `Correct`, `Review`, and `Incorrect` badges.
    - **Recent activity** (`.ad-activity-panel`): System feed timeline.
    - **Quick actions** (`.ad-quick-actions`): Links to Questions (`/admin/questions`), QR Checkpoints (`/admin/checkpoints`), Leaderboard (`/admin/leaderboard`), and Event Analytics (`/admin/analytics`).
- [x] **Route & Demo Data Reporting**:
  - [x] Verified QR Checkpoints points to `/admin/checkpoints` (`CheckpointManagerPage.jsx` under `AdminLayout`) and Questions points to `/admin/questions` (dedicated standalone `/admin/questions`, `/admin/security-logs`, and `/admin/analytics` pages are not yet implemented; question pool management currently resides inside `ChallengePoolPage.jsx` at `/admin/challenges`).
  - [x] Clearly labeled all dashboard metrics, charts, submissions, and event toggles as local demo-only preview data (`DEMO MODE`).
- [x] **Build & Empirical Verification**:
  - [x] `npm run build --workspace=client` succeeded with 0 errors (1,747 modules transformed).
  - [x] Verified desktop (`admin-dashboard-desktop.png`), mobile (`admin-dashboard-mobile.png`), mobile drawer (`admin-dashboard-mobile-drawer.png`), and `/admin/login` tab selection via headless Chrome CDP.

---

## Phase 2 Milestone — Admin Team Management UI & Shared Mission Control Sidebar Integration (Completed)
- [x] **Integration of `Hack-The-Grid-Team-Management-UI-Reference-Match.zip`**:
  - [x] Inspected `README-INTEGRATION.md`, reference screenshot (`admin-team-management-reference.png`), and existing admin routes/controllers.
  - [x] Created shared [`client/src/components/navigation/AdminSidebar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/AdminSidebar.jsx) implementing the exact Mission Control sidebar reference with automatic active-route detection (`useLocation()`), React Router `<Link>` navigation across all 9 admin sections, dynamic badge counts, and mobile slide-over drawer support.
  - [x] Integrated [`client/src/pages/admin/TeamManagementPage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/admin/TeamManagementPage.jsx) and [`client/src/styles/TeamManagementPage.css`](file:///c:/projects/Hack-The-Grid/client/src/styles/TeamManagementPage.css).
  - [x] Registered `/admin/teams` (`ROUTES.ADMIN_TEAMS`) as a standalone full-bleed route in `AppRoutes.jsx` (and added `/admin/questions` and `/admin/security-logs` routes) so there are no duplicate sidebars or headers from `AdminLayout.jsx`.
- [x] **Backend & Service Layer Integration**:
  - [x] Created [`client/src/services/admin.service.js`](file:///c:/projects/Hack-The-Grid/client/src/services/admin.service.js) wrapping `/api/v1/admin/*` endpoints.
  - [x] Enhanced [`server/src/controllers/admin.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/admin.controller.js):
    - `getAllTeams`: Populates `leaderId` and `members` with `'username email fullName role collegeRollNo isActive'` while keeping `passwordHash` hidden (`select: false`).
    - `disqualifyTeam`: Validates 24-hex ObjectId format, sanitizes `reason`, supports both disqualifying (`isDisqualified: true`) and restoring (`isDisqualified: false`) a team, and returns the populated team document.
  - [x] Explicitly separated live database records (`● LIVE DATABASE`) from demo preview fallback (`● DEMO PREVIEW DATA`) with a clear warning banner when unauthenticated or when the backend is offline.
- [x] **Build & Empirical Verification**:
  - [x] `npm run build --workspace=client` succeeded with 0 errors (1,750 modules transformed in 6.25s).
  - [x] Verified desktop (`team-management-desktop.png`), grid view (`team-management-grid.png`), tablet (`team-management-tablet.png`), mobile (`team-management-mobile.png`), and mobile drawer (`team-management-mobile-drawer.png`) via headless Chrome CDP.

---

## Phase 2 Milestone — Admin Challenge Management UI & Backend Integration (Completed)
- [x] **Integration of `Hack-The-Grid-Challenge-Management-UI.zip`**:
  - [x] Inspected `README-INTEGRATION.md`, existing `Challenge`, `Question`, and `Checkpoint` models, and admin routes/controllers.
  - [x] Integrated [`client/src/pages/admin/ChallengeManagementPage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/admin/ChallengeManagementPage.jsx) and [`client/src/styles/ChallengeManagementPage.css`](file:///c:/projects/Hack-The-Grid/client/src/styles/ChallengeManagementPage.css) using the shared [`AdminSidebar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/AdminSidebar.jsx) with `Challenges` (`⌘ Challenges`) highlighted on `/admin/challenges`.
  - [x] Registered `/admin/challenges` (`ROUTES.ADMIN_CHALLENGES`) as a standalone full-bleed route in [`client/src/routes/AppRoutes.jsx`](file:///c:/projects/Hack-The-Grid/client/src/routes/AppRoutes.jsx) without duplicate `AdminLayout` sidebars/headers.
- [x] **Backend & Service Layer Integration**:
  - [x] Extended [`server/src/constants/challengeTypes.js`](file:///c:/projects/Hack-The-Grid/server/src/constants/challengeTypes.js) and [`server/src/models/Challenge.js`](file:///c:/projects/Hack-The-Grid/server/src/models/Challenge.js) to support `subtitle`, `status` (`Published`, `Draft`, `Paused` synced with `isActive`), `objectives`, `image`, and UI category tags (`Recon`, `OSINT`, `Crypto`, `Web`, `Forensics`, `Pwn`, `Stego`, `Network`, `Mixed`).
  - [x] Added `GET /api/v1/admin/challenges`, `PATCH /api/v1/admin/challenges/:challengeId`, and `GET /api/v1/admin/questions` in [`server/src/routes/admin.routes.js`](file:///c:/projects/Hack-The-Grid/server/src/routes/admin.routes.js) and [`server/src/controllers/admin.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/admin.controller.js) with server-side validation, linked question counts, linked QR checkpoints, and strict flag exclusion (`select('-flag')`).
  - [x] Added `getChallenges`, `updateChallenge`, and `getQuestions` to [`client/src/services/admin.service.js`](file:///c:/projects/Hack-The-Grid/client/src/services/admin.service.js).
  - [x] Explicitly separated live database records (`● LIVE DATABASE`) from demo preview fallback (`● DEMO PREVIEW DATA`).
- [x] **Build & Empirical Verification**:
  - [x] `npm run build --workspace=client` succeeded with 0 errors (1,752 modules transformed in 6.33s).
  - [x] Verified desktop (`challenge-management-desktop.png`), Add Challenge modal (`challenge-management-modal.png`), grid view (`challenge-management-grid.png`), tablet (`challenge-management-tablet.png`), mobile (`challenge-management-mobile.png`), and mobile drawer (`challenge-management-mobile-drawer.png`) via headless Chrome CDP.

---

## Phase 2 Milestone — Admin Question Management UI & Backend Integration (Completed)
- [x] **Integration of `Hack-The-Grid-Question-Management-UI.zip`**:
  - [x] Inspected `README-INTEGRATION.md`, existing `Question` and `Challenge` models, and admin routes/controllers.
  - [x] Integrated [`client/src/pages/admin/QuestionManagementPage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/admin/QuestionManagementPage.jsx) and [`client/src/styles/QuestionManagementPage.css`](file:///c:/projects/Hack-The-Grid/client/src/styles/QuestionManagementPage.css) reusing the shared [`AdminSidebar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/AdminSidebar.jsx) with `Questions` (`☰ Questions`) highlighted on `/admin/questions`.
  - [x] Registered `/admin/questions` (`ROUTES.ADMIN_QUESTIONS`) as a standalone full-bleed route in [`client/src/routes/AppRoutes.jsx`](file:///c:/projects/Hack-The-Grid/client/src/routes/AppRoutes.jsx) without duplicate `AdminLayout` sidebars or headers.
- [x] **Backend & Service Layer Integration**:
  - [x] Extended [`server/src/constants/challengeTypes.js`](file:///c:/projects/Hack-The-Grid/server/src/constants/challengeTypes.js) and [`server/src/models/Question.js`](file:///c:/projects/Hack-The-Grid/server/src/models/Question.js) to support `type` (`Text Answer`, `Flag`, `Multiple Choice`, `File Upload`), `points`, `status` (`Published`, `Draft`, `Paused` synced with `isActive`), `attempts`, `required`, and question categories (`Cryptography`, `Web Security`, `Networking`, `Encoding`).
  - [x] Added `PATCH /api/v1/admin/questions/:questionId` and enhanced `GET /api/v1/admin/questions` and `POST /api/v1/admin/questions` in [`server/src/routes/admin.routes.js`](file:///c:/projects/Hack-The-Grid/server/src/routes/admin.routes.js) and [`server/src/controllers/admin.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/admin.controller.js).
  - [x] Strictly protected secret flags: `Question.flag` remains `select: false` by default and is never exposed to participant APIs (`/mission-map`, `/current`, `/checkpoints/scan`). Authenticated admin endpoints allow flags only via explicit `includeFlag=true`, and the client UI preview panel requires an explicit "Reveal" click.
  - [x] Added `updateQuestion` to [`client/src/services/admin.service.js`](file:///c:/projects/Hack-The-Grid/client/src/services/admin.service.js).
  - [x] Clearly distinguished live database state (`● LIVE DATABASE`) from demo preview fallback (`● DEMO PREVIEW DATA`).
- [x] **Build & Empirical Verification**:
  - [x] `npm run build --workspace=client` succeeded with 0 errors (1,754 modules transformed in 12.67s).
  - [x] Verified desktop (`question-management-desktop.png`), secret answer reveal (`demo-answer-not-for-production`), Add Question modal (`question-management-modal.png`), grid view (`question-management-grid.png`), tablet (`question-management-tablet.png`), mobile (`question-management-mobile.png`), and mobile drawer (`question-management-mobile-drawer.png`) via headless Chrome CDP.

---

## Phase 2 Milestone — Admin QR Checkpoint Management UI & Real Scannable QR Generation (Completed)
- [x] **Integration of `Hack-The-Grid-QR-Checkpoint-Management-UI.zip`**:
  - [x] Inspected `README-INTEGRATION.md`, existing `Checkpoint` and `Challenge` models, and participant scan flows.
  - [x] Integrated [`client/src/pages/admin/QRCheckpointManagementPage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/admin/QRCheckpointManagementPage.jsx) and [`client/src/styles/QRCheckpointManagementPage.css`](file:///c:/projects/Hack-The-Grid/client/src/styles/QRCheckpointManagementPage.css) reusing the shared [`AdminSidebar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/AdminSidebar.jsx) with `QR Checkpoints` (`▦ QR Checkpoints`) highlighted on `/admin/checkpoints`.
  - [x] Registered `/admin/checkpoints` (`ROUTES.ADMIN_CHECKPOINTS`) as a standalone full-bleed route in [`client/src/routes/AppRoutes.jsx`](file:///c:/projects/Hack-The-Grid/client/src/routes/AppRoutes.jsx) without duplicate `AdminLayout` sidebars or headers.
- [x] **Real Scannable QR Code Generation & Printable Placards**:
  - [x] Installed `qrcode` in the `client` workspace (`npm install qrcode --workspace=client`).
  - [x] Replaced decorative 21×21 SVGs with `ScannableQrImage` component that renders genuine scannable QR data URLs encoding canonical verification URLs (`/checkpoint/scan?code=...&token=...`).
  - [x] Built high-resolution printable placard generator (`downloadPlacard`) exporting branded `HTG-Placard-${code}.png` placards ready for physical competition deployment.
  - [x] Added "Copy URL" button and station configuration inspector.
- [x] **Backend & Service Layer Integration**:
  - [x] Extended [`server/src/models/Checkpoint.js`](file:///c:/projects/Hack-The-Grid/server/src/models/Checkpoint.js) with `status` (`'Active' | 'Paused' | 'Draft'`), `mode` (`'Public QR' | 'Team-bound QR'`), and `lastScanAt` (`Date`), keeping `status === 'Active'` synced with `isActive`.
  - [x] Added `PATCH /api/v1/admin/checkpoints/:checkpointId` and enhanced `GET /api/v1/admin/checkpoints` and `POST /api/v1/admin/checkpoints` in [`server/src/routes/admin.routes.js`](file:///c:/projects/Hack-The-Grid/server/src/routes/admin.routes.js) and [`server/src/controllers/admin.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/admin.controller.js).
  - [x] Added `updateCheckpoint` to [`client/src/services/admin.service.js`](file:///c:/projects/Hack-The-Grid/client/src/services/admin.service.js).
  - [x] Clearly distinguished live database state (`● LIVE DATABASE`) from demo preview fallback (`● DEMO PREVIEW DATA`).
- [x] **Build & Empirical Verification**:
  - [x] `npm run build --workspace=client` succeeded with 0 errors (1,805 modules transformed in 6.36s).
  - [x] Verified desktop (`checkpoint-management-desktop.png`), Create Checkpoint modal (`checkpoint-management-modal.png`), grid view (`checkpoint-management-grid.png`), tablet (`checkpoint-management-tablet.png`), mobile (`checkpoint-management-mobile.png`), and mobile drawer (`checkpoint-management-mobile-drawer.png`) via headless Chrome CDP.
  - [x] Validated roundtrip scannability and URL query parameter parsing (`code` and `token`) against participant scanner logic.

---

## Phase 2 Milestone — Admin Submission Management UI & Secure Review Actions (Completed)
- [x] **Integration of `SubmissionManagementPage.jsx` & `SubmissionManagementPage.css`**:
  - [x] Integrated [`client/src/pages/admin/SubmissionManagementPage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/admin/SubmissionManagementPage.jsx) and [`client/src/styles/SubmissionManagementPage.css`](file:///c:/projects/Hack-The-Grid/client/src/styles/SubmissionManagementPage.css) reusing the shared [`AdminSidebar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/AdminSidebar.jsx) with `Submissions` (`⇧ Submissions`) highlighted on `/admin/submissions` and showing the real-time pending submissions badge count.
  - [x] Registered `/admin/submissions` (`ROUTES.ADMIN_SUBMISSIONS`) as a standalone full-bleed route in [`client/src/routes/AppRoutes.jsx`](file:///c:/projects/Hack-The-Grid/client/src/routes/AppRoutes.jsx) without duplicate `AdminLayout` sidebars or headers.
- [x] **Backend & Secure Review Endpoint Integration**:
  - [x] Extended [`server/src/models/Submission.js`](file:///c:/projects/Hack-The-Grid/server/src/models/Submission.js) schema with `reviewed`, `reviewedBy`, `reviewedAt`, `reviewNote`, and `updatedAt: true`, and added `PENDING_REVIEW` to [`server/src/constants/submissionStatus.js`](file:///c:/projects/Hack-The-Grid/server/src/constants/submissionStatus.js).
  - [x] Enhanced `GET /api/v1/admin/submissions` in [`server/src/routes/admin.routes.js`](file:///c:/projects/Hack-The-Grid/server/src/routes/admin.routes.js) and [`server/src/controllers/admin.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/admin.controller.js) with multi-criteria filtering (`result`, `level`, `team`, `search`) and global KPI aggregation (`total`, `correct`, `incorrect`, `pending`, `totalPoints`).
  - [x] Implemented `PATCH /api/v1/admin/submissions/:submissionId/review` in [`server/src/routes/admin.routes.js`](file:///c:/projects/Hack-The-Grid/server/src/routes/admin.routes.js) and [`server/src/controllers/admin.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/admin.controller.js) enforcing admin authorization, points bounding against `question.points`, duplicate award prevention, and atomic score updates across `TeamChallenge`, `Team.totalScore`, and `Score.currentScore`.
  - [x] Added `reviewSubmission` to [`client/src/services/admin.service.js`](file:///c:/projects/Hack-The-Grid/client/src/services/admin.service.js).
  - [x] Clearly distinguished live database state (`● LIVE DATABASE`) from demo preview fallback (`● DEMO PREVIEW DATA`).
- [x] **Build & Empirical Verification**:
  - [x] `npm run build --workspace=client` succeeded with 0 errors (1,807 modules transformed in 6.45s).
  - [x] Verified desktop (`submission-management-desktop.png`), answer reveal (`submission-management-reveal.png`), pending queue filter & approve review action (`submission-management-reviewed.png`), grid view (`submission-management-grid.png`), tablet (`submission-management-tablet.png`), mobile (`submission-management-mobile.png`), and mobile drawer (`submission-management-mobile-drawer.png`) via headless Chrome CDP.

---

## Phase 2 Milestone — Admin Leaderboard Management UI & Deterministic Scoring Controls (Completed)
- [x] **Integration of `LeaderboardManagementPage.jsx` & `LeaderboardManagementPage.css`**:
  - [x] Integrated [`client/src/pages/admin/LeaderboardManagementPage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/admin/LeaderboardManagementPage.jsx) and [`client/src/styles/LeaderboardManagementPage.css`](file:///c:/projects/Hack-The-Grid/client/src/styles/LeaderboardManagementPage.css) reusing the shared [`AdminSidebar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/AdminSidebar.jsx) with `Leaderboard` (`♜ Leaderboard`) highlighted on `/admin/leaderboard`.
  - [x] Registered `/admin/leaderboard` (`ROUTES.ADMIN_LEADERBOARD`) as a standalone full-bleed route in [`client/src/routes/AppRoutes.jsx`](file:///c:/projects/Hack-The-Grid/client/src/routes/AppRoutes.jsx) without duplicate `AdminLayout` sidebars or headers.
- [x] **Backend, Service Layer & Ranking Integrity Integration**:
  - [x] Connected live data fetching to [`adminService.getAllTeams()`](file:///c:/projects/Hack-The-Grid/client/src/services/admin.service.js), `adminService.getDashboardStats()`, and [`leaderboardService.getLeaderboard()`](file:///c:/projects/Hack-The-Grid/client/src/services/leaderboard.service.js), with deterministic tie-breaking: `(b.score - a.score) || ((a.lastSolveTimestamp || 0) - (b.lastSolveTimestamp || 0))` which mirrors [`LeaderboardController.getLiveLeaderboard`](file:///c:/projects/Hack-The-Grid/server/src/controllers/leaderboard.controller.js).
  - [x] Connected public leaderboard visibility switch directly with `adminService.updateEventConfig({ isLeaderboardFrozen })`, synchronizing participant visibility across `EventConfig.isLeaderboardFrozen`.
  - [x] Strictly disabled client-side demo score adjustments (`↑ Demo Move Up`) in live database mode to maintain ranking integrity, displaying an explanatory callout note in the detail panel.
  - [x] Implemented 15-second background auto-refresh polling interval when enabled, with manual refresh trigger and time indicator.
  - [x] Supported multi-criteria sorting (Highest score, Challenges solved, Highest level), search by team name or code, level filtering (1-10), Table/Grid view toggling, and RFC 4180 CSV export.
  - [x] Added `getLeaderboard` to [`client/src/services/admin.service.js`](file:///c:/projects/Hack-The-Grid/client/src/services/admin.service.js).
  - [x] Clearly distinguished live database state (`● LIVE DATABASE`) from demo preview fallback (`● DEMO PREVIEW DATA`).
- [x] **Build & Empirical Verification**:
  - [x] `npm run build --workspace=client` succeeded with 0 errors (1,810 modules transformed in 7.63s).
  - [x] Verified desktop (`leaderboard-management-desktop.png`), search filtering (`leaderboard-management-filtered.png`), visibility switch toggle (`leaderboard-management-visibility.png`), grid view (`leaderboard-management-grid.png`), tablet (`leaderboard-management-tablet.png`), mobile (`leaderboard-management-mobile.png`), and mobile drawer (`leaderboard-management-mobile-drawer.png`) via headless Chrome CDP.

---

## Phase 2 Milestone — Admin Event Control Console & Operational Switch Integration (Completed)
- [x] **Integration of `EventControlPage.jsx` & `EventControlPage.css`**:
  - [x] Integrated [`client/src/pages/admin/EventControlPage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/admin/EventControlPage.jsx) and [`client/src/styles/EventControlPage.css`](file:///c:/projects/Hack-The-Grid/client/src/styles/EventControlPage.css) reusing the shared [`AdminSidebar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/AdminSidebar.jsx) with `Event Control` (`◉ Event Control`) highlighted on `/admin/event-control` and `/admin/controls`.
  - [x] Registered `/admin/event-control` (`ROUTES.ADMIN_EVENT_CONTROL`) as a standalone full-bleed route in [`client/src/routes/AppRoutes.jsx`](file:///c:/projects/Hack-The-Grid/client/src/routes/AppRoutes.jsx) and redirected `/admin/controls` to `/admin/event-control`.
- [x] **Backend & Service Layer Integration**:
  - [x] Extended [`server/src/models/EventConfig.js`](file:///c:/projects/Hack-The-Grid/server/src/models/EventConfig.js) schema with `subtitle`, `duration`, `maxTeams`, `registrationOpen`, `qrCheckpoints`, `hintsEnabled`, `maintenanceMode`, `announcementsEnabled`, and `location`.
  - [x] Enhanced `updateEventConfig` in [`server/src/controllers/admin.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/admin.controller.js) with validation checks and audit logging for critical state transitions (`maintenanceMode`, `state`, `isLeaderboardFrozen`).
  - [x] Implemented `createAnnouncement` endpoint (`POST /api/v1/admin/announcements`), validating inputs, updating the announcement history array, and logging broadcasts.
  - [x] Enhanced `getDashboardStats` in [`server/src/controllers/admin.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/admin.controller.js) to aggregate `totalScans` across checkpoints and retrieve latest submission records.
  - [x] Added `broadcastAnnouncement` to [`client/src/services/admin.service.js`](file:///c:/projects/Hack-The-Grid/client/src/services/admin.service.js).
  - [x] Guaranteed administrative access remains unimpeded during maintenance windows through role-based middleware (`requireAdmin`).
- [x] **Frontend Features & State Synchronization**:
  - [x] Synchronized 4 overview KPI cards (`Registered teams`, `Active participants`, `Checkpoints cleared`, `Submissions today`) with live data or fallback demo values.
  - [x] Connected all 4 tab panels: `Overview` (radar HUD, metrics, quick switches, system health, live activity feed), `Event Settings` (name, dates, duration, team limits), `Access & Safety` (maintenance mode, safety controls, production warning), and `Announcements` (broadcast composer, char counter, preview mode, broadcast action).
  - [x] Dynamic radar HUD status and header pill reflecting maintenance state (`RUNNING` vs `PAUSED`).
- [x] **Build & Empirical Verification**:
  - [x] `npm run build --workspace=client` succeeded with 0 errors (1,811 modules transformed in 18.20s).
  - [x] Verified desktop (`event-control-desktop.png`), settings tab (`event-control-settings.png`), safety controls & maintenance mode (`event-control-safety.png`), announcement preview & composer (`event-control-announcements.png`), tablet (`event-control-tablet.png`), mobile (`event-control-mobile.png`), and mobile drawer (`event-control-mobile-drawer.png`) via headless Chrome CDP.

---

## Phase 2 Milestone — Admin Security Logs Console & Forensic Audit Stream Integration (Completed)
- [x] **Integration of `SecurityLogsPage.jsx` & `SecurityLogsPage.css`**:
  - [x] Integrated [`client/src/pages/admin/SecurityLogsPage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/admin/SecurityLogsPage.jsx) and [`client/src/styles/SecurityLogsPage.css`](file:///c:/projects/Hack-The-Grid/client/src/styles/SecurityLogsPage.css) reusing the shared [`AdminSidebar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/AdminSidebar.jsx) with `Security Logs` (`⛨ Security Logs`) highlighted on `/admin/security-logs` and `/admin/logs`.
  - [x] Registered `/admin/security-logs` (`ROUTES.ADMIN_SECURITY_LOGS`) as a standalone full-bleed route in [`client/src/routes/AppRoutes.jsx`](file:///c:/projects/Hack-The-Grid/client/src/routes/AppRoutes.jsx) and redirected `/admin/logs` to `/admin/security-logs`.
- [x] **Backend & Service Layer Integration**:
  - [x] Created [`server/src/models/SecurityLog.js`](file:///c:/projects/Hack-The-Grid/server/src/models/SecurityLog.js) schema for persistent, append-only cybersecurity telemetry (`eventId`, `severity`, `category`, `event`, `actor`, `target`, `source`, `detail`, `status`, `reviewedBy`, `reviewedAt`, `timestamp`).
  - [x] Implemented `getSecurityLogs` and `reviewSecurityLog` in [`server/src/controllers/admin.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/admin.controller.js) and [`server/src/routes/admin.routes.js`](file:///c:/projects/Hack-The-Grid/server/src/routes/admin.routes.js), guarded by `authenticate` and `requireAdmin`.
  - [x] Added `getSecurityLogs` and `reviewSecurityLog` to [`client/src/services/admin.service.js`](file:///c:/projects/Hack-The-Grid/client/src/services/admin.service.js).
  - [x] Structured security logging enabled with `logger.security` on audit review transitions.
- [x] **Frontend Features & Security Operations (SOC) Workflow**:
  - [x] Telemetry metrics: Critical events, Warnings, Informational, and Flagged records with live counts.
  - [x] Alert banner with immediate "Review critical events →" shortcut.
  - [x] Multi-criteria filters: Severity (All, Critical, Warning, Info), Category (All, Authentication, Authorization, Rate Limit, Integrity, Checkpoint, QR Checkpoint, Admin Action, Session, Configuration), Status (All, Flagged, Review, Recorded, Reviewed), Time window (1 Hour, 24 Hours, 7 Days, 30 Days).
  - [x] Text search across event ID, event name, actor, IP source, target, and detail, with `Ctrl+K` keyboard shortcut.
  - [x] Interactive Record Inspector panel displaying event metadata, severity/status tags, audit integrity note, "Mark as reviewed ✓" action, and "Copy record JSON" button.
  - [x] RFC 4180 CSV export functionality with full record escaping.
  - [x] 15-second background auto-refresh polling when live mode is engaged.
- [x] **Build & Empirical Verification**:
  - [x] `npm run build --workspace=client` succeeded with 0 errors (1,814 modules transformed in 1m 4s).
  - [x] Verified desktop overview (`security-logs-desktop.png`), filtered stream (`security-logs-filtered.png`), reviewed event action & toast (`security-logs-reviewed.png`), tablet (`security-logs-tablet.png`), mobile (`security-logs-mobile.png`), and mobile drawer (`security-logs-mobile-drawer.png`) via headless Chrome CDP.

---

## Phase 2 Milestone — Participant User Profile Console & Preference Management Integration (Completed)
- [x] **Integration of `UserProfilePage.jsx` & `UserProfilePage.css`**:
  - [x] Integrated [`client/src/pages/participant/UserProfilePage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/participant/UserProfilePage.jsx) and [`client/src/styles/UserProfilePage.css`](file:///c:/projects/Hack-The-Grid/client/src/styles/UserProfilePage.css) featuring a player card hero with circular radar styling, live rank standings `#08`, stats cards (Total XP, Challenges solved, Checkpoints explored, Team contribution), tabbed workspace (`Overview`, `Achievements`, `Settings`), right-side telemetry cards (Team identity, Recent badges, Account security), and mobile slide-down drawer.
  - [x] Replaced legacy `/profile -> /portal/team` redirect in [`client/src/routes/AppRoutes.jsx`](file:///c:/projects/Hack-The-Grid/client/src/routes/AppRoutes.jsx) by mounting `ROUTES.PROFILE` (`/profile`) as a standalone full-bleed page and `/portal/profile` under participant routes.
  - [x] Reused the dedicated participant cyber navbar (`.htg-up-navbar`) with React Router navigation (`Link` to Home, Challenges, Leaderboard, Rules, Team, Profile), user avatar dropdown with settings / team / sign-out shortcuts, and mobile hamburger toggle.
- [x] **Backend & Service Layer Integration**:
  - [x] Extended [`server/src/models/User.js`](file:///c:/projects/Hack-The-Grid/server/src/models/User.js) schema with `college`, `course`, `year`, `bio` (maxlength 180), `github`, `linkedin`, `publicProfile`, `emailUpdates`, and `avatar`.
  - [x] Implemented `getProfile` in [`server/src/controllers/auth.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/auth.controller.js), dynamically aggregating user identity, team standings, solve counts, checkpoints scanned, rank percentile, achievements unlocked, and recent activity timeline.
  - [x] Implemented `updateProfile` in [`server/src/controllers/auth.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/auth.controller.js) with validation for `fullName`, unique `username`, unique `email`, `bio`, and preferences. Strictly enforced read-only boundaries: attempts to alter `role`, `teamId`, `score`, or `rank` are ignored/rejected.
  - [x] Implemented `updateAvatar` (`POST /api/v1/auth/avatar`) with base64 parsing and 500KB payload limit.
  - [x] Implemented `changePassword` (`POST /api/v1/auth/change-password`) verifying `currentPassword` against bcrypt hash, checking minimum 6-character length, updating via model pre-save hook, and logging security events with `logger.security`.
  - [x] Mounted routes in [`server/src/routes/auth.routes.js`](file:///c:/projects/Hack-The-Grid/server/src/routes/auth.routes.js) and added API service methods in [`client/src/services/auth.service.js`](file:///c:/projects/Hack-The-Grid/client/src/services/auth.service.js).
- [x] **Frontend Features & State Management**:
  - [x] Live vs demo preview transparency badge (`● LIVE DATABASE` vs `● DEMO PREVIEW`).
  - [x] Profile editing in `Settings` tab with inline validation, disabled team name field, and cancel/save controls.
  - [x] Interactive switches for `Public profile` and `Event email updates`.
  - [x] Account security modal with backdrop blur, password fields, validation error banner, and success toast.
  - [x] Avatar upload trigger with client-side file type and 500KB file size checks.
- [x] **Build & Empirical Verification**:
  - [x] `npm run build --workspace=client` succeeded with 0 errors (1,816 modules transformed in 30.94s).
  - [x] Verified desktop overview (`user-profile-desktop.png`), achievements tab (`user-profile-achievements.png`), settings tab with edit mode (`user-profile-settings.png`), account security password modal (`user-profile-security-modal.png`), tablet (`user-profile-tablet.png`), mobile (`user-profile-mobile.png`), and mobile drawer (`user-profile-mobile-drawer.png`) via headless Chrome CDP.

---

## Phase 10 Milestone — Admin Profile Console & Security Operations Identity Management (Completed)
- [x] **Integration of `AdminProfilePage.jsx` & `AdminProfilePage.css`**:
  - [x] Integrated [`client/src/pages/admin/AdminProfilePage.jsx`](file:///c:/projects/Hack-The-Grid/client/src/pages/admin/AdminProfilePage.jsx) and [`client/src/styles/AdminProfilePage.css`](file:///c:/projects/Hack-The-Grid/client/src/styles/AdminProfilePage.css) reusing the shared [`AdminSidebar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/AdminSidebar.jsx) with responsive overlay scrim.
  - [x] Updated [`AdminSidebar.jsx`](file:///c:/projects/Hack-The-Grid/client/src/components/navigation/AdminSidebar.jsx) to link the administrator user card directly to `ROUTES.ADMIN_PROFILE` with active route highlight.
  - [x] Registered `ROUTES.ADMIN_PROFILE` (`/admin/profile`) as a standalone full-bleed route and mounted `/admin/profile` in [`client/src/routes/AppRoutes.jsx`](file:///c:/projects/Hack-The-Grid/client/src/routes/AppRoutes.jsx).
- [x] **Backend & Service Layer Integration**:
  - [x] Extended [`server/src/models/User.js`](file:///c:/projects/Hack-The-Grid/server/src/models/User.js) schema with `department`, `twoFactor`, `securityAlerts`, `emailAlerts`, and `sessionAlerts`.
  - [x] Implemented `getAdminProfile`, `updateAdminProfile`, and `revokeSession` in [`server/src/controllers/admin.controller.js`](file:///c:/projects/Hack-The-Grid/server/src/controllers/admin.controller.js) and [`server/src/routes/admin.routes.js`](file:///c:/projects/Hack-The-Grid/server/src/routes/admin.routes.js) guarded by `authenticate` and `requireAdmin`.
  - [x] Enforced strict role immutability: attempts to elevate roles or permissions are rejected server-side and trigger security warnings.
  - [x] Added `getAdminProfile`, `updateAdminProfile`, and `revokeSessions` to [`client/src/services/admin.service.js`](file:///c:/projects/Hack-The-Grid/client/src/services/admin.service.js).
  - [x] Added append-only audit logging to `SecurityLog` on profile and preference updates.
- [x] **Frontend Features & Security Operations (SOC) Workflow**:
  - [x] Hero card with `ACCESS LEVEL 04`, privileged account status bar, and avatar upload trigger.
  - [x] Telemetry cards: `Admin actions`, `Security reviews`, `Managed teams`, `Session status`.
  - [x] 3-tab layout: `Overview` (administrator details, bio, recent admin activity), `Settings` (editable contact and professional links), `Security` (2FA, security alerts, email alerts, session alerts, password change, session revocation).
  - [x] Side column: `Access & permissions` inspector, `Current session` telemetry, and official support contact.
  - [x] Password modal with client validation, progress state, and backdrop dismissal.
  - [x] Live database vs demo preview transparency badges.
- [x] **Build & Empirical Verification**:
  - [x] `npm run build --workspace=client` succeeded with 0 errors (1,818 modules transformed in 18.16s).
  - [x] Verified desktop overview (`admin-profile-desktop.png`), settings tab with edit mode (`admin-profile-settings.png`), security tab with switches (`admin-profile-security.png`), password change modal (`admin-profile-password-modal.png`), tablet (`admin-profile-tablet.png`), mobile (`admin-profile-mobile.png`), and mobile drawer (`admin-profile-mobile-drawer.png`) via headless Chrome CDP.







