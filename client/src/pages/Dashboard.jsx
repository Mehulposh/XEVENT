import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrationService } from '../services/apiService';
import { useAuth } from '../context/authContext';

const Dashboard = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegisteredEvents();
  }, []);

  const fetchRegisteredEvents = async () => {
    try {
      const data = await registrationService.getMyRegistrations();
      setRegisteredEvents(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-primary-yellow text-4xl font-bold text-center mb-8">
          Welcome, {user?.name} 👋
        </h1>
        <h2 className="text-white text-2xl font-semibold mb-6">Your Registered Events</h2>

        {loading ? (
          <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-yellow"></div></div>
        ) : registeredEvents.length === 0 ? (
          <p className="text-gray-400">You haven't registered for any events yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registeredEvents.map((event) => (
              <div key={event._id} className="bg-card-bg rounded-lg overflow-hidden">
                <img src={event.image || 'https://via.placeholder.com/400x200'} alt={event.title} className="w-full h-40 object-cover" />
                <div className="p-5">
                  <h3 className="text-primary-yellow text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-400">📅 {new Date(event.date).toLocaleDateString()} • 🕐 {event.time}</p>
                  <p className="text-sm text-gray-400">📍 {event.location}</p>
                  <p className="text-sm text-gray-400 mb-1">👤 Organizer: {event.organizer?.name || 'Unknown'}</p>
                  <p className="text-sm font-semibold mb-3">Status: {event.status}</p>
                  <p className="text-sm text-gray-400">{event.eventType}</p>
                  <button onClick={() => navigate(`/event/${event._id}`)} type="button" className="mt-3 bg-primary-yellow text-gray-900 px-4 py-2 rounded font-semibold hover:bg-yellow-300 transition">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;