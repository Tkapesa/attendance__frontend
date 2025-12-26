# 🤖 AI Prompt Templates

This file contains ready-to-copy prompts for generating code with ChatGPT or other AI tools.

---

## 📝 How to Use

1. Copy the entire prompt for the page/component you need
2. Paste into ChatGPT/Claude/Copilot
3. The AI will generate the React component with Tailwind CSS
4. Review and integrate into your project

---

## 🔐 Prompt 1: Login Page

```
Generate a React Login Page component with the following specifications:

REQUIREMENTS:
- Email input field
- Password input field
- Login button
- Show loading spinner when submitting
- Display error messages in red
- Use Firebase Authentication for login
- Redirect to /dashboard on successful login
- Use Tailwind CSS for styling

STYLING:
- Clean, centered card layout
- Blue primary button (blue-600)
- Red error messages (red-500)
- Disabled button style during loading
- Mobile responsive

FUNCTIONALITY:
- Use useState for form state
- Use useNavigate from react-router-dom
- Handle authentication errors gracefully
- Show loading state on button

TECH STACK:
- React functional component
- Tailwind CSS
- Firebase Auth
- React Router
```

---

## 🏠 Prompt 2: Dashboard Page

```
Generate a React Dashboard component with the following specifications:

REQUIREMENTS:
- Display 3 summary cards:
  1. Total Students
  2. Total Courses
  3. Today's Attendance
- Navigation buttons for:
  - Enroll Student
  - Mark Attendance
  - View Students
  - Manage Courses
- Header with "Teacher Dashboard" title
- Logout button

STYLING:
- Grid layout for cards (3 columns on desktop)
- Cards with shadow and hover effect
- Blue buttons (blue-600)
- Icons for each card (use emoji or lucide-react)
- Mobile responsive (stack on mobile)

FUNCTIONALITY:
- Fetch statistics from API on mount:
  GET /students (count)
  GET /courses (count)
  GET /attendance/today (count)
- Use useState for data
- Use useEffect to fetch on mount
- Use useNavigate for routing
- Loading state while fetching

TECH STACK:
- React functional component
- Tailwind CSS
- Axios for API calls
- React Router
```

---

## 👤 Prompt 3: Enroll Student Page

```
Generate a React Enroll Student component with the following specifications:

REQUIREMENTS:
Form Fields:
- Student ID (text input)
- Full Name (text input)
- Course (dropdown/select)

Actions:
- "Scan Fingerprint" button
- Display scanned Fingerprint ID (read-only)
- "Save Student" button (disabled until fingerprint scanned)

WORKFLOW:
1. Teacher fills Student ID, Name, and selects Course
2. Clicks "Scan Fingerprint"
3. API call to POST /fingerprint/enroll returns fingerprint_id
4. Display fingerprint_id on screen
5. "Save Student" button becomes enabled
6. On Save, POST to /students with all data
7. Show success message and clear form

STYLING:
- Form layout with labels
- Tailwind CSS styling
- Green success message (green-500)
- Red error message (red-500)
- Disabled button style
- Loading spinner on buttons

FUNCTIONALITY:
- Fetch courses from GET /courses on mount
- Two-step process (scan then save)
- Form validation
- Error handling for API calls
- Success toast/notification

TECH STACK:
- React functional component
- Tailwind CSS
- Axios
- useState, useEffect
```

---

## ✅ Prompt 4: Attendance Page (Live Scan)

```
Generate a React Attendance Page component with the following specifications:

REQUIREMENTS:
- Large "Place Finger on Scanner" message
- Auto-scan mode (polls backend every 2 seconds)
- Success feedback: "Welcome, [Student Name]!"
- Error feedback: "Fingerprint not registered"
- List of last 10 attendance records below

WORKFLOW:
1. Component continuously polls POST /fingerprint/scan
2. Backend returns student data if match found
3. Display success message with student name (green)
4. If no match, show error (red)
5. Add record to attendance list

STYLING:
- Centered large text for scan status
- Green background for success (bg-green-100, text-green-700)
- Red background for error (bg-red-100, text-red-700)
- Table for attendance list
- Fade-in animation for messages

FUNCTIONALITY:
- Use setInterval or useEffect with polling
- Clear previous message after 3 seconds
- Display time of scan
- Auto-scroll to show latest attendance

TECH STACK:
- React functional component
- Tailwind CSS
- Axios
- useState, useEffect, useRef
```

