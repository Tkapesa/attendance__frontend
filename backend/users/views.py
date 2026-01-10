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


@csrf_exempt
def list_students(request):
    """Get all students from Firestore"""
    if request.method != "GET":
        return _json_error("Method not allowed", status=405)

    try:
        db = get_firestore_db()
    except FirebaseCredentialsError as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

    # Query all users with role=student
    students_ref = db.collection("users").where("role", "==", "student")
    students = []
    
    for doc in students_ref.stream():
        student_data = doc.to_dict()
        students.append(student_data)

    return JsonResponse({
        "status": "success",
        "students": students,
        "count": len(students)
    })


@csrf_exempt
def get_student(request, uid):
    """Get a single student by UID"""
    if request.method != "GET":
        return _json_error("Method not allowed", status=405)

    try:
        db = get_firestore_db()
    except FirebaseCredentialsError as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

    student_doc = db.collection("users").document(uid).get()
    
    if not student_doc.exists:
        return _json_error("Student not found", status=404)

    student_data = student_doc.to_dict()
    
    return JsonResponse({
        "status": "success",
        "student": student_data
    })


@csrf_exempt
def delete_student(request, uid):
    """Delete a student from Firestore"""
    if request.method != "DELETE" and request.method != "POST":
        return _json_error("Method not allowed", status=405)

    try:
        db = get_firestore_db()
    except FirebaseCredentialsError as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

    student_doc = db.collection("users").document(uid).get()
    
    if not student_doc.exists:
        return _json_error("Student not found", status=404)

    # Delete the student document
    db.collection("users").document(uid).delete()
    
    return JsonResponse({
        "status": "success",
        "message": f"Student {uid} deleted successfully"
    })
