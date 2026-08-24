import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Organizer from './pages/Organizer';
import OrganizerRequests from "./pages/OrganizerRequests";
import Admin from './pages/Admin';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/events" />;
};

const OrganizerRoute = ({ children }) => {
  const { isOrganizer } = useAuth();
  return isOrganizer ? children : <Navigate to="/events" />;
};

function AppContent() {
  return (
    
    <Routes>
   
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />

  {/* Cypress tests expect /events */}
  <Route path="/events" element={<Events />} />

  {/* Keep existing route */}
  <Route path="/explore" element={<Events />} />

  <Route path="/event/:id" element={<EventDetail />} />

  <Route
    path="/dashboard"
    element={
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    }
  />

  <Route
    path="/profile"
    element={
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    }
  />

  <Route
    path="/organizer"
    element={
      <OrganizerRoute>
        <Organizer />
      </OrganizerRoute>
    }
  />

  <Route
    path="/admin"
    element={
      <AdminRoute>
        <Admin />
      </AdminRoute>
    }
  />

  <Route
  path="/admin/organizer-requests"
  element={
  <AdminRoute>
  <OrganizerRequests />
  </AdminRoute>
  }
/>
</Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <AppContent />
    </AuthProvider>
  );
}

export default App;

