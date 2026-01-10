# Firebase Setup Guide

Complete guide to setting up Firebase for the Attendance System.

---

## 📋 Prerequisites

- Google Account
- Project already cloned locally
- Backend Python environment set up

---

## 🔥 Step 1: Create Firebase Project

### 1.1 Go to Firebase Console
Visit: https://console.firebase.google.com

### 1.2 Create New Project (or select existing)
1. Click **"Add project"** or **"Create a project"**
2. Enter project name: `attendance-system` (or your preferred name)
3. Click **Continue**
4. Enable Google Analytics (optional but recommended)
5. Click **Create project**
6. Wait for project creation (30-60 seconds)
7. Click **Continue**

---

## 🗄️ Step 2: Set Up Firestore Database

### 2.1 Navigate to Firestore
1. In Firebase Console, click **"Build"** in left sidebar
2. Click **"Firestore Database"**
3. Click **"Create database"**

### 2.2 Configure Security Rules
1. Select **"Start in test mode"** (for development)
   - ⚠️ Warning: Test mode allows all reads/writes
   - For production, update rules later
2. Click **Next**

### 2.3 Choose Location
1. Select closest region (e.g., `us-central`, `europe-west`, `asia-southeast1`)
2. Click **Enable**
3. Wait for database creation

### 2.4 Verify Database Created
- You should see "Cloud Firestore" with empty collections
- Database is ready! ✅

---

## 🔐 Step 3: Enable Authentication

### 3.1 Navigate to Authentication
1. Click **"Build"** → **"Authentication"**
2. Click **"Get started"**

### 3.2 Enable Email/Password
1. Click **"Sign-in method"** tab
2. Click **"Email/Password"**
3. Toggle **Enable** (first option)
4. Click **Save**

### 3.3 Create Test User (Optional)
1. Click **"Users"** tab
2. Click **"Add user"**
3. Enter email: `teacher@school.com`
4. Enter password: `password123` (use strong password in production)
5. Click **"Add user"**

---

## 🔑 Step 4: Generate Service Account Key (Backend)

### 4.1 Go to Project Settings
1. Click **⚙️ gear icon** (top left, next to "Project Overview")
2. Click **"Project settings"**

### 4.2 Navigate to Service Accounts
1. Click **"Service accounts"** tab at top
2. Scroll down to **"Firebase Admin SDK"** section

### 4.3 Generate New Private Key
1. Select **Python** as language
2. Click **"Generate new private key"** button
3. Click **"Generate key"** in confirmation dialog
4. A JSON file will download automatically (e.g., `attendance-system-a1b2c3.json`)

### 4.4 Save Credentials File
1. Locate the downloaded JSON file in your Downloads folder
2. Rename it to: `firebase-credentials.json`
3. Move it to your project backend folder:
   ```bash
   mv ~/Downloads/attendance-system-*.json "/Users/user/attendance_frontend /backend/firebase-credentials.json"
   ```

### 4.5 Verify File Location
```bash
ls -l "/Users/user/attendance_frontend /backend/firebase-credentials.json"
```
You should see the file with size around 2-3 KB.

⚠️ **IMPORTANT**: Never commit this file to Git! It's already in `.gitignore`.

---

## 🌐 Step 5: Get Web App Config (Frontend)

### 5.1 Go to Project Settings
1. Click **⚙️ gear icon** → **"Project settings"**
2. Scroll down to **"Your apps"** section

### 5.2 Add Web App
1. Click **Web icon** (`</>`)
2. Enter app nickname: `Attendance Frontend`
3. **Don't** check "Set up Firebase Hosting"
4. Click **"Register app"**

### 5.3 Copy Configuration
You'll see something like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "attendance-system.firebaseapp.com",
  projectId: "attendance-system",
  storageBucket: "attendance-system.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### 5.4 Update Frontend Config
Open `src/services/firebase.js` and replace with your config:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

Click **"Continue to console"** when done.

---

## ✅ Step 6: Verify Setup

### 6.1 Restart Backend Server
```bash
cd "/Users/user/attendance_frontend /backend"
source .venv/bin/activate
pkill -f "python manage.py runserver"
python manage.py runserver 8000 &
```

### 6.2 Test Backend Connection
```bash
curl -X POST http://localhost:8000/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "S001",
    "name": "John Doe",
    "fingerprint_id": 1234,
    "role": "student"
  }'
```

**Expected response:**
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

### 6.3 Verify in Firestore Console
1. Go back to Firestore Database in Firebase Console
2. You should see a new collection: `users`
3. Inside, document with ID: `S001`
4. Document contains: name, fingerprint_id, role, created_at

✅ **Backend connected to Firebase successfully!**

### 6.4 Test Frontend Login
1. Start frontend: `npm run dev`
2. Open http://localhost:5173
3. Try logging in with test user: `teacher@school.com` / `password123`
4. Should redirect to dashboard

✅ **Frontend connected to Firebase successfully!**

---

## 🔒 Step 7: Update Security Rules (Production)

⚠️ **Before deploying to production**, update Firestore security rules:

### 7.1 Go to Firestore Rules
1. In Firestore Database, click **"Rules"** tab
2. Replace with secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - only authenticated users can read
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.role == 'teacher';
    }
    
    // Attendance logs - only authenticated users can read/write
    match /attendance_logs/{logId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### 7.2 Publish Rules
1. Click **"Publish"**
2. Rules are now active

---

## 🎯 Step 8: Optional Configurations

### 8.1 Set Custom Domain (Optional)
1. Go to **"Authentication"** → **"Settings"** → **"Authorized domains"**
2. Add your production domain

### 8.2 Email Templates (Optional)
1. Go to **"Authentication"** → **"Templates"**
2. Customize email verification and password reset templates

### 8.3 Add More Teachers
1. Go to **"Authentication"** → **"Users"**
2. Click **"Add user"** for each teacher account

---

## 🐛 Troubleshooting

### Error: "Firebase credentials not found"
**Solution:**
- Verify `firebase-credentials.json` is in `/backend/` directory
- Check file permissions: `chmod 644 firebase-credentials.json`
- Restart Django server

### Error: "Permission denied" in Firestore
**Solution:**
- Check Firestore security rules
- Ensure user is authenticated
- For development, use test mode rules

### Error: "Invalid API key" in frontend
**Solution:**
- Verify `firebaseConfig` in `src/services/firebase.js`
- Check API key is correct from Firebase Console
- Ensure authorized domains include `localhost:5173`

### Error: "Authentication failed"
**Solution:**
- Verify Email/Password auth is enabled in Firebase Console
- Check user exists in Authentication → Users
- Test with correct email/password

---

## 📚 Additional Resources

- **Firebase Documentation**: https://firebase.google.com/docs
- **Firestore Queries**: https://firebase.google.com/docs/firestore/query-data/queries
- **Firebase Auth**: https://firebase.google.com/docs/auth/web/start
- **Security Rules**: https://firebase.google.com/docs/firestore/security/get-started

---

## 🎉 Next Steps

After Firebase setup is complete:

1. ✅ Test student registration
2. ✅ Test attendance check-in
3. ✅ Connect ESP32 fingerprint sensor (see `ESP32_SETUP.md`)
4. ✅ Deploy to production (see deployment guides)

**Congratulations! Firebase is now fully configured!** 🚀
