# SECURITY ARCHITECTURE & ANTI-CHEAT SYSTEM: THE TECH MYSTERY

This document defines the multi-tiered defense-in-depth security model implemented in **The Tech Mystery** to ensure competition integrity.

---

## 1. Threat Modeling & CTF Cheating Vectors

| Attack Vector | Attacker Motive | Mitigation Implemented |
|---|---|---|
| **Client-Side Source Leakage** | Inspect React state, bundle, or network tab to extract answers | Zero flags or answers exist on client. Models use `select: false` on `flag`. |
| **Flag Brute-Forcing** | Write scripts to hammer flag endpoints with dictionary attacks | Tiered rate limiter (`submissionLimiter`) restricts teams to 10 attempts/min/level with cool-downs. |
| **Timing Side-Channel Attacks** | Deduce flag characters by measuring comparison latency | Flag string comparison uses Node's constant-time `crypto.timingSafeEqual`. |
| **Cross-Team Collusion** | Share solved flag with adjacent friendly team | Questions are drawn from randomized pools. Team A and Team B receive different questions. |
| **Physical QR Remote Forgery** | Guess checkpoint IDs without campus physical presence | QR codes use HMAC-SHA256 signatures with server-side secrets (`QR_SECRET_SALT`). |
| **Privilege Escalation** | Manipulate JWT or request headers to access `/admin` | JWT signed with HMAC-SHA256. Admin routes guarded by `requireRole(ROLES.ADMIN)`. |
| **Denial of Service (DoS)** | Overwhelm backend during competition rush | Global rate limiter (`apiLimiter`), Helmet headers, body size limits (1MB). |

---

## 2. Zero-Leakage Architecture

### Flag Secrecy by Design
In `server/src/models/Question.js`:
```javascript
flag: {
  type: String,
  required: true,
  select: false // Excluded from all standard Mongoose queries
}
```
Unless an internal service explicitly calls `.select('+flag')`, queries like `find()`, `findOne()`, or `.populate('assignedQuestionId')` strictly omit the flag field from JSON serialization.

### Constant-Time Flag Verification
In `server/src/utils/crypto.js`:
```javascript
const safeFlagCompare = (submitted, expected) => {
  const normSub = normalizeFlag(submitted);
  const normExp = normalizeFlag(expected);
  if (normSub.length !== normExp.length) return false;
  return crypto.timingSafeEqual(Buffer.from(normSub), Buffer.from(normExp));
};
```

---

## 3. Rate Limiting Architecture

| Limiter Scope | Window | Max Requests | Target |
|---|---|---|---|
| **Global API** | 15 minutes | 150 requests | Guard entire `/api/v1` against scraping |
| **Auth Intake** | 15 minutes | 20 requests | Prevent password spraying on `/auth/login` |
| **Flag Submissions** | 1 minute | 10 attempts | Anti-brute-force per team + level |
| **QR Scanners** | 30 seconds | 10 scans | Prevent automated barcode loop flooding |

---

## 4. Forensic Audit Trail

Every interaction with the flag submission endpoint is permanently recorded in the `submissions` collection:
- `teamId` and `userId`
- Exact string submitted
- Timestamp down to the millisecond
- Source client IP address and User-Agent
- Verification outcome (`CORRECT`, `INCORRECT`, `RATE_LIMITED`)

Organizers can review anomalous submission velocity directly in the Admin Command SOC.

