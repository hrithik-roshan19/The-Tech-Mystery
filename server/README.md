# Hack the Grid — Backend Server API

Production-grade Express.js & MongoDB REST API engine for the **Hack the Grid** Cybersecurity Capture-The-Flag platform.

## Architecture Highlights

- **Persistent Team Challenge Assignment**: Cryptographically seeds or deterministically associates distinct questions from a randomized challenge pool per team, ensuring questions never regenerate upon page reload or re-scanning.
- **Physical QR Checkpoint Integration**: QR codes encode only tamper-proof opaque checkpoint codes (HMAC-hashed), leaving questions, flags, and answers strictly server-side.
- **Zero Frontend Leakage**: Zero flags, hints, or verification logic are sent to the client browser. All verification runs server-side with atomic score updates.
- **Role-Based Access Control**: Granular permission layers for `ADMIN`, `TEAM_LEADER`, and `TEAM_MEMBER`.
- **Brute-Force & Abuse Mitigation**: Multi-tiered rate limiters for auth endpoints, QR scanning, and flag submissions.

## Directory Structure

```text
server/
├── src/
│   ├── config/             # Database connection, environment parsing & validation
│   ├── constants/          # Roles, challenge types, submission statuses, event states
│   ├── controllers/        # Express route handler logic
│   ├── middleware/         # Auth, roles, rate-limiting, error handling, validator runner
│   ├── models/             # Mongoose schemas (User, Team, Challenge, Question, TeamChallenge, etc.)
│   ├── routes/             # REST API endpoint definitions (/api/v1)
│   ├── services/           # Core business logic (question assignment, scoring, tokens)
│   ├── utils/              # API response envelopes, logger, cryptographic helpers
│   ├── validators/         # express-validator rule schemas
│   └── server.js           # Server entry point and middleware pipeline
├── .env.example            # Environment variable template
├── package.json
└── README.md
```

## Quick Start (Phase 1 Setup)

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

*Note: Database connection and route controllers are prepared as architectural foundations for Phase 2–13 development.*
