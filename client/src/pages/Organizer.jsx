import React, { useState, useEffect } from 'react';
import { eventService, registrationService } from '../services/apiService';
import { useAuth } from '../context/authContext';

const Organizer = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', time: '', location: '', eventType: 'offline', category: 'other' });
  const { user } = useAuth();

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const data = await eventService.getMyEvents();
      setMyEvents(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async (eventId) => {
    try {
      const data = await registrationService.getEventParticipants(eventId);
      setParticipants(data.data || []);
      setSelectedEvent(eventId);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await eventService.create(newEvent);
      alert('Event created successfully!');
      setShowCreateModal(false);
      fetchMyEvents();
      setNewEvent({ title: '', description: '', date: '', time: '', location: '', eventType: 'offline', category: 'other' });
    } catch (error) {
      alert('Failed to create event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.delete(eventId);
        alert('Event deleted!');
        fetchMyEvents();
      } catch (error) {
        alert('Failed to delete event');
      }
    }
  };

  if (selectedEvent) {
    return (
      <div className="min-h-screen p-10">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setSelectedEvent(null)} type="button" className="mb-5 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded">
            ← Back to Events
          </button>
          <h1 className="text-primary-yellow text-4xl font-bold mb-8">Event Registrations</h1>
          {participants.length === 0 ? (
            <p className="text-gray-400">No participants yet</p>
          ) : (
            <div className="space-y-4">
              {participants.map((p) => (
                <div key={p.user._id} className="bg-card-bg p-5 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white text-xl font-bold">
                      {p.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{p.user.name}</p>
                      <p className="text-gray-400 text-sm">{p.user.email}</p>
                      <p className="text-gray-400 text-sm">Registered: {new Date(p.registeredAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="bg-green-600 text-white px-4 py-2 rounded font-semibold">Active</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-primary-yellow text-4xl font-bold text-center mb-8">Welcome Organizer!</h1>
        
        <div className="text-center mb-8">
          <button onClick={() => setShowCreateModal(true)} type="button" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-bold text-lg transition">
            + Create New Event
          </button>
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-5">
            <div className="bg-card-bg rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-primary-yellow text-3xl font-bold mb-6">Create New Event</h2>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <input type="text" name="title" placeholder="Event Title" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} required className="w-full p-3 bg-input-bg border-2 border-border-color rounded text-white" />
                <textarea name="description" placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} required className="w-full p-3 bg-input-bg border-2 border-border-color rounded text-white h-32" />
                <input type="date" name="date" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} required className="w-full p-3 bg-input-bg border-2 border-border-color rounded text-white" />
                <input type="time" name="time" value={newEvent.time} onChange={(e) => setNewEvent({...newEvent, time: e.target.value})} required className="w-full p-3 bg-input-bg border-2 border-border-color rounded text-white" />
                <input type="text" name="location" placeholder="Location" value={newEvent.location} onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} required className="w-full p-3 bg-input-bg border-2 border-border-color rounded text-white" />
                <select name="eventType" value={newEvent.eventType} onChange={(e) => setNewEvent({...newEvent, eventType: e.target.value})} className="w-full p-3 bg-input-bg border-2 border-border-color rounded text-white">
                  <option value="offline">Offline</option>
                  <option value="online">Online</option>
                </select>
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white p-3 rounded font-bold">Create</button>
                  <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 bg-red-600 hover:bg-red-700 text-white p-3 rounded font-bold">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-yellow"></div></div>
        ) : myEvents.length === 0 ? (
          <p className="text-center text-gray-400">No events yet. Create your first event!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEvents.map((event) => (
              <div key={event._id} className="bg-card-bg rounded-lg overflow-hidden">
                <div className="p-5">
                  <h3 className="text-primary-yellow text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">Date: {new Date(event.date).toLocaleDateString()}</p>
                  <p className="text-sm font-semibold mb-3">Status: {event.status}</p>
                  <div className="flex gap-2">
                    <button onClick={() => fetchParticipants(event._id)} type="button" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-semibold">View</button>
                    <button type="button" className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded text-sm font-semibold">Edit</button>
                    <button onClick={() => handleDeleteEvent(event._id)} type="button" className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-semibold">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Organizer;