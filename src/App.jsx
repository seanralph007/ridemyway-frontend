import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Navbar from "./components/nav";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./auth/Login";
import Signup from "./auth/SignUp";
import Home from "./pages/Home";
import CreateRide from "./pages/CreateRide";
import RideDetails from "./pages/RideDetails";
import DriverDashboard from "./pages/DriverDashboard";
import PassengerDashboard from "./pages/PassengerDashBoard";
import VerifyEmail from "./pages/VerifyEmail";
import './App.css';

function AppRoutes() {
  const { loading } = useContext(AuthContext);

  if (loading) return <p>Loading session...</p>; // Avoid premature rendering

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/rides/:id" element={<RideDetails />} />
        {/* <Route path="/rides/:id" element={<ProtectedRoute><RideDetails /></ProtectedRoute>} /> */}
        <Route path="/create" element={<ProtectedRoute><CreateRide /></ProtectedRoute>} />
        <Route path="/driver" element={<ProtectedRoute><DriverDashboard /></ProtectedRoute>} />
        <Route path="/passenger" element={<ProtectedRoute><PassengerDashboard /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
