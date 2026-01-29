import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/navbar/Navbar';
import HomeContainer from './pages/home_container/HomeContainer';
import Footer from './components/footer/Footer';
import Bus from './pages/bus/Bus';
import Detail from './pages/detail/Detail';
import Checkout from './pages/checkout/Checkout';
import About from './pages/about/About';
import Services from './pages/services/Services';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import MyBookings from './pages/booking/MyBookings';
import Profile from './pages/profile/Profile';

// Admin Imports
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import BusManagement from './pages/admin/BusManagement';
import RouteManagement from './pages/admin/RouteManagement';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Admin Routes (Layout handles its own UI) */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="buses" element={<BusManagement />} />
            <Route path="routes" element={<RouteManagement />} />
          </Route>

          {/* User Routes (Wrapped in Main Layout) */}
          <Route path="/*" element={
            <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-300 flex flex-col overflow-hidden">
              <Navbar />
              <Routes>
                <Route path="/" element={<HomeContainer />} />
                <Route path="/bus" element={<Bus />} />
                <Route path="/bus/:id" element={<Detail />} />
                <Route path="/bus/:id/checkout" element={<Checkout />} />
                <Route path="/bookings/my" element={<MyBookings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
              <Footer />
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;