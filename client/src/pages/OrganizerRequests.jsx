import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userService } from "../services/apiService";

const OrganizerRequests = () => {
  const [users, setUsers] = useState([]);

  const fetchRequests = async () => {
    try {
      const data = await userService.getAll();

      const participants = (data.data || []).filter(
        (user) => user.role === "Participant"
      );

      setUsers(participants);
    } catch (err) {
      console.error("Failed to fetch organizer requests:", err);
    }
  };    

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await userService.updateRole(userId, "Organizer");

      alert("User approved as Organizer!");

      fetchRequests();
    } catch (err) {
      console.error("Failed to approve user:", err);
      alert("Failed to approve user");
    }
  };

  const handleReject = (userId) => {
    console.log("Rejected request:", userId);

    // Add your reject API here when available.
    alert("Request rejected");
  };

  return (
    <div className="min-h-screen bg-[#292929] text-white">

      <main className="max-w-[850px] mx-auto px-5 py-10">

        {/* Back */}
        <Link
          to="/admin"
          className="
            inline-block
            mb-8
            text-gray-300
            hover:text-white
            transition-colors
          "
        >
          ← Back
        </Link>

        {/* Heading */}
        <h1
          className="
            text-center
            text-[#ffc400]
            text-3xl
            font-bold
            mb-8
          "
        >
          Organizer Requests
        </h1>

        {/* Empty State */}
        {users.length === 0 ? (
          <div
            className="
              bg-[#1d1d1d]
              rounded-2xl
              p-8
              text-center
              text-gray-400
            "
          >
            No pending organizer requests.
          </div>
        ) : (
          <div className="space-y-6">

            {users.map((user) => (
              <div
                key={user._id}
                className="
                  bg-[#1d1d1d]
                  rounded-2xl
                  px-5
                  py-5
                  flex
                  items-center
                  justify-between
                  shadow-lg
                "
              >

                {/* User Info */}
                <div className="flex items-center gap-4">

                  {/* Avatar */}
                  <div
                    className="
                      w-14
                      h-14
                      rounded-full
                      border-2
                      border-[#ffc400]
                      flex
                      items-center
                      justify-center
                      bg-[#292929]
                      text-white
                      text-xl
                      font-semibold
                      overflow-hidden
                    "
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.name?.charAt(0).toUpperCase()
                    )}
                  </div>

                  {/* Name + Email */}
                  <div>
                    <h2 className="text-white font-semibold text-lg">
                      {user.name}
                    </h2>

                    <p className="text-gray-400 text-sm">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">

                  <button
                    type="button"
                    onClick={() => handleApprove(user._id)}
                    className="
                      bg-[#00b84f]
                      hover:bg-[#00cc59]
                      text-white
                      font-semibold
                      px-5
                      py-2
                      rounded-xl
                      transition-all
                    "
                  >
                    Approve
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReject(user._id)}
                    className="
                      bg-[#ff101c]
                      hover:bg-[#ff2933]
                      text-white
                      font-semibold
                      px-5
                      py-2
                      rounded-xl
                      transition-all
                    "
                  >
                    Reject
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrganizerRequests;