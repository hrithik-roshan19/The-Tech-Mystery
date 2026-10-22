# Event ingestion preparation - not authorization to ingest

## Current readiness evidence

Read the latest conversation readiness inspection together with
`reports/HISTORICAL_RECONCILIATION_2026-10-19.md` and
`DEPLOYMENT_VERIFICATION_CHECKLIST.md`. The current deployment remains blocked:
standalone MongoDB, stale API invitation exposure, unsuitable production configuration,
historical score conflicts, answer-bearing prompts, and incomplete roster enrollment UI.
No real participants/teams/configuration/bindings were changed in this phase.

The authenticated staging replica-set configuration is prepared under `staging/`.
It uses separate ports, database, credentials, network and volume; its guarded launcher
rejects live targets. Docker configuration validation is not a container startup test.
Provisioning/initialization/startup remain separate approval-gated actions.

## Registration wizard: smallest safe proposal

### Verified existing behavior

`client/src/pages/public/RegisterPage.jsx` collects a roster but `handleFinalSubmit`
registers **only the leader** then calls `teamService.createTeam(teamName)`. Other member
fields are not persisted. Registration and team creation are separate requests, so a
team-creation failure can leave a valid account with no team. Re-submitting registration
can then conflict with the existing account. Existing backend registration creates one
person, ignores client roles/team assignments, and cannot create accounts on others' behalf.

`POST /api/v1/admin/teams` already accepts a leader identifier and `memberIdentifiers`;
`createAdminTeam` resolves existing active accounts and creates the full roster and initial
Score in one transaction. New isolated tests cover complete-roster success and rollback
when a member cannot be resolved. This does not implement participant identity verification.

### Recommended minimal approved-roster workflow (proposal only)

1. Each person registers their own account, selects their own password and provides
   consent. Reuse the existing auth endpoint; do not let the leader invent passwords,
   claim existing accounts by email, or create other people's accounts.
2. Change the wizard's behavior/copy, preserving its design: individual signup completion
   means **account created, team pending**, not full enrollment. Do not silently collect
   and discard member details or show a fully enrolled team when only one account exists.
   Existing accounts log in instead of being registered again on retry.
3. Use an organizer-approved roster manifest of existing account IDs/identifiers. Resolve
   and preview all members, duplicates, capacity and single-team eligibility before any
   write. Verify identities/consent through an approved process; current JWT auth does
   not provide verified email/OTP. Do not publish this manifest or its private fields.
4. Assemble each complete approved team through the existing authenticated admin batch
   endpoint, using currentLevel 1 / totalScore 0. That transaction is all-or-nothing.
   Existing enrolled users must be resolved for approval rather than silently moved.
5. To enforce organizer-only approval, propose a server-side enrollment mode on
   EventConfig that rejects participant create/join endpoints in this mode. UI hiding
   alone is insufficient; existing bearer join codes do not prove roster approval.
   Admin assembly remains role-protected. This mode/gate is **not implemented here**.

This reuses existing account creation, admin roster resolution, authorization and
transactions. It avoids introducing email delivery, invitation-account creation or
Clerk during preparation. A self-service invite alternative is possible only after
the organizer explicitly approves invitation possession as the enrollment policy or
implements identity-bound approvals. Do not equate either policy to verified email.

### Exact proposed implementation scope (not changed now)

- `client/src/pages/public/RegisterPage.jsx`: individual registration/pending state,
  existing-account retry and honest roster status; stop automatic leader-only team creation
  in organizer-approved mode.
- `server/src/models/EventConfig.js`, `server/src/services/team.service.js`: approved
  enrollment mode and backend gates for participant create/join.
- `client/src/pages/admin/TeamManagementPage.jsx`: preview the approved existing-user
  roster and reuse `client/src/services/admin.service.js` / `POST /admin/teams`.
- `server/tests/security.test.js`: mode bypass, pending/retry and reviewed-batch tests
  after implementation. Identity-bound approval requires its own approved requirements.

No wizard, enrollment-mode or application API behavior was changed by this proposal.

## Shared-campus signed Public QR proposal

- Use one explicitly approved **Public QR** checkpoint per challenge level, retaining
  existing checkpoint/challenge IDs only if the organizer chooses to reuse the data.
  Public means shared across eligible teams; every scan still needs authentication,
  active membership, roster eligibility, LIVE state and a valid signature.
- Existing payload code already signs version, checkpoint code, level, shared scope and
  expiry. Only the server holds the signing key. Never embed answers in QR content.
- Levels 1-2 are currently Public QR. Levels 3-10 are Team-bound QR with no bound team.
  Approve converting the latter to Public QR only for shared stations. The current unique
  checkpoint-per-level schema and single boundTeamId cannot represent one dedicated
  binding per participating team. Do not silently work around that restriction.
- Event dates/timezone, public domain, allowed operating window, TTL and replacement
  policy must be approved **before any real signed payload generation or printing**.
  Default TTL is 24 hours; set an approved TTL/window covering installation and the
  event, with a bounded expiry. The current implementation has expiry but no not-before
  claim: LIVE/start-time enforcement is the opening gate. Do not describe expiry as
  automatic event-date validation.
- Static shared QR photos can be forwarded. Signatures prevent tampering, not proof of
  physical presence. If physical-presence assurance is required, approve staffed checks
  or a separately scoped rotating beacon design before claiming anti-sharing protection.
- After approval: apply reviewed mode/configuration changes, fetch fresh signed payloads
  through admin access, print replacements, retire old placards, and test with eligible,
  locked, undersized and disqualified synthetic teams before opening real gameplay.
- Scanning awards zero points and cannot skip progression. No new real signatures or
  placards were generated in this phase; tests use synthetic checkpoint fixtures only.

## Ordered approval gates

1. Approve production/staging target, maintenance/backups and staging-only provisioning.
2. Classify current historical/demo/real records and choose separate event DB versus
   reviewed reuse. No blanket reset or automatic reconciliation is authorized.
3. Approve final event dates/settings, capacity, challenge content/assets and scoring.
4. Approve organizer-assisted enrollment versus self-service identity/invitation policy,
   then approve implementing the minimal wizard/backend mode changes above.
5. Approve shared Public QR policy, expiry window, physical-presence assurance and
   later payload/placard issuance. No issuance before dates and policy approval.
6. Approve any exact reconciliation/invitation-rotation manifest separately, after an
   isolated restore rehearsal and before-images are reviewed.
7. Approve a reviewed release deployment, smoke tests and rollback procedure.
8. Approve real participant/team ingestion and registration opening as the final gate.
