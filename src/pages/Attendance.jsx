import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { apiService } from '../services/api';

function Attendance() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('attendance');
  const [scanning, setScanning] = useState(true);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [error, setError] = useState('');
  const [recentScans, setRecentScans] = useState([
    { time: '10:15 AM', id: 'S001', name: 'John Doe', status: 'Present' },
    { time: '10:14 AM', id: 'S003', name: 'Mike Johnson', status: 'Present' },
    { time: '10:12 AM', id: 'S002', name: 'Jane Smith', status: 'Present' }
  ]);

  const handleNav = (path, navItem) => {
    setActiveNav(navItem);
    navigate(path);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const fingerprintId = Math.floor(1000 + Math.random() * 9000);
      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      setError('');
      setScanning(false);
      try {
        const res = await apiService.checkIn({ fingerprint_id: fingerprintId, device_id: 'web-demo' });

        if (res?.status !== 'success') {
          throw new Error(res?.message || 'Check-in failed');
        }

        setCurrentStudent(res.user_name || 'Student');
        setRecentScans(prev => [
          { time, id: res.student_id || 'N/A', name: res.user_name || 'Student', status: 'Present' },
          ...prev.slice(0, 4)
        ]);
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to record attendance';
        setError(msg);
        setCurrentStudent(null);
        setRecentScans(prev => [
          { time, id: 'N/A', name: `Fingerprint #${fingerprintId}`, status: 'Rejected' },
          ...prev.slice(0, 4)
        ]);
      } finally {
        setTimeout(() => {
          setCurrentStudent(null);
          setScanning(true);
        }, 2000);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

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
            <h1>Live Attendance Scanner</h1>
            <p>Real-time fingerprint scanning for attendance</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              <ArrowBackIcon /> Back to Dashboard
            </button>
          </div>
        </header>

        <div className="content-grid">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Scanner Status</h2>
            </div>

            {error && (
              <div style={{
                margin: '20px 20px 0',
                background: '#fff5f5',
                border: '1px solid #800020',
                color: '#800020',
                padding: '12px 14px',
                borderRadius: '12px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}
            <div style={{textAlign: 'center', padding: '60px 20px'}}>
              <div style={{
                width: '280px',
                height: '280px',
                margin: '0 auto 32px',
                borderRadius: '50%',
                background: currentStudent 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                  : 'linear-gradient(135deg, #800020 0%, #a0153e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '120px',
                transition: 'all 0.5s',
                boxShadow: currentStudent 
                  ? '0 20px 60px rgba(16, 185, 129, 0.3)' 
                  : '0 20px 60px rgba(128, 0, 32, 0.3)',
                animation: scanning ? 'pulse 2s infinite' : 'none'
              }}>
                {currentStudent ? 
                  <CheckCircleIcon style={{fontSize: '120px', color: 'white'}} /> : 
                  <FingerprintIcon style={{fontSize: '120px', color: 'white'}} />}
              </div>

              {currentStudent ? (
                <div style={{
                  background: '#d1fae5',
                  border: '2px solid #10b981',
                  borderRadius: '16px',
                  padding: '24px',
                  maxWidth: '400px',
                  margin: '0 auto'
                }}>
                  <div style={{fontSize: '24px', fontWeight: 700, color: '#059669', marginBottom: '8px'}}>
                    ✓ Welcome, {currentStudent}!
                  </div>
                  <div style={{fontSize: '15px', color: '#047857'}}>
                    Attendance marked successfully at {new Date().toLocaleTimeString()}
                  </div>
                </div>
              ) : (
                <div style={{
                  background: '#fff5f5',
                  border: '2px solid #800020',
                  borderRadius: '16px',
                  padding: '24px',
                  maxWidth: '400px',
                  margin: '0 auto'
                }}>
                  <div style={{fontSize: '18px', fontWeight: 600, color: '#800020', marginBottom: '8px'}}>
                    Ready to Scan
                  </div>
                  <div style={{fontSize: '14px', color: '#86868b'}}>
                    Place your finger on the scanner...
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Attendance ({recentScans.length})</h2>
            </div>
            <div>
              {recentScans.map((scan, index) => (
                <div key={index} className="task-item">
                  <div className="task-indicator" style={{background: scan.status === 'Rejected' ? '#800020' : '#10b981'}}></div>
                  <div className="task-content">
                    <div className="task-title">{scan.name}</div>
                    <div className="task-subtitle">{scan.id} • {scan.time}</div>
                  </div>
                  <div style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: scan.status === 'Rejected' ? '#fff5f5' : '#d1fae5',
                    color: scan.status === 'Rejected' ? '#800020' : '#059669',
                    fontSize: '13px',
                    fontWeight: 600
                  }}>
                    {scan.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}

export default Attendance;
