import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from '@mui/icons-material/Delete';

import { apiService } from '../services/api';

function Students() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('students');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiService.listStudents();
      if (response.status === 'success') {
        setStudents(response.students || []);
      } else {
        setError(response.message || 'Failed to load students');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load students');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNav = (path, navItem) => {
    setActiveNav(navItem);
    navigate(path);
  };

  const handleRemove = async (uid) => {
    if (!confirm(`Are you sure you want to remove student ${uid}?`)) {
      return;
    }

    try {
      const response = await apiService.deleteStudent(uid);
      if (response.status === 'success') {
        setStudents(students.filter(s => s.uid !== uid));
      } else {
        alert(response.message || 'Failed to delete student');
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete student');
      console.error('Error deleting student:', err);
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">
            <AssignmentIcon />
          </div>
          <span>AttendTrack</span>
        </div>

        <div className="user-profile">
          <div className="user-avatar">
            <PeopleIcon style={{fontSize: '40px'}} />
          </div>
          <div className="user-name">Admin User</div>
          <div className="user-email">admin@school.com</div>
        </div>

        <nav>
          <ul className="nav-menu">
            <li className="nav-item">
              <a className={`nav-link ${activeNav === 'dashboard' ? 'active' : ''}`} onClick={() => handleNav('/', 'dashboard')}>
                <span className="nav-icon"><HomeIcon /></span>
                <span>Dashboard</span>
              </a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${activeNav === 'attendance' ? 'active' : ''}`} onClick={() => handleNav('/attendance', 'attendance')}>
                <span className="nav-icon"><BarChartIcon /></span>
                <span>Live Scan</span>
              </a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${activeNav === 'students' ? 'active' : ''}`} onClick={() => handleNav('/students', 'students')}>
                <span className="nav-icon"><PeopleIcon /></span>
                <span>Students</span>
              </a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${activeNav === 'enroll' ? 'active' : ''}`} onClick={() => handleNav('/enroll', 'enroll')}>
                <span className="nav-icon"><PersonAddIcon /></span>
                <span>Enroll</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link">
                <span className="nav-icon"><SettingsIcon /></span>
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="greeting">
            <h1>Student Management</h1>
            <p>View and manage all enrolled students</p>
          </div>
          <div className="header-actions">
            <button className="icon-btn"><SearchIcon /></button>
            <button className="btn btn-primary" onClick={() => navigate('/enroll')}>
              <AddIcon /> Add New Student
            </button>
          </div>
        </header>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">All Students ({students.length})</h2>
          </div>

          {error && (
            <div style={{
              margin: '20px',
              background: '#fff5f5',
              border: '1px solid #800020',
              color: '#800020',
              padding: '12px 14px',
              borderRadius: '10px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>No students enrolled yet. Click "Add New Student" to get started.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Fingerprint ID</th>
                  <th>Enrolled Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.uid}>
                    <td><strong>{student.uid}</strong></td>
                    <td>{student.name}</td>
                    <td><code>{student.fingerprint_id}</code></td>
                    <td>{student.created_at ? new Date(student.created_at).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <button className="btn-danger" onClick={() => handleRemove(student.uid)}>
                        <DeleteIcon style={{fontSize: '16px', marginRight: '4px'}} />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default Students;
