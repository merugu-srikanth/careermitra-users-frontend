import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/NewLogo.png"

// ✅ import your AvatarSVG (adjust path)
// import { AvatarSVG } from "../pages/Userprofilepage";
/* ═══════════════ AVATAR ═══════════════ */
const AvatarSVG = ({ size=64 }) => (
  <div style={{width:size,height:size}} className="rounded-2xl bg-orange-100 overflow-hidden flex items-end justify-center border-2 border-orange-200/50 shrink-0">
    <svg viewBox="0 0 64 72" style={{width:size}} fill="none">
      <rect x="14" y="42" width="36" height="30" rx="6" fill="#2d3a6b"/>
      <path d="M24 42 L32 50 L40 42" stroke="#f97316" strokeWidth="1.5" fill="none"/>
      <ellipse cx="32" cy="30" rx="14" ry="16" fill="#f4a674"/>
      <ellipse cx="18" cy="30" rx="3" ry="4" fill="#f4a674"/>
      <ellipse cx="46" cy="30" rx="3" ry="4" fill="#f4a674"/>
      <path d="M18 24 Q32 13 46 24" fill="#f97316"/>
      <rect x="21" y="11" width="22" height="14" rx="4" fill="#ea580c"/>
      <rect x="15" y="22" width="34" height="4" rx="2" fill="#f97316"/>
      <ellipse cx="27" cy="30" rx="2.5" ry="3" fill="white"/>
      <ellipse cx="37" cy="30" rx="2.5" ry="3" fill="white"/>
      <ellipse cx="27.5" cy="30.5" rx="1.2" ry="1.6" fill="#1e1e1e"/>
      <ellipse cx="37.5" cy="30.5" rx="1.2" ry="1.6" fill="#1e1e1e"/>
      <path d="M27 37 Q32 41 37 37" stroke="#c0622e" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    </svg>
  </div>
);

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Latest Jobs", path: "/latest-govt-jobs" },
    { name: "Internships", path: "/internship" },
    { name: "Blogs", path: "/blogs" },
    { name: "Contact", path: "/contact-us" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">

        {/* LOGO */}
        <Link to="/" className="text-xl font-black text-gray-800">
         <img src={Logo}  className="w-40 h-20 py-2"/>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-6">

          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-orange-500 font-medium hover:text-orange-500 transition"
            >
              {link.name}
            </Link>
          ))}

          {/* 🔥 PROFILE SECTION */}
          {token ? (
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >

              {/* AVATAR + NAME */}
              <div
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 cursor-pointer px-3 py-1 rounded-xl hover:bg-orange-50 transition"
              >
                <AvatarSVG size={36} />

                <span className="text-sm font-bold text-gray-800">
                  {user?.name || "User"}
                </span>
              </div>

              {/* 🔥 DROPDOWN CARD */}
              {profileOpen && (
                <div className="absolute right-0 top-11 w-72 bg-white rounded-2xl shadow-xl border border-orange-100 p-4 z-50">

                  {/* USER INFO */}
                  <div className="flex gap-3 items-center mb-4">
                    <AvatarSVG size={56} />

                    <div className="flex-1 min-w-0">
                      <h1 className="text-lg font-black text-gray-800 truncate">
                        {user?.name || "User"}
                      </h1>
                      <p className="text-orange-500 text-xs truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="border-t my-3"></div>

                  {/* DASHBOARD */}
                  <button
                    onClick={() => {
                      navigate("/user-dashboard");
                      setProfileOpen(false);
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl font-semibold mb-2 transition"
                  >
                    Dashboard
                  </button>

                  {/* LOGOUT */}
                  <button
                    onClick={() => {
                      logout(navigate);
                      setProfileOpen(false);
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-orange-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-orange-600 transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="block text-gray-700">
              {link.name}
            </Link>
          ))}

          {token ? (
            <>
              <button
                onClick={() => navigate("/user-dashboard")}
                className="w-full bg-orange-500 text-white py-2 rounded-xl"
              >
                Dashboard
              </button>

              <button
                onClick={() => logout(navigate)}
                className="w-full bg-red-500 text-white py-2 rounded-xl"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block bg-orange-500 text-white py-2 rounded-xl text-center"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}