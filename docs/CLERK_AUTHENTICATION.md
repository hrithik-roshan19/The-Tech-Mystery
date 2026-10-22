# Clerk authentication implementation ? 19 October 2026

## Frontend visibility fix

The saved client selector still chose legacy JWT UI even though a Clerk key was present; earlier
forced-mode testing missed it. Local frontend selection/API targeting are corrected. Real Chrome
now shows Clerk on login/register/admin-login routes with zero page/console/network failures.
Use `npm run dev:clerk` and its isolated origin. See [root cause, files, screenshots and checks](reports/CLERK_UI_FIX_2026-10-19.md).
Frontend tests: 16/16; lint: 0 errors/66 unused-code warnings; build passed. Clock synchronization
is still required for reliable immediate sign-in. No live data/event/deployment changes occurred.


## Latest development verification

See [real development verification, failures and rollback](reports/CLERK_DEVELOPMENT_VERIFICATION_2026-10-19.md).
Real Chrome password/Device Trust authentication, valid-token mapping/inactive/admin checks,
closed registration and application logout/revocation passed on disposable replica sets.
**Immediate login remains blocked by ~8.7 seconds of host clock drift**; the final smoke run
waited for token validity instead of weakening the bounded five-second verification allowance.
Full prebuilt-form automation is not consistently passing. No live connection, migration,
event change, registration opening or deployment occurred. Latest automated results: server
73/73, client 11/11, lint/build passed. Earlier test counts below describe the implementation phase.

Status: implemented in the working tree, default provider still **JWT**. Not deployed or activated.
No configured/live database connection, Clerk Dashboard change, participant enrollment,
team creation, event change, invitation rotation, QR issuance, or historical reconciliation
was performed. Tests created and removed synthetic records in separate temporary MongoDB
processes only. Existing uncommitted changes were preserved.

## Before and after

Before: browser localStorage access token, password login/registration, server JWT verification
and MongoDB authorization. The inspected remediation already issued access-only JWTs;
there is no refresh endpoint/client refresh flow to remove. Refresh-secret configuration and
legacy response destructuring remain for compatibility. The old Google button displayed
an alert; no functional Google OAuth integration or Google credential migration was found.

After: explicit `AUTH_PROVIDER=clerk` and `VITE_AUTH_PROVIDER=clerk` opt in together.
The official `@clerk/react` SDK owns identity sessions, SignIn/SignUp, token refresh,
account security UI and logout. API requests obtain a fresh session token using `getToken()`;
Clerk mode ignores legacy localStorage credentials. Missing keys fail closed.
`/auth/complete` resolves application access, links existing participants or explicitly
provisions a new unteamed participant. Existing routes remain, including `/admin/login`;
standalone `/dashboard` and `/profile` now require authentication like the portal routes.

The official `@clerk/backend` SDK verifies RSA signature, issuer, expiration and authorized
party. Additional checks require a user/session identity, reject pending/impersonated sessions,
and retrieve the provider session on every authenticated request to reject revocations
immediately. Provider outages fail closed; this adds provider latency/availability and rate-limit
capacity requirements. Public anonymous endpoints remain anonymous. Optional-auth endpoints
ignore invalid/unlinked credentials but fail on provider infrastructure errors.

MongoDB remains authoritative for role, active status and team on every request. Existing
role/team/gameplay guards still run. Client metadata, submitted IDs and role flags cannot
grant authority. Clerk mode disables password login/register and local password changes;
team operations issue no legacy JWTs. Profile email changes require identity reconciliation.
Clerk admin session revocation revokes other Clerk sessions, preserving the current session;
logout revokes the current session. Legacy JWT revocation behavior remains available in JWT mode.

## Mapping and data preservation

- Sparse unique, hidden `User.clerkUserId`; hidden `clerkLinkedAt`. Existing MongoDB IDs and
  all historical foreign keys are retained. No bulk-linking or backfill script was run.
- Self-link requires a valid active Clerk session, server-fetched verified primary email
  matching the existing MongoDB email, and the existing password. Inactive accounts,
  duplicate mappings, and all ADMIN self-links are rejected. Matching email alone is insufficient.
- Linking updates only identity mapping, link timestamp, tokenVersion (invalidates legacy
  sessions), and normal update timestamp. Password hash, role, team and history stay intact.
- New participant provisioning obtains email from Clerk, accepts only username/fullName,
  and creates TEAM_MEMBER with no team/password. It checks existing event registration state,
  maintenance and deadline inside a transaction. A Clerk identity alone grants no gameplay access.
- Link/provision require the unique mapping index and transaction-capable MongoDB. Production
  autoIndex is already disabled. Missing index fails closed with 503. No index was built on live data.
- Legacy auth source/UI/storage and password hashes remain. New Clerk-only users cannot sign
  in through legacy password auth; rollback requires a planned recovery path for those users.

