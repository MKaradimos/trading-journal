# Trading Journal

A personal trading journal web application for logging, analyzing, and improving trading performance. Built with React and Firebase.

![Trading Journal](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white) ![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)

## Features

- **Trade logging** — date, asset, direction (long/short), entry/exit price, P/L in € and %
- **Auto P/L %** — calculated automatically from P/L € and current capital
- **Monthly statistics** — win rate, total P/L, average P/L per trade, best/worst trade
- **All-time statistics** — aggregated stats across all months
- **Monthly chart** — bar chart of P/L per month
- **Capital tracker** — tracks current capital vs initial capital with overall return %
- **Monthly report modal** — detailed breakdown per month
- **Screenshot support** — attach chart screenshots to each trade
- **Google Authentication** — secure login, only you can access your data
- **Real-time sync** — Firestore real-time updates, works across devices
- **Responsive** — works on desktop and mobile

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite |
| Styling | Tailwind CSS v4 |
| Database | Firebase Firestore |
| Auth | Firebase Authentication (Google) |
| Hosting | Firebase Hosting |
| Charts | Recharts |
| Icons | Lucide React |
| Testing | Vitest, Testing Library |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Firebase](https://firebase.google.com) project with Firestore and Authentication enabled

### Installation

```bash
git clone https://github.com/your-username/trading-journal.git
cd trading-journal
npm install
```

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Firestore Database**
3. Enable **Authentication → Google** sign-in method
4. Copy your Firebase config

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Firestore Security Rules

In Firebase Console → Firestore → Rules, set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Run Locally

```bash
npm run dev
```

### Run Tests

```bash
npm test
```

### Deploy

```bash
npm run build
firebase deploy
```

## Project Structure

```
src/
├── components/
│   ├── CapitalPanel.jsx     # Capital overview panel
│   ├── LoginScreen.jsx      # Google login screen
│   ├── MonthlyChart.jsx     # Bar chart component
│   ├── MonthSelector.jsx    # Month navigation
│   ├── MonthlySummary.jsx   # Trade list summary
│   ├── ReportModal.jsx      # Monthly report modal
│   ├── StatsSection.jsx     # Statistics cards
│   ├── TradeForm.jsx        # Add/edit trade form
│   ├── TradeTable.jsx       # Trade history table
│   └── ui.jsx               # Shared UI primitives
├── hooks/
│   ├── useAuth.js           # Firebase auth state
│   ├── useMonthlyStats.js   # Stats calculations
│   └── useTrades.js         # Trade CRUD operations
├── test/
│   ├── tradeLogic.test.js   # Validation & P/L % tests
│   ├── useMonthlyStats.test.js
│   └── utils.test.js
├── constants.js
├── firebase.js
└── utils.js
```


