# Deployment verification checklist - 19 October 2026

Status: preparation only; **do not deploy or restart the running API** without
organizer approval. Current code and current process are different evidence sources.

## Confirmed runtime difference

The read-only probe in `reports/running-api-2026-10-19.json` observed:

| Check | Running API | Remediated working tree |
|---|---|---|
| GET /api/v1/leaderboard | 200, 42 rows; rows include `joinCode` | `leaderboard.controller.js` projection/DTO omits `joinCode`; isolated tests verify omission |
| GET /api/v1/health | 200, no immutable release identity | Health controller still has no release fingerprint |
| OPTIONS /api/v1/auth/logout | 204 | CORS also returns 204 globally; this does **not** prove the route exists or is missing |

The public row-field difference is exactly the invitation field. The report records
source hashes/mtimes for eight remediation files. All eight were edited after the
running process's approximate startup time, 19 October 2026 07:46 UTC (13:16 IST).
This supports stale-process diagnosis; it does not recover or identify the old loaded
source. No authenticated/write probe was used to infer other running behavior.

## Code changes requiring deployment acceptance

These are verified source/test differences from historical behavior, **not claims
that the running process was mutation-tested**:

| Area | Exact source files | Required acceptance on an approved isolated target |
|---|---|---|
| Invitation access | controllers/leaderboard.controller.js, controllers/team.controller.js, utils/participantData.js | Public/member responses omit invitations; leader/admin access only |
| JWT revocation | middleware/auth.middleware.js, services/auth.service.js, controllers/auth.controller.js, routes/auth.routes.js | Old purpose/version rejected, password/logout/admin revocation effective |
| Transactional enrollment/scoring | utils/transaction.js, services/team.service.js, services/scoring.service.js | Concurrent operations, rollback and standalone refusal |
| Participant content | utils/participantData.js, services/questionAssignment.service.js, controllers/challenge.controller.js | No private answer/hint/metadata fields or literal answer-bearing content |
| Signed QR | utils/crypto.js, services/checkpoint.service.js, services/checkpointToken.service.js | Reject absent/expired/tampered/incorrect-scope signatures; scan awards zero |
| Lifecycle | services/eligibility.service.js | Registration gating; LIVE/roster/publication eligibility |
| Production configuration | config/environment.js, utils/seed.js | Invalid signing configuration fails; demo seed refuses production |

Paths in this table are relative to `server/src/`.

## Organizer-approved deployment gates

- [ ] Choose and record the immutable release commit/build artifact; the present working
  tree contains pre-existing uncommitted work. Record the reviewed source hashes and
  dependency lockfile. Add an approved build identifier to deployment metadata/health
  before relying on remote source-version assertions; that feature is not implemented here.
- [ ] Approve a maintenance/intake restriction window and consistent backup/restore test.
  Registration is currently enabled; preparation did not turn it off.
- [ ] Choose production DB/auth/TLS/network/redundancy policy. Current configured DB is
  standalone; staging must not replace the live connection. Verify required unique indexes.
- [ ] Supply distinct production signing credentials privately; current environment files
  do not pass production signing checks. Existing JWTs require re-login after cutover.
- [ ] Approve historical data disposition and exact reconciliation manifests, if any.
- [ ] Finalize dates, roster policy, participant content/assets and QR Public-mode policy.
- [ ] Execute security and preparation suites on isolated MongoDB. Validate the separate
  staging Compose setup at runtime; `docker compose config` alone does not prove startup.
- [ ] Deploy backend/frontend together only after approval. Use a separate isolated
  client build with VITE_API_BASE_URL pointing to staging for staging UI tests; do not
  overwrite a running frontend build/configuration as part of preparation.
- [ ] Re-run the read-only public probe: invitation fields must be absent. Check the
  approved release ID. Execute authenticated, enrollment and rollback smoke tests only
  on approved synthetic staging data before real intake.
- [ ] Obtain final organizer approval before opening/advertising participant registration.

Do not call participant challenge GET endpoints as a purported read-only production
probe: current assignment/eligibility logic can write revision/assignment records.
Admin checkpoint listings can generate signed payloads, so they were also not called.

## Backup and rollback gate

Install/locate Database Tools, quiesce **all** writers on the standalone source, take
an encrypted BSON backup preserving indexes/IDs/timestamps, record checksums, and test
an isolated restore. Keep code/configuration backups protected separately. Prefer
rollback by switching to a verified compatible restored database, preserving the
post-cutover database for recovery. New registrations require an explicit replay or
point-in-time recovery plan: restoring an older backup alone would lose those writes.
Never roll back to the invitation-leaking API or reactivate old signing credentials.

Reference: https://www.mongodb.com/docs/manual/tutorial/backup-and-restore-tools/


## Additional Clerk cutover gate

See [Clerk implementation and rollback](CLERK_AUTHENTICATION.md). The opt-in code is not evidence
of running API behavior; no live probe was repeated in this phase. Verify matching client/API
provider selection, exact issuer/authorized parties, mapped active users and database roles,
unique sparse mapping index, transactional linking/provisioning, provider session revocation,
public endpoint behavior, identity-provider outage handling and the Clerk-only rollback gap.
Require real development Clerk browser acceptance before approving production cutover.
