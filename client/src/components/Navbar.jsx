import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin, isOrganizer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-secondary-bg border-b-2 border-card-bg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 py-4">
        <div className="flex justify-between items-center">
          <Link to={isAuthenticated ? '/explore' : '/'} className="text-primary-yellow text-2xl font-bold hover:text-yellow-300 transition">
            The Social Hub
          </Link>
          
          <div className="flex items-center gap-5">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-white hover:text-primary-yellow transition">Dashboard</Link>
                <Link to="/profile" className="text-white hover:text-primary-yellow transition">Profile</Link>
                {isAdmin && <Link to="/admin" className="text-white hover:text-primary-yellow transition">Admin</Link>}
                {isOrganizer && <Link to="/organizer" className="text-white hover:text-primary-yellow transition">Organizer</Link>}
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-primary-yellow transition">Login</Link>
                <Link to="/signup" className="text-white hover:text-primary-yellow transition">Signup</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;