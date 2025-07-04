import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence, browserLocalPersistence } from 'firebase/auth';
import '../Login.css';
import logo from '../assets/Task_7682639_35712196.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistence);
      await signInWithEmailAndPassword(auth, email, password);
      setTimeout(() => {
        setIsLoading(false);
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      setIsLoading(false);
      let errorMessage = 'Login failed. Please try again.';
      switch (err.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No user found with this email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later.';
          break;
        default:
          errorMessage = 'An unexpected error occurred.';
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="image-container"></div>
        <div className="form-container">
          <img src={logo} alt="Olive-IoT Logo" className="company-logo" />
          <h2> RO-Aqua-Monitoring</h2>
          <div className="form-wrapper">
            <div className="form-group">
              <label htmlFor="email">Username or Email</label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter username or email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Remember Me</label>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              <span>{isLoading ? 'Logging in...' : 'Login'}</span>
            </button>
            {error && <p className="error-message">{error}</p>}
          </div>
          <footer>
            Copyright © 2025 Olive-IoT. All Rights Reserved.
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Login;