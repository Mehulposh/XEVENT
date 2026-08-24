import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Navbar = () => {
  const {
    logout,
    isAuthenticated,
    isAdmin,
    isOrganizer
  } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#303030] bg-[#1f1f1f] shadow-[0_2px_12px_rgba(0,0,0,0.16)]">
      <nav className="page-container flex min-h-[70px] items-center justify-between py-3">

        {/* Logo */}
        <Link
          to={isAuthenticated ? '/events' : '/'}
          className="
            text-[26px]
            font-extrabold
            tracking-tight
            text-primary-yellow
            transition
            hover:text-[#ffd43b]
          "
        >
          The Social Hub
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-7 text-[16px]">

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="transition hover:text-primary-yellow"
              >
                Dashboard
              </Link>

              <Link
                to="/profile"
                className="transition hover:text-primary-yellow"
              >
                Profile
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="transition hover:text-primary-yellow"
                >
                  Admin
                </Link>
              )}

              {isOrganizer && (
                <Link
                  to="/organizer"
                  className="transition hover:text-primary-yellow"
                >
                  Organizer
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="
                  rounded
                  bg-[#ef0711]
                  px-4
                  py-2
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#d90710]
                "
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="transition hover:text-primary-yellow"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="transition hover:text-primary-yellow"
              >
                Signup
              </Link>
            </>
          )}

        </div>

      </nav>
    </header>
  );
};

export default Navbar;