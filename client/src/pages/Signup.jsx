import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ ...formData, role: 'Participant' });
      navigate('/explore');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center p-10">
      <div className="w-full max-w-md bg-card-bg rounded-lg p-10 shadow-xl">
        <h2 className="text-primary-yellow text-4xl font-bold text-center mb-8">Signup</h2>
        
        {error && <div className="bg-red-600 text-white p-3 rounded mb-5 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-4 bg-input-bg border-2 border-primary-yellow rounded text-white placeholder-primary-yellow placeholder-opacity-80 focus:outline-none focus:border-yellow-300"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-4 bg-input-bg border-2 border-primary-yellow rounded text-white placeholder-primary-yellow placeholder-opacity-80 focus:outline-none focus:border-yellow-300"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="8"
            className="w-full p-4 bg-input-bg border-2 border-primary-yellow rounded text-white placeholder-primary-yellow placeholder-opacity-80 focus:outline-none focus:border-yellow-300"
          />

          <button
            type="button"
            className="w-full bg-input-bg text-white p-4 rounded font-semibold hover:bg-opacity-80 transition"
          >
            Choose Avatar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-yellow text-gray-900 p-4 rounded font-bold text-lg hover:bg-yellow-300 transition disabled:opacity-60"
          >
            {loading ? 'Signing up...' : 'Signup'}
          </button>

          <button
            type="button"
            onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
            className="w-full bg-red-600 text-white p-4 rounded font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition"
          >
            <span className="text-xl font-bold">G</span> Signup with Google
          </button>
        </form>

        <p className="text-center mt-5 text-gray-400">
          Already have an account? <Link to="/login" className="text-primary-yellow hover:underline font-semibold">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;