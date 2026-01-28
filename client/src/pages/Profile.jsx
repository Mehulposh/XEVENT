import React, { useState } from 'react';
import { useAuth } from '../context/authContext';
import { userService } from '../services/apiService';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const getInitial = (name) => name?.charAt(0).toUpperCase() || 'A';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const data = await userService.updateProfile({ name: formData.name });
      updateUser(data.data);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleRequest = () => {
    alert('Role change request sent to admin!');
  };

  return (
    <div className="min-h-screen p-10">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card-bg rounded-lg p-10">
          <h2 className="text-primary-yellow text-4xl font-bold text-center mb-8">Your Profile</h2>
          
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center text-white text-4xl font-bold">
              {getInitial(user?.name)}
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-white text-xl font-semibold">{user?.name}</p>
            <p className="text-gray-400">{user?.email}</p>
          </div>

          {message && <div className={`p-3 rounded mb-5 text-center ${message.includes('success') ? 'bg-green-600' : 'bg-red-600'} text-white`}>{message}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-300 mb-2">Name</label>
              <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-input-bg border-2 border-primary-yellow rounded text-white focus:outline-none focus:border-yellow-300" />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input type="email" name="email" value={formData.email} readOnly className="w-full p-3 bg-input-bg border-2 border-primary-yellow rounded text-white focus:outline-none" />
            </div>

            <button type="button" className="w-full bg-input-bg text-white p-3 rounded font-semibold hover:bg-opacity-80 transition">
              Change Avatar
            </button>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 transition disabled:opacity-60">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>

            <div className="text-center pt-4">
              <p className="text-gray-300 mb-3">Role: <span className="font-semibold">{user?.role}</span></p>
              {user?.role === 'Participant' && (
                <button type="button" onClick={handleRoleRequest} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold transition">
                  Request Organizer Role
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;