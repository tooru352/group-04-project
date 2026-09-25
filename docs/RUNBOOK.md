# Runbook

This runbook is the operational companion to the main project README. It is written to be self-contained and to match the current repository setup without relying on hidden assumptions.

## 1. Purpose

This project is a role-based LMS with:

- Node.js/Express backend
- PostgreSQL/Supabase database
- Vite/React frontend
- Python verification tests

The primary goals of this runbook are to document how to:

- set up the application
- bootstrap seed data
- run locally
- test changes
- deploy safely
- troubleshoot common failures
- roll back or recover from release issues

## 2. Prerequisites

Before running the project, confirm you have:

- Node.js 18 or newer
- npm
- Python 3.11 or newer
- PostgreSQL connection details or a Supabase project
- access to a valid `.env` file

## 3. Environment configuration

Create the environment file from the template:

```bash
copy .env.example .env
```

Then update `.env` with the actual connection values:

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=replace_with_secure_secret
VITE_API_BASE_URL=http://localhost:4000
```

Required values:

- `DATABASE_URL`: backend database connection string
- `JWT_SECRET`: backend secret used for secure sessions
- `VITE_API_BASE_URL`: frontend target endpoint

## 4. Install dependencies

```bash
npm install
npm --prefix web install
```

## 5. Seed and database bootstrap

The backend initializes the schema and seed data automatically in `server/db.js`.

When the API starts, it will:

- create core tables if missing
- insert initial users if the table is empty
- insert sample courses and lessons if needed

Seeded local accounts:

```text
alice@lms.test / learner123
bob@lms.test / instructor123
carol@lms.test / reviewer123
diana@lms.test / admin123
```

## 6. Run locally

### Backend

```bash
npm run api
```

Expected API URL:

```text
http://localhost:4000
```

Health check:

```bash
curl http://localhost:4000/api/health
```

### Frontend

In another terminal:

```bash
npm --prefix web run dev -- --host 0.0.0.0
```

Expected frontend URL:

```text
http://localhost:5173
```

### Combined startup

```bash
npm run dev
```

## 7. Smoke checks

After startup, confirm these checks succeed:

- `GET /api/health` returns success
- login works for a seed account
- user/course data loads
- role-based pages render correctly
- learner, instructor, reviewer, and admin flows are accessible

Example login smoke check:

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@lms.test","password":"learner123"}'
```

## 8. Test workflow

Run the project validation commands:

```bash
npm run typecheck
python -m pytest tests -q
```

If the frontend has a build step, validate it as well:

```bash
npm --prefix web run build
```

## 9. Deployment checklist

1. Confirm production environment variables are set.
2. Ensure the PostgreSQL database is reachable.
3. Start the backend with the production config.
4. Build or serve the frontend with production settings.
5. Run a smoke suite against the deployed URL.
6. Validate login, role access, course loading, and assignment flow.

For Docker-based deployment:

```bash
docker compose up --build
```

## 10. Rollback and recovery

### Rollback

Use rollback when:

- the app build fails
- the deployment introduces a broken route or user flow
- migration-dependent writes have not yet happened

Rollback approach:

- restore the previous app version
- keep the database unchanged unless data writes have already happened
- verify the health endpoint and login flow

### Forward fix

Use a forward fix when:

- a database migration or schema change has already been applied
- a rollback would lose required operational data

Forward-fix guidance:

- do not blindly downgrade the schema
- deploy a corrective patch or follow-up migration
- validate the app and affected workflows before reopening traffic

## 11. Troubleshooting matrix

### Application does not start

Check:

- `.env` values are populated
- `DATABASE_URL` is valid
- database is accessible
- port `4000` is free

### Frontend cannot reach API

Check:

- `VITE_API_BASE_URL` matches the running backend URL
- backend is running
- CORS is enabled

### Login fails

Check:

- password matches the seeded account
- input is not blank or whitespace-only
- backend is connected to the database

### Database connection errors

Check:

- credentials and hostname are correct
- database server is up
- connection string includes the correct SSL settings if required

### Tests fail

Run the exact validation command:

```bash
python -m pytest tests -q
```

Then fix the failing functional or validation case in the relevant service or route.

## 12. Operational notes

- Keep secrets in environment variables only.
- Do not store production credentials in source control.
- Enforce role checks on the server.
- Validate blank/whitespace input and unauthorized behavior.
- Confirm health and login checks after every deployment.

## 13. One-line quick start

```bash
copy .env.example .env && npm install && npm --prefix web install && npm run api
```

Then in a second terminal:

```bash
npm --prefix web run dev -- --host 0.0.0.0
```
