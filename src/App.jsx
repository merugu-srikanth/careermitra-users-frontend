import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VerifyOtp from "./pages/RegisterVerify";
import UserProfilePage from "./pages/Userprofilepage";
import ProfileLayout from "./pages/Profilre";
import ScrollToTop from "./ScrollToTop";
import Userprofilefillingpage from "./pages/Userprofilefillingpage";
import Userprofilepage from "./pages/Userprofilepage";
import ProtectedRoute from "./components/ProtectedRoute";
import BlogDetail from "./pages/Blogs/BlogDetail";
import BlogList from "./pages/Blogs/BlogList";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import Contact from "./pages/ContactPage";
import "./App.css"

export default function App() {
  return (
    <AuthProvider>

      <ToastContainer />
      <Router>
        <ScrollToTop />
        <Navbar  />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute>
                <Userprofilepage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-profile-filling"
            element={
              <ProtectedRoute>
                <Userprofilefillingpage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/UserProfile"
            element={
              <ProtectedRoute>
                <ProfileLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs"
            element={
                <BlogList />
            }
          />
          <Route
            path="/blog/:slug"
            element={
                <BlogDetail />
            }
          />
          <Route
            path="/about-us"
            element={
                <AboutPage />
            }
          />
          <Route
            path="/contact-us"
            element={
                <Contact />
            }
          />
          {/* <Route path="/user" element={<ProfileLayout />} /> */}
          <Route path="/latest-govt-jobs" element={<div className="min-h-screen flex items-center justify-center text-2xl font-bold text-gray-700 pt-20">Latest Govt Jobs Page</div>} />
          <Route path="/profile" element={<div className="min-h-screen flex items-center justify-center text-2xl font-bold text-gray-700 pt-20">Profile Page</div>} />
          <Route path="/internship" element={<div className="min-h-screen flex items-center justify-center text-2xl font-bold text-gray-700 pt-20">Internships Page</div>} />
          <Route path="/contact-us" element={<div className="min-h-screen flex items-center justify-center text-2xl font-bold text-gray-700 pt-20">Contact Us Page</div>} />
        </Routes>
        <Footer />

      </Router>
    </AuthProvider>
  );
}