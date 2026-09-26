# LMS Project

A role-based learning management system with a Node.js/Express API, PostgreSQL/Supabase-backed data layer, React frontend, and Python automation tests.

## Overview

- Backend: Node.js + Express + PostgreSQL
- Frontend: Vite + React
- Database bootstrap: automatic schema + seed data in `server/db.js`
- Automated validation: Python tests under `tests/`
- Roles: Learner, Instructor, Reviewer, Admin

## Repository layout

```text
.
├─ .env.example
├─ .github/
│  └─ workflows/
│     └─ ci.yml
├─ Dockerfile
├─ docker-compose.yml
├─ docs/
├─ package.json
├─ server/
│  ├─ db.js
│  ├─ index.js
│  └─ test_connection.js
├─ tests/
├─ web/
│  ├─ Dockerfile
│  ├─ package.json
│  └─ src/
└─ README.md
```

## Prerequisites

- Node.js 18+
- npm
- Python 3.11+
- PostgreSQL database or Supabase project
- Access to a working `DATABASE_URL`

## Setup

1. Clone the repository.
2. Copy the environment template:

```bash
copy .env.example .env
```

3. Update `.env` with real values:

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=replace_with_secure_secret
VITE_API_BASE_URL=group-04-project-production.up.railway.app
```

Notes:
- `DATABASE_URL` is required for the API to connect to PostgreSQL.
- `VITE_API_BASE_URL` is used by the frontend to call the backend.
- The app does not rely on hidden local state; it reads config strictly from environment variables.

## Dependencies

```bash
npm install
npm --prefix web install
```

## Seed data and bootstrapping

The database initialization is handled in `server/db.js`.

On startup, the backend creates the core tables if they do not exist and inserts seed data when empty, including:

- `alice@lms.test` / `learner123` – Learner
- `bob@lms.test` / `instructor123` – Instructor
- `carol@lms.test` / `reviewer123` – Reviewer
- `diana@lms.test` / `admin123` – Admin

These credentials are for local/dev verification only.

## Run the app

Start the backend:

```bash
npm run api
```

Start the frontend in a second terminal:

```bash
npm --prefix web run dev -- --host 0.0.0.0
```

Optional: run both together:

```bash
npm run dev
```

### Verify the app is working

- Backend health:

```bash
curl http://localhost:4000/api/health
```

Expected result: `ok: true` and database status.

- Frontend: open the Vite URL shown in the terminal, typically:

```text
http://localhost:5173
```

- Login test with a seeded account:
  - `alice@lms.test` / `learner123`

## Test suite

Run the project validation checks:

```bash
npm run typecheck
python -m pytest tests -q
```

### Test AI Tutor

After starting the backend, test AI Tutor functionality:

```bash
# Reset database to load detailed lesson content
node reset_database.js

# Test AI Tutor locally (requires jq for JSON formatting)
bash test_ai_tutor_quick.sh

# Or test on production Railway
bash test_ai_production.sh
```

Expected AI Tutor behavior:
- ✅ Answers questions based on lesson content
- ✅ Provides relevant examples from course material
- ✅ Rejects off-topic questions with "KHÔNG ĐỦ DỮ LIỆU" message
- ✅ References specific concepts like empathy mapping, prototyping methods, design systems

See [test_ai_tutor.md](test_ai_tutor.md) for detailed test cases.

If you need a quick smoke check for the API:

```bash
curl http://localhost:4000/api/users
```

## Deploy

1. Prepare production environment variables.
2. Ensure the database is reachable and the schema is initialized.
3. Start the API with the production env file.
4. Build and serve the frontend.
5. Run a smoke test against the deployed environment.

### Production Health Checks

After deployment, verify these endpoints:

**Backend (Railway):**
```bash
curl https://group-04-project-production.up.railway.app/api/health
```
Expected: `{"ok":true,"db":"connected",...}`

**Frontend (Vercel):**
- Open your Vercel URL
- Verify login page loads
- Test login with seed account

### Docker / Compose

```bash
docker compose up --build
```

This repo includes Docker assets for running the API and frontend containers with automated health checks.

## Rollback and forward-fix

- If the release fails before a migration-dependent write occurs, rollback the application code and keep the database unchanged.
- If a migration or data change already ran and affected live data, do not blindly downgrade the schema. Deploy a forward fix or incremental migration instead.
- Always validate health checks, login flow, and critical role workflows after recovery.

## Troubleshooting

### 1) Backend fails to start

Check:
- `.env` exists and `DATABASE_URL` is valid
- PostgreSQL/Supabase is reachable
- port `4000` is not already occupied

Useful commands:

```bash
npm run api
```

If the port is busy, terminate stale Node processes and retry.

### 2) Frontend cannot reach the API

Check:
- `VITE_API_BASE_URL` in `.env`
- backend is running on `http://localhost:4000`
- CORS is enabled on the API

### 3) Login fails

Use one of the seeded credentials from the DB bootstrap:

```text
alice@lms.test / learner123
bob@lms.test / instructor123
carol@lms.test / reviewer123
diana@lms.test / admin123
```

### 4) Database connection issues

Verify:

```bash
node server/test_connection.js
```

or test the configured database connection directly in the environment.

### 5) Tests fail unexpectedly

Run the exact validation script used by the project:

```bash
python -m pytest tests -q
```

If failures are role-based or validation-based, inspect the failing test case and match the expected business rules from the project requirement docs.

## Security and operational notes

- Never commit real secrets to source control.
- Use environment variables for all credentials.
- Keep role checks enforced on the server side.
- Validate input, especially blank/whitespace-only values and unauthorized role actions.

## Quick reference

```bash
copy .env.example .env
npm install
npm --prefix web install
npm run api
npm --prefix web run dev -- --host 0.0.0.0
python -m pytest tests -q
```

