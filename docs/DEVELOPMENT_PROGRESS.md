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












