# REST API DOCUMENTATION: THE TECH MYSTERY

Base URL: `http://localhost:5000/api/v1` (Development) / `https://<backend-domain>/api/v1` (Production)

---

## 1. Global Response Standards

### Success Envelope
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "meta": { "page": 1, "total": 42 } // Optional
}
```

### Error Envelope
```json
{
  "success": false,
  "message": "Error description",
  "errorCode": "VALIDATION_FAILED",
  "errors": [
    { "field": "email", "message": "A valid email address is required" }
  ]
}
```

---

## 2. Authentication Header
All protected endpoints require:
```http
Authorization: Bearer <jwt_access_token>
```

---

## 3. Endpoints Directory

### 3.1. System Health
#### `GET /health`
- **Auth**: None
- **Response `200`**:
  ```json
  {
    "success": true,
    "message": "The Tech Mystery Core API is healthy and operational",
    "data": {
      "status": "ONLINE",
      "uptime": 3600.42,
      "timestamp": "2026-10-08T15:00:00.000Z",
      "database": "connected",
      "nodeVersion": "v26.1.0"
    }
  }
  ```

---

### 3.2. Authentication (`/auth`)

#### `POST /auth/register`
- **Rate Limit**: 20 req / 15 min
- **Request Body**:
  ```json
  {
    "username": "cypher_01",
    "email": "cypher@tulas.edu.in",
    "password": "SecretPassphrase123",
    "fullName": "Alex Mercer",
    "phone": "+91 9876543210",
    "collegeRollNo": "TU-CS-2024-001"
  }
  ```
- **Response `201`**:
  ```json
  {
    "success": true,
    "message": "Participant registered successfully",
    "data": {
      "user": {
        "id": "6705...",
        "username": "cypher_01",
        "email": "cypher@tulas.edu.in",
        "fullName": "Alex Mercer",
        "role": "TEAM_MEMBER",
        "teamId": null
      },
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "eyJhbGciOi..."
    }
  }
  ```

#### `POST /auth/login`
- **Rate Limit**: 20 req / 15 min
- **Request Body**:
  ```json
  {
    "emailOrUsername": "cypher_01",
    "password": "SecretPassphrase123"
  }
  ```
- **Response `200`**: Same token payload as register.

#### `GET /auth/me`
- **Auth**: Required (`Bearer <token>`)
- **Response `200`**: Returns current authenticated user and populated team document.

---

### 3.3. Teams (`/teams`)

#### `POST /teams/create`
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "name": "ShadowGrid"
  }
  ```
- **Response `201`**: Returns newly created team with auto-generated `joinCode` (e.g. `HTG-A8F29C`). Promoting user to `TEAM_LEADER`.

#### `POST /teams/join`
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "joinCode": "HTG-A8F29C"
  }
  ```
- **Response `200`**: Enrolls user into squad if members count `< 4`.

#### `GET /teams/me`
- **Auth**: Required
- **Response `200`**: Returns logged-in team details, roster, current level, and accumulated score.

---

### 3.4. Challenges (`/challenges`)

#### `GET /challenges/mission-map`
- **Auth**: Required (Team Member)
- **Response `200`**: Returns array of all 10 stages with `isSolved`, `isUnlocked`, `isCurrent` statuses relative to the team's progress.

#### `GET /challenges/current`
- **Auth**: Required (Team Member)
- **Response `200`**:
  ```json
  {
    "success": true,
    "data": {
      "levelNumber": 1,
      "challenge": {
        "title": "Level 1: Reconnaissance Protocol",
        "category": "WEB_INSPECTION",
        "points": 100,
        "difficulty": "EASY",
        "description": "Perimeter breach reconnaissance..."
      },
      "question": {
        "_id": "6705...",
        "title": "Source Leak Analysis - Variant B",
        "prompt": "Inspect the provided network payload...",
        "assetUrls": []
      },
      "teamChallenge": {
        "status": "UNLOCKED",
        "unlockedHints": [],
        "penaltyIncurred": 0,
        "attemptsCount": 2
      }
    }
  }
  ```
  *(Note: The `flag` property is strictly excluded by backend filter).*

---

### 3.5. Flag Submissions (`/submissions`)

#### `POST /submissions/submit`
- **Auth**: Required (Team Member)
- **Rate Limit**: 10 attempts / minute per team / level
- **Request Body**:
  ```json
  {
    "levelNumber": 1,
    "flag": "HTG{p3r1m3t3r_br34ch3d_2026}"
  }
  ```
- **Response `200` (Correct)**:
  ```json
  {
    "success": true,
    "message": "GRID BREACHED! Level 1 successfully conquered!",
    "data": {
      "isCorrect": true,
      "pointsAwarded": 100,
      "newTotalScore": 100,
      "nextLevel": 2,
      "levelCleared": 1
    }
  }
  ```
- **Response `400` (Incorrect)**:
  ```json
  {
    "success": false,
    "message": "Incorrect flag. Try again, operative.",
    "errorCode": "BAD_REQUEST",
    "errors": { "attemptsCount": 3, "isCorrect": false }
  }
  ```

---

### 3.6. Checkpoint Verification (`/checkpoints`)

#### `POST /checkpoints/scan`
- **Auth**: Required (Team Member)
- **Rate Limit**: 10 scans / 30 seconds
- **Request Body**:
  ```json
  {
    "code": "CP-A7F92B",
    "token": "4a7f92b..."
  }
  ```
- **Response `200`**: Unlocks corresponding level and returns persistent question.

---

### 3.7. Leaderboard (`/leaderboard`)

#### `GET /leaderboard`
- **Auth**: Optional
- **Response `200`**:
  ```json
  {
    "success": true,
    "data": {
      "leaderboard": [
        {
          "rank": 1,
          "teamId": "6705...",
          "teamName": "ShadowProtocol",
          "currentLevel": 4,
          "totalScore": 650,
          "lastSolveTimestamp": "2026-10-08T12:34:56.789Z"
        }
      ],
      "isFrozen": false,
      "lastUpdated": "2026-10-08T12:35:00.000Z"
    }
  }
  ```

---

### 3.8. Admin Command SOC (`/admin`)
*(All endpoints require `ADMIN` role)*

- `GET /admin/dashboard-stats`: Real-time event telemetry metrics.
- `GET /admin/teams`: List all squads, member manifests, and scores.
- `PATCH /admin/teams/:teamId/disqualify`: Disqualify squad with justification.
- `POST /admin/challenges`: Create new level challenge.
- `POST /admin/questions`: Add question variation to level pool.
- `GET /admin/checkpoints`: List campus QR checkpoints with calculated HMAC tokens.
- `POST /admin/checkpoints`: Register physical campus checkpoint beacon.
- `GET /admin/submissions`: Paginated forensic submission logs.
- `PATCH /admin/event-config`: Update master state (`LIVE`, `PAUSED`, `CONCLUDED`) or toggle `isLeaderboardFrozen`.

