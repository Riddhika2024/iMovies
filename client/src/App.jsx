import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Core Components
import Header from './components/Header';
import Footer from './components/Footer';
import Loader from './components/Loader';
import UserProtection from './components/UserProtection';
import AdminProtection from './components/AdminProtection';

// Lazy-Loaded Pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Home = lazy(() => import('./pages/Home'));
const MovieDetails = lazy(() => import('./pages/MovieDetails'));
const MovieShows = lazy(() => import('./pages/MovieShows'));
const SeatSlug = lazy(() => import('./pages/SeatSlug'));
const Bookings = lazy(() => import('./pages/Bookings'));
const FavoriteShows = lazy(() => import('./pages/FavoriteShows'));
const Profile = lazy(() => import('./pages/Profile'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AddMovie = lazy(() => import('./pages/AddMovie'));
const AddTheatre = lazy(() => import('./pages/AddTheatre'));
const AddShow = lazy(() => import('./pages/AddShow'));
const AddAdmin = lazy(() => import('./pages/AddAdmin'));
const AdminBookings = lazy(() => import('./pages/AdminBookings'));

// Root Index Redirector
const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? <Navigate to="/home" replace /> : <Navigate to="/landing" replace />;
};

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-[#0A0E17] text-slate-100 font-sans selection:bg-[#00A8E1] selection:text-white">
          <Header />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Suspense fallback={<Loader message="Loading cinematic experience..." />}>
              <Routes>
                {/* Root Route */}
                <Route path="/" element={<RootRedirect />} />

                {/* Public Routes */}
                <Route path="/landing" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* User Protected Routes */}
                <Route
                  path="/home"
                  element={
                    <UserProtection>
                      <Home />
                    </UserProtection>
                  }
                />
                <Route
                  path="/moviedetails/:movieId"
                  element={
                    <UserProtection>
                      <MovieDetails />
                    </UserProtection>
                  }
                />
                <Route
                  path="/movieshows/:movieId"
                  element={
                    <UserProtection>
                      <MovieShows />
                    </UserProtection>
                  }
                />
                <Route
                  path="/seatslug/:showId"
                  element={
                    <UserProtection>
                      <SeatSlug />
                    </UserProtection>
                  }
                />
                <Route
                  path="/bookings"
                  element={
                    <UserProtection>
                      <Bookings />
                    </UserProtection>
                  }
                />
                <Route
                  path="/favoriteshows"
                  element={
                    <UserProtection>
                      <FavoriteShows />
                    </UserProtection>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <UserProtection>
                      <Profile />
                    </UserProtection>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminProtection>
                      <AdminDashboard />
                    </AdminProtection>
                  }
                />
                <Route
                  path="/admin/transactions"
                  element={
                    <AdminProtection>
                      <AdminBookings />
                    </AdminProtection>
                  }
                />
                <Route
                  path="/addmovie"
                  element={
                    <AdminProtection>
                      <AddMovie />
                    </AdminProtection>
                  }
                />
                <Route
                  path="/addtheatre"
                  element={
                    <AdminProtection>
                      <AddTheatre />
                    </AdminProtection>
                  }
                />
                <Route
                  path="/addshow"
                  element={
                    <AdminProtection>
                      <AddShow />
                    </AdminProtection>
                  }
                />
                <Route
                  path="/addadmin"
                  element={
                    <AdminProtection>
                      <AddAdmin />
                    </AdminProtection>
                  }
                />
                <Route
                  path="/adminbookings"
                  element={
                    <AdminProtection>
                      <AdminBookings />
                    </AdminProtection>
                  }
                />

                {/* 404 Catch All */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>

          <Footer />

          {/* Toast Notification Container */}
          <ToastContainer
            position="bottom-right"
            autoClose={3500}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
