# 🖐️ Fingerprint Attendance System - Frontend

A modern, React-based frontend for managing student attendance using fingerprint biometrics.

## 🎯 Project Overview

This frontend application enables teachers to enroll students and track attendance through fingerprint scanning. The system communicates with a backend API and does not process biometric data directly.

## 🛠️ Tech Stack

- **React.js** (Vite) - Fast, modern build tool
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **Firebase Auth** - Teacher authentication
- **React Router** - Navigation

## 📋 Features

### For Teachers (Authenticated)
- ✅ Login with Firebase Authentication
- ✅ Enroll new students with fingerprint linking
- ✅ Manage students and courses
- ✅ View attendance records
- ✅ Remove students or disable fingerprints

### For Students
- ✅ Simple fingerprint scan for attendance (no login required)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Backend API running

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd attendance_frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your backend API URL and Firebase config

# Run development server
npm run dev
```

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Buttons, Cards, Modals
│   ├── layout/          # Header, Sidebar, Layout
│   └── pages/           # Page-specific components
├── context/             # AuthContext, AppContext
├── hooks/               # Custom hooks
├── services/            # API calls (axios)
├── pages/               # Main route pages
├── utils/               # Helpers
└── App.jsx              # Root component
```

## 🗺️ Routes

| Route | Page | Access |
|-------|------|--------|
| `/login` | Login | Public |
| `/dashboard` | Dashboard | Protected |
| `/enroll` | Enroll Student | Protected |
| `/attendance` | Attendance Scan | Public/Protected |
| `/students` | Student Management | Protected |
| `/courses` | Course Management | Protected |

## 🔌 API Integration

See [`SPECIFICATION.md`](./SPECIFICATION.md) for complete API endpoint documentation.

## 🎨 UI/UX Guidelines

- **Colors:** Green for success, Red for errors
- **Feedback:** Large text for attendance confirmation
- **Loading:** Spinners and disabled buttons during operations
- **Responsive:** Works on tablets and desktops

## 📖 Documentation

- **[SPECIFICATION.md](./SPECIFICATION.md)** - Complete technical specification
- **[AI-PROMPTS.md](./.ai-prompts/AI-PROMPTS.md)** - Ready-to-use AI prompt templates

## 🤝 Contributing

1. Read `SPECIFICATION.md` for requirements
2. Follow the component structure
3. Use Tailwind CSS for styling
4. Test with the backend API

## 📝 License

[Your License Here]

## 👨‍💻 Maintainer

[Your Name]

---

**Note:** This is the frontend only. Backend required separately.
