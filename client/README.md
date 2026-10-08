# Hack the Grid — Frontend Web Client

Cybersecurity SOC / CTF HUD interface for **Hack the Grid**, engineered for the CodeSphere Coding Club at Tula's University, Dehradun.

## Tech Stack

- **Framework**: React 19 + Vite 6
- **Styling**: Tailwind CSS (SOC cyber theme: #05070A, #0B1017, #0F1720, #00E5FF, #39FF88, #FF6A00)
- **Routing**: React Router v7
- **Motion & Transitions**: Framer Motion
- **HTTP Client**: Axios with centralized JWT Bearer interceptor
- **Iconography**: Lucide React

## Directory Structure

```text
client/
├── public/                 # Static assets & favicon
├── src/
│   ├── assets/             # Vector graphics and badges
│   ├── components/
│   │   ├── common/         # CyberButton, CyberCard, TerminalWindow, Badges, Modals
│   │   ├── hud/            # HUDHeader, EventTimer, ScoreDisplay, ScanlineOverlay
│   │   └── navigation/     # Navbar, Footer, AdminSidebar
│   ├── layouts/            # PublicLayout, ParticipantLayout, AdminLayout
│   ├── pages/
│   │   ├── public/         # Home, About, HowItWorks, Rules, Schedule, FAQ
│   │   ├── auth/           # Login, Register
│   │   ├── participant/    # Dashboard, MissionMap, ChallengeView, CheckpointScanner, Leaderboard
│   │   └── admin/          # AdminDashboard, TeamManagement, ChallengePool, SubmissionLogs
│   ├── routes/             # AppRoutes, ProtectedRoute (RBAC)
│   ├── services/           # Axios HTTP client & domain API services
│   ├── context/            # AuthContext, EventContext
│   ├── hooks/              # useAuth, useCountdown, usePolling
│   ├── constants/          # Themes, routes, status enums
│   ├── utils/              # Formatters, local storage managers
│   ├── styles/             # index.css (custom cyber scanlines, grid styling)
│   ├── App.jsx             # Top-level application shell
│   └── main.jsx            # Application DOM mounting
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

## Quick Start (Phase 1 Setup)

1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment template:
   ```bash
   cp .env.example .env
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
   Access at `http://localhost:5173`.

