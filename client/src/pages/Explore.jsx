import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/apiService';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card-bg rounded-lg overflow-hidden hover:transform hover:scale-105 transition cursor-pointer" onClick={() => navigate(`/event/${event._id}`)}>
      <img src={event.image || 'https://via.placeholder.com/400x200'} alt={event.title} className="w-full h-48 object-cover" />
      <div className="p-5">
        <h3 className="text-primary-yellow text-xl font-bold mb-2">{event.title}</h3>
        <p className="text-sm text-gray-400 mb-1">{new Date(event.date).toLocaleDateString()} | {event.time}</p>
        <p className="text-sm text-gray-300 mb-3 line-clamp-2">{event.description}</p>
        <p className="text-sm text-gray-400">{event.location}</p>
        <span className={`inline-block mt-3 px-3 py-1 rounded text-sm font-semibold ${
          event.status === 'Upcoming' ? 'bg-green-600' : event.status === 'Ongoing' ? 'bg-red-600' : 'bg-gray-600'
        }`}>
          {event.status}
        </span>
      </div>
    </div>
  );
};

const Explore = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', eventType: '', location: '', sort: 'Sort by Newest' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.eventType) params.category = filters.eventType;
      if (filters.location) params.location = filters.location;
      const data = await eventService.getAll(params);
      setEvents(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <div className="min-h-screen p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-primary-yellow text-5xl font-bold text-center mb-10">Explore Events</h1>

        <form onSubmit={handleSearch} className="grid grid-cols-5 gap-4 mb-10">
          <input type="text" name="search" placeholder="Search events..." value={filters.search} onChange={(e) => setFilters({...filters, search: e.target.value})} className="p-3 bg-input-bg border-2 border-border-color rounded text-white placeholder-gray-400 focus:outline-none focus:border-primary-yellow" />
          <input type="text" name="eventType" placeholder="Event type (e.g. Music)" value={filters.eventType} onChange={(e) => setFilters({...filters, eventType: e.target.value})} className="p-3 bg-input-bg border-2 border-border-color rounded text-white placeholder-gray-400 focus:outline-none focus:border-primary-yellow" />
          <input type="text" name="location" placeholder="Location" value={filters.location} onChange={(e) => setFilters({...filters, location: e.target.value})} className="p-3 bg-input-bg border-2 border-border-color rounded text-white placeholder-gray-400 focus:outline-none focus:border-primary-yellow" />
          <input type="text" name="sort" placeholder="Sort by Newest" value={filters.sort} readOnly className="p-3 bg-input-bg border-2 border-border-color rounded text-white placeholder-gray-400" />
          <button type="submit" className="bg-primary-yellow text-gray-900 rounded font-bold hover:bg-yellow-300 transition">Search</button>
        </form>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-yellow"></div></div>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-400 text-xl">No events found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => <EventCard key={event._id} event={event} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;