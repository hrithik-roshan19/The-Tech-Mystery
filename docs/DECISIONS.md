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



