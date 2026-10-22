# Real Clerk development verification ? 19 October 2026

**Result: real Clerk authentication and isolated API authorization verified, with a clock-sync blocker.**
The final Chrome run used the configured development Clerk application, real password authentication
and real Device Trust email-code verification through the official browser SDK. No Clerk/session
responses were mocked. Newly issued tokens were about **8.7 seconds ahead of this machine**;
the API correctly rejected them outside its bounded five-second tolerance. After waiting for the
same signed token to become valid locally, mapping, authorization, closed-registration, protected
portal access and application logout/revocation passed. This wait is a verification technique,
**not an application fix**. Immediate/reliable sign-in remains blocked until the host clock is synced.

No live `hack_the_grid` connection, account migration, historical modification, event configuration
change, invitation/QR change, registration opening or production deployment occurred. Only disposable
development Clerk identities and new, temporary, loopback replica-set databases were used.

## Configuration verified without exposing values

Initial scans found no credentials. After the organizer saved them, repeated scans found:

| Setting | Actual observation |
|---|---|
| `server/.env`: `CLERK_SECRET_KEY` | Present, development format; real Clerk Backend API accepted it |
| `server/.env` and `client/.env`: `VITE_CLERK_PUBLISHABLE_KEY` | Present, development format, matching values |
| `CLERK_JWT_ISSUER_DOMAIN` | Not explicitly configured; isolated launcher derives exact HTTPS origin from publishable-key instance domain |
| `CLERK_AUTHORIZED_PARTIES` | Not explicitly configured; isolated launcher supplies only `http://127.0.0.1:5175` |
| `AUTH_PROVIDER` / `VITE_AUTH_PROVIDER` | Existing files do not jointly select Clerk; isolated process explicitly selects Clerk on both sides |
| `CLERK_JWT_KEY` | Absent, optional; actual SDK key retrieval was exercised |

The secret-key instance's JWKS and frontend instance's public JWKS contained the same signing key.
No key, password, session token, sign-in token, participant information or configured live URI was
printed. User-edited env files were read, not rewritten by the agent. Keys are not duplicated into
a new file automatically. Existing ordinary development commands can still select the existing
connection; use only the dedicated launcher for this verification environment.

## Exact environment and Dashboard requirements

For repeatable dedicated configuration, copy `verification/.env.example` to ignored
`verification/.env.local`, or pass the existing server/client env file paths explicitly.
Required credentials are `CLERK_SECRET_KEY` (`sk_test_`) and
`VITE_CLERK_PUBLISHABLE_KEY` (`pk_test_`) from the **same development instance**.
Set `CLERK_JWT_ISSUER_DOMAIN` to its exact HTTPS session issuer origin, without a trailing slash,
and `CLERK_AUTHORIZED_PARTIES=http://127.0.0.1:5175`. The isolated launcher can derive the latter
two non-secret values when absent; it never invents credentials. `CLERK_JWT_KEY` is optional PEM.

The launcher sets `NODE_ENV=development`, `AUTH_PROVIDER=clerk`, `VITE_AUTH_PROVIDER=clerk`,
`VITE_API_BASE_URL=http://127.0.0.1:5101/api/v1`, and the matching CORS origin internally.
It generates its own isolated MongoDB URI and temporary QR key. Do not add a live URI to its config.

Dashboard observations: username, email, phone and password were required by the rendered sign-up
form; Google was offered. Password authentication was accepted. Device Trust requires a verification
code on a new browser (`needs_client_trust`). This is distinct from `needs_second_factor` and must
not be silently skipped. The test completed that requirement through the official SDK. Development
reserved test emails/phone numbers and documented test-mode codes were used; no real participant
mailbox or phone was used. No Dashboard setting, Device Trust policy, MFA setting or production
origin was changed. Google OAuth and real-message delivery were not verified.

Keep this a separate development application. Where relevant Dashboard controls exist, allow
`http://127.0.0.1:5175` and `/login`, `/register`, `/auth/complete` redirects. Existing pages use
hash-based Clerk components and explicit completion redirects. Never use production credentials.

