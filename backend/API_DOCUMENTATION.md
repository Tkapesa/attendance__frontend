# Backend API Documentation

## Overview
This Django backend provides a RESTful API for the Attendance System with Firestore as the database.

**Base URL**: `http://localhost:8000`

---

## Authentication Endpoints

### POST /auth/login/
Verify Firebase ID token and authenticate user.

**Request Body:**
```json
{
  "id_token": "firebase-id-token-here"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "user": {
    "uid": "user123",
    "email": "teacher@school.com",
    "role": "teacher",
    "name": "Teacher Name"
  },
  "token": "firebase-id-token"
}
```

### POST /auth/logout/
Logout acknowledgment.

**Response:**
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

### POST /auth/verify-token/
Verify if Firebase ID token is valid.

**Request Body:**
```json
{
  "id_token": "firebase-id-token-here"
}
```

**Response:**
```json
{
  "status": "success",
  "valid": true,
  "uid": "user123"
}
```

---

## User/Student Management

### POST /users/register/
Register a new student with fingerprint.

**Request Body:**
```json
{
  "uid": "S001",
  "name": "John Doe",
  "fingerprint_id": 1234,
  "role": "student"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User registered",
  "user": {
    "uid": "S001",
    "name": "John Doe",
    "fingerprint_id": 1234,
    "role": "student",
    "created_at": "2026-01-10T12:00:00Z"
  }
}
```

### GET /users/students/
Get all enrolled students.

**Response:**
```json
{
  "status": "success",
  "students": [
    {
      "uid": "S001",
      "name": "John Doe",
      "fingerprint_id": 1234,
      "role": "student",
      "created_at": "2026-01-10T12:00:00Z"
    }
  ],
  "count": 1
}
```

### GET /users/students/{uid}/
Get a specific student by UID.

**Response:**
```json
{
  "status": "success",
  "student": {
    "uid": "S001",
    "name": "John Doe",
    "fingerprint_id": 1234,
    "role": "student"
  }
}
```

### DELETE /users/students/{uid}/delete/
Delete a student.

**Response:**
```json
{
  "status": "success",
  "message": "Student S001 deleted successfully"
}
```

---

## Attendance Endpoints

### POST /attendance/check-in/
Record attendance via fingerprint.

**Request Body:**
```json
{
  "fingerprint_id": 1234,
  "device_id": "ESP32-001"
}
```

**Response (Success):**
```json
{
  "status": "success",
  "message": "Attendance recorded",
  "user_name": "John Doe",
  "student_id": "S001"
}
```

**Response (Not Found):**
```json
{
  "status": "error",
  "message": "Fingerprint not recognized"
}
```

### GET /attendance/history/
Get attendance history with optional filters.

**Query Parameters:**
- `student_id` (optional): Filter by specific student
- `limit` (optional, default=100): Maximum records to return

**Response:**
```json
{
  "status": "success",
  "logs": [
    {
      "id": "log123",
      "student_id": "S001",
      "timestamp": "2026-01-10T10:15:00Z",
      "status": "Present",
      "device_id": "ESP32-001",
      "fingerprint_id": 1234
    }
  ],
  "count": 1
}
```

### GET /attendance/today/
Get today's attendance records.

**Response:**
```json
{
  "status": "success",
  "logs": [...],
  "count": 38,
  "unique_students": 38,
  "date": "2026-01-10"
}
```

### GET /attendance/stats/
Get attendance statistics.

**Response:**
```json
{
  "status": "success",
  "stats": {
    "total_students": 45,
    "present_today": 38,
    "attendance_percentage": 84.4,
    "total_records": 1234,
    "date": "2026-01-10"
  }
}
```

---

## Dashboard Endpoints

### GET /dashboard/stats/
Get comprehensive dashboard statistics.

**Response:**
```json
{
  "status": "success",
  "stats": {
    "total_students": 45,
    "present_today": 38,
    "absent_today": 7,
    "attendance_percentage": 84.4,
    "total_records": 1234,
    "new_students_this_week": 3,
    "trend": {
      "value": 5.2,
      "direction": "up"
    },
    "date": "2026-01-10"
  }
}
```

### GET /dashboard/recent-activity/
Get recent attendance check-ins with student details.

**Query Parameters:**
- `limit` (optional, default=10): Number of recent activities

**Response:**
```json
{
  "status": "success",
  "activities": [
    {
      "id": "log123",
      "student_id": "S001",
      "student_name": "John Doe",
      "timestamp": "2026-01-10T10:15:00Z",
      "status": "Present",
      "device_id": "ESP32-001",
      "fingerprint_id": 1234
    }
  ],
  "count": 10
}
```

---

## Fingerprint Endpoints

### GET /fingerprint/verify/{fingerprint_id}/
Verify if a fingerprint is enrolled (placeholder for ESP32).

### POST /fingerprint/enroll/
Enroll a new fingerprint (placeholder for ESP32).

---

## Health Check

### GET /health/
Simple health check endpoint.

**Response:**
```json
{
  "status": "success",
  "message": "ok"
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "status": "error",
  "message": "Description of what went wrong"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid input)
- `401` - Unauthorized
- `404` - Not Found
- `405` - Method Not Allowed
- `500` - Server Error (usually Firebase credentials missing)

---

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → Project Settings → Service Accounts
3. Click "Generate new private key"
4. Save as `backend/firebase-credentials.json`
5. Restart Django server

See `backend/README.md` for detailed setup instructions.

---

## Testing with curl

```bash
# Health check
curl http://localhost:8000/health/

# Register student
curl -X POST http://localhost:8000/users/register/ \
  -H "Content-Type: application/json" \
  -d '{"uid":"S001","name":"John Doe","fingerprint_id":1234,"role":"student"}'

# List students
curl http://localhost:8000/users/students/

# Check-in attendance
curl -X POST http://localhost:8000/attendance/check-in/ \
  -H "Content-Type: application/json" \
  -d '{"fingerprint_id":1234,"device_id":"web-demo"}'

# Get dashboard stats
curl http://localhost:8000/dashboard/stats/

# Get today's attendance
curl http://localhost:8000/attendance/today/
```
