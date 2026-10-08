# SYSTEM ARCHITECTURE SPECIFICATION: HACK THE GRID

This document defines the high-level and component architecture of the **Hack the Grid** platform.

---

## 1. System Topology Overview

Hack the Grid is organized into distinct decoupled tiers:

```mermaid
graph TD
    Client["React 19 / Vite Client (SPA)<br/>Cyber SOC HUD Interface"]
    Gateway["Express.js API Engine<br/>Security Middlewares & Rate Limiters"]
    AuthModule["Authentication & RBAC<br/>JWT & bcrypt Engine"]
    QREngine["QR Checkpoint Service<br/>HMAC Cryptographic Verifier"]
    PoolService["Question Assignment Service<br/>Balanced Idempotent Allocator"]
    ScoringEngine["Atomic Scoring Service<br/>Tie-Breaking & Audit Logger"]
    Database[("MongoDB Atlas Database<br/>9 Primary Collections")]

    Client -->|HTTPS REST API /api/v1| Gateway
    Gateway --> AuthModule
    Gateway --> QREngine
    Gateway --> PoolService
    Gateway --> ScoringEngine
    AuthModule --> Database
    QREngine --> Database
    PoolService --> Database
    ScoringEngine --> Database
```

---

## 2. End-to-End Operational Sequence Flows

### A. Physical QR Scan & Persistent Question Assignment Flow

```mermaid
sequenceDiagram
    autonumber
    actor Operative as Participant Squad
    participant Browser as Client Browser (HUD)
    participant Server as Express API (/api/v1)
    participant DB as MongoDB Atlas

    Operative->>Browser: Scans Physical QR Checkpoint
    Browser->>Server: POST /checkpoints/scan { code: "CP-A7F92B", token: "HMAC..." }
    Server->>Server: Verify HMAC signature with QR_SECRET_SALT
    Server->>DB: Fetch Team status & current level
    alt Team currentLevel < checkpoint.levelNumber
        Server-->>Browser: 400 Bad Request ("Level Locked. Clear previous levels first")
    else Team eligible
        Server->>DB: Query TeamChallenge { teamId, levelNumber }
        alt Already assigned
            DB-->>Server: Return existing TeamChallenge & Question (excluding flag)
        else First scan of level
            Server->>DB: Fetch Question pool for Level N
            Server->>Server: Select least-assigned Question variation
            Server->>DB: Insert new TeamChallenge { teamId, challengeId, questionId }
        end
        Server->>DB: Mark checkpointScanned = true on TeamChallenge
        Server-->>Browser: 200 OK { checkpoint, question, teamChallenge }
        Browser-->>Operative: Display decrypted challenge prompt in HUD
    end
```

---

### B. Flag Submission & Atomic Scoring Flow

```mermaid
sequenceDiagram
    autonumber
    actor Operative as Participant Squad
    participant Browser as Client Browser (HUD)
    participant Server as Express API (/api/v1)
    participant DB as MongoDB Atlas

    Operative->>Browser: Enters flag string e.g. HTG{sample_flag}
    Browser->>Server: POST /submissions/submit { levelNumber: 2, flag: "HTG{...}" }
    Server->>Server: Apply submission rate limiter (10 req/min per team)
    Server->>DB: Fetch TeamChallenge & Question (with secret flag)
    alt Level already solved
        Server-->>Browser: 400 Bad Request ("Already solved by your team")
    else Pending solve
        Server->>Server: crypto.timingSafeEqual(submittedFlag, question.flag)
        alt Flag Incorrect
            Server->>DB: Log Submission { isCorrect: false, status: "INCORRECT" }
            Server-->>Browser: 400 Bad Request ("Incorrect flag. Try again.")
        else Flag Correct
            Server->>DB: Log Submission { isCorrect: true, status: "CORRECT" }
            Server->>DB: Update TeamChallenge (status = 'SOLVED', solvedAt = now)
            Server->>DB: Atomic $inc Team totalScore, set currentLevel = levelNumber + 1
            Server->>DB: Update Score snapshot collection with timestamp
            Server-->>Browser: 200 OK { isCorrect: true, pointsAwarded: 200, nextLevel: 3 }
            Browser-->>Operative: Play HUD breach animation & advance to Level 3
        end
    end
```

---

## 3. Architecture Principles

1. **Zero Client-Side Trust**:
   - The browser never receives flags, answers, or verification logic.
   - All comparisons occur server-side inside constant-time routines (`crypto.timingSafeEqual`).
2. **Deterministic Idempotency**:
   - Every team-specific question assignment is stored in the database.
   - Any repeated request, reload, or duplicate QR scan returns the exact same question record.
3. **Stateless Scalability**:
   - Authentication is powered by self-contained JWT tokens.
   - The API server maintains no in-memory session state, allowing horizontal scaling across multiple instances (Render/Railway/AWS).
4. **Performance Optimized Scoring**:
   - Leaderboard standings are served from pre-indexed snapshots in the `scores` collection (`{ currentScore: -1, lastSolveTimestamp: 1 }`), preventing heavy table scans during high-traffic competition bursts.
