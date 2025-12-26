import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { apiService } from '../services/api';

const EnrollStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    courseId: ''
  });
  const [fingerprintId, setFingerprintId] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await apiService.getCourses();
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const handleScanFingerprint = async () => {
    setScanning(true);
    setError('');
    try {
      const result = await apiService.enrollFingerprint();
      setFingerprintId(result.fingerprintId || result.id);
      setSuccess('Fingerprint scanned successfully!');
    } catch (err) {
      setError('Failed to scan fingerprint. Please try again.');
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fingerprintId) {
      setError('Please scan fingerprint first');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await apiService.addStudent({
        ...formData,
        fingerprintId
      });
      setSuccess('Student enrolled successfully!');
      // Reset form
      setFormData({ studentId: '', fullName: '', courseId: '' });
      setFingerprintId('');
      setTimeout(() => {
        navigate('/students');
      }, 2000);
    } catch (err) {
      setError('Failed to enroll student. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Enroll New Student</h2>
          <p className="text-gray-600">Register a student with fingerprint authentication</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Student ID</label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="input"
                required
                placeholder="e.g., STU001"
              />
            </div>

            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="input"
                required
                placeholder="e.g., John Doe"
              />
            </div>

            <div>
              <label className="label">Course</label>
              <select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                className="input"
                required
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t pt-6">
              <label className="label">Fingerprint Enrollment</label>
              <div className="space-y-4">
                <Button
                  type="button"
                  onClick={handleScanFingerprint}
                  loading={scanning}
                  variant="secondary"
                  className="w-full"
                >
                  🖐️ Scan Fingerprint
                </Button>

                {fingerprintId && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    ✅ Fingerprint ID: <strong>{fingerprintId}</strong>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                loading={loading}
                disabled={!fingerprintId}
                className="flex-1"
              >
                Save Student
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default EnrollStudent;
