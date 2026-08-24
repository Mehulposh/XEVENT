import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  eventService,
  registrationService,
} from "../services/apiService";

const Organizer = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [participantsLoading, setParticipantsLoading] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [search, setSearch] = useState("");
  const [eventType, setEventType] = useState("");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const emptyEvent = {
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    eventType: "offline",
    category: "other",
  };

  const [newEvent, setNewEvent] = useState(emptyEvent);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  // --------------------------------------------------
  // FETCH EVENTS
  // --------------------------------------------------

  const fetchMyEvents = async () => {
    try {
      setLoading(true);

      const response = await eventService.getMyEvents();

      setMyEvents(response.data || []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // FETCH PARTICIPANTS
  // --------------------------------------------------

  const fetchParticipants = async (event) => {
    try {
      setParticipantsLoading(true);

      const response =
        await registrationService.getEventParticipants(event._id);

      setParticipants(response.data || []);
      setSelectedEvent(event);
    } catch (error) {
      console.error("Failed to fetch participants:", error);
      alert("Failed to load event registrations.");
    } finally {
      setParticipantsLoading(false);
    }
  };

  // --------------------------------------------------
  // CREATE EVENT
  // --------------------------------------------------

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    try {
      await eventService.create(newEvent);

      alert("Event created successfully!");

      setShowCreateModal(false);
      setNewEvent(emptyEvent);

      await fetchMyEvents();
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Failed to create event.");
    }
  };

  // --------------------------------------------------
  // DELETE EVENT
  // --------------------------------------------------

  const handleDeleteEvent = async (eventId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    try {
      await eventService.delete(eventId);

      alert("Event deleted successfully!");

      await fetchMyEvents();
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Failed to delete event.");
    }
  };

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------

  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  // --------------------------------------------------
  // EVENT STATUS
  // --------------------------------------------------

  const getEventStatus = (event) => {
    if (!event.date) return "Upcoming";

    const eventDate = new Date(event.date);
    const today = new Date();

    eventDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (eventDate > today) {
      return "Upcoming";
    }

    if (eventDate.getTime() === today.getTime()) {
      return "Ongoing";
    }

    return "Completed";
  };

  // --------------------------------------------------
  // STATUS COLOR
  // --------------------------------------------------

  const getStatusClass = (status) => {
    if (status === "Completed") {
      return "text-gray-400";
    }

    if (status === "Ongoing") {
      return "text-blue-400";
    }

    return "text-green-400";
  };

  // --------------------------------------------------
  // FILTER + SORT
  // --------------------------------------------------

  const filteredEvents = [...myEvents]
    .filter((event) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        !search ||
        event.title?.toLowerCase().includes(searchText) ||
        event.description?.toLowerCase().includes(searchText);

      const matchesType =
        !eventType ||
        event.category?.toLowerCase() === eventType.toLowerCase() ||
        event.eventType?.toLowerCase() === eventType.toLowerCase();

      const matchesLocation =
        !location ||
        event.location?.toLowerCase().includes(location.toLowerCase());

      return matchesSearch && matchesType && matchesLocation;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();

      if (sortBy === "oldest") {
        return dateA - dateB;
      }

      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }

      return dateB - dateA;
    });

  // ==================================================
  // REGISTRATIONS SCREEN
  // ==================================================

  if (selectedEvent) {
    return (
      <div className="min-h-screen bg-[#292929] text-white px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[950px]">

          {/* Back */}
          <button
            type="button"
            onClick={() => {
              setSelectedEvent(null);
              setParticipants([]);
            }}
            className="mb-7 rounded-lg bg-[#555] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#666]"
          >
            ← Back to Events
          </button>

          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-[#ffc400] sm:text-4xl">
              Event Registrations
            </h1>

            <p className="mt-2 text-gray-400">
              {selectedEvent.title}
            </p>
          </div>

          {/* Loading */}
          {participantsLoading ? (
            <div className="rounded-2xl bg-[#1d1d1d] py-16 text-center">
              <p className="text-gray-400">
                Loading registrations...
              </p>
            </div>
          ) : participants.length === 0 ? (
            <div className="rounded-2xl bg-[#1d1d1d] py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#292929] text-2xl">
                👥
              </div>

              <h2 className="text-xl font-semibold">
                No participants yet
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                Nobody has registered for this event yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {participants.map((participant) => {
                const participantUser = participant.user || {};

                const name =
                  participantUser.name || "Unknown User";

                const initial =
                  name.charAt(0).toUpperCase();

                return (
                  <div
                    key={
                      participant._id ||
                      participantUser._id
                    }
                    className="flex flex-col gap-4 rounded-2xl bg-[#1d1d1d] px-5 py-5 shadow-lg sm:flex-row sm:items-center sm:justify-between"
                  >
                    {/* Participant */}
                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#ffc400] bg-[#292929]">
                        {participantUser.avatar ? (
                          <img
                            src={participantUser.avatar}
                            alt={name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-semibold text-white">
                            {initial}
                          </span>
                        )}
                      </div>

                      <div>
                        <h2 className="font-semibold text-white">
                          {name}
                        </h2>

                        <p className="text-sm text-gray-400">
                          {participantUser.email ||
                            "No email available"}
                        </p>

                        {participant.registeredAt && (
                          <p className="text-xs text-gray-500">
                            Registered:{" "}
                            {new Date(
                              participant.registeredAt
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <span className="w-fit rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white">
                      Active
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================================================
  // ORGANIZER DASHBOARD
  // ==================================================

  return (
    <div className="min-h-screen bg-[#292929] text-white">

      <main className="mx-auto max-w-[1450px] px-5 py-8 sm:px-8 lg:px-10">

        {/* ------------------------------------------ */}
        {/* HEADER */}
        {/* ------------------------------------------ */}

        <div className="mb-6 text-center">

          <h1 className="text-4xl font-bold text-[#ffc400] sm:text-5xl">
            Welcome Organizer!
          </h1>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="mt-8 rounded-xl bg-[#00a83b] px-7 py-3 text-base font-bold text-white shadow-md transition hover:bg-[#00c247]"
          >
            + Create New Event
          </button>

        </div>

        {/* ------------------------------------------ */}
        {/* SEARCH / FILTER */}
        {/* ------------------------------------------ */}

        <div className="mb-10 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-center">

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="h-12 w-full rounded-lg border-2 border-[#ffc400] bg-[#292929] px-4 text-white outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#ffc400] lg:w-[260px]"
          />

          <input
            type="text"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            placeholder="Event type (e.g. Music)"
            className="h-12 w-full rounded-lg border-2 border-[#ffc400] bg-[#292929] px-4 text-white outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#ffc400] lg:w-[260px]"
          />

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="h-12 w-full rounded-lg border-2 border-[#ffc400] bg-[#292929] px-4 text-white outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#ffc400] lg:w-[260px]"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-12 w-full rounded-lg border-2 border-[#ffc400] bg-[#292929] px-4 text-white outline-none lg:w-[260px]"
          >
            <option value="newest">
              Sort by Newest
            </option>

            <option value="oldest">
              Sort by Oldest
            </option>

            <option value="title">
              Sort by Title
            </option>
          </select>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setEventType("");
              setLocation("");
              setSortBy("newest");
            }}
            className="h-12 rounded-lg bg-[#ffc400] px-7 font-bold text-black transition hover:bg-[#ffd43b]"
          >
            Search
          </button>

        </div>

        {/* ------------------------------------------ */}
        {/* LOADING */}
        {/* ------------------------------------------ */}

        {loading ? (
          <div className="py-20 text-center">
            <p className="text-gray-400">
              Loading your events...
            </p>
          </div>
        ) : filteredEvents.length === 0 ? (

          <div className="rounded-2xl bg-[#1d1d1d] py-20 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#292929] text-2xl">
              📅
            </div>

            <h2 className="text-xl font-semibold">
              No events found
            </h2>

            <p className="mt-2 text-gray-400">
              Create your first event or change your search filters.
            </p>
          </div>

        ) : (

          /* ---------------------------------------- */
          /* EVENT GRID */
          /* ---------------------------------------- */

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

            {filteredEvents.map((event) => {

              const status = getEventStatus(event);

              return (
                <div
                  key={event._id}
                  className="flex min-h-[210px] flex-col rounded-2xl bg-[#1d1d1d] p-6 shadow-lg transition duration-200 hover:-translate-y-1 hover:bg-[#202020]"
                >

                  {/* Title */}
                  <h2 className="mb-5 text-2xl font-bold text-[#ffc400]">
                    {event.title}
                  </h2>

                  {/* Date */}
                  <div className="mb-4">
                    <span className="text-sm text-gray-300">
                      Date:{" "}
                    </span>

                    <span className="text-sm text-gray-200">
                      {formatDate(event.date)}
                    </span>

                    {event.time && (
                      <span className="text-sm text-gray-300">
                        {" "}
                        | {event.time}
                      </span>
                    )}
                  </div>

                  {/* Location */}
                  {event.location && (
                    <div className="mb-3 text-sm text-gray-300">
                      Location: {event.location}
                    </div>
                  )}

                  {/* Status */}
                  <div className="mb-6">
                    <span className="text-sm text-gray-300">
                      Status:{" "}
                    </span>

                    <span
                      className={`text-sm font-semibold ${getStatusClass(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex flex-wrap gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        fetchParticipants(event)
                      }
                      className="rounded-xl bg-[#1769ff] px-5 py-2.5 font-semibold text-white transition hover:bg-[#367eff]"
                    >
                      View
                    </button>

                    <Link
                      to={`/organizer/events/${event._id}/edit`}
                      className="rounded-xl bg-[#ffc400] px-5 py-2.5 font-semibold text-black transition hover:bg-[#ffd43b]"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteEvent(event._id)
                      }
                      className="rounded-xl bg-[#f20b16] px-5 py-2.5 font-semibold text-white transition hover:bg-[#ff2630]"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </main>

      {/* ================================================== */}
      {/* CREATE EVENT MODAL */}
      {/* ================================================== */}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-[#1d1d1d] p-6 shadow-2xl sm:p-8">

            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-2xl font-bold text-[#ffc400]">
                Create New Event
              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowCreateModal(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#333] text-xl text-gray-300 transition hover:bg-[#444] hover:text-white"
              >
                ×
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleCreateEvent}
              className="space-y-5"
            >

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-200">
                  Event Title
                </label>

                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter event title"
                  className="w-full rounded-lg border border-[#555] bg-[#292929] px-4 py-3 text-white outline-none focus:border-[#ffc400]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-200">
                  Description
                </label>

                <textarea
                  required
                  rows="4"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe your event..."
                  className="w-full resize-none rounded-lg border border-[#555] bg-[#292929] px-4 py-3 text-white outline-none focus:border-[#ffc400]"
                />
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-200">
                    Date
                  </label>

                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        date: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-[#555] bg-[#292929] px-4 py-3 text-white outline-none focus:border-[#ffc400]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-200">
                    Time
                  </label>

                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        time: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-[#555] bg-[#292929] px-4 py-3 text-white outline-none focus:border-[#ffc400]"
                  />
                </div>

              </div>

              {/* Location */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-200">
                  Location
                </label>

                <input
                  type="text"
                  required
                  value={newEvent.location}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      location: e.target.value,
                    })
                  }
                  placeholder="Event location"
                  className="w-full rounded-lg border border-[#555] bg-[#292929] px-4 py-3 text-white outline-none focus:border-[#ffc400]"
                />
              </div>

              {/* Event Type + Category */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-200">
                    Event Type
                  </label>

                  <select
                    value={newEvent.eventType}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        eventType: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-[#555] bg-[#292929] px-4 py-3 text-white outline-none focus:border-[#ffc400]"
                  >
                    <option value="offline">
                      Offline
                    </option>

                    <option value="online">
                      Online
                    </option>

                    <option value="hybrid">
                      Hybrid
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-200">
                    Category
                  </label>

                  <select
                    value={newEvent.category}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        category: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-[#555] bg-[#292929] px-4 py-3 text-white outline-none focus:border-[#ffc400]"
                  >
                    <option value="other">
                      Other
                    </option>

                    <option value="music">
                      Music
                    </option>

                    <option value="sports">
                      Sports
                    </option>

                    <option value="technology">
                      Technology
                    </option>

                    <option value="business">
                      Business
                    </option>

                    <option value="education">
                      Education
                    </option>

                    <option value="entertainment">
                      Entertainment
                    </option>
                  </select>
                </div>

              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowCreateModal(false)
                  }
                  className="rounded-xl bg-[#444] px-6 py-3 font-semibold text-white transition hover:bg-[#555]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[#00a83b] px-6 py-3 font-semibold text-white transition hover:bg-[#00c247]"
                >
                  Create Event
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Organizer;