# Clerk frontend UI fix ? 19 October 2026

**Root cause: the saved client configuration explicitly selected legacy JWT UI despite a
present Clerk publishable key.** Both `ClerkAuthProvider.jsx` and `ClerkPages.jsx` correctly obeyed
that selector. Earlier isolated verification forced Clerk mode in the launcher, so successful
Clerk authentication did not prove the application's saved UI mode was correct.

The Vite configuration is baked into the served module/bundle. A key alone does not select Clerk;
existing tabs/builds must be refreshed/rebuilt after changing the selector. The API target also
selected the existing ordinary development endpoint; it has been changed locally to the isolated
API, without changing any server database connection or backend/live provider configuration.
No environment values or keys were dumped. The publishable key was preserved byte-for-byte.

## Actual Chrome reproduction and fix verification

Both before/after runs used newly owned, proven temporary replica sets and the saved frontend
selector (`--configured-frontend`), with API targeting forced to the isolated listener.

| Route | Before | After |
|---|---|---|
| `/login` | Old JWT login screen | Actual Clerk SignIn visible |
| `/register` | Old team-registration wizard | Actual Clerk SignUp visible |
| `/admin/login` | Old JWT login screen | Actual Clerk SignIn visible |
| Signed-out `/portal/dashboard` | Redirected to login | Redirected to Clerk login |

Before: no blank screen, loading screen or redirect loop. **0 page errors, 0 console errors,
0 failed requests and no HTTP failures.** This was a deterministic selection/configuration issue,
not a missing SDK component, failed network request or broken provider placement.
After: all three Clerk forms visible with the same zero-error/network counts. Chrome screenshots
were saved and visually inspected for both signed-out login and registration.

Evidence: [before JSON](clerk-ui-legacy.json), [after JSON](clerk-ui-clerk.json),
[login screenshot](clerk-ui-clerk-login.png), [registration screenshot](clerk-ui-clerk-register.png).
The screenshots show empty fields and contain no participant credentials.

Inspection confirmed: `App.jsx` wraps `AppRoutes` in `AuthProvider` inside `BrowserRouter`;
Clerk mode places `ClerkProvider` around the session bridge/routes. `AppRoutes.jsx` already imports
the active wrappers from `pages/auth/ClerkPages.jsx`; these are standalone auth routes and are not
hidden by a public/participant/admin layout. ProtectedRoute waits for verification and denies
unlinked/inactive users. Login/register use supported hash routing and completion redirects.
No rewrite of working routing/provider code was required.

## Changes in this phase

- **`client/.env` (private, ignored):** changed only the non-secret auth selector and local API
  target. Keys and all other settings preserved. Previous selector/API target saved privately in
  `verification/frontend-rollback-2026-10-19.local` (ignored, no Clerk keys copied).
- **`package.json`:** new `npm run dev:clerk` starts the guarded isolated runtime using saved
  frontend selection. No ordinary/live server start command was run.
- **`server/scripts/clerk-development.js`:** optional `--configured-frontend` honors the saved UI
  selector while retaining generated/proven MongoDB, isolated API/CORS, private Vite cache and
  the event-write lock. Default explicit-Clerk verification behavior remains available.
- **`verification/clerk-ui.cjs` (new):** real Chrome route inspection, before/after screenshots,
  page/console/network observations, signed-out guard check, automatic test-runtime cleanup.
- **`verification/real-clerk.cjs`:** now uses the saved frontend selection too, preventing the
  old forced-mode test from hiding this configuration regression.
- **`client/src/routes/auth-routes.test.jsx` (new):** real `AppRoutes` tests for login, admin login,
  registration, explicit JWT rollback with a key present, and actual `App` provider placement.
  Clerk SDK UI is mocked in these unit tests; real Chrome evidence is separate.
- **`client/eslint.config.js` (new), `client/package.json`, `package-lock.json`:** added a frontend
  lint command/config and development lint dependencies. JSX bindings are recognized; deliberate
  cleanup catch blocks are allowed. No unrelated QR behavior was modified.
- **`client/.env.example`:** explains explicit provider selection and the safe local command.
- Documentation: this report, `docs/CLERK_AUTHENTICATION.md`, `docs/PROJECT_CONTEXT.md`, and journal.

## Tests and authenticated browser verification

| Check | Result |
|---|---|
| `node verification/clerk-ui.cjs --legacy` (before fix) | Passed; reproduced old JWT UI on all three routes |
| `node verification/clerk-ui.cjs` (after fix) | Passed; real Clerk forms on all three routes, no console/page/network failures |
| `npm test --workspace=client` | **16/16 passed**, 3 test files |
| `npm run lint --workspace=client` | **0 errors, 66 existing unused-code warnings** |
| `npm run build --workspace=client` | Passed; existing large-chunk warning |
| Server lint and launcher guards | Passed; **3/3 guards** |
| `node verification/real-clerk.cjs --api-fixture --sdk-password` | Exit 0; real Clerk password/Device Trust, isolated mapping/role checks, protected portal and app logout passed |

The authenticated run used a disposable development identity, real Chrome SDK password/Device
Trust verification and real Clerk/API responses. No sessions were mocked. Participant/admin and
inactive mapping changes affected only its single synthetic record in the newly created database.
The test identity was deleted and its own test runtime stopped.

**Remaining separate blocker:** local clock was still ~8.4 seconds behind Clerk. The signed session
was rejected initially under the existing five-second allowance. The verification waited for
actual token validity and retried before asserting protected portal access. This is not a clock
fix or an immediate-login pass. Synchronize the machine clock before accepting reliable sign-in.
Prebuilt sign-up OTP flow repeatability, Google OAuth and recovery acceptance remain as recorded
in the [earlier real-authentication report](CLERK_DEVELOPMENT_VERIFICATION_2026-10-19.md).
Signed-out component visibility is now independently verified and is not blocked by that clock issue.

## Running preview and safe repeat

The isolated preview was started with **`npm run dev:clerk`** and left running for organizer review:

- Login: `http://127.0.0.1:5175/login`
- Registration UI: `http://127.0.0.1:5175/register`
- API: loopback-only port 5101, connected exclusively to a newly created temporary replica set.

Current preview database: `htg_clerk_dev_8ced9ae197d2c63b`. Its process, data path, loopback binding,
replica identity and transaction abort were verified before HTTP listeners started. This is a new
empty preview, not the authenticated test fixture DB. A fresh Chrome check confirmed both current
preview forms visible after startup. Do not use an older localhost tab or ordinary server command
for these tests. Hard-refresh/restart a frontend that still has the old Vite configuration cached.

No live DB connection, event configuration change, registration opening, history change or production
deployment occurred. Showing development Clerk SignUp does not enable event registration: application
provisioning remains registration-gated, and this runtime has no event configuration and rejects
EventConfig inserts/updates. No participant or team was imported or enrolled.

Stop the standalone launcher cleanly with `stop` on its stdin or Ctrl+C. This closes only its owned
frontend/API/replica set and removes its private descriptor. Stop it before running another smoke
command because those commands require the same isolated ports. Each start creates/proves a new DB.
For rollback, stop this runtime and restore only the prior non-secret client selector/API target
from the private rollback file, then rebuild/restart the intended approved frontend. Do not restore
or contact the old API target as part of testing, reset the repository, delete history, change server
secrets, or switch production authentication.