---

## 📋 Prompt 5: Students Management Page

```
Generate a React Students Management component with the following specifications:

REQUIREMENTS:
- Table displaying:
  - Student ID
  - Name
  - Course(s)
  - Fingerprint ID
  - Actions (Remove button)
- Search/filter by name or ID
- Confirm before delete

STYLING:
- Tailwind CSS table
- Hover effect on rows
- Red delete button
- Modal for delete confirmation
- Mobile responsive table

FUNCTIONALITY:
- Fetch students from GET /students on mount
- Delete student: DELETE /students/:id
- Search filter updates table in real-time
- Show confirmation modal before delete
- Refresh list after delete

TECH STACK:
- React functional component
- Tailwind CSS
- Axios
- useState, useEffect
```

---

## 📚 Prompt 6: Courses Page

```
Generate a React Courses Management component with the following specifications:

REQUIREMENTS:
- Form to add new course:
  - Course Name (input)
  - Course Code (input)
  - Add button
- List of all courses
- Delete button for each course
- Confirm before delete

STYLING:
- Form at top
- List below
- Cards or table layout
- Blue add button (blue-600)
- Red delete button (red-500)
- Tailwind CSS

FUNCTIONALITY:
- Fetch courses from GET /courses on mount
- Add course: POST /courses
- Delete course: DELETE /courses/:id
- Clear form after add
- Refresh list after add/delete
- Show success/error messages

TECH STACK:
- React functional component
- Tailwind CSS
- Axios
- useState, useEffect
```

---

## 🔒 Prompt 7: Protected Route Component

```
Generate a React ProtectedRoute wrapper component with the following specifications:

REQUIREMENTS:
- Check if user is authenticated (Firebase Auth)
- If authenticated, render children
- If not, redirect to /login
- Show loading spinner while checking auth

FUNCTIONALITY:
- Use Firebase onAuthStateChanged
- Store user in context or state
- Redirect using Navigate from react-router-dom

TECH STACK:
- React functional component
- Firebase Auth
- React Router
```

---

## 🌐 Prompt 8: API Service File

```
Generate an Axios API service file (apiService.js) with the following:

REQUIREMENTS:
- Base URL from environment variable
- Axios instance with default config
- Functions for all API endpoints:
  - login(email, password)
  - enrollFingerprint()
  - scanFingerprint()
  - getStudents()
  - addStudent(data)
  - deleteStudent(id)
  - getCourses()
  - addCourse(data)
  - deleteCourse(id)
  - getTodayAttendance()

FEATURES:
- Error handling wrapper
- Authorization header with token
- Response data extraction

TECH STACK:
- Axios
- Environment variables
```

---

## 🎨 Prompt 9: Reusable Button Component

```
Generate a reusable Button component with the following:

PROPS:
- children (button text)
- onClick
- variant (primary, danger, secondary)
- loading (boolean)
- disabled (boolean)
- className (additional classes)

STYLING:
- Tailwind CSS
- Primary: blue-600
- Danger: red-500
- Secondary: gray-500
- Disabled state
- Loading spinner

TECH STACK:
- React functional component
- Tailwind CSS
```

---

## 💡 Tips for Using These Prompts

1. **Copy the entire block** - Context matters
2. **Adjust API URLs** - Match your backend endpoints
3. **Add Firebase config** - Include your Firebase setup
4. **Test incrementally** - Generate one page at a time
5. **Review code** - AI isn't perfect, review for logic errors

---

## 🔄 Regeneration Strategy

If the AI generates incorrect code:
- Add: "Follow React best practices"
- Add: "Include error handling"
- Add: "Use modern hooks syntax"
- Be more specific about functionality

---

**Last Updated:** 2025-12-26
