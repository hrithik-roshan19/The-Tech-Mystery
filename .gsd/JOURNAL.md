# Security remediation evidence ? 19 October 2026

User-authorized code remediation only. Existing event database, pre-existing user work,
and unrelated dirty files were preserved. No deployment, commit, live migration or Clerk
integration was performed. Generated client/dist build output is ignored by Git.

## Verification evidence

- Final security suite: `npm test --workspace=server` exited 0.
  `tests 38; suites 5; pass 38; fail 0; cancelled 0; skipped 0` (55.39 seconds).
  Real HTTP requests ran against a new temporary MongoDB replica set; the standalone
  refusal test used a second temporary server. Existing MongoDB processes were used only
  to locate an executable; tests did not connect to their databases. The suite automatically
  discovers a standard Windows installation, or accepts MONGOMS_SYSTEM_BINARY. Without an
  executable the test dependency may download MongoDB. Native temporary processes were
  stopped and disconnected after tests.
- Lint: `npm run lint --workspace=server` exited 0 after correcting findings.
- Production build: `npm run build:client` exited 0; 1814 modules transformed, retained
  >500 kB chunk warning, output JS about 1.109 MB (321 kB gzip).
- `npm audit --omit=dev --json`: exited 0, zero runtime advisories.
- Full `npm audit --json`: exited 1, 6 high/2 moderate development-tool advisories.
  No forced major upgrade was applied.
- Static private-answer scan of client/src: zero matches for demo seed answer literals.

Intermediate validation caught unused imports and an overbroad team-size validation edit
that broke one dashboard test; those were corrected before the final passing suite.
An initial attempted test dependency binary download was cancelled; the final tests reused
an installed MongoDB executable to provision isolated servers.

## Limits and required setup

See the leading security section of docs/PROJECT_CONTEXT.md. Replica-set setup, unique
index verification, fresh QR placards/team bindings, previously exposed invitation rotation,
legacy prompt/artifact review and reviewed historical scoring ownership reconciliation
remain deployment/data work. Legacy root scripts were not executed because they target the
existing event API and assert old behavior. Browser/camera interaction and load tests were
not executed. Existing historical totals were not repaired. Session defaults permit
existing users to sign in, but old purpose-less tokens must be replaced by logging in.

## Files changed in this remediation

This manifest records this turn's edits, independently of the already-dirty working tree.

- `.gsd/SPEC.md`
- `.gsd/JOURNAL.md`
- `package-lock.json`
- `server/package.json`
- `server/eslint.config.js`
- `server/tests/security.test.js`
- `server/src/config/environment.js`
- `server/src/controllers/admin.controller.js`
- `server/src/controllers/auth.controller.js`
- `server/src/controllers/challenge.controller.js`
- `server/src/controllers/checkpoint.controller.js`
- `server/src/controllers/leaderboard.controller.js`
- `server/src/controllers/submission.controller.js`
- `server/src/controllers/team.controller.js`
- `server/src/middleware/auth.middleware.js`
- `server/src/middleware/errorHandler.middleware.js`
- `server/src/middleware/rateLimiter.middleware.js`
- `server/src/middleware/validate.middleware.js`
- `server/src/models/Challenge.js`
- `server/src/models/Checkpoint.js`
- `server/src/models/EventConfig.js`
- `server/src/models/Question.js`
- `server/src/models/Team.js`
- `server/src/models/TeamChallenge.js`
- `server/src/models/User.js`
- `server/src/routes/auth.routes.js`
- `server/src/routes/team.routes.js`
- `server/src/services/auth.service.js`
- `server/src/services/checkpoint.service.js`
- `server/src/services/checkpointToken.service.js`
- `server/src/services/eligibility.service.js`
- `server/src/services/questionAssignment.service.js`
- `server/src/services/scoring.service.js`
- `server/src/services/team.service.js`
- `server/src/utils/crypto.js`
- `server/src/utils/participantData.js`
- `server/src/utils/seed.js`
- `server/src/utils/transaction.js`
- `client/src/context/AuthContext.jsx`
- `client/src/services/api.js`
- `client/src/services/auth.service.js`
- `client/src/services/admin.service.js`
- `client/src/pages/admin/QRCheckpointManagementPage.jsx`
- `docs/PROJECT_CONTEXT.md`
- `docs/DEVELOPMENT_PROGRESS.md`
- `docs/TODO.md`
- `docs/DECISIONS.md`


