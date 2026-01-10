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


@csrf_exempt
def attendance_history(request):
    """Get attendance history with optional filters"""
    if request.method != "GET":
        return _json_error("Method not allowed", status=405)

    try:
        db = get_firestore_db()
    except FirebaseCredentialsError as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

    # Get query parameters
    student_id = request.GET.get("student_id")
    limit = int(request.GET.get("limit", 100))
    
    # Build query
    query = db.collection("attendance_logs").order_by("timestamp", direction="DESCENDING")
    
    if student_id:
        query = query.where("student_id", "==", student_id)
    
    query = query.limit(limit)
    
    # Fetch records
    logs = []
    for doc in query.stream():
        log_data = doc.to_dict()
        log_data['id'] = doc.id
        logs.append(log_data)

    return JsonResponse({
        "status": "success",
        "logs": logs,
        "count": len(logs)
    })


@csrf_exempt
def today_attendance(request):
    """Get today's attendance records"""
    if request.method != "GET":
        return _json_error("Method not allowed", status=405)

    try:
        db = get_firestore_db()
    except FirebaseCredentialsError as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

    # Get today's start time (midnight UTC)
    from datetime import datetime, timezone, time
    today_start = datetime.combine(datetime.now(timezone.utc).date(), time.min, tzinfo=timezone.utc)
    
    # Query attendance logs from today
    query = db.collection("attendance_logs").where(
        "timestamp", ">=", today_start.isoformat()
    ).order_by("timestamp", direction="DESCENDING")
    
    logs = []
    student_ids = set()
    
    for doc in query.stream():
        log_data = doc.to_dict()
        log_data['id'] = doc.id
        logs.append(log_data)
        student_ids.add(log_data.get("student_id"))

    return JsonResponse({
        "status": "success",
        "logs": logs,
        "count": len(logs),
        "unique_students": len(student_ids),
        "date": today_start.date().isoformat()
    })


@csrf_exempt
def attendance_stats(request):
    """Get attendance statistics"""
    if request.method != "GET":
        return _json_error("Method not allowed", status=405)

    try:
        db = get_firestore_db()
    except FirebaseCredentialsError as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

    # Get total students
    students_query = db.collection("users").where("role", "==", "student")
    total_students = len(list(students_query.stream()))

    # Get today's attendance
    from datetime import datetime, timezone, time
    today_start = datetime.combine(datetime.now(timezone.utc).date(), time.min, tzinfo=timezone.utc)
    
    today_query = db.collection("attendance_logs").where(
        "timestamp", ">=", today_start.isoformat()
    )
    
    today_logs = list(today_query.stream())
    today_count = len(set(doc.to_dict().get("student_id") for doc in today_logs))
    
    # Calculate attendance percentage
    attendance_percentage = (today_count / total_students * 100) if total_students > 0 else 0

    # Get total attendance records
    all_logs = db.collection("attendance_logs").limit(1000).stream()
    total_records = len(list(all_logs))

    return JsonResponse({
        "status": "success",
        "stats": {
            "total_students": total_students,
            "present_today": today_count,
            "attendance_percentage": round(attendance_percentage, 1),
            "total_records": total_records,
            "date": today_start.date().isoformat()
        }
    })
