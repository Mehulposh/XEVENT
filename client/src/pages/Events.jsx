import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/apiService';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const statusClass =
    event.status === 'Upcoming'
      ? 'text-[#00e676]'
      : event.status === 'Ongoing'
        ? 'text-[#ff5252]'
        : 'text-[#a0a0a0]';

  return (
    <article
      onClick={() => navigate(`/event/${event._id}`)}
      className="
        cursor-pointer
        overflow-hidden
        rounded-[14px]
        bg-[#1f1f1f]
        shadow-[0_8px_24px_rgba(0,0,0,0.16)]
        transition
        duration-200
        hover:-translate-y-1
        hover:bg-[#222]
      "
    >

      <img
        src={
          event.image ||
          'https://via.placeholder.com/400x200'
        }
        alt={event.title}
        className="
          mx-6
          mt-6
          h-[185px]
          w-[calc(100%-48px)]
          rounded-[7px]
          object-cover
        "
      />

      <div className="px-6 pb-6 pt-5">

        <h2 className="
          text-[22px]
          font-extrabold
          leading-tight
          text-primary-yellow
        ">
          {event.title}
        </h2>

        <p className="
          mt-2
          text-[14px]
          text-white/80
        ">
          {new Date(event.date).toLocaleDateString()}
          {' | '}
          {event.time}
        </p>

        <p className="
          mt-2
          line-clamp-2
          text-[15px]
          leading-5
          text-white/90
        ">
          {event.description}
        </p>

        <p className="
          mt-2
          text-[14px]
          text-[#42a5f5]
        ">
          {event.location}
        </p>

        <p
          className={`
            mt-2
            text-[15px]
            font-bold
            ${statusClass}
          `}
        >
          {event.status}
        </p>

      </div>

    </article>
  );
};

const Explore = () => {
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: '',
    eventType: '',
    location: '',
    sort: 'Sort by Newest'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const params = {};

      if (filters.search) {
        params.search = filters.search;
      }

      if (filters.eventType) {
        params.category = filters.eventType;
      }

      if (filters.location) {
        params.location = filters.location;
      }

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
    <main className="min-h-screen px-6 py-12">

      <div className="page-container">

        {/* Heading */}

        <h1
          className="
            text-center
            text-[38px]
            font-extrabold
            leading-none
            text-primary-yellow
            sm:text-[42px]
          "
        >
          Explore Events
        </h1>

        {/* Search */}

        <form
          onSubmit={handleSearch}
          className="
            mx-auto
            mt-11
            grid
            max-w-[1120px]
            grid-cols-1
            gap-4
            md:grid-cols-2
            lg:grid-cols-[1.25fr_1.25fr_1.25fr_1.25fr_auto]
          "
        >

          <input
            type="text"
            placeholder="Search events..."
            value={filters.search}
            onChange={(e) =>
              setFilters({
                ...filters,
                search: e.target.value
              })
            }
            className="form-input h-[49px]"
          />

          <input
            type="text"
            placeholder="Event type (e.g. Music)"
            value={filters.eventType}
            onChange={(e) =>
              setFilters({
                ...filters,
                eventType: e.target.value
              })
            }
            className="form-input h-[49px]"
          />

          <input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={(e) =>
              setFilters({
                ...filters,
                location: e.target.value
              })
            }
            className="form-input h-[49px]"
          />

          <select
            value={filters.sort}
            onChange={(e) =>
              setFilters({
                ...filters,
                sort: e.target.value
              })
            }
            className="form-select h-[49px]"
          >
            <option>
              Sort by Newest
            </option>

            <option>
              Sort by Oldest
            </option>
          </select>

          <button
            type="submit"
            className="
              primary-button
              h-[49px]
              px-7
              lg:w-auto
            "
          >
            Search
          </button>

        </form>

        {/* Loading */}

        {loading ? (

          <div className="flex justify-center py-20">

            <div
              className="
                h-12
                w-12
                animate-spin
                rounded-full
                border-4
                border-primary-yellow
                border-t-transparent
              "
            />

          </div>

        ) : events.length === 0 ? (

          <p className="
            py-16
            text-center
            text-xl
            text-white/60
          ">
            No events found
          </p>

        ) : (

          <div className="
            mt-11
            grid
            grid-cols-1
            gap-6
            md:grid-cols-2
            xl:grid-cols-3
          ">

            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
              />
            ))}

          </div>

        )}

      </div>

    </main>
  );
};

export default Explore;