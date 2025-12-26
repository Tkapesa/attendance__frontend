import { useState } from 'react';
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

function Students() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('students');
  const [students, setStudents] = useState([
    { id: 'S001', name: 'John Doe', course: 'Computer Science', fingerprintId: 'FP12345' },
    { id: 'S002', name: 'Jane Smith', course: 'Mathematics', fingerprintId: 'FP12346' },
    { id: 'S003', name: 'Mike Johnson', course: 'Physics', fingerprintId: 'FP12347' },
    { id: 'S004', name: 'Sarah Williams', course: 'Chemistry', fingerprintId: 'FP12348' }
  ]);

  const handleNav = (path, navItem) => {
    setActiveNav(navItem);
    navigate(path);
  };

  const handleRemove = (id) => {
    setStudents(students.filter(s => s.id !== id));
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
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Course</th>
                <th>Fingerprint ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td><strong>{student.id}</strong></td>
                  <td>{student.name}</td>
                  <td>{student.course}</td>
                  <td><code>{student.fingerprintId}</code></td>
                  <td>
                    <button className="btn-danger" onClick={() => handleRemove(student.id)}>
                      <DeleteIcon style={{fontSize: '16px', marginRight: '4px'}} />
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Students;
