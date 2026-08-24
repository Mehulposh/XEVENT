import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/authContext";

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const getInitial = () => {
    return user?.name?.charAt(0)?.toUpperCase() || "A";
  };

  const handleSave = async () => {
    const updatedUser = {
      ...user,
      name,
      email,
    };

    updateUser(updatedUser);

    // Keep your existing API update call here.
    // await userService.updateProfile({ name, email });

    alert("Profile updated successfully");
  };

  return (
    <div className="min-h-screen bg-[#292929] text-white">
      
      <main className="flex justify-center px-5 py-9 mt-6">
        <div className="w-full max-w-[730px] bg-[#1d1d1d] rounded-lg shadow-xl px-8 py-8">
          
          {/* Heading */}
          <h1 className="text-center text-[#ffc400] text-[30px] font-bold mb-5">
            Your Profile
          </h1>

          {/* Avatar */}
          <div className="flex flex-col items-center mb-7">
            <div className="w-[108px] h-[108px] rounded-full bg-[#65a832] border-[3px] border-[#ffc400] flex items-center justify-center">
              <span className="text-white text-5xl font-normal">
                {getInitial()}
              </span>
            </div>

            <h2 className="text-lg mt-3 font-medium">
              {user?.name}
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              {user?.email}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            
            <div>
              <label className="block text-sm font-semibold mb-2">
                Name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 px-3 bg-[#202b3d] border border-[#ffc400] rounded-md text-white outline-none focus:ring-2 focus:ring-[#ffc400]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Email
              </label>

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-3 bg-[#202b3d] border border-[#ffc400] rounded-md text-white outline-none focus:ring-2 focus:ring-[#ffc400]"
              />
            </div>

            {/* Change Avatar */}
            <button
              className="w-full h-12 bg-[#28283f] border border-[#41415a] hover:bg-[#32324d] rounded-md transition font-medium"
            >
              Change Avatar
            </button>

            {/* Save */}
            <button
              onClick={handleSave}
              className="w-full h-12 bg-[#2167f5] hover:bg-[#3477ff] rounded-md transition font-semibold"
            >
              Save Changes
            </button>
          </div>

          {/* Role */}
          <div className="text-center mt-6 text-gray-400">
            Role:{" "}
            <span className="text-white font-semibold">
              {user?.role}
            </span>
          </div>

          {/* Organizer Request */}
          {user?.role === "Participant" && (
            <div className="flex justify-center mt-4">
              <button className="bg-[#00a83b] hover:bg-[#00c247] px-5 py-2.5 rounded-md font-medium transition">
                Request Organizer Role
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;