Official references: [React setup](https://clerk.com/docs/react/getting-started/quickstart),
[token verification](https://clerk.com/docs/reference/backend/verify-token),
[development test emails/phones](https://clerk.com/docs/guides/development/testing/test-emails-and-phones),
[testing tokens](https://clerk.com/docs/guides/development/testing/overview),
[Device Trust](https://clerk.com/docs/guides/development/custom-flows/authentication/device-trust).
Testing tokens were attached only to real Frontend API requests for supported bot-protection
handling; they did not replace session verification, password authentication or Device Trust.

## Isolation evidence and local runtime

`server/scripts/clerk-development.js` creates and verifies its own mongod process, generated
`htg_clerk_dev_<random>` database/set name, separate temporary data path and IPv4 loopback socket.
It rejects live database names, ports 27017/27027, other hosts and mismatched replica sets before
connecting. It checks actual mongod options/data path, process ownership, writable-primary and
replica-set identity. A transaction probe is inserted, aborted and confirmed absent.

Final successful runtime evidence:

```json
{"isolationVerified":true,"database":"htg_clerk_dev_a97f9aa00675455a","replicaSet":"htg_clerk_dev_a97f9aa00675455a","loopbackOnly":true,"separateProcess":true,"separateTemporaryDataPath":true,"transactionsVerifiedByAbort":true,"configuredMongoUriUsed":false}
```

Application config/models load only after these checks. Dotenv and Vite env loading are isolated
from repository defaults. The frontend uses its own Vite cache, port **5175**, exact origin
**http://127.0.0.1:5175**, and API **http://127.0.0.1:5101**; it does not use the existing localhost
frontend or API. The private runtime descriptor is Git-ignored and removed on normal shutdown.
No users/teams/event settings are provisioned by the launcher. Production-style staging files
remain unchanged; the new runtime is explicitly development-only and disposable.

Some existing admin GET handlers auto-create EventConfig on an empty database. The runtime creates
only an empty event collection with a rejecting validator, preventing event inserts/updates.
Real closed-registration testing returned 403 and left zero EventConfig records. No event was opened.
The synthetic mapping fixture was inserted only after rechecking the runtime URI, replica name,
data path and empty users collection. Its role/active status changes were confined to that record.
There was no real-account linking, team enrollment or imported roster.

## Real verification results

| Check | Actual evidence |
|---|---|
| Credential/instance match | Backend key accepted; frontend/backend JWKS match |
| Clerk sign-in component | Rendered in real Chrome, no page errors; screenshot saved |
| Clerk UI sign-up | Completed in earlier browser runs using disposable development identity; repeated OTP automation also encountered failures below |
| Clerk UI password sign-in | Completed in earlier browser runs; immediate API access then exposed clock drift |
| Final password + Device Trust | **Passed** in real Chrome using official SDK calls and actual Clerk network responses; final strategy status `complete` |
| Fresh session acceptance | **Blocked initially**: measured issue time +8736 ms, beyond allowed 5000 ms |
| Unlinked account | After token became valid locally: **403 CLERK_ACCOUNT_UNLINKED** |
| Application registration closed | Real signed-in identity: **403**; no EventConfig or participant created by registration |
| MongoDB mapping | Synthetic development mapping: `/auth/me` **200** |
| Inactive mapping | Same real session with synthetic user inactive: **403 ACCOUNT_INACTIVE** |
| Participant/admin authorization | Same real session: participant `/admin/teams` **403**, database ADMIN role **200**, then restored to participant |
| Protected participant route | `/portal/dashboard` reached after waiting/retrying clock-affected verification; no team created |
| Application logout | Actual application's Sign out button returned to `/login` |
| Revocation | Previously valid, **still-unexpired** real session token rejected with **401** after logout |
| Signed-out protected route | `/portal/dashboard` redirected to `/login` |
| Preservation | Runtime ended with **zero event configurations and scores**; only test mapping used and removed |
| Cleanup | Created completed development identities deleted; final frontend/API/replica set stopped |

The final comprehensive run used `--api-fixture --sdk-password`: the disposable identity was created
through the real Clerk Backend API, then authenticated in Chrome using official SDK password and
Device Trust methods. It verifies real browser SDK/session/API integration, **not an uninterrupted
click-through of the prebuilt forms**. Earlier runs did exercise prebuilt sign-up and password
sign-in successfully, but full form automation is not consistently passing. Do not report every
UI flow as accepted. The screenshot contains an empty sign-in form, no participant data.
Incomplete abandoned development sign-up attempts may remain until Clerk expires them; they were
not imported into MongoDB. No existing Clerk users or real sessions were altered.

## Automated tests, separate from real tests

| Command | Result |
|---|---|
| `npm test --workspace=server` | **73/73 passed** (19 Clerk, 3 launcher guards, 41 security/gameplay, 10 preparation) |
| `npm test --workspace=client` | **11/11 passed**, SDK UI/hooks mocked |
| `npm run lint --workspace=server` | Passed |
| `npm run build --workspace=client` | Passed; existing large-chunk warning |
| `node --check verification/real-clerk.cjs` | Passed |
| `node verification/real-clerk.cjs --api-fixture --sdk-password` | Exit 0; real results above, with explicit clock wait and readiness blocker |

Backend unit/integration tests use generated RSA keys with actual SDK crypto verification and
mocked Clerk BAPI. The real smoke run does not mock responses. Do not combine these categories.

## Failures and fixes

1. Credentials were initially not visible, then appeared in user-saved files; no fabricated keys
   were substituted. Explicit issuer/party/provider values remain necessary outside the launcher.
2. An initial browser run hit an invalid React hook error. Added explicit React/ReactDOM deduplication
   and a private Vite cache; subsequent isolated Clerk pages rendered without errors. A separate
   IPv4 port avoids an existing localhost/IPv6 frontend. Project cwd is restored for CSS tools only
   after backend config is safely loaded; dotenv/Vite env isolation remains explicit.
3. A minimal Backend API user fixture omitted required username/phone fields and failed. The complete
   fixture supplies all required synthetic fields; no Dashboard policy was weakened.
4. Form automation encountered unnamed verification inputs, new Device Trust state, asynchronous
   code preparation (`verification not requested`), loading timeouts and an accidentally overbroad
   button selector. Selector/testing-token routing was narrowed; errors are documented rather than
   counted as passes. Final official SDK flow explicitly prepares and verifies Device Trust codes.
5. Real tokens exposed `token-iat-in-the-future`. Zero skew was replaced with bounded **5000 ms**;
   regression tests accept a +2-second token and reject a +30-second token. Actual host drift is
   larger (~8.7 seconds). **Clock synchronization is still required**; no OS clock or auth policy
   was changed to hide the issue. Verification waited for the token's actual validity interval.
6. Existing dev startup could select a live/default connection and tolerate connection failure;
   existing staging mode requires production keys. The new launcher avoids both paths entirely.

## Repeat and rollback

From the repository root, after synchronizing the host clock:

```powershell
node server/scripts/clerk-development.js --check-db
node server/scripts/clerk-development.js --start server/.env client/.env
# Separate opt-in comprehensive real smoke run; do not run concurrently with the launcher:
node verification/real-clerk.cjs --api-fixture --sdk-password
# Form-driven real smoke run (OTP automation remains under investigation):
node verification/real-clerk.cjs
```

Each start proves a new database target. Do not edit the URI to reuse an existing database.
To stop a standalone launcher cleanly, enter `stop` on its stdin or send SIGINT; the comprehensive
runner stops its own child through IPC in finally. It closes only its Vite/API listeners,
Mongo connections and owned replica set and deletes only its own ignored descriptor. Abrupt
Windows shell interruption may skip graceful cleanup; inspect and stop only positively identified
owned temporary processes. Never stop the existing MongoDB service or API, drop a live database,
delete a shared volume, reset scores, or restore a snapshot over current gameplay.

The runner deletes only completed development identities it created. Existing JWT/auth configuration,
password hashes, user data and historical records remain untouched; there is no production cutover
to roll back. To revert code changes later, review just this phase's files, retaining user edits
and the earlier uncommitted remediation work. Never use a repository-wide reset.

Remaining decisions/actions: organizer synchronizes the machine clock and reruns immediate login;
complete repeatable form/Google/recovery acceptance; decide how to test positive participant
registration in a separately approved synthetic event fixture (registration stays closed here).
Production target/index/account-linking/cutover/real-data approvals remain separate.

Files added: `server/scripts/clerk-development.js`, `server/tests/clerk-development.test.js`,
`verification/.env.example`, `verification/real-clerk.cjs`, this report and
`docs/reports/clerk-login-development.png`. Updated: server test command, Clerk service skew,
Clerk regression test, client Vite deduplication/dev testing dependency, lockfile, main Clerk doc,
project context and journal. No actual env files or existing staging deployment settings were edited.

Final cleanup check: zero owned Clerk-development mongod processes, no runtime descriptor,
and no listeners on the isolated API/frontend ports. Scoped whitespace checks and the three
launcher guards passed after the final run.
