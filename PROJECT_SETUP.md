# Complete Project Setup Guide

Step-by-step guide to set up the entire Attendance System from scratch.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Clone Repository](#clone-repository)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Firebase Configuration](#firebase-configuration)
6. [Hardware Setup](#hardware-setup-optional)
7. [Testing](#testing)
8. [Deployment](#deployment)

---

## 🛠️ Prerequisites

### Required Software

#### 1. Python 3.10+
```bash
# Check Python version
python3 --version

# Install if needed (macOS with Homebrew)
brew install python@3.10
```

#### 2. Node.js 18+
```bash
# Check Node.js version
node --version

# Install if needed (macOS with Homebrew)
brew install node
```

#### 3. Git
```bash
# Check Git version
git --version

# Install if needed
brew install git
```

#### 4. Text Editor
- VS Code (recommended): https://code.visualstudio.com
- Or any code editor of your choice

### Optional (for hardware)
- Arduino IDE 2.0+
- ESP32 drivers (CH340/CP2102)

---

## 📥 Clone Repository

### Step 1: Clone from GitHub

```bash
# Navigate to your projects folder
cd ~/Projects  # or wherever you keep projects

# Clone the repository
git clone https://github.com/Tkapesa/attendance__frontend.git

# Enter project directory
cd attendance_frontend
```

### Step 2: Explore Project Structure

```bash
# View project structure
ls -la

# Expected structure:
attendance_frontend/
├── backend/              # Django backend
├── src/                  # React frontend source
├── public/               # Frontend public assets
├── node_modules/         # Frontend dependencies (after install)
├── package.json          # Frontend dependencies list
├── vite.config.js       # Vite configuration
├── README.md            # Main documentation
├── FIREBASE_SETUP.md    # Firebase guide
├── HARDWARE_SETUP.md    # ESP32 guide
├── FULL_STACK_SETUP.md  # Quick reference
└── ESP32_SETUP.md       # Original hardware docs
```

---

## 🐍 Backend Setup

### Step 1: Navigate to Backend

```bash
cd backend
pwd  # Should show: /Users/yourname/Projects/attendance_frontend/backend
```

### Step 2: Create Virtual Environment

```bash
# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate

# Your prompt should now show: (.venv)
```

### Step 3: Install Python Dependencies

```bash
# Upgrade pip
pip install --upgrade pip

# Install requirements
pip install -r requirements.txt

# Verify installation
pip list | grep -i django
# Should show: Django 4.2.16

pip list | grep -i firebase
# Should show: firebase-admin 6.5.0
```

### Step 4: Configure Environment (Optional)

```bash
# Copy environment template
cp .env.example .env

# Edit if you want custom settings
nano .env
```

Default settings work fine for development!

### Step 5: Run Database Migrations (Optional)

```bash
# Django migrations (for admin/sessions, not for our Firestore data)
python manage.py migrate

# Create superuser for Django admin (optional)
python manage.py createsuperuser
```

### Step 6: Test Backend

```bash
# Start Django development server
python manage.py runserver 8000

# You should see:
# Starting development server at http://127.0.0.1:8000/
```

Keep this terminal open! Backend is now running.

### Step 7: Verify Backend in Another Terminal

```bash
# Open new terminal
curl http://localhost:8000/health/

# Expected response:
# {"status":"success","message":"ok"}
```

✅ **Backend is working!**

---

## ⚛️ Frontend Setup

### Step 1: Navigate to Project Root (New Terminal)

```bash
# From backend folder, go back to root
cd ..

# Or open new terminal and:
cd ~/Projects/attendance_frontend
```

### Step 2: Install Node Dependencies

```bash
# Install all dependencies
npm install

# This will take 1-2 minutes
# Should install ~200+ packages
```

### Step 3: Configure Environment

```bash
# Create environment file
touch .env

# Add this content:
echo "VITE_API_URL=http://localhost:8000" > .env

# For Firebase, add your config later (see FIREBASE_SETUP.md)
```

### Step 4: Start Frontend Development Server

```bash
# Start Vite dev server
npm run dev

# You should see:
#   VITE v5.4.21  ready in 500 ms
#   ➜  Local:   http://localhost:5173/
#   ➜  Network: use --host to expose
```

### Step 5: Open in Browser

```bash
# macOS: Open browser automatically
open http://localhost:5173

# Or manually visit: http://localhost:5173
```

✅ **Frontend is running!**

---

## 🔥 Firebase Configuration

**⚠️ Critical Step**: System needs Firebase to work properly.

### Quick Setup (5 minutes)

1. **See detailed guide**: Open `FIREBASE_SETUP.md`
2. **Create Firebase project**: https://console.firebase.google.com
3. **Enable Firestore Database**: Start in test mode
4. **Enable Authentication**: Email/Password provider
5. **Generate service account key**: Save as `backend/firebase-credentials.json`
6. **Get web config**: Update `src/services/firebase.js`

### Quick Commands After Firebase Setup

```bash
# Test backend with Firebase
curl -X POST http://localhost:8000/users/register/ \
  -H "Content-Type: application/json" \
  -d '{"uid":"TEST001","name":"Test User","fingerprint_id":9999,"role":"student"}'

# Should get success response, not error about credentials
```

### Skip Firebase for Quick Testing

If you want to test without Firebase temporarily:
- Frontend will show errors when fetching data
- Backend endpoints requiring database will fail
- Health check endpoint will still work: `curl http://localhost:8000/health/`

**But you MUST set up Firebase for the system to function!**

📖 **See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for complete instructions.**

---

## 🔌 Hardware Setup (Optional)

Only needed if you want physical fingerprint scanning.

### Quick Overview

1. **Buy hardware**:
   - ESP32 board (~$10)
   - Adafruit fingerprint sensor (~$45)
   - Jumper wires

2. **Connect hardware**:
   - Sensor TX → ESP32 GPIO16
   - Sensor RX → ESP32 GPIO17
   - 5V and GND connections

3. **Upload Arduino code**: From `HARDWARE_SETUP.md`

4. **Configure WiFi**: Update credentials in sketch

5. **Set server URL**: Use your Mac's IP address

📖 **See [HARDWARE_SETUP.md](HARDWARE_SETUP.md) for complete instructions.**

---

## ✅ Testing

### Test 1: Backend Health Check

```bash
curl http://localhost:8000/health/

# Expected: {"status":"success","message":"ok"}
```

### Test 2: Frontend Loading

Visit http://localhost:5173
- Should see login page
- No console errors (F12 to check)

### Test 3: Register a Student (After Firebase Setup)

```bash
curl -X POST http://localhost:8000/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "S001",
    "name": "John Doe",
    "fingerprint_id": 1234,
    "role": "student"
  }'

# Expected: {"status":"success","message":"User registered",...}
```

### Test 4: Check In Student

```bash
curl -X POST http://localhost:8000/attendance/check-in/ \
  -H "Content-Type: application/json" \
  -d '{"fingerprint_id":1234,"device_id":"web-test"}'

# Expected: {"status":"success","message":"Attendance recorded",...}
```

### Test 5: View Dashboard Stats

```bash
curl http://localhost:8000/dashboard/stats/ | python3 -m json.tool

# Expected: JSON with total_students, present_today, etc.
```

### Test 6: Frontend Features

1. **Login** (after Firebase auth setup)
   - Go to http://localhost:5173
   - Use teacher credentials
   - Should redirect to dashboard

2. **Dashboard**
   - Shows student count
   - Shows attendance percentage
   - All cards clickable

3. **Students Page**
   - Lists all enrolled students
   - Can delete students
   - "Add New Student" button works

4. **Enroll Page**
   - Fill student info
   - Scan fingerprint (simulated for now)
   - Submit registration

5. **Live Attendance**
   - Shows real-time scanning simulation
   - Recent scans appear in list

---

## 🚢 Deployment

### Backend Deployment Options

#### Option 1: Heroku
```bash
# Install Heroku CLI
brew install heroku/brew/heroku

# Login and deploy
heroku login
heroku create attendance-backend
git push heroku main
```

#### Option 2: Railway
- Visit https://railway.app
- Connect GitHub repo
- Deploy backend folder
- Add environment variables

#### Option 3: AWS/DigitalOcean
- Set up Ubuntu server
- Install Python, dependencies
- Use gunicorn + nginx
- Configure firewall

### Frontend Deployment Options

#### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Update VITE_API_URL to production backend
```

#### Option 2: Netlify
- Connect GitHub repo
- Build command: `npm run build`
- Publish directory: `dist`
- Add environment variables

#### Option 3: GitHub Pages
```bash
# Build production version
npm run build

# Deploy dist folder to gh-pages branch
```

### Update Firebase for Production

1. Go to Firebase Console → Authentication → Authorized domains
2. Add your production domain
3. Update Firestore security rules (see FIREBASE_SETUP.md)

---

## 📝 Environment Variables Reference

### Backend `.env`
```env
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=0
FIREBASE_CREDENTIALS_PATH=/path/to/firebase-credentials.json
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

---

## 🐛 Common Issues

### Issue: "Module not found"
**Solution**: 
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

### Issue: "Port already in use"
**Solution**:
```bash
# Find and kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or use different port
python manage.py runserver 8001
```

### Issue: "Firebase credentials not found"
**Solution**: Complete Firebase setup (see FIREBASE_SETUP.md)

### Issue: "CORS errors"
**Solution**: 
- Backend should allow `localhost:5173`
- Check `backend_project/settings.py` → `CORS_ALLOWED_ORIGINS`

### Issue: "Cannot connect to backend from ESP32"
**Solution**:
- Use `0.0.0.0` instead of `127.0.0.1`
- Check firewall allows port 8000
- Use Mac's local IP, not localhost

---

## 📚 Documentation Index

- **[README.md](README.md)** - Project overview
- **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** - Complete Firebase guide ⭐
- **[HARDWARE_SETUP.md](HARDWARE_SETUP.md)** - ESP32 hardware guide ⭐
- **[FULL_STACK_SETUP.md](FULL_STACK_SETUP.md)** - Quick reference
- **[backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)** - API endpoints
- **[ESP32_SETUP.md](ESP32_SETUP.md)** - Original hardware docs

---

## 🎯 Quick Start Checklist

- [ ] Clone repository
- [ ] Set up Python virtual environment
- [ ] Install backend dependencies
- [ ] Install frontend dependencies
- [ ] Create Firebase project
- [ ] Set up Firestore database
- [ ] Enable Firebase Authentication
- [ ] Download service account key
- [ ] Update frontend Firebase config
- [ ] Start backend server
- [ ] Start frontend server
- [ ] Test health endpoint
- [ ] Register test student
- [ ] Test check-in
- [ ] (Optional) Set up ESP32 hardware
- [ ] (Optional) Deploy to production

---

## 💡 Tips for Success

1. **Follow the order**: Backend → Firebase → Frontend → Hardware
2. **Test as you go**: Don't skip verification steps
3. **Read error messages**: They usually tell you what's wrong
4. **Check documentation**: Each guide has troubleshooting section
5. **Use Git**: Commit working changes before trying new things

---

## 🆘 Getting Help

### Resources
- **GitHub Issues**: https://github.com/Tkapesa/attendance__frontend/issues
- **Firebase Docs**: https://firebase.google.com/docs
- **Django Docs**: https://docs.djangoproject.com
- **React Docs**: https://react.dev

### Before Asking for Help
1. Check all documentation files
2. Review troubleshooting sections
3. Check browser console (F12)
4. Check terminal output
5. Verify all prerequisites installed

---

**Ready to build? Let's go!** 🚀

Start with: [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
