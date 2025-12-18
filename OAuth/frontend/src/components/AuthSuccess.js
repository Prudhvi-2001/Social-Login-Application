import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    // Redirect to dashboard after successful authentication
    // The token is passed via URL, but in a real app, you'd store it securely
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      color: 'white',
      fontSize: '24px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Authentication successful!</h2>
        <p>Redirecting to dashboard...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;

