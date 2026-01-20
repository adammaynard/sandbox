# CLAUDE.md - Bus Seating Manager

## Project Overview

A React web application for managing and organizing passenger seating arrangements across multiple buses. Features drag-and-drop functionality to assign riders to specific seats, configurable bus layouts, and print-ready seating charts.

## Tech Stack

- **React 19** with Vite 7
- **React DnD** for drag-and-drop interactions
- **Vanilla CSS** with Flexbox/Grid layouts
- **ES6 Modules** (type: module)

## Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

All commands should be run from the `bus-seating-app/` directory.

## Project Structure

```
bus-seating-app/
├── src/
│   ├── components/       # React components (Bus, Seat, Row, Bench, etc.)
│   ├── utils/            # Helper functions
│   ├── App.jsx           # Main app with state management
│   └── main.jsx          # Entry point
├── public/               # Static assets (logo, favicon)
├── vite.config.js        # Vite configuration
└── eslint.config.js      # ESLint flat config (v9+)
```

## Key Components

- **App.jsx** - Central state management (riders, buses, configs), file I/O
- **Bus.jsx** - Bus container with seat counter
- **Row.jsx** - Horizontal row with row number label
- **Bench.jsx** - Left/right bench container
- **Seat.jsx** - Individual seat with drag/drop support
- **RidersList.jsx** - Unassigned riders list (drag source/drop zone)
- **ConfigDialog.jsx** - Modal for bus configuration
- **PrintView.jsx** - Print-optimized seating tables

## Data Structure

```javascript
// Bus state: buses[busIndex][rowIndex][benchIndex][seatIndex]
buses: [
  [ // Bus 1
    [ // Row 1
      ["Alice", "Bob"],  // Left bench seats
      [null, "Charlie"]  // Right bench seats
    ]
  ]
]

// Per-bus configuration
busConfigs: [
  { rows: 14, seatsPerBench: 2 }
]
```

## Key Features

- Drag-and-drop rider assignment between buses and seats
- Multi-bus support with individual configuration (rows, seats per bench)
- State persistence via localStorage and JSON file export/import
- Print-optimized seating charts
- Bulk rider upload from TXT files

## Code Style

- ESLint with React hooks rules and react-refresh plugin
- Unused variables with `^[A-Z_]` pattern are allowed (constants)
- Prefer functional components with hooks
