# Staging configuration - prepared, not provisioned

No container, replica set, user, database, signing key or event record was created
by preparing these files. Root/server .env files are unchanged. Do not run the
commands below without organizer approval for staging provisioning/startup.

This is an authenticated, loopback-only **single-node staging replica set**, not
a production high-availability deployment. Only synthetic data is approved for
tests; copying live records or enrolling real people requires separate approval.

## Approval-gated setup

1. Review/pin the `mongo:8.2` image to an approved digest. Verify Docker is available,
   port 27027 is unused, and the named staging volume/network do not already hold
   data. Never reuse a live volume or port. Do not run `down -v` as a reset step.
2. Create private `staging/secrets/` files: `mongo-keyfile` (valid MongoDB keyfile),
   `mongo-root-password`, and `mongo-app-password`. Generate distinct credentials
   outside chat/logs. These files are ignored by Git. Never reuse live secrets.
3. Copy `.env.example` to `staging/.env`; supply the staging application's password
   and three distinct random signing secrets. Percent-encode URI credentials.
   A 32-byte hex application password avoids URI-special-character ambiguity.
4. From the repository root, after approval, start only this staging service:

   ```powershell
   docker compose -f staging/compose.yaml up -d mongo
   ```

5. Initialize/authenticate the dedicated replica set and create the least-privilege
   staging application user (a staging-only database operation):

   ```powershell
   docker compose -f staging/compose.yaml exec -e HTG_APPROVED_STAGING_INIT=yes mongo mongosh --quiet --host localhost --port 27027 --file /opt/htg/init-replica.js
   ```

6. Verify `hello.setName`, primary election, application-user permissions and a
   synthetic transaction/rollback on this target. This configuration has not been
   container-runtime validated by the preparation phase.
7. After approval, start the staging API using the target guard:

   ```powershell
   node server/scripts/staging-config.js --start-approved-staging
   ```

   The dedicated API bootstrap binds only `127.0.0.1:5100`, not all host interfaces.
   It requires production validation, API port 5100, MongoDB port 27027,
   `hack_the_grid_staging`, `htg-staging`, and the staging-only app username.
   It rejects templates and live database targets. It never loads a live env file.

8. Prepare staging indexes under a reviewed setup procedure: production-mode
   Mongoose does not auto-create them. Initialize approved synthetic EventConfig
   and content only after a separate fixture/setup approval. No demo seed command
   is part of this runbook. Registration should remain closed during acceptance.

The host API connects directly to the single advertised `localhost:27027` member.
This layout is not suitable for remote clients or a multi-node production replica
set. MongoDB auth is enabled; local transport is not TLS. A production target needs
its own TLS/network/access controls and redundancy plan.