## Event-data preparation evidence - 19 October 2026

Completed preparation only, preserving the previous remediation and other dirty user work.
No live connection/env file, records, scores, invitations, event configuration, registration
state or deployment changed. No real placard or signed event QR payload was generated.
No staging container/replica set/user was provisioned or started.

Read-only evidence commands executed:
- Native-driver reconciliation report collection: 6 unsupported totals, 3 amount conflicts,
  14 candidate solves, 20 orphan submissions across 5 deleted teams. Inclusion projections
  exclude participant identity fields, credentials, answers and invitations. Exact original
  team/assignment/submission/challenge/question/score IDs are retained in local artifacts.
- Loopback HTTP probe: GET health, GET public leaderboard, OPTIONS auth/logout only.
  Running leaderboard includes joinCode; working-tree DTO omits it. OPTIONS 204 is handled
  by global CORS and does not prove POST route presence. Eight source files have mtimes
  after the approximate running-process startup. Full loaded-source identity is unknown.
- Final read-only repeat: original event counts and historical classifications unchanged
  from the report snapshot; report counts were also stable across their read interval.
  These observations are not an atomic snapshot or a replacement for a backup.
- Reconciliation artifact private-field allowlist check: passed, group sizes 6/3/14/20.

Tests/checks actually executed:
- Final `npm test --workspace=server`: exit 0, tests 51, suites 6, pass 51, fail 0,
  cancelled 0, skipped 0; duration 50.09 seconds. Ten pure preparation safeguards and
  41 real-HTTP security/enrollment tests. Fixture writes occur only in newly provisioned
  temporary MongoDB servers, never the existing event database.
- `npm run lint --workspace=server`: exit 0, includes src/scripts/tests.
- `docker compose -f staging/compose.yaml config --quiet --no-interpolate`: exit 0.
  No `up`, `exec`, `down`, replica initialization or provisioning command was executed.
- `node --check staging/init-replica.js`: exit 0 (parse only; no script execution).
- Git ignore checks confirm staging/.env and staging/secrets contents are excluded.

Earlier combined runs passed 49 then 50 tests while preparation safeguards were expanded;
final acceptance is the 51-test run above. The frontend was not changed or rebuilt in
this phase. Browser/camera, actual staging startup, restore rehearsal, load testing and
production mutation-based acceptance remain unexecuted and approval-gated.

The approved-roster wizard/backend enrollment-mode changes and shared-campus Public QR
policy are documented proposals, not activated features. Existing admin roster assembly
was verified using synthetic accounts only. Deployment and approval checklists describe
all remaining organizer decisions and operations.

Files added/updated in this preparation (not a list of all pre-existing dirty files):

- `.gitignore`
- `server/package.json`
- `server/eslint.config.js`
- `server/scripts/reconciliation-report.js`
- `server/scripts/deployment-probe.js`
- `server/scripts/staging-config.js`
- `server/scripts/staging-api.js`
- `server/tests/preparation.test.js`
- `server/tests/security.test.js`
- `staging/compose.yaml`
- `staging/.env.example`
- `staging/init-replica.js`
- `staging/README.md`
- `docs/DEPLOYMENT_VERIFICATION_CHECKLIST.md`
- `docs/EVENT_INGESTION_PREPARATION.md`
- `docs/reports/historical-reconciliation-2026-10-19.json`
- `docs/reports/HISTORICAL_RECONCILIATION_2026-10-19.md`
- `docs/reports/running-api-2026-10-19.json`
- `docs/PROJECT_CONTEXT.md`
- `docs/DEVELOPMENT_PROGRESS.md`
- `docs/TODO.md`
- `docs/DECISIONS.md`
- `.gsd/JOURNAL.md`


## 2026-10-19 ? Clerk opt-in authentication implementation

