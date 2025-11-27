# Copilot / AI Agent Instructions for AfterBellCorner Backend

This file contains actionable, project-specific guidance for AI coding agents working in this repository.

**Quick context:** This is a small Express + MongoDB API that serves lesson data and accepts orders. Key files: `server.js`, `db.js`, `seed-lessons.js`, `package.json`.

**Environment & start commands**
- **Env:** Requires `.env` with at least `MONGODB_URI`, `MONGODB_DB_NAME`. Optional: `PORT`.
- **Install:** `npm install`
- **Run (prod):** `npm start` (runs `node server.js`)
- **Run (dev):** `npm run dev` (uses `nodemon server.js`)
- **Seed DB:** `node seed-lessons.js` (will skip if `lessons` already has documents)

**High-level architecture**
- `server.js`: Express app, routes, middleware (logging, JSON body parsing), central error handler and 404 handler. The server calls `connectToDatabase()` on start.
- `db.js`: Exposes `connectToDatabase()` and `getDb()`. `connectToDatabase()` must be called before `getDb()` is used — otherwise `getDb()` throws.
- `seed-lessons.js`: idempotent seeding script for the `lessons` collection.

**Data model & important invariants (use these exactly when modifying code or data):**
- Collections: `lessons`, `orders`.
- Lesson documents use an integer `id` field (e.g., `1001`) — do not switch to Mongo `_id` replacements without migrating seeds and clients.
- `lessons` fields shown in `seed-lessons.js`: `id`, `title`, `description`, `price`, `availableInventory` (non-negative integer), `rating`, `location`.
- Orders expect: `{ name: string (letters only), phone: string (digits only, length 7-20), items: [{ id: number, qty: number }] }` — validation is applied in `POST /orders` and must be preserved unless intentionally changing API behavior.

**API surface / examples**
- `GET /` - basic health check
- `GET /health` - uptime-style health endpoint
- `GET /db-test` - returns DB name and list of collections (useful to confirm env/connection)
- `GET /lessons` - returns all lessons
- `PUT /lessons/:id` - updates `availableInventory` (expects integer)
- `POST /orders` - creates an order; follows strict validation rules (see above)

Examples (run from macOS zsh):
```bash
# start dev server
npm run dev

# seed DB (after setting .env)
node seed-lessons.js

# quick db test
curl http://localhost:3000/db-test

# create order (example)
curl -X POST http://localhost:3000/orders \
  -H 'Content-Type: application/json' \
  -d '{"name":"Alice","phone":"1234567","items":[{"id":1001,"qty":1}]}'
```

**Coding conventions & patterns for agents**
- Use the existing `connectToDatabase()` / `getDb()` pattern for DB access — prefer calling `connectToDatabase()` during server startup and `getDb()` within request handlers.
- Preserve the central JSON error response pattern. The project relies on the error middleware in `server.js` which always returns JSON `{ error, message, timestamp }` — returning HTML or plain text will break client expectations.
- Follow the lightweight validation style used in `POST /orders` and `PUT /lessons/:id`: explicit type checks, short regexes for simple constraints, and early `return res.status(400).json({...})` on invalid input.
- Logging: a request logger middleware prints a concise single-line log on `res.finish`. Keep new logs similar in verbosity and format.
- IDs: `lessons.id` is an integer; keep numeric ids where applicable to avoid compatibility issues with frontends that expect integers.

**Testing / Debugging tips**
- If DB calls fail, confirm `.env` values and try `curl http://localhost:3000/db-test` to see whether collections are accessible.
- If `getDb()` throws, ensure `connectToDatabase()` completed successfully before starting to accept requests. Server startup already awaits connection in `startServer()`.

**When changing routes or DB schema**
- Update `seed-lessons.js` accordingly when you introduce new `lessons` fields or change primary keys — seeding is the canonical example data used by local dev.
- If you change validation rules in `POST /orders`, update any clients that rely on the current constraints.

**Files to inspect when making changes**
- `server.js` — routes, middleware, error handling
- `db.js` — mongodb connection lifecycle
- `seed-lessons.js` — canonical sample data and shape
- `package.json` — scripts for dev and prod

If anything here is unclear or you want me to expand a section (for example, add common PR checklists, API contract examples, or test commands), tell me which area to iterate on.
