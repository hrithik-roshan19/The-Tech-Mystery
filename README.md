# ⚡ THE TECH MYSTERY

> **Flagship Hybrid Cybersecurity Capture-the-Flag (CTF) Platform**  
> Organized by **CodeSphere Coding Club** at **Tula's University, Dehradun**

[![Node.js Version](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-19.0-cyan.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Database](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-Proprietary-orange.svg)]()

---

## 🛰️ Project Overview

**The Tech Mystery** is a modern, production-grade cybersecurity competition platform designed to bridge virtual problem-solving with the physical university campus. 

Teams of 2 to 4 students traverse **10 progressive containment levels** ranging from reconnaissance, cryptography, and steganography to web inspection, binary reverse-engineering, and the climactic **Master Flag**.

### Key Architectural Highlights
- **Campus Physical QR Checkpoints**: Physical QR stickers placed across university coordinates unlock levels without ever exposing challenges or answers inside the QR codes.
- **Persistent Team-Specific Question Allocation**: Every squad is assigned a distinct challenge variation from an encrypted pool. Idempotent design ensures questions never regenerate upon page refresh or re-scan.
- **Zero Client Answer Leakage**: Challenge flags, answers, and solution logic are strictly sealed server-side (`select: false`) and validated using constant-time string comparisons.
- **Cybersecurity SOC & Game HUD Aesthetics**: High-impact dark theme (`#05070A`, `#00E5FF`, `#39FF88`, `#FF6A00`) with scanlines, monospace telemetry, and tactical HUD controls.
- **Admin Command SOC**: God-mode operations center featuring live submission forensics, one-click squad disqualification, and a freeze switch for the live leaderboard.

---

## 📁 Repository Structure

```text
hack-the-grid/
├── client/                     # Frontend SPA (React 19, Vite, Tailwind CSS, Framer Motion)
├── server/                     # Backend API (Node.js, Express, Mongoose, JWT, Rate Limiting)
├── docs/                       # Comprehensive Architecture & Engineering Documentation
│   ├── PROJECT_CONTEXT.md      # ★ Single source of truth for AI & developer continuity
│   ├── ARCHITECTURE.md         # System topology, sequence flows, data contracts
│   ├── DATABASE_SCHEMA.md      # Mongoose schemas, relationships, compound indexes
│   ├── API_DOCUMENTATION.md    # REST API specification for /api/v1 routes
│   ├── GAMEPLAY_LOGIC.md       # Progression rules, tie-breaking, scoring math
│   ├── QR_SYSTEM.md            # Checkpoint token design and HMAC verification
│   ├── SECURITY.md             # Threat models, anti-cheat, rate limiters
│   ├── ADMIN_SYSTEM.md         # God-mode admin controls and operations guide
│   ├── FRONTEND_GUIDELINES.md  # Cyber SOC visual identity, colors, typography
│   ├── DEVELOPMENT_PROGRESS.md # Phase completion tracker
│   ├── DECISIONS.md            # Architectural Decision Records (ADRs)
│   └── TODO.md                 # Actionable future implementation backlog
├── .env.example                # Combined environment variable template
├── .gitignore                  # Git ignore rules
├── package.json                # Monorepo workspaces definition
└── README.md                   # Repository guide (THIS FILE)
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** (v20.0.0 or higher)
- **npm** (v10.0.0 or higher)
- **MongoDB** (Local instance or MongoDB Atlas connection string)

### 2. Installation
Install all dependencies across the workspace:
```bash
# Clone the repository
git clone https://github.com/CodeSphere-Tulas/Hack-The-Grid.git
cd Hack-The-Grid

# Install root, client, and server dependencies
npm run install:all
```

### 3. Environment Configuration
Copy environment templates:
```bash
# Server environment
cp server/.env.example server/.env

# Client environment
cp client/.env.example client/.env
```
*(Update `MONGODB_URI` in `server/.env` with your MongoDB connection string).*

### 4. Running Development Servers
You can start both client and server concurrently, or individually:

```bash
# Start backend server (http://localhost:5000)
npm run dev:server

# Start frontend client (http://localhost:5173)
npm run dev:client
```

---

## 📚 Documentation Index

For developers and AI coding agents resuming work on this codebase:
- **[Master Project Context](file:///docs/PROJECT_CONTEXT.md)**: Read first before modifying code.
- **[System Architecture](file:///docs/ARCHITECTURE.md)**: Sequence diagrams and system topology.
- **[Database Schemas](file:///docs/DATABASE_SCHEMA.md)**: Full collection fields, indexes, and ERD.
- **[API Documentation](file:///docs/API_DOCUMENTATION.md)**: REST endpoints and payloads.
- **[Development Progress](file:///docs/DEVELOPMENT_PROGRESS.md)**: Phase status tracker.
- **[Architectural Decisions (ADR)](file:///docs/DECISIONS.md)**: Key architectural choices and rationale.
- **[Task Backlog](file:///docs/TODO.md)**: Detailed phase roadmap.

---

## 🛡️ Security & Integrity Principles

- **No Secrets in Source Control**: All credentials and salts reside in `.env`.
- **Timing Attack Mitigation**: Flag comparison uses `crypto.timingSafeEqual`.
- **Anti-Brute-Force Rate Limiting**: Max 10 attempts/minute per squad on challenge submissions.
- **Tamper-Proof QR Codes**: Physical QR placards use HMAC-SHA256 signatures; zero answer data is stored on campus posters.

---

## 🏛️ Event Organization

- **Event**: The Tech Mystery (Annual CTF)
- **Club**: CodeSphere Coding Club
- **Institution**: Tula's University, Dehradun, Uttarakhand, India
- **Year**: 2026

