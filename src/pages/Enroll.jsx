import { useState } from 'react';
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
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

function Enroll() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('enroll');
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    course: ''
  });
  const [fingerprintId, setFingerprintId] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleNav = (path, navItem) => {
    setActiveNav(navItem);
    navigate(path);
  };

  const handleScanFingerprint = () => {
    setScanning(true);
    setTimeout(() => {
      setFingerprintId('FP' + Math.floor(Math.random() * 100000));
      setScanning(false);
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Student ${formData.name} enrolled successfully!`);
    navigate('/students');
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
            <h1>Enroll New Student</h1>
            <p>Register student information and fingerprint</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={() => navigate('/students')}>
              <ArrowBackIcon /> Back to Students
            </button>
          </div>
        </header>

        <div className="content-grid">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Student Information</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px'}}>Student ID</label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #d2d2d7',
                    fontSize: '15px'
                  }}
                  placeholder="Enter student ID"
                  required
                />
              </div>

              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px'}}>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #d2d2d7',
                    fontSize: '15px'
                  }}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div style={{marginBottom: '24px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px'}}>Course</label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({...formData, course: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #d2d2d7',
                    fontSize: '15px'
                  }}
                  required
                >
                  <option value="">Select a course</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                </select>
              </div>

              <div style={{display: 'flex', gap: '12px'}}>
                <button type="submit" className="btn btn-primary" disabled={!fingerprintId} style={{opacity: fingerprintId ? 1 : 0.5}}>
                  Save Student
                </button>
                <button type="button" className="btn" style={{background: '#f5f5f7', color: '#1d1d1f'}} onClick={() => navigate('/students')}>
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Fingerprint Scan</h2>
            </div>
            <div style={{textAlign: 'center', padding: '40px 20px'}}>
              <div style={{
                width: '200px',
                height: '200px',
                margin: '0 auto 24px',
                borderRadius: '50%',
                background: fingerprintId 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                  : 'linear-gradient(135deg, #800020 0%, #a0153e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '80px',
                transition: 'all 0.3s',
                boxShadow: fingerprintId 
                  ? '0 10px 30px rgba(16, 185, 129, 0.3)' 
                  : '0 10px 30px rgba(128, 0, 32, 0.3)'
              }}>
                {scanning ? <HourglassEmptyIcon style={{fontSize: '80px', color: 'white'}} /> : 
                 fingerprintId ? <CheckCircleIcon style={{fontSize: '80px', color: 'white'}} /> : 
                 <FingerprintIcon style={{fontSize: '80px', color: 'white'}} />}
              </div>

              {fingerprintId && (
                <div style={{
                  background: '#d1fae5',
                  border: '1px solid #10b981',
                  borderRadius: '10px',
                  padding: '16px',
                  marginBottom: '20px'
                }}>
                  <div style={{fontWeight: 600, color: '#059669', marginBottom: '4px'}}>Scan Successful!</div>
                  <div style={{fontSize: '13px', color: '#047857'}}>Fingerprint ID: {fingerprintId}</div>
                </div>
              )}

              <button 
                className="btn btn-primary" 
                onClick={handleScanFingerprint}
                disabled={scanning}
                style={{opacity: scanning ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto'}}
              >
                <FingerprintIcon />
                {scanning ? 'Scanning...' : fingerprintId ? 'Scan Again' : 'Scan Fingerprint'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Enroll;
