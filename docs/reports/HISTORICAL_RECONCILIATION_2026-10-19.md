# Historical reconciliation evidence - 19 October 2026

Captured: 2026-10-19T08:42:53.812Z to 2026-10-19T08:42:53.902Z (UTC).

Read-only native-driver inspection. No records, IDs, scores, invitations or event settings were changed. This is evidence for organizer decisions, not an approved migration. No personal data, credentials, answer strings or signed QR payloads are included.

Database: `hack_the_grid`; topology: **standalone**. Counts were stable across the read interval. These sequential reads are not an atomic snapshot or a backup.

## Observed counts

| Collection | Count |
|---|---:|
| users | 97 |
| teams | 42 |
| challenges | 10 |
| questions | 17 |
| checkpoints | 10 |
| teamchallenges | 52 |
| submissions | 72 |
| scores | 42 |

## Six unsupported-score teams

Team and Score snapshot totals agree, but those totals lack supporting solves/history. Do not assume these points are either valid or disposable.

| Original team ID | Level | Stored points | Solve points | History points | Original score ID |
|---|---:|---:|---:|---:|---|
| `6ace7c2bf5fda84bd9c5fccf` | 8 | 1840 | 0 | 0 | `6ace7c2b6014ea747c698d70` |
| `6ace7c2cf5fda84bd9c5fcdd` | 7 | 1690 | 0 | 0 | `6ace7c2c6014ea747c698d71` |
| `6ace7c2cf5fda84bd9c5fce8` | 7 | 1510 | 0 | 0 | `6ace7c2c6014ea747c698d72` |
| `6ace7c2cf5fda84bd9c5fcf3` | 6 | 1320 | 0 | 0 | `6ace7c2c6014ea747c698d73` |
| `6ace7c2cf5fda84bd9c5fd01` | 6 | 1280 | 0 | 0 | `6ace7c2c6014ea747c698d74` |
| `6ad07bddd38f05b1e19784ca` | 1 | 750 | 0 | 0 | `6ad07bddd38f05b1e19784cd` |

These six totals sum to 8,390 points. All 42 teams total 10,090 points; recorded solves total 1,700. Organizer approval is required to classify historical/demo/test records or carry scores into a new event. No score resets are proposed as an automatic repair.

## Three score-amount discrepancies

Each assignment/history records 100 points, while its unique linked correct submission records zero. A canonical-owner backfill alone would not resolve this inconsistency.

| Team ID | Assignment ID | Correct submission ID | Assignment points | Submission points |
|---|---|---|---:|---:|
| `6ace7d0cfe5a4232d239b3cb` | `6ace7d0cfe5a4232d239b3e9` | `6ace7d0cfe5a4232d239b404` | 100 | 0 |
| `6ace8199fe5a4232d239b59c` | `6ace8199fe5a4232d239b5ba` | `6ace8199fe5a4232d239b5d5` | 100 | 0 |
| `6ad07c58b9813a8ca5e87848` | `6ad07c59b9813a8ca5e87869` | `6ad07c59b9813a8ca5e87884` | 100 | 0 |

## Fourteen candidate canonical-owner mappings

Each has one matching correct submission, matching team/challenge/question associations, matching history, consistent totals and progression, and no scoring owner. These are evidence candidates only: applying any mapping requires approval and a guarded, separately reviewed migration.

| Team ID | Assignment ID | Candidate submission ID | Points |
|---|---|---|---:|
| `6ad080e7666d7dc7bc9b2460` | `6ad080e7666d7dc7bc9b2470` | `6ad080e7666d7dc7bc9b247f` | 100 |
| `6ad0811ef97208b3274e2ef3` | `6ad0811ef97208b3274e2f03` | `6ad0811ef97208b3274e2f12` | 100 |
| `6ad08125f97208b3274e2f5c` | `6ad08126f97208b3274e2f7d` | `6ad08126f97208b3274e2f98` | 100 |
| `6ad09704c1c8aa5e3b765195` | `6ad09704c1c8aa5e3b7651b6` | `6ad09704c1c8aa5e3b7651d7` | 100 |
| `6ad09709c1c8aa5e3b765295` | `6ad09709c1c8aa5e3b7652a8` | `6ad09709c1c8aa5e3b7652ba` | 100 |
| `6ad09776d302b02553cce02e` | `6ad09776d302b02553cce041` | `6ad09776d302b02553cce053` | 100 |
| `6ad09820d302b02553cce1cf` | `6ad09820d302b02553cce1f0` | `6ad09820d302b02553cce211` | 100 |
| `6ad09828d302b02553cce355` | `6ad09828d302b02553cce368` | `6ad09828d302b02553cce37a` | 100 |
| `6ad0998e9daf0ef14b6d8682` | `6ad0998f9daf0ef14b6d8695` | `6ad0998f9daf0ef14b6d86a7` | 100 |
| `6ad099979daf0ef14b6d8785` | `6ad099979daf0ef14b6d87a6` | `6ad099979daf0ef14b6d87c7` | 100 |
| `6ad5cce95853b87ba757b749` | `6ad5cce95853b87ba757b76a` | `6ad5ccea5853b87ba757b78b` | 100 |
| `6ad5ccfa5853b87ba757b8cf` | `6ad5ccfa5853b87ba757b8e2` | `6ad5ccfa5853b87ba757b8f4` | 100 |
| `6ad5cdcb5853b87ba757baa3` | `6ad5cdcc5853b87ba757bac4` | `6ad5cdcc5853b87ba757bae5` | 100 |
| `6ad5cddc5853b87ba757bc29` | `6ad5cddc5853b87ba757bc3c` | `6ad5cddc5853b87ba757bc4e` | 100 |

