import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { register } = useAuth();

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
      await register({
        ...formData,
        role: 'Participant'
      });

      navigate('/events');

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href =
      'http://localhost:5000/api/auth/google';
  };

  return (
    <main className="auth-page">

      <section className="auth-card">

        <h1 className="auth-title">
          Signup
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
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
          />

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
            minLength="8"
            className="form-input"
          />

          <button
            type="button"
            className="avatar-button"
          >
            Choose Avatar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="primary-button"
          >
            {loading ? 'Signing up...' : 'Signup'}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignup}
            className="google-button"
          >
            <span className="google-icon">
              G
            </span>

            Signup with Google
          </button>

        </form>

        <p className="auth-footer">

          Already have an account?{' '}

          <Link
            to="/login"
            className="auth-link"
          >
            Log in
          </Link>

        </p>

      </section>

    </main>
  );
};

export default Signup;