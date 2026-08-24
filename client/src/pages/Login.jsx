import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      await login(formData);

      navigate('/events');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      'http://localhost:5000/api/auth/google';
  };

  return (
    <main className="auth-page">

      <section className="auth-card">

        <h1 className="auth-title">
          Login
        </h1>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
          />

          <button
            type="submit"
            disabled={loading}
            className="primary-button"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="google-button"
          >
            <span className="google-icon">
              G
            </span>

            Login with Google
          </button>

        </form>

        <p className="auth-footer">

          Don't have an account?{' '}

          <Link
            to="/signup"
            className="auth-link"
          >
            Sign up
          </Link>

        </p>

      </section>

    </main>
  );
};

export default Login;