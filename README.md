# CaterFlow Platform

A simple catering scheduling platform built as a browser-based frontend with optional local JSON API support.

## What it is

- A single-page web app for managing bookings, staff, notifications, packages, and invoices.
- Frontend state is stored in `localStorage` and initialized from `js/data/seed.js`.
- Includes an optional local API server that persists data in `api/data.json`.

## Project structure

- `index.html` — main application entry point
- `css/` — styling for the app and landing page
- `js/` — frontend JavaScript
  - `js/app.js` — app shell, state management, routing, and actions
  - `js/utils/storage.js` — localStorage helper
  - `js/utils/api.js` — optional API wrapper for the local server
  - `js/data/seed.js` — initial demo data used when no API is available
  - `js/components/` — UI component renderers
- `api/` — local JSON API server
  - `api/server.js` — Express server
  - `api/data.json` — persisted backend data
- `package.json` — API server dependencies and start script

## Prerequisites

- Node.js 18+ installed
- A browser for viewing the app

## Setup

From the project root:

```powershell
cd "c:\Users\USER\Documents\myProject\CaterFlowPlatform"
npm install
```

## Run the app

Start the API server and static frontend together:

```powershell
npm start
```

Then open in your browser:

```text
http://localhost:3000/
```

## How the app works

- If the local API is available, the frontend will fetch state from the API and persist changes back to `api/data.json`.
- If the API is not available, the app still works as a client-only demo using seeded data from `js/data/seed.js` and stores changes in the browser's `localStorage`.

## API endpoints

The local API exposes these routes:

- `GET /api/ping`
- `GET /api/state`
- `GET /api/bookings`
- `POST /api/bookings`
- `PUT /api/bookings/:id`
- `DELETE /api/bookings/:id`
- `GET /api/staff`
- `POST /api/staff`
- `PUT /api/staff/:id`
- `DELETE /api/staff/:id`
- `GET /api/notifications`
- `POST /api/notifications`
- `PUT /api/notifications/:id`
- `DELETE /api/notifications/:id`
- `GET /api/packages`
- `GET /api/menu`

## Notes

- The server now serves the frontend and the API from the same origin.
- This is a local development/demo setup, not production-ready.
- For production, add real authentication, validation, and a proper database.
