# Backend (Django + Firestore)

## Run (dev)

1) Create a virtualenv (recommended) and install deps.
2) Add Firebase credentials (required for all endpoints except `/health/`).
3) Start the server.

### Firebase credentials

You must provide a Firebase service account json.

- **Default location:** `backend/firebase-credentials.json`
- **Or set an env var:** `FIREBASE_CREDENTIALS_PATH=/absolute/path/to/firebase-credentials.json`

If credentials are missing, API endpoints will return JSON like:

```json
{"status":"error","message":"Firebase credentials not found at '...'"}
```

### Start server

```zsh
cd "backend"
source .venv/bin/activate
python manage.py runserver 8000
```

Health check:

```zsh
curl -sS http://127.0.0.1:8000/health/
```
