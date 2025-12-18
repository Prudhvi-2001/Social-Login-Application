import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/user`, {
        withCredentials: true
      });
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${API_URL}/auth/logout`, {
        withCredentials: true
      });
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="user-header">
          <img 
            src={user.picture} 
            alt={user.name} 
            className="user-avatar"
          />
          <h1 className="user-name">Welcome, {user.name}!</h1>
          <p className="user-email">{user.email}</p>
        </div>

        <div className="user-info">
          <div className="info-item">
            <span className="info-label">Provider:</span>
            <span className="info-value">{user.provider}</span>
          </div>
          {user.username && (
            <div className="info-item">
              <span className="info-label">Username:</span>
              <span className="info-value">{user.username}</span>
            </div>
          )}
          <div className="info-item">
            <span className="info-label">User ID:</span>
            <span className="info-value">{user.id}</span>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

