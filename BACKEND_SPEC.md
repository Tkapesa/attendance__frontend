# Backend Implementation Specification: IoT Attendance System

## 🎯 Objective
Build a **Django-based backend** that acts as a bridge between **ESP32 IoT devices** and **Firebase Firestore**.

The system handles **fingerprint authentication** and **attendance logging** **without using the local Django ORM**.

## 🛠 Tech Stack & Constraints
- Framework: **Django 4.x+**
- Database: **Firebase Firestore (Primary)**
- IoT: **ESP32 (REST API communication)**
- **Strict Rule: DO NOT USE DJANGO ORM/MODELS.** All CRUD operations must go through **firebase-admin** or **google-cloud-firestore**.

## 📂 Project Structure Reference

```
backend/
├── attendance/          # Attendance logs & logic
├── fingerprint/         # Fingerprint templates & ESP32 communication
├── users/               # Student/Staff profiles
├── firebase_config/     # (To be created) Firebase initialization logic
├── firebase-credentials.json
└── requirements.txt     # django, firebase-admin, python-dotenv
```

## 🏗 Required Tasks

### 1. Firebase Initialization (`firebase_config/`)
Create a singleton utility to initialize `firebase-admin`.
- Load credentials from `firebase-credentials.json`
- Provide a global `db` variable to access Firestore

### 2. `users/` App Implementation
**Firestore Collection:** `users`

**Fields:**
- `uid`
- `name`
- `fingerprint_id`
- `role`
- `created_at`

**Endpoints:**
- `POST /users/register/` : Create a user profile in Firestore.

### 3. `fingerprint/` App Implementation (ESP32 Interface)
**Endpoints:**
- `GET /fingerprint/verify/<int:fingerprint_id>/` : ESP32 calls this to check if a fingerprint ID exists.
- `POST /fingerprint/enroll/` : Receives a new fingerprint template from ESP32 to store in Firestore.

### 4. `attendance/` App Implementation
**Firestore Collection:** `attendance_logs`

**Fields:**
- `student_id`
- `timestamp`
- `status` (Present)
- `device_id`

**Logic:**
- `POST /attendance/check-in/`:
  - Receive `fingerprint_id` from ESP32.
  - Lookup `student_id` in `users` collection.
  - Create a new entry in `attendance_logs`.
  - Return success/failure to ESP32.

## 📝 Critical API Design for ESP32
The ESP32 expects **simple JSON responses**.

All views must return something like:

```json
{
  "status": "success",
  "message": "Attendance recorded",
  "user_name": "John Doe"
}
```

## 🚀 How to Start Programming
1. Initialize Firebase: Setup the `firebase-admin` SDK connection first.
2. Mock Firestore Data: Create a few dummy users in the `users` collection.
3. Develop Endpoints: Focus on `/attendance/check-in/` as it is the core loop.

### Notes
- **No ORM models**
- **No migrations needed** for core data logic