Explicit user attachment authorized frontend/backend implementation while prohibiting live
connections, migrations, deployment and registration opening. Used empirical-validation skill;
inspected existing auth and official Clerk SDK APIs before implementation. See
`docs/CLERK_AUTHENTICATION.md` for exact file inventory, architecture, setup and rollback.

Final command evidence:
- `npm test --workspace=server`: tests 69; pass 69; fail 0; duration_ms 28199.8807.
  Temporary MongoMemoryReplSet and standalone fixtures only; configured URI overridden
  before imports. Actual SDK verifies generated RSA signatures; Clerk BAPI is mocked.
- `npm test --workspace=client`: Test Files 2 passed; Tests 11 passed; Duration 2.40s (final run).
  SDK components/hooks mocked; no real Clerk identity or browser acceptance claimed.
- `npm run lint --workspace=server`: exit 0.
- `npm run build --workspace=client`: exit 0; 1884 modules transformed;
  JS 1,145.31 kB (gzip 329.70 kB), existing chunk-size warning.
- `npm audit --omit=dev --json`: vulnerabilities total 0.

Initial synthetic fixtures omitted required Team.joinCode and used totalPoints instead of
Score.currentScore; corrected and reran combined suite. Real SDK browser UI/screenshot,
Google/MFA/recovery and provider-network behavior remain unverified without approved Clerk
configuration and isolated development runtime. No deployment, live data/connection or env
file change was made. JWT remains default; legacy code and hashes retained for rollback.

Full dependency audit: 8 development-tool advisories (2 moderate, 6 high); no forced upgrades.
Scoped diff whitespace check passes; repository-wide check still reports pre-existing blank
EOF lines in four untouched CSS files. No unrelated stylesheet cleanup performed.


## 2026-10-19 ? Isolated Clerk verification continuation

User authorized isolated replica-set preparation and real local verification, prohibited live
connections/migration/history/event changes. Read main Clerk doc and inspected actual token
verification, mapping, provider selectors and registration/authorization code. Used empirical-validation.

Credential presence/type-only inspection found no Clerk variables in actual root/server env files,
client env files or current process. Organizer subsequently reported keys configured; repeat scan
still found none. Requested their local file path only. No credentials, tokens, participant details
or existing MongoDB URI were printed. No Clerk application, test identity or browser session created.

Prepared `server/scripts/clerk-development.js`, `server/tests/clerk-development.test.js`,
`verification/.env.example` and `docs/reports/CLERK_DEVELOPMENT_VERIFICATION_2026-10-19.md`.
Updated main doc and server test command. Launcher never copies a configured URI; proves newly
owned process, loopback binding, unique DB/set name, separate temp data path, writable primary
and transactional abort before any application imports/startup. It isolates dotenv and Vite env
loading, starts only loopback ports 5101/5173 with exact party checks, and prevents EventConfig
inserts/updates in the empty runtime (some existing admin GETs otherwise create defaults).

Executed `--check-db` twice: isolationVerified=true, transactionsVerifiedByAbort=true,
configuredMongoUriUsed=false; both owned replica sets stopped cleanly. The second database was
htg_clerk_dev_2c9b7a83cd1105fc. No existing live DB connection or configuration changed.
`--start` without credentials refused with only four missing variable names (expected exit 1).

Executed checks: new pure launcher guards 3/3; existing Clerk suite 18/18 (real RSA SDK checks,
mocked Clerk BAPI); client 11/11 (mocked SDK hooks/UI); server lint passed. Full combined server
run result is appended after completion. No real Clerk/browser success is claimed. Local Chrome
and Edge executables exist, but browser automation dependencies were not installed while blocked.
Real mapping/inactive/admin checks remain pending credential access. Registration remains closed;
positive application registration requires a separately allowed synthetic event fixture.


### Final real development verification evidence

Credentials subsequently appeared in server/.env and client/.env; type-only checks confirmed
matching development publishable keys, backend key accepted and identical public JWKS. No values
printed/rewritten. New runtime uses exact IPv4 origin 127.0.0.1:5175, API port 5101, private Vite
cache, isolated dotenv loading and guarded EventConfig collection. Added Playwright dev dependency
and real opt-in smoke script; visually inspected the empty Clerk login screenshot.

