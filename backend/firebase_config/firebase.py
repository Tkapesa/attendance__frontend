import os
from pathlib import Path

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore


_db = None


def get_firestore_db():
    """Singleton initializer for Firebase Admin + Firestore client.

    Rules:
    - No Django ORM.
    - Credentials loaded from backend/firebase-credentials.json (by default).
    """
    global _db

    if _db is not None:
        return _db

    base_dir = Path(__file__).resolve().parents[1]  # backend/

    # Allow override via env var for deployments.
    cred_path = os.environ.get(
        "FIREBASE_CREDENTIALS_PATH",
        str(base_dir / "firebase-credentials.json"),
    )

    if not firebase_admin._apps:
        if not os.path.exists(cred_path):
            raise FileNotFoundError(
                f"Firebase credentials not found at '{cred_path}'. "
                "Place firebase-credentials.json in backend/ or set FIREBASE_CREDENTIALS_PATH."
            )

        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)

    _db = firestore.client()
    return _db


# Convenience global for modules that prefer `from ... import db`
try:
    db = get_firestore_db()
except Exception:
    # During installs/tests without credentials, keep importable.
    db = None
