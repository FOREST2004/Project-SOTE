import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

function Profile() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user.fullName);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const data = { fullName };
      if (password) data.password = password;

      await api.put('/auth/profile', data);
      setMessage('Profile updated successfully');
      setPassword('');
    } catch (error) {
      setMessage('Failed to update profile');
    }
  };

  return (
    <div className="container">
      <div className="profile-page">
        <h1>My Profile</h1>

        <div className="user-info">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form" noValidate>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>New Password (leave empty to keep current)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="6"
            />
          </div>

          {message && <div className="message">{message}</div>}

          <button type="submit" className="btn btn-primary">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
