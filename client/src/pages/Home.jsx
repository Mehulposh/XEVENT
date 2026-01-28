import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center p-10">
      <div className="max-w-4xl w-full border-2 border-border-color rounded-lg p-20 text-center bg-card-bg">
        <h1 className="text-5xl font-bold mb-8">
          Welcome to <span className="text-primary-yellow">The Social Hub</span>
        </h1>
        <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
          Your one-stop hub for <strong>exciting events</strong> — meet, explore, and experience like never before!
        </p>
        <button
          onClick={() => navigate('/explore')}
          type="button"
          className="bg-primary-yellow text-gray-900 px-8 py-4 rounded font-bold text-lg hover:bg-yellow-300 transition transform hover:-translate-y-1"
        >
          Explore Events
        </button>
      </div>
    </div>
  );
};

export default Home;