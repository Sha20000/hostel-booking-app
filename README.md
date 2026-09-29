# Hostel Booking App

SE2020 — Full Stack Mobile Application (Individual Assignment)

React Native + Node.js/Express + MongoDB Atlas

## Structure
- `backend/` — REST API (Express, MongoDB, JWT auth)
- `mobile/` — React Native app
- `docs/` — Report, diagrams, API table

## Setup
See `backend/.env.example` and `mobile/.env` for required environment variables.

## Deployment

**Live Backend URL:** https://innovative-clarity-production-bf82.up.railway.app

**Environment Variables Configured on Railway (values redacted):**
- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — secret key used to sign JWT tokens
- `JWT_EXPIRES_IN` — token expiry duration (7d)

The backend is deployed on Railway and connected to a MongoDB Atlas cluster. The mobile application is configured to communicate with the live Railway URL above rather than a local development server.
