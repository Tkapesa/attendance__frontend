# Quick Start: Backend Integration

This is a simplified guide to quickly connect your backend to the frontend.

## 🚀 5-Minute Setup

### Step 1: Install Dependencies (30 seconds)

```bash
npm install axios
```

### Step 2: Create Environment File (30 seconds)

```bash
# Create .env file in project root
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

**Note:** Replace `http://localhost:5000/api` with your actual backend URL.

### Step 3: Create API Service (2 minutes)

Create file `src/services/api.js`:

```bash
mkdir -p src/services
cat > src/services/api.js << 'APIFILE'
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
APIFILE
```

### Step 4: Create Student Service (1 minute)

Create file `src/services/studentService.js`:

```bash
cat > src/services/studentService.js << 'STUDENTFILE'
import api from './api';

export const studentService = {
  getAllStudents: () => api.get('/students').then(res => res.data),
  createStudent: (data) => api.post('/students', data).then(res => res.data),
  deleteStudent: (id) => api.delete(`/students/${id}`).then(res => res.data),
};
STUDENTFILE
```

---

## 📋 Backend Requirements Checklist

Your backend must provide these endpoints:

### Required Endpoints:

- [ ] `GET /api/students` - Returns array of students
- [ ] `POST /api/students` - Creates new student
- [ ] `DELETE /api/students/:id` - Deletes student
- [ ] `POST /api/attendance/scan` - Records attendance
- [ ] `GET /api/attendance/today` - Gets today's attendance

### Expected Student Object:

```json
{
  "id": "S001",
  "name": "John Doe",
  "course": "Computer Science",
  "fingerprintId": "FP12345"
}
```

---

## 🔧 CORS Configuration

Your backend must allow requests from `http://localhost:5173`

### Node.js/Express:
```javascript
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173' }));
```

### Python/Flask:
```python
from flask_cors import CORS
CORS(app, origins=["http://localhost:5173"])
```

### Python/Django:
```python
CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]
```

---

## 🧪 Test Your Connection

Open browser console and run:

```javascript
fetch('http://localhost:5000/api/students')
  .then(res => res.json())
  .then(data => console.log('✅ Connected:', data))
  .catch(err => console.error('❌ Failed:', err));
```

---

## 🐛 Troubleshooting

### CORS Error
**Solution:** Add CORS configuration to your backend

### Network Error
**Solution:** Check if backend is running and verify URL in `.env`

### 404 Not Found
**Solution:** Verify backend routes match frontend API calls

---

## 📚 Full Documentation

For complete integration guide, see: **BACKEND_INTEGRATION.md**