Real prebuilt sign-up and password sign-in succeeded in early runs; subsequent form runs exposed
unnamed OTP inputs, Device Trust needs_client_trust and code-preparation/loading failures. These
are not counted as all-form acceptance. Final Chrome test used real official browser SDK password
and Device Trust email-code calls; no Clerk response mocking and no ticket/auth bypass.

Final real command `node verification/real-clerk.cjs --api-fixture --sdk-password`: exit 0.
Database htg_clerk_dev_a97f9aa00675455a, new owned process/path/replica and aborted transaction
verified before service startup. Signed-in status complete; token issuedAtOffsetMs 8736. API
correctly rejects immediately with five-second skew. Waited until token actually valid, then:
unlinked 403 CLERK_ACCOUNT_UNLINKED; registration 403; mapped user 200; inactive 403;
participant admin 403; synthetic DB ADMIN 200; protected portal after retry; app logout; unexpired
prior token 401; signed-out portal -> login; zero event configurations/scores; development identity
deleted. Owned local runtime shut down. Host clock not adjusted; drift is a remaining readiness blocker.

Core service now uses bounded 5000 ms skew, with +2s accepted/+30s rejected regression coverage.
Final combined server tests 73/73 (28734.613 ms), frontend 11/11, lint/build passed. See the real
report for exact fixture, mock and form-test distinctions and safe rollback. No live DB connection,
account migration, historical reconciliation, event change, registration opening or deployment.

Final cleanup check: zero owned Clerk-development mongod processes, no runtime descriptor,
and no listeners on the isolated API/frontend ports. Scoped whitespace checks and the three
launcher guards passed after the final run.


## 2026-10-19 ? Clerk frontend visibility investigation and fix

Used empirical-validation skill. Actual client env presence/classification showed explicit legacy
selection despite Clerk publishable key. Isolated Chrome configured-mode reproduction showed old
JWT UI on /login, /register and /admin/login, with zero page/console/network errors. App/provider/
layout/routes were wired correctly. Earlier forced-Clerk harness hid the saved configuration bug.

Changed only private client's non-secret auth selector/API target; preserved key bytes; saved only
old selector/API target privately in ignored rollback file. Added guarded npm run dev:clerk command,
--configured-frontend harness option, actual route/App tests, Chrome before/after route probe,
frontend ESLint setup and docs. No production/backend auth switch or live connection.

Actual after-fix Chrome probe: all three Clerk forms visible, old forms absent, blank/loading false;
0 page errors, console errors, failed requests, HTTP failures. Signed-out portal redirected to login.
Saved redacted JSON and empty-form screenshots; visually inspected login and registration.
Frontend tests 16/16 (3 files, 4.74s), full frontend lint 0 errors/66 existing unused-code warnings,
build passed (large chunk warning). Server lint and 3 launcher guards passed. Initial rollback-test
text assertion failed on a split heading; corrected to semantic submit-button assertion. Intentional
empty cleanup catches allowed by new lint config; no QR behavior/source change.

Real smoke using saved frontend config: exit 0. Clerk SDK password/Device Trust complete; actual
token offset +8433ms remains beyond 5s allowance. Waited for true validity, then unlinked 403,
closed registration 403, mapped 200, inactive rejected, participant admin403/database-admin200,
protected portal reached, actual app logout and unexpired previous token401, signed-out redirect.
Only synthetic test mapping/identity; identity deleted and own runtime stopped.

Left a separate empty preview running for organizer review via npm run dev:clerk (PTY session 82937),
origin 127.0.0.1:5175, API5101. Proven new DB htg_clerk_dev_8ced9ae197d2c63b, separate owned mongod,
temp data path, loopback, replica and abort check. Fresh Chrome confirmed current login/register
forms visible. No actual participant/team/history or EventConfig initialized; write lock retained.
Stop with stdin `stop` or SIGINT. No live DB, event-state change, registration opening or deployment.
