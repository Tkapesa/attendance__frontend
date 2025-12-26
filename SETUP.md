# 🚀 Quick Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account (for authentication)
- Backend API running

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Edit the `.env` file with your actual values:

```env
# Backend API URL (your backend server)
VITE_API_BASE_URL=http://localhost:3000/api

# Firebase Configuration (Get from Firebase Console)
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**How to get Firebase credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Go to Project Settings > General
4. Scroll to "Your apps" > Web app
5. Copy the config values

### 3. Run Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

## 🔧 Troubleshooting

### Port already in use
If port 5173 is taken, Vite will automatically try the next available port.

### Firebase auth errors
- Double-check your `.env` file has correct Firebase credentials
- Enable Email/Password authentication in Firebase Console:
  - Go to Authentication > Sign-in method
  - Enable "Email/Password"

### API connection errors
- Ensure your backend is running
- Check `VITE_API_BASE_URL` matches your backend URL
- Check CORS settings on backend

## �� Project Structure

```
src/
├── components/
│   ├── common/          # Button, Card, LoadingSpinner
│   ├── layout/          # Layout, Header
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx  # Firebase authentication
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── EnrollStudent.jsx
│   ├── Attendance.jsx
│   ├── Students.jsx
│   └── Courses.jsx
├── services/
│   ├── api.js          # Axios API calls
│   └── firebase.js     # Firebase config
├── App.jsx             # Routes
├── main.jsx            # Entry point
└── index.css           # Tailwind CSS
```

## 🎯 Features

- ✅ Teacher login with Firebase Authentication
- ✅ Dashboard with statistics
- ✅ Enroll students with fingerprint
- ✅ Live attendance scanning
- ✅ Student management
- ✅ Course management
- ✅ Responsive design with Tailwind CSS

## 🔐 Default Login

You'll need to create a teacher account in Firebase:
1. Go to Firebase Console > Authentication > Users
2. Click "Add User"
3. Enter email and password
4. Use these credentials to login

## 📝 Next Steps

1. Configure your Firebase project
2. Set up your backend API
3. Update the `.env` file
4. Run `npm install`
5. Run `npm run dev`
6. Login and start managing attendance!

## 📚 Documentation

- [SPECIFICATION.md](./SPECIFICATION.md) - Complete technical specs
- [AI-PROMPTS.md](./.ai-prompts/AI-PROMPTS.md) - AI generation prompts
- [README.md](./README.md) - Project overview

## 💡 Tips

- Use Chrome DevTools to debug API calls
- Check browser console for errors
- Use the `.ai-prompts/` folder to regenerate or modify components with AI

## 🆘 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify `.env` configuration
3. Ensure backend is running
4. Check Firebase authentication settings

---

**Happy coding! 🎉**
