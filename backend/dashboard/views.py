import json
from datetime import datetime, timezone, time, timedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from firebase_config.firebase import FirebaseCredentialsError, get_firestore_db


def _json_error(message, status=400):
    return JsonResponse({"status": "error", "message": message}, status=status)


@csrf_exempt
def dashboard_stats(request):
    """
    Get comprehensive dashboard statistics including:
    - Total students
    - Today's attendance
    - Attendance percentage
    - Recent trends
    """
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
    today_start = datetime.combine(datetime.now(timezone.utc).date(), time.min, tzinfo=timezone.utc)
    
    today_query = db.collection("attendance_logs").where(
        "timestamp", ">=", today_start.isoformat()
    )
    
    today_logs = list(today_query.stream())
    today_unique_students = set(doc.to_dict().get("student_id") for doc in today_logs)
    today_count = len(today_unique_students)
    
    # Calculate attendance percentage
    attendance_percentage = (today_count / total_students * 100) if total_students > 0 else 0

    # Get yesterday's attendance for comparison
    yesterday_start = today_start - timedelta(days=1)
    yesterday_end = today_start
    
    yesterday_query = db.collection("attendance_logs").where(
        "timestamp", ">=", yesterday_start.isoformat()
    ).where(
        "timestamp", "<", yesterday_end.isoformat()
    )
    
    yesterday_logs = list(yesterday_query.stream())
    yesterday_count = len(set(doc.to_dict().get("student_id") for doc in yesterday_logs))

    # Calculate trend
    if yesterday_count > 0:
        trend = ((today_count - yesterday_count) / yesterday_count) * 100
    else:
        trend = 0 if today_count == 0 else 100

    # Get total attendance records
    all_logs_query = db.collection("attendance_logs").limit(5000)
    total_records = len(list(all_logs_query.stream()))

    # Get new enrollments this week
    week_ago = datetime.now(timezone.utc) - timedelta(days=7)
    new_students_query = db.collection("users").where(
        "role", "==", "student"
    ).where(
        "created_at", ">=", week_ago.isoformat()
    )
    new_students_count = len(list(new_students_query.stream()))

    return JsonResponse({
        "status": "success",
        "stats": {
            "total_students": total_students,
            "present_today": today_count,
            "absent_today": total_students - today_count,
            "attendance_percentage": round(attendance_percentage, 1),
            "total_records": total_records,
            "new_students_this_week": new_students_count,
            "trend": {
                "value": round(trend, 1),
                "direction": "up" if trend > 0 else "down" if trend < 0 else "stable"
            },
            "date": today_start.date().isoformat()
        }
    })


@csrf_exempt
def recent_activity(request):
    """Get recent attendance check-ins with student details"""
    if request.method != "GET":
        return _json_error("Method not allowed", status=405)

    try:
        db = get_firestore_db()
    except FirebaseCredentialsError as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

    limit = int(request.GET.get("limit", 10))

    # Get recent attendance logs
    logs_query = db.collection("attendance_logs").order_by(
        "timestamp", direction="DESCENDING"
    ).limit(limit)

    activities = []
    
    for doc in logs_query.stream():
        log_data = doc.to_dict()
        student_id = log_data.get("student_id")
        
        # Get student details
        student_doc = db.collection("users").document(student_id).get()
        student_name = "Unknown"
        
        if student_doc.exists:
            student_data = student_doc.to_dict()
            student_name = student_data.get("name", "Unknown")
        
        activities.append({
            "id": doc.id,
            "student_id": student_id,
            "student_name": student_name,
            "timestamp": log_data.get("timestamp"),
            "status": log_data.get("status"),
            "device_id": log_data.get("device_id"),
            "fingerprint_id": log_data.get("fingerprint_id")
        })

    return JsonResponse({
        "status": "success",
        "activities": activities,
        "count": len(activities)
    })