## Dependency inventory and exact files

| Area | Files changed or added in this phase |
|---|---|
| Dependencies | `client/package.json`, `server/package.json`, `package-lock.json` |
| Client session and token handling | `client/src/context/AuthContext.jsx`, `client/src/context/ClerkAuthProvider.jsx` (new), `client/src/services/api.js` |
| Login, provisioning and route guards | `client/src/pages/auth/ClerkPages.jsx` (new), `client/src/routes/AppRoutes.jsx`, `client/src/routes/ProtectedRoute.jsx` |
| Account security UI | `client/src/pages/participant/UserProfilePage.jsx`, `client/src/pages/admin/AdminProfilePage.jsx` |
| API identity | `server/src/middleware/auth.middleware.js`, `server/src/middleware/legacyAuth.middleware.js` (retained implementation), `server/src/middleware/clerkAuth.middleware.js` (new), `server/src/services/clerk.service.js` (new) |
| Linking/provisioning and identity schema | `server/src/controllers/clerk.controller.js` (new), `server/src/models/User.js`, `server/src/routes/auth.routes.js` |
| Compatibility and security | `server/src/config/environment.js`, `server/src/services/auth.service.js`, `server/src/controllers/auth.controller.js`, `server/src/controllers/admin.controller.js` |
| Tests | `server/tests/clerk.test.js` (new), `server/tests/security.test.js` (force JWT fixture mode), `client/vitest.config.js` (new), `client/src/context/clerk.test.jsx` (new), `client/src/services/api.test.js` (new) |
| Configuration examples | `.env.example`, `client/.env.example`, `server/.env.example` |
| Documentation | this report, `docs/PROJECT_CONTEXT.md`, `docs/DEVELOPMENT_PROGRESS.md`, `docs/DECISIONS.md`, `docs/TODO.md`, `docs/DEPLOYMENT_VERIFICATION_CHECKLIST.md`, `.gsd/JOURNAL.md` |

Existing dependencies inspected and retained: `auth.service.js` clients, `storage.js`, legacy
public and duplicate auth page components, navbar/sidebar/layout logout handlers,
`TeamDashboardPage.jsx` membership refresh, `admin.service.js` replacement-token handling,
team controller token generation, JWT middleware, role middleware, auth validators and routes.
No separate refresh-token client or Google backend route was found. The context keeps compatible
login/logout/updateTeamMembership functions; Clerk membership updates re-fetch server state.
The admin client stores a replacement token only when one is returned; Clerk returns none.

## Clerk Dashboard and environment setup (organizer action; not performed)

1. Create a separate **development** Clerk application. Enable email/password with verified
   primary email; require verification before account completion. Configure recovery/MFA and
   sign-up restrictions. Keep public event registration closed until separately approved.
2. Register the actual development application origin and redirect destinations:
   `http://localhost:5173`, `/login`, `/register`, `/auth/complete`. SignIn/SignUp use supported
   hash routing. Development origin must exactly match the token's `azp`.
3. Optional Google: enable the Google social connection in Clerk's Dashboard only if available
   for this application, test verified primary-email behavior and account collision recovery.
   Production Google requires the production OAuth configuration required by Clerk/Google;
   the old alert button supplies no OAuth implementation. No custom Google secrets belong in Vite.
4. On an explicitly isolated development replica-set database, configure server variables:
   `AUTH_PROVIDER=clerk`, `CLERK_SECRET_KEY`, `CLERK_JWT_ISSUER_DOMAIN` (exact HTTPS session
   issuer origin, no trailing slash), `CLERK_AUTHORIZED_PARTIES` (comma-separated exact origins).
   Optional `CLERK_JWT_KEY` is the instance's PEM public key; without it SDK key retrieval is used.
   Literal backslash-n PEM separators are supported. Set an explicit **isolated** `MONGODB_URI`;
   never start a development API with this repository's existing connection/default by accident.
5. In `client/.env.local` or approved hosting settings, set `VITE_AUTH_PROVIDER=clerk`, the matching
   application's `VITE_CLERK_PUBLISHABLE_KEY`, and the isolated API's `VITE_API_BASE_URL`.
   Vite reads client-directory env files; editing the root example alone does not configure it.
   Server secrets must never use the VITE prefix. Restart/rebuild both sides after mode changes.
6. Production is separate: verified production domains/DNS/TLS, real redirect origins, production
   app keys, OAuth credentials and privacy/recovery configuration. This implementation requires
   `sk_live_` and HTTPS authorized parties under NODE_ENV=production, plus a strong QR secret.
   Local development Clerk keys work under NODE_ENV=development/test only. Existing staging
   launcher uses production mode: do not point development Clerk keys at it or weaken its guards;
   approve a separate isolated development runtime profile before real-browser testing.
