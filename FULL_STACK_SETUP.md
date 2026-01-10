# Full Stack Attendance System Setup Guide

## 📋 Project Overview

A complete attendance tracking system using:
- **Frontend**: React + Vite
- **Backend**: Django + Firestore
- **Hardware**: ESP32 + Fingerprint Sensor (optional)

---

## 🚀 Quick Start

### 1. **Clone the Repository**
```bash
git clone https://github.com/Tkapesa/attendance__frontend.git
cd attendance_frontend
```

### 2. **Backend Setup**

#### Install Python Dependencies
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

#### Configure Firebase
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create or select your project
3. Go to **Project Settings** → **Service Accounts**
4. Click **"Generate new private key"**
5. Save the JSON file as `backend/firebase-credentials.json`

#### Set Environment Variables (Optional)
```bash
cp .env.example .env
# Edit .env if you want custom settings
```

#### Start Django Server
```bash
python manage.py runserver 8000
```

Backend will be available at: `http://localhost:8000`

### 3. **Frontend Setup**

```bash
cd ..  # Back to project root
npm install
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## 📚 API Endpoints

See `backend/API_DOCUMENTATION.md` for complete API reference.

### Key Endpoints:
- `POST /auth/login/` - Authenticate with Firebase
- `POST /users/register/` - Register new student
- `GET /users/students/` - List all students
- `POST /attendance/check-in/` - Record attendance
- `GET /dashboard/stats/` - Get dashboard statistics
- `GET /attendance/today/` - Today's attendance

---

## 🔧 Backend Architecture

### Apps Structure:
```
backend/
├── auth/               # Authentication endpoints
├── users/              # Student management
├── attendance/         # Attendance tracking
├── dashboard/          # Statistics & analytics
├── fingerprint/        # Fingerprint verification
└── firebase_config/    # Firebase initialization
```

### Features:
✅ Firebase Authentication integration
✅ Firestore database (no Django ORM)
✅ JSON error middleware for ESP32
✅ CORS configured for frontend
✅ RESTful API design
✅ Comprehensive error handling

---

## 🎨 Frontend Architecture

### Pages:
- **Login** - Teacher authentication
- **Dashboard** - Overview & statistics
- **Live Scan** - Real-time attendance scanning
- **Students** - Student management
- **Enroll** - Register new students
- **Courses** - Course management (coming soon)

### Key Features:
✅ React Router for navigation
✅ Protected routes with authentication
✅ Real-time attendance simulation
✅ Responsive Material-UI design
✅ Axios API client with interceptors

---

## 🔌 ESP32 Hardware Integration

See `ESP32_SETUP.md` for complete hardware setup instructions.

### Requirements:
- ESP32 DevKit
- Adafruit Fingerprint Sensor
- WiFi network

### Quick Setup:
1. Upload Arduino code from `ESP32_SETUP.md`
2. Configure WiFi credentials
3. Set backend URL to your Mac's IP
4. Connect sensor (RX→GPIO16, TX→GPIO17)

---

## 🧪 Testing the System

### 1. Health Check
```bash
curl http://localhost:8000/health/
```

### 2. Register a Student
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

### 3. Record Attendance
```bash
curl -X POST http://localhost:8000/attendance/check-in/ \
  -H "Content-Type: application/json" \
  -d '{
    "fingerprint_id": 1234,
    "device_id": "web-demo"
  }'
```

### 4. Get Dashboard Stats
```bash
curl http://localhost:8000/dashboard/stats/
```

---

## 📊 Database Structure (Firestore)

### Collections:

#### `users`
```json
{
  "uid": "S001",
  "name": "John Doe",
  "fingerprint_id": 1234,
  "role": "student",
  "created_at": "2026-01-10T12:00:00Z"
}
```

#### `attendance_logs`
```json
{
  "student_id": "S001",
  "timestamp": "2026-01-10T10:15:00Z",
  "status": "Present",
  "device_id": "ESP32-001",
  "fingerprint_id": 1234
}
```

---

## 🐛 Troubleshooting

### Backend Issues

**"Firebase credentials not found"**
- Ensure `firebase-credentials.json` is in `backend/` directory
- Check file permissions
- Restart Django server

**"CORS errors in browser"**
- Verify `CORS_ALLOWED_ORIGINS` in `settings.py`
- Check frontend is running on port 5173

### Frontend Issues

**"Network Error" or "500 errors"**
- Ensure backend is running on port 8000
- Check Firebase credentials are configured
- Verify `.env` has correct `VITE_API_URL`

**"Authentication failed"**
- Check Firebase Auth is enabled in Firebase Console
- Verify `firebase.js` has correct config

---

## 📦 Dependencies

### Backend (requirements.txt)
- Django 4.2.16
- firebase-admin 6.5.0
- django-cors-headers 4.3.1
- python-dotenv 1.0.1

### Frontend (package.json)
- React 18.3.1
- React Router 7.1.1
- Axios 1.7.9
- Firebase 11.1.0
- Material-UI Icons 6.3.0
- Vite 5.4.21

---

## 🚢 Deployment

### Backend (Django)
1. Set `DEBUG=False` in production
2. Configure `ALLOWED_HOSTS`
3. Use proper secret key
4. Deploy to Heroku/Railway/AWS

### Frontend (React)
1. Build: `npm run build`
2. Deploy `dist/` folder to Vercel/Netlify
3. Update `VITE_API_URL` to production backend

---

## 📝 Environment Variables

### Backend `.env`
```env
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=0
FIREBASE_CREDENTIALS_PATH=/path/to/firebase-credentials.json
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

---

## 📄 License

MIT License

## 👥 Contributors

- Your Name - [@Tkapesa](https://github.com/Tkapesa)

---

## 🆘 Support

For issues or questions:
1. Check documentation in `backend/README.md` and `ESP32_SETUP.md`
2. Review `backend/API_DOCUMENTATION.md`
3. Open an issue on GitHub

---

**Happy Coding! 🎉**
