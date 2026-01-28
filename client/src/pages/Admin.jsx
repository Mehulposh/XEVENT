import React, { useState, useEffect } from 'react';
import { userService } from '../services/apiService';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [showRequests, setShowRequests] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await userService.updateRole(userId, 'Organizer');
      alert('User approved as Organizer!');
      fetchUsers();
    } catch (error) {
      alert('Failed to approve user');
    }
  };

  const handleReject = async (userId) => {
    alert('Request rejected');
  };

  const organizerRequests = users.filter(u => u.role === 'Participant');

  if (showRequests) {
    return (
      <div className="min-h-screen p-10">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setShowRequests(false)} type="button" className="mb-5 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded">
            ← Back
          </button>
          <h1 className="text-primary-yellow text-4xl font-bold mb-8">Organizer Requests</h1>
          {organizerRequests.length === 0 ? (
            <p className="text-gray-400">No pending requests</p>
          ) : (
            <div className="space-y-4">
              {organizerRequests.slice(0, 2).map((user) => (
                <div key={user._id} className="bg-card-bg p-5 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-600 flex items-center justify-center text-white text-xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(user._id)} type="button" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold">Approve</button>
                    <button onClick={() => handleReject(user._id)} type="button" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold">Reject</button>
                  </div>
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
        <div className="flex justify-center gap-8 mb-10">
          <button onClick={() => setShowRequests(true)} type="button" className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded font-bold text-lg">
            View Organizer Requests
          </button>
        </div>

        <h2 className="text-white text-2xl font-semibold mb-6">All Users</h2>
        {loading ? (
          <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-yellow"></div></div>
        ) : (
          <div className="bg-card-bg rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary-bg">
                <tr>
                  <th className="p-4 text-left text-primary-yellow">Name</th>
                  <th className="p-4 text-left text-primary-yellow">Email</th>
                  <th className="p-4 text-left text-primary-yellow">Role</th>
                  <th className="p-4 text-left text-primary-yellow">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t border-border-color">
                    <td className="p-4 text-white">{user.name}</td>
                    <td className="p-4 text-gray-400">{user.email}</td>
                    <td className="p-4 text-white">{user.role}</td>
                    <td className="p-4">
                      <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;