## Submissions referencing five deleted teams

Twenty submissions remain, including ten correct submissions. Their team and assignment records are missing. Preserve these records; do not recreate teams or award points from them without independent evidence.

### Missing team `6ad096f7c1c8aa5e3b764ffb`

| Original submission ID | Original missing assignment ID | Correct | Recorded points |
|---|---|---|---:|
| `6ad096f8c1c8aa5e3b765074` | `6ad096f8c1c8aa5e3b76504e` | false | 0 |
| `6ad096f8c1c8aa5e3b765080` | `6ad096f8c1c8aa5e3b76504e` | true | 100 |
| `6ad096f8c1c8aa5e3b7650a9` | `6ad096f8c1c8aa5e3b76509b` | false | 0 |
| `6ad096f8c1c8aa5e3b7650b5` | `6ad096f8c1c8aa5e3b76509b` | true | 600 |

### Missing team `6ad0977ad302b02553cce0c2`

| Original submission ID | Original missing assignment ID | Correct | Recorded points |
|---|---|---|---:|
| `6ad0977ad302b02553cce13b` | `6ad0977ad302b02553cce115` | false | 0 |
| `6ad0977ad302b02553cce147` | `6ad0977ad302b02553cce115` | true | 100 |
| `6ad0977ad302b02553cce170` | `6ad0977ad302b02553cce162` | false | 0 |
| `6ad0977ad302b02553cce17c` | `6ad0977ad302b02553cce162` | true | 600 |

### Missing team `6ad099879daf0ef14b6d850c`

| Original submission ID | Original missing assignment ID | Correct | Recorded points |
|---|---|---|---:|
| `6ad099879daf0ef14b6d8585` | `6ad099879daf0ef14b6d855f` | false | 0 |
| `6ad099879daf0ef14b6d8591` | `6ad099879daf0ef14b6d855f` | true | 100 |
| `6ad099879daf0ef14b6d85ba` | `6ad099879daf0ef14b6d85ac` | false | 0 |
| `6ad099879daf0ef14b6d85c6` | `6ad099879daf0ef14b6d85ac` | true | 600 |

### Missing team `6ad5cd025853b87ba757b963`

| Original submission ID | Original missing assignment ID | Correct | Recorded points |
|---|---|---|---:|
| `6ad5cd025853b87ba757b9dc` | `6ad5cd025853b87ba757b9b6` | false | 0 |
| `6ad5cd025853b87ba757b9e8` | `6ad5cd025853b87ba757b9b6` | true | 100 |
| `6ad5cd025853b87ba757ba11` | `6ad5cd025853b87ba757ba03` | false | 0 |
| `6ad5cd025853b87ba757ba1d` | `6ad5cd025853b87ba757ba03` | true | 600 |

### Missing team `6ad5cde95853b87ba757bcbd`

| Original submission ID | Original missing assignment ID | Correct | Recorded points |
|---|---|---|---:|
| `6ad5cde95853b87ba757bd36` | `6ad5cde95853b87ba757bd10` | false | 0 |
| `6ad5cde95853b87ba757bd42` | `6ad5cde95853b87ba757bd10` | true | 100 |
| `6ad5cde95853b87ba757bd6b` | `6ad5cde95853b87ba757bd5d` | false | 0 |
| `6ad5cde95853b87ba757bd77` | `6ad5cde95853b87ba757bd5d` | true | 600 |

## Before any approved reconciliation

1. Stop writers under an approved maintenance window and verify an encrypted backup through isolated restore.
2. Classify genuine event records separately from historical/demo/test data. Prefer a separate production event database if approved.
3. Prepare an exact-ID change manifest with expected current values and an idempotent/reversible mapping. Recheck all evidence against a consistent snapshot.
4. Test the manifest only on an isolated restored copy; compare every score, history entry, assignment, foreign key and audit record.
5. Obtain explicit approval for the precise live operation. Keep a before-image journal and do not delete original submissions.

The machine-readable sibling JSON preserves additional original challenge/question/snapshot references. Report writing used only local filesystem operations; database operations were limited to counts, finds and hello.
