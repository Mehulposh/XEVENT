import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userService } from "../services/apiService";

const Admin = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  return (
    <div className="min-h-screen bg-[#292929] text-white">
      <main className="max-w-[1200px] mx-auto px-5 py-10">

        {/* Organizer Requests Button */}
        <div className="flex justify-center mb-8">
          <Link
            to="/admin/organizer-requests"
            className="
              bg-[#d99000]
              hover:bg-[#f0a900]
              text-white
              font-medium
              px-5
              py-2
              rounded-md
              transition-all
              duration-200
            "
          >
            View Organizer Requests
          </Link>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl font-medium mb-3">
          All Users
        </h1>

        {/* Users Table */}
        <div className="w-full overflow-hidden rounded-xl bg-[#1d1d1d]">

          {/* Table Header */}
          <div
            className="
              grid
              grid-cols-[2fr_3fr_1fr_100px]
              border-b
              border-[#ffc400]
              text-[#ffc400]
              font-semibold
            "
          >
            <div className="px-1 py-2">
              Name
            </div>

            <div className="px-1 py-2">
              Email
            </div>

            <div className="px-1 py-2">
              Role
            </div>

            <div className="px-1 py-2">
              Actions
            </div>
          </div>

          {/* Users */}
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="
                  grid
                  grid-cols-[2fr_3fr_1fr_100px]
                  border-b
                  border-[#9b8500]
                  hover:bg-[#252525]
                  transition-colors
                "
              >
                {/* Name */}
                <div className="px-1 py-2">
                  {user.name}
                </div>

                {/* Email */}
                <div className="px-1 py-2 text-gray-300">
                  {user.email}
                </div>

                {/* Role */}
                <div className="px-1 py-2">
                  {user.role}
                </div>

                {/* Action */}
                <div className="px-1 py-2">
                  <Link
                    to={`/admin/users/${user._id}`}
                    className="
                      inline-block
                      bg-[#1769ff]
                      hover:bg-[#367eff]
                      text-white
                      px-2
                      py-1
                      rounded-sm
                      transition-colors
                    "
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="px-5 py-8 text-center text-gray-400">
              No users found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;