# PHYSICAL QR CHECKPOINT ARCHITECTURE: HACK THE GRID

This document defines the cryptographic design, URL structure, and anti-spoofing protocols for the physical QR checkpoint beacons stationed across Tula's University campus.

---

## 1. Zero-Exposure Security Principle

> **CARDINAL RULE:**  
> A physical QR code placard placed on campus **MUST NEVER** encode:
> - Challenge questions or clues
> - Flags or answers
> - Direct API endpoints that execute actions without authentication

Physical QR placards act solely as **Cryptographically Signed Physical Proximity Markers**.

---

## 2. Checkpoint URL Schema & Token Structure

Physical QR codes encode a standard web URL formatted as:
```text
https://hackthegrid.codesphere.org/portal/checkpoint?code=CP-A7F92B&token=d5a8b2...
```

### Component Breakdown
1. **Base Domain**: `https://hackthegrid.codesphere.org` (or local host in dev)
2. **Path**: `/portal/checkpoint` (Routes user directly to portal scanner)
3. **`code` Parameter**: An opaque, non-sequential alphanumeric string (e.g. `CP-A7F92B`)
4. **`token` Parameter**: An HMAC-SHA256 signature calculated as:
   $$\text{token} = \text{HMAC-SHA256}(\text{key}=\text{QR\_SECRET\_SALT}, \text{data}=\text{"CP-A7F92B:LevelNumber"})$$

---

## 3. Threat Modeling & Countermeasures

### A. Code Enumeration / Brute-Forcing
- **Threat**: A team tries to guess `CP-01`, `CP-02`, etc., without walking to the campus location.
- **Countermeasure**:
  1. Checkpoint codes are randomized 6-character hex slugs.
  2. The server strictly verifies the HMAC token using constant-time comparison (`crypto.timingSafeEqual`). Guessing a valid token has a complexity of $2^{256}$.

### B. Premature Level Scanning
- **Threat**: A team finds Level 7's QR sticker while wandering the campus during Level 2.
- **Countermeasure**:
  - The server verifies: `team.currentLevel >= checkpoint.levelNumber`.
  - If a team attempts to scan Level 7 while on Level 2, the server responds with:
    `400 Bad Request: Checkpoint locked! Solve prior levels first.`
  - The scan is rejected and logged as premature in the audit trail.

### C. Re-Scan & Idempotency
- **Threat**: Multiple teammates scan the same QR sticker simultaneously or refresh the page.
- **Countermeasure**:
  - Scanning is completely idempotent. Re-scanning an already unlocked checkpoint simply returns the previously assigned question for that level without altering state.

---

## 4. Campus Placard Physical Deployment

Organizers print waterproof 4x6" laminated placard cards featuring:
- CodeSphere & Tula's University branding
- High-contrast QR barcode
- Fallback manual checkpoint code (e.g. `CP-A7F92B`) for devices with camera issues
- Instructions: *"Scan with your smartphone camera to authenticate operative location."*
