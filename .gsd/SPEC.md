# Security remediation

Status: FINALIZED

Scope authorized by the user's security remediation request on 19 October 2026:
protect participant content and team invitations; require signed checkpoints; make
scoring, reviews and membership transactional; enforce lifecycle rules; implement
JWT revocation; validate production configuration; add isolated regression tests
and update the four project documents. Preserve the current UI and existing work.

Never mutate the existing event database. Tests provision their own replica set.
No Clerk integration, deployment, live migration, or commits are included.

Verification: real HTTP tests against isolated MongoDB, concurrent operations,
server lint and tests, frontend production build. Report migration requirements.
