import json
from datetime import datetime, timezone

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from firebase_config.firebase import FirebaseCredentialsError, get_firestore_db


def _json_error(message, status=400):
    return JsonResponse({"status": "error", "message": message}, status=status)


@csrf_exempt
def register_user(request):
    if request.method != "POST":
        return _json_error("Method not allowed", status=405)

    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return _json_error("Invalid JSON")

    uid = payload.get("uid") or payload.get("student_id")
    name = payload.get("name")
    fingerprint_id = payload.get("fingerprint_id") or payload.get("fingerprintId")
    role = payload.get("role", "student")

    if not uid:
        return _json_error("uid is required")
    if not name:
        return _json_error("name is required")
    if fingerprint_id is None:
        return _json_error("fingerprint_id is required")

    try:
        fingerprint_id = int(fingerprint_id)
    except (TypeError, ValueError):
        return _json_error("fingerprint_id must be an integer")

    try:
        db = get_firestore_db()
    except FirebaseCredentialsError as e:
        return JsonResponse(
            {"status": "error", "message": str(e)},
            status=500,
        )

    user_doc = {
        "uid": str(uid),
        "name": name,
        "fingerprint_id": fingerprint_id,
        "role": role,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    # Use uid as document id for easy read.
    db.collection("users").document(str(uid)).set(user_doc, merge=True)

    return JsonResponse(
        {
            "status": "success",
            "message": "User registered",
            "user": user_doc,
        }
    )