7. Production mapping index setup is approval-gated: backup, inspect mapping field shape and
   duplicates read-only, then approve the exact sparse unique `clerkUserId_1` index manifest.
   Do not call syncIndexes or drop/rebuild unrelated indexes. Validate topology and permissions.

Official references: [React quickstart](https://clerk.com/docs/react/getting-started/quickstart),
[backend verifyToken](https://clerk.com/docs/reference/backend/verify-token),
[session listing](https://clerk.com/docs/reference/backend/sessions/get-session-list),
[session revocation](https://clerk.com/docs/reference/backend/sessions/revoke-session).
Issuer and authorized parties are SDK `verifyToken` options passed by our service; our environment
variable names are application configuration, not automatically consumed by the SDK.

## Recovery and rollback

For forgotten local passwords, mismatched/unverified emails, already-linked identities and ADMIN
accounts: deny self-linking. Organizer verifies the person through established independent event
records and verifies the Clerk account/session, then prepares a narrow mapping manifest containing
only the original MongoDB ID and verified Clerk ID. A second organizer reviews collision, role,
active-status and ownership evidence. Backup first; apply only after explicit approval, transactionally
with an organizer audit record. Never infer an ADMIN role from Clerk metadata or create an admin.
No general-purpose recovery write endpoint/script is supplied in this phase. Clerk email changes
are not synchronized automatically; resolve identity/email changes through the same reviewed process.

Before any cutover, retain a known-good JWT client/API artifact, unchanged JWT secrets/password
hashes and private config backup. Take a consistent encrypted MongoDB snapshot/dump with a tested
restore on a separate target; record release/index manifests and identity mapping approval separately.
Protect backups and organizer evidence as private participant data. Never post them into this report.

Rollback after explicit organizer approval: stop further linking/provisioning, restore matching
frontend/backend JWT provider configuration and rebuild/restart the approved legacy artifacts together.
Do not delete Clerk mappings or restore historical data as an auth rollback. Existing password users
log in again (linking invalidated older tokens). Clerk-only users remain locked out of JWT password
login until an approved recovery strategy exists; never assign a default/shared password. Revoke
Clerk sessions through provider controls where authorized. Rehearse this on synthetic staging data
before cutover. Avoid full database restoration over newer gameplay records; restore a backup into
an isolated target for review and approve narrowly scoped corrections if ever necessary.

## Verification and remaining gates

Final executed checks:

| Command | Result |
|---|---|
| `npm test --workspace=server` | **69/69 passed**: 18 Clerk tests, 41 existing security/gameplay tests, 10 preparation tests |
| `npm test --workspace=client` | **11/11 passed**, 2 files |
| `npm run lint --workspace=server` | Passed |
| `npm run build --workspace=client` | Passed; existing large-chunk warning, JS approximately 1.15 MB before gzip |
| `npm audit --omit=dev --json` | 0 production vulnerabilities |

Initial runs caught incomplete synthetic team fixtures and an incorrect score-field assertion;
those fixtures/assertions were corrected, and the final combined suite passed. Production
configuration rejection, signing checks, current membership/roles, linking collisions,
verified email/password proof, historical preservation, explicit registration gates, gameplay
access/redaction, revocation and missing-index behavior are covered. The existing security
suite also verifies transaction failure on a temporary standalone server.

Tests do not contact Clerk or the configured
MongoDB. Backend tests use generated RSA keys and the actual official SDK signature verification;
only Clerk account/session HTTP responses are mocked. Frontend tests mock SDK UI/session hooks;
they prove application integration contracts, not Clerk's browser login, Google, MFA or real logout.
No real Clerk login or browser screenshot was verified. Production build succeeds with a bundle-size
warning. Production dependency audit reports zero vulnerabilities; the full audit currently reports 8 development-tool vulnerabilities
(2 moderate, 6 high) in braces/chokidar/fast-glob/micromatch/nodemon/postcss-nested/
postcss-selector-parser/tailwindcss. These need separate dependency remediation; no force-upgrade
was performed. This audit is not a production-login acceptance test.

Priority approvals before activation:

1. Approve Clerk identity/sign-in/Google/MFA, account recovery and ADMIN linking policy, and the
   independent approvers. No real account creation/linking is authorized by this code delivery.
2. Approve isolated replica-set provisioning and development Clerk application/origins/configuration.
   Perform real-browser email/Google/recovery/logout and database authority tests there.
3. Approve transaction-capable production target, backup/restore rehearsal and exact unique-index
   manifest; resolve historical reconciliation decisions separately, preserving original IDs.
4. Approve staged cutover, simultaneous provider switch, tested rollback and Clerk-only account
   recovery policy. Validate SDK/BAPI rate limits, latency and identity-provider outage handling.
5. Approve final event content/dates, complete-roster enrollment policy, shared QR policy and
   ingestion manifests separately. Only after acceptance approve deployment and opening registration.
