import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { eventService, registrationService } from '../services/apiService';
import { useAuth } from '../context/authContext';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const data = await eventService.getById(id);
      setEvent(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      await registrationService.register(id);
      alert('Successfully registered!');
      setIsRegistered(true);
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-yellow"></div></div>;
  if (!event) return <div className="text-center text-white text-2xl mt-20">Event not found</div>;

  return (
    <div className="min-h-screen p-10">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card-bg rounded-lg overflow-hidden">
          <img src={event.image || 'https://via.placeholder.com/800x300'} alt={event.title} className="w-full h-64 object-cover" />
          <div className="p-8">
            <h1 className="text-white text-4xl font-bold mb-4">{event.title}</h1>
            <p className="text-primary-yellow font-semibold mb-2">Status: {event.status}</p>
            <p className="text-gray-300 mb-2">Date: {new Date(event.date).toLocaleDateString()}</p>
            <p className="text-gray-300 mb-2">Time: {event.time}</p>
            <p className="text-gray-300 mb-4">Location: {event.location}</p>
            <p className="text-white mb-6">{event.description}</p>
            {isAuthenticated && !isRegistered && (
              <button onClick={handleRegister} type="button" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded font-bold transition">
                Register
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;