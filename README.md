# Store App (Angular + Node/Express)

## Overview

- Frontend: Angular 21, built to `frontend/dist/frontend`.
- Backend: Express + Mongoose, serves API under `/api/*` and static SPA in production.

## Local Development

```powershell
# Backend
cd backend
npm ci
$env:MONGO_URI="mongodb://localhost:27017/store"  # or Atlas URI
$env:PORT="3000"
node server.js

# Frontend
cd ../frontend
npm ci
ng serve --host localhost --port 4200
```

## Build Frontend

```powershell
cd frontend
npm run build
```

This produces `frontend/dist/frontend` consumed by the backend in production.

## Deployment (Vercel)

- Repo includes `vercel.json` routing all requests through `backend/server.js`.
- Backend serves the SPA from `../frontend/dist/frontend` if present.

### Steps

1. Push to GitHub (main branch).
2. Import repo in Vercel.
3. Set Environment Variables in Vercel Project Settings:
   - `MONGO_URI` (Atlas URI)
   - `PORT=3000`
   - `FRONTEND_URL=https://<your-domain>`
   - `EMAIL_USER`, `EMAIL_PASSWORD`, `ADMIN_EMAIL`
   - `WHATSAPP_INSTANCE_ID`, `WHATSAPP_TOKEN`, `WHATSAPP_FROM_NUMBER`
4. Configure Build Command:
   - Vercel will build the Node function automatically. Ensure frontend is built:
   - Add an Install/Build Hook or run a prebuild script:

```json
// frontend/package.json (optional)
{
  "scripts": {
    "build": "ng build"
  }
}
```

You can also add a root build script:

```json
{
  "scripts": {
    "build": "cd frontend && npm ci && npm run build"
  }
}
```

## Security Notes

- Do not commit `.env`. `.gitignore` already excludes it.
- Default admin is created on boot; change password/email in production.

## API Health

- `GET /api/health` → status
- `GET /api/diagnostics` → Mongo/uptime info

## Admin Protection

- Admin routes guarded via `middleware/isAdmin.js` using `x-user-id` of an admin user.

## Troubleshooting

- If `ng serve` fails under OneDrive paths, consider cloning to `C:\dev\store`.
- For CORS issues, backend allows all origins in dev; tighten for production if needed.
