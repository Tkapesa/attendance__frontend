import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';

import { apiService } from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [stats, setStats] = useState({
    total_students: 0,
    present_today: 0,
    attendance_percentage: 0,
    new_students_this_week: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await apiService.getDashboardStats();
      if (response.status === 'success') {
        setStats(response.stats);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNav = (path, navItem) => {
    setActiveNav(navItem);
    navigate(path);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
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
              <a 
                className={`nav-link ${activeNav === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleNav('/', 'dashboard')}
              >
                <span className="nav-icon"><HomeIcon /></span>
                <span>Dashboard</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={`nav-link ${activeNav === 'attendance' ? 'active' : ''}`}
                onClick={() => handleNav('/attendance', 'attendance')}
              >
                <span className="nav-icon"><BarChartIcon /></span>
                <span>Live Scan</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={`nav-link ${activeNav === 'students' ? 'active' : ''}`}
                onClick={() => handleNav('/students', 'students')}
              >
                <span className="nav-icon"><PeopleIcon /></span>
                <span>Students</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={`nav-link ${activeNav === 'enroll' ? 'active' : ''}`}
                onClick={() => handleNav('/enroll', 'enroll')}
              >
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

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="greeting">
            <h1>Hello, Admin</h1>
            <p>Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="header-actions">
            <button className="icon-btn"><SearchIcon /></button>
            <button className="btn btn-primary" onClick={() => navigate('/enroll')}>
              <AddIcon /> Add New Student
            </button>
            <button className="icon-btn"><NotificationsIcon /></button>
          </div>
        </header>

        {/* Project Cards */}
        <div className="projects-grid">
          <div className="project-card purple" onClick={() => navigate('/students')}>
            <div className="project-header">
              <div className="project-members">
                <div className="member-avatar"><PeopleIcon style={{fontSize: '18px'}} /></div>
                <div className="member-avatar"><PeopleIcon style={{fontSize: '18px'}} /></div>
                <div className="member-avatar">+7</div>
              </div>
              <button className="project-menu">⋯</button>
            </div>
            <div className="project-title">Student Management</div>
            <div className="project-stats">
              <span>{loading ? '...' : stats.total_students} Students</span>
              <span>{loading ? '...' : Math.round((stats.total_students / (stats.total_students + 5)) * 100)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: loading ? '0%' : `${Math.round((stats.total_students / (stats.total_students + 5)) * 100)}%`}}></div>
            </div>
          </div>

          <div className="project-card blue" onClick={() => navigate('/attendance')}>
            <div className="project-header">
              <div className="project-members">
                <div className="member-avatar"><CheckCircleIcon style={{fontSize: '18px'}} /></div>
                <div className="member-avatar"><CheckCircleIcon style={{fontSize: '18px'}} /></div>
                <div className="member-avatar"><CheckCircleIcon style={{fontSize: '18px'}} /></div>
              </div>
              <button className="project-menu">⋯</button>
            </div>
            <div className="project-title">Live Attendance</div>
            <div className="project-stats">
              <span>{loading ? '...' : stats.present_today} Present Today</span>
              <span>{loading ? '...' : stats.attendance_percentage}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: loading ? '0%' : `${stats.attendance_percentage}%`}}></div>
            </div>
          </div>

          <div className="project-card orange" onClick={() => navigate('/enroll')}>
            <div className="project-header">
              <div className="project-members">
                <div className="member-avatar"><FingerprintIcon style={{fontSize: '18px'}} /></div>
                <div className="member-avatar"><FingerprintIcon style={{fontSize: '18px'}} /></div>
              </div>
              <button className="project-menu">⋯</button>
            </div>
            <div className="project-title">Fingerprint Enrollment</div>
            <div className="project-stats">
              <span>8 Pending</span>
              <span>18%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: '18%'}}></div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Tasks for Today */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Quick Actions</h2>
            </div>
            <div>
              <div className="task-item">
                <div className="task-indicator orange"></div>
                <div className="task-content">
                  <div className="task-title">Start Attendance Scanner</div>
                  <div className="task-subtitle">Begin fingerprint scanning for today</div>
                </div>
                <div className="task-checkbox" onClick={() => navigate('/attendance')}>
                  <ArrowForwardIcon />
                </div>
              </div>
              <div className="task-item">
                <div className="task-indicator purple"></div>
                <div className="task-content">
                  <div className="task-title">View All Students</div>
                  <div className="task-subtitle">Manage student database</div>
                </div>
                <div className="task-checkbox" onClick={() => navigate('/students')}>
                  <ArrowForwardIcon />
                </div>
              </div>
              <div className="task-item">
                <div className="task-indicator orange"></div>
                <div className="task-content">
                  <div className="task-title">Enroll New Student</div>
                  <div className="task-subtitle">Register fingerprint for new student</div>
                </div>
                <div className="task-checkbox" onClick={() => navigate('/enroll')}>
                  <ArrowForwardIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Statistics</h2>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon"><AccessTimeIcon style={{fontSize: '32px'}} /></div>
                <div className="stat-value">28 h</div>
                <div className="stat-label">Tracked time</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon"><CheckCircleIcon style={{fontSize: '32px'}} /></div>
                <div className="stat-value">18</div>
                <div className="stat-label">Present Today</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon"><SchoolIcon style={{fontSize: '32px'}} /></div>
                <div className="stat-value">8</div>
                <div className="stat-label">Active Courses</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
