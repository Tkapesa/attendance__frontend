# FRONTEND SPECIFICATION DOCUMENT
## Fingerprint Attendance System

---

## 1. Project Overview

**Project Name:** Fingerprint Attendance System (Frontend)

**Description:**  
This is a frontend application for a fingerprint-based attendance system. The frontend allows teachers to enroll students by linking a student ID with a fingerprint ID returned from the backend. After enrollment, students only scan their fingerprint to mark attendance. The frontend communicates with an existing backend and does not process fingerprint data directly.

---

## 2. Technology Stack

- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **API Communication:** Axios
- **Authentication:** Firebase Authentication (teachers only)
- **Database:** Firebase (handled by backend)

---

## 3. User Roles

### Teacher (Authenticated User)
- Login
- Enroll students
- Remove students
- Add and remove courses
- View attendance

### Student
- Only scans fingerprint (no login)

---

## 4. Application Pages & Requirements

### 4.1 Login Page
- Email input
- Password input
- Login button
- Error handling
- Redirect to dashboard after login

**Route:** `/login`

---

### 4.2 Dashboard
- Display summary cards:
  - Total students
  - Total courses
  - Today's attendance
- Navigation buttons:
  - Enroll Student
  - Attendance
  - Students
  - Courses

**Route:** `/dashboard`

---

### 4.3 Enroll Student Page

**Inputs:**
- Student ID
- Full Name
- Course selection (dropdown)

**Actions:**
- "Scan Fingerprint" button
- Display fingerprint ID returned from backend
- "Save Student" button (enabled only after fingerprint scan)

**Rules:**
- Fingerprint enrollment happens once per student
- Fingerprint ID must be unique

**Route:** `/enroll`

---

### 4.4 Attendance Page

- Message display:
  - "Place finger on scanner"
  - Success message with student name
  - Error message if fingerprint not registered
- Live scanning mode
- List of recent attendance scans

**Route:** `/attendance`

---

### 4.5 Students Management Page

- Table with:
  - Student ID
  - Name
  - Course(s)
  - Fingerprint ID
- Actions:
  - Remove student
  - Disable fingerprint

**Route:** `/students`

---

### 4.6 Courses Page

- Add course form
- Courses list
- Delete course button

**Route:** `/courses`

---

## 5. API Endpoints (Frontend Usage Only)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/login` | Teacher login |
| POST | `/fingerprint/enroll` | Register new fingerprint |
| POST | `/fingerprint/scan` | Verify fingerprint for attendance |
| POST | `/students` | Add new student |
| GET | `/students` | Get all students |
| DELETE | `/students/:id` | Remove student |
| POST | `/courses` | Add new course |
| GET | `/courses` | Get all courses |
| DELETE | `/courses/:id` | Remove course |
| GET | `/attendance` | Get attendance records |
| GET | `/attendance/today` | Get today's attendance |

---

## 6. UI/UX Guidelines

- Clean, minimal design
- Large text for attendance feedback
- **Green** = success, **Red** = error
- Disable buttons during loading
- Show loading indicators (spinners)
- Use consistent spacing and padding
- Mobile-responsive design
- Toast notifications for success/error messages

### Color Palette (Tailwind)
- Primary: `blue-600`
- Success: `green-500`
- Error: `red-500`
- Warning: `yellow-500`
- Neutral: `gray-100`, `gray-800`

---

## 7. Security Rules (Frontend Perspective)

- Only authenticated teachers can access dashboard pages
- Attendance page may be publicly accessible on classroom device
- No fingerprint images or biometric data stored on frontend
- Use protected routes with authentication checks
- Store auth tokens securely (httpOnly cookies or secure storage)

---

## 8. Output Expectations (For AI Prompts)

When generating code:
- Use React functional components
- Use hooks (`useState`, `useEffect`, `useContext`)
- Use Axios for API calls
- Use Tailwind CSS for styling
- No backend logic included
- Include error handling
- Include loading states
- Use TypeScript types (optional but recommended)
- Follow React best practices

---

## 9. Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── layout/          # Layout components (Header, Sidebar)
│   └── pages/           # Page-specific components
├── context/             # React Context for auth/state
├── hooks/               # Custom React hooks
├── services/            # API service functions
├── utils/               # Helper functions
├── pages/               # Route pages
└── App.jsx              # Main app component
```

---

## 10. HOW TO USE THIS DOCUMENT FOR AI PROMPTS

### Example Prompt Format:

```
Using the specification below, generate the React frontend code for [PAGE NAME] page only.
Follow the UI/UX rules and use Tailwind CSS.

[Copy relevant section from this document]
```

### Quick Copy Sections:
- **Login Page:** Section 4.1
- **Dashboard:** Section 4.2
- **Enroll Student:** Section 4.3
- **Attendance:** Section 4.4
- **Students Management:** Section 4.5
- **Courses:** Section 4.6

---

## 11. Development Guidelines

### Component Naming
- PascalCase for components: `EnrollStudent.jsx`
- camelCase for functions: `handleSubmit`
- UPPER_CASE for constants: `API_BASE_URL`

### State Management
- Use `useState` for local state
- Use Context API for global state (auth, user data)
- Use `useEffect` for side effects (API calls)

### API Calls
```javascript
// Example structure
const fetchStudents = async () => {
  try {
    setLoading(true);
    const response = await axios.get('/students');
    setStudents(response.data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

---

## 12. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-26 | Initial specification document |

---

## Notes
- This document is the single source of truth for frontend development
- Update this file when requirements change
- Use version control to track specification changes
