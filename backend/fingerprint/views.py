import json
from datetime import datetime, timezone

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from firebase_config.firebase import get_firestore_db


def _json_error(message, status=400):
    return JsonResponse({"status": "error", "message": message}, status=status)


def _find_user_by_fingerprint(db, fingerprint_id: int):
    q = db.collection("users").where("fingerprint_id", "==", fingerprint_id).limit(1)
    docs = list(q.stream())
    if not docs:
        return None
    return docs[0].to_dict()


def verify_fingerprint(request, fingerprint_id: int):
    if request.method != "GET":
        return _json_error("Method not allowed", status=405)

    db = get_firestore_db()
    user = _find_user_by_fingerprint(db, int(fingerprint_id))

    if not user:
        return JsonResponse({"status": "error", "message": "Fingerprint not found"}, status=404)

    return JsonResponse(
        {
            "status": "success",
            "message": "Fingerprint verified",
            "user_name": user.get("name"),
            "user_uid": user.get("uid"),
        }
    )


@csrf_exempt
def enroll_fingerprint(request):
    if request.method != "POST":
        return _json_error("Method not allowed", status=405)

    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return _json_error("Invalid JSON")

    fingerprint_id = payload.get("fingerprint_id") or payload.get("fingerprintId")
    template = payload.get("template") or payload.get("fingerprint_template")
    device_id = payload.get("device_id") or payload.get("deviceId")

    if fingerprint_id is None:
        return _json_error("fingerprint_id is required")

    try:
        fingerprint_id = int(fingerprint_id)
    except (TypeError, ValueError):
        return _json_error("fingerprint_id must be an integer")

    db = get_firestore_db()

    doc = {
        "fingerprint_id": fingerprint_id,
        "template": template,
        "device_id": device_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    # Store by fingerprint id
    db.collection("fingerprints").document(str(fingerprint_id)).set(doc, merge=True)

    return JsonResponse(
        {
            "status": "success",
            "message": "Fingerprint enrolled",
            "fingerprint_id": fingerprint_id,
        }
    )
