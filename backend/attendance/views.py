import json
from datetime import datetime, timezone

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from firebase_config.firebase import FirebaseCredentialsError, get_firestore_db


def _json_error(message, status=400):
    return JsonResponse({"status": "error", "message": message}, status=status)


def _find_user_by_fingerprint(db, fingerprint_id: int):
    q = db.collection("users").where("fingerprint_id", "==", fingerprint_id).limit(1)
    docs = list(q.stream())
    if not docs:
        return None
    return docs[0].to_dict()


@csrf_exempt
def check_in(request):
    if request.method != "POST":
        return _json_error("Method not allowed", status=405)

    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return _json_error("Invalid JSON")

    fingerprint_id = payload.get("fingerprint_id") or payload.get("fingerprintId")
    device_id = payload.get("device_id") or payload.get("deviceId") or "unknown"

    if fingerprint_id is None:
        return _json_error("fingerprint_id is required")

    try:
        fingerprint_id = int(fingerprint_id)
    except (TypeError, ValueError):
        return _json_error("fingerprint_id must be an integer")

    try:
        db = get_firestore_db()
    except FirebaseCredentialsError as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

    user = _find_user_by_fingerprint(db, fingerprint_id)
    if not user:
        return JsonResponse(
            {
                "status": "error",
                "message": "Fingerprint not recognized",
            },
            status=404,
        )

    log = {
        "student_id": user.get("uid"),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "status": "Present",
        "device_id": device_id,
        "fingerprint_id": fingerprint_id,
    }

    db.collection("attendance_logs").add(log)

    return JsonResponse(
        {
            "status": "success",
            "message": "Attendance recorded",
            "user_name": user.get("name"),
            "student_id": user.get("uid"),
        }
    )
