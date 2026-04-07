import { FaBell, FaRegistered, FaRegRegistered, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { HiOutlineArrowRight } from "react-icons/hi";
import { MdNotificationsActive } from "react-icons/md";
import { Link } from "react-router-dom";
import logo from "../assets/NewLogo.png";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 mt-16 shadow-inner">
      
      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* 🔥 BRAND WITH LOGO */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-3 mb-4">
            {/* Logo Circle with Orange Gradient */}
            {/* <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-2 rounded-xl shadow-lg transform transition-transform hover:scale-105 duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div> */}
            <img src={logo} alt="CareerMitra Logo" className="h-28 w-auto" />
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Your gateway to government jobs. Get real-time alerts,
            exam updates, and career guidance across India.
          </p>
          {/* Social Icons */}
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.337-11.93c0-.214-.005-.428-.015-.642.637-.46 1.19-1.035 1.627-1.68z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* 🔗 QUICK LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-lg relative inline-block">
            Quick Links
            <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-orange-500 rounded-full"></span>
          </h3>
          <ul className="space-y-2 text-sm mt-4">
            <li><Link to="/" className="hover:text-orange-400 transition-colors duration-200 flex items-center space-x-2"><span className="text-orange-400">→</span><span>Home</span></Link></li>
            <li><Link to="/blogs" className="hover:text-orange-400 transition-colors duration-200 flex items-center space-x-2"><span className="text-orange-400">→</span><span>Blogs</span></Link></li>
            <li><Link to="/contact-us" className="hover:text-orange-400 transition-colors duration-200 flex items-center space-x-2"><span className="text-orange-400">→</span><span>Contact</span></Link></li>
            <li><Link to="/login" className="hover:text-orange-400 transition-colors duration-200 flex items-center space-x-2"><span className="text-orange-400">→</span><span>Login</span></Link></li>
          </ul>
        </div>

        {/* 📂 CATEGORIES */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-lg relative inline-block">
            Categories
            <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-orange-500 rounded-full"></span>
          </h3>
          <ul className="space-y-2 text-sm mt-4">
            <li className="hover:text-orange-400 cursor-pointer transition-colors duration-200 flex items-center space-x-2"><span className="text-orange-400">•</span><span>10th Pass Jobs</span></li>
            <li className="hover:text-orange-400 cursor-pointer transition-colors duration-200 flex items-center space-x-2"><span className="text-orange-400">•</span><span>12th Pass Jobs</span></li>
            <li className="hover:text-orange-400 cursor-pointer transition-colors duration-200 flex items-center space-x-2"><span className="text-orange-400">•</span><span>Degree Jobs</span></li>
            <li className="hover:text-orange-400 cursor-pointer transition-colors duration-200 flex items-center space-x-2"><span className="text-orange-400">•</span><span>Bank Jobs</span></li>
            <li className="hover:text-orange-400 cursor-pointer transition-colors duration-200 flex items-center space-x-2"><span className="text-orange-400">•</span><span>Defence Jobs</span></li>
          </ul>
        </div>

        {/* 📍 STATES */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-lg relative inline-block">
            Top States
            <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-orange-500 rounded-full"></span>
          </h3>
          <ul className="space-y-2 text-sm mt-4">
            <li className="hover:text-orange-400 cursor-pointer transition-colors duration-200 flex items-center space-x-2"><span className="text-orange-400">•</span><span>Andhra Pradesh</span></li>
            <li className="hover:text-orange-400 cursor-pointer transition-colors duration-200 flex items-center space-x-2"><span className="text-orange-400">•</span><span>Telangana</span></li>
            <li className="hover:text-orange-400 cursor-pointer transition-colors duration-200 flex items-center space-x-2"><span className="text-orange-400">•</span><span>Karnataka</span></li>
            <li className="hover:text-orange-400 cursor-pointer transition-colors duration-200 flex items-center space-x-2"><span className="text-orange-400">•</span><span>Tamil Nadu</span></li>
            <li className="hover:text-orange-400 cursor-pointer transition-colors duration-200 flex items-center space-x-2"><span className="text-orange-400">•</span><span>Maharashtra</span></li>
          </ul>
        </div>
      </div>

     <div className="border-t border-gray-800 py-8 text-center bg-gradient-to-r from-orange-500/10 to-orange-600/10">
  <div className="max-w-3xl mx-auto px-4">

    {/* ICON */}
    <div className="flex justify-center mb-3">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-full animate-pulse">
        <MdNotificationsActive className="text-white text-2xl" />
      </div>
    </div>

    {/* TITLE */}
    <h3 className="text-xl font-bold text-white mb-2 flex justify-center items-center gap-2">
      <FaBell className="text-orange-400" />
      Never Miss an Alert!
    </h3>

    <p className="text-gray-400 mb-6">
      Join thousands of job seekers who get real-time updates on government jobs
    </p>

    {/* MAIN BUTTON */}
    <Link 
      to="/register" 
      className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
    >
      <FaUserPlus className="text-lg" />
      <span className="font-semibold text-lg">
        Register Now - Get Job Alerts
      </span>
      <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
    </Link>

    {/* SMALL LINKS */}
    <div className="flex justify-center gap-6 mt-6 text-sm">

      <Link 
        to="/register" 
        className="text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-2"
      >
        <FaUserPlus />
        <span>Create Account</span>
      </Link>

      <Link 
        to="/login" 
        className="text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-2"
      >
        <FaSignInAlt />
        <span>Existing User? Login</span>
      </Link>

    </div>
  </div>
</div>

      {/* 🔻 BOTTOM */}
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} CareerMitra. All rights reserved.</p>
      </div>
    </footer>
  );
}