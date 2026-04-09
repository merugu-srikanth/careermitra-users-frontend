import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/NewLogo.png";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome, FaInfoCircle, FaBlog, FaPhoneAlt,
  FaSignInAlt, FaSignOutAlt, FaTachometerAlt,
  FaLinkedin, FaTwitter, FaWhatsapp, FaInstagram,
  FaFacebook, FaChevronDown, FaTimes, FaBars,
  FaUser, FaEnvelope
} from "react-icons/fa";

const API_BASE = "https://g2u.mavenerp.in/g2uapi/public/api";

/* ─── SOCIAL LINKS ─────────────────────────────────────────────────────────── */
const socials = [
  { Icon: FaLinkedin, href: "#", color: "hover:text-blue-600", label: "LinkedIn" },
  { Icon: FaTwitter, href: "#", color: "hover:text-sky-500", label: "Twitter" },
  { Icon: FaWhatsapp, href: "#", color: "hover:text-green-500", label: "WhatsApp" },
  { Icon: FaInstagram, href: "#", color: "hover:text-pink-500", label: "Instagram" },
  { Icon: FaFacebook, href: "#", color: "hover:text-blue-700", label: "Facebook" },
];

/* ─── NAV LINKS ────────────────────────────────────────────────────────────── */
const navLinks = [
  { name: "HOME", path: "/", Icon: FaHome },
  { name: "ABOUT US", path: "/about-us", Icon: FaInfoCircle },
  { name: "CONTACT US", path: "/contact-us", Icon: FaPhoneAlt },
  { name: "BLOGS", path: "/blogs", Icon: FaBlog },

];

/* ─── AVATAR ───────────────────────────────────────────────────────────────── */
const AvatarSVG = ({ size = 64 }) => (
  <div
    style={{ width: size, height: size }}
    className="rounded-2xl bg-orange-100 overflow-hidden flex items-end justify-center border-2 border-orange-200/50 shrink-0"
  >
    <svg viewBox="0 0 64 72" style={{ width: size }} fill="none">
      <rect x="14" y="42" width="36" height="30" rx="6" fill="#2d3a6b" />
      <path d="M24 42 L32 50 L40 42" stroke="#f97316" strokeWidth="1.5" fill="none" />
      <ellipse cx="32" cy="30" rx="14" ry="16" fill="#f4a674" />
      <ellipse cx="18" cy="30" rx="3" ry="4" fill="#f4a674" />
      <ellipse cx="46" cy="30" rx="3" ry="4" fill="#f4a674" />
      <path d="M18 24 Q32 13 46 24" fill="#f97316" />
      <rect x="21" y="11" width="22" height="14" rx="4" fill="#ea580c" />
      <rect x="15" y="22" width="34" height="4" rx="2" fill="#f97316" />
      <ellipse cx="27" cy="30" rx="2.5" ry="3" fill="white" />
      <ellipse cx="37" cy="30" rx="2.5" ry="3" fill="white" />
      <ellipse cx="27.5" cy="30.5" rx="1.2" ry="1.6" fill="#1e1e1e" />
      <ellipse cx="37.5" cy="30.5" rx="1.2" ry="1.6" fill="#1e1e1e" />
      <path d="M27 37 Q32 41 37 37" stroke="#c0622e" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  </div>
);

/* ─── MAIN NAVBAR ──────────────────────────────────────────────────────────── */
export default function Navbar() {
  const { user, token, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef();

  /* fetch profile */
  useEffect(() => {
    if (!token) return;
    axios
      .get(`${API_BASE}/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setProfileData(res.data.data))
      .catch(console.error);
  }, [token]);

  /* scroll + outside click */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setProfileOpen(false);
    };
    window.addEventListener("scroll", onScroll);
    document.addEventListener("mousedown", onOutside);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", onOutside);
    };
  }, []);

  /* close drawer on route change */
  useEffect(() => setDrawerOpen(false), [location.pathname]);

  /* lock body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const displayName = profileData?.name || user?.name || "User";
  const displayEmail = profileData?.email || user?.email || "";

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      {/* ── TOP BAR (desktop only) ─────────────────────────────────────────── */}
      {/* <div className="hidden md:flex bg-orange-500 text-white text-xs py-1.5 px-6 items-center justify-between">
        <span className="font-medium tracking-wide">
          🎯 Career Mitra — Empowering Youth Through Government Careers
        </span>
        <div className="flex items-center gap-3">
          {socials.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="text-white/80 hover:text-white transition-colors duration-200"
            >
              <Icon size={13} />
            </a>
          ))}
        </div>
      </div> */}

      {/* ── MAIN NAV ───────────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
            ? "bg-white/90 backdrop-blur-md text-orange-500 shadow-md"
            : "bg-transparent"
          }`}
      >
        {/* top accent line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-orange-400 via-orange-500 to-green-500" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between ">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={Logo} alt="Career Mitra" className="w-auto h-20 object-contain py-1" />
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ name, path }) => (
              <Link
                key={name}
                to={path}
                className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${isActive(path)
                    ? "text-orange-500 bg-orange-50"
                    : "text-orange-500 hover:text-orange-500 hover:bg-orange-50"
                  }`}

              >
                {name}
                {isActive(path) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500"
                  />
                )}
              </Link>
            ))}
            {/* DESKTOP RIGHT */}
            <div className="hidden md:flex items-center gap-3">
              {token ? (
                <div
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={() => setProfileOpen(true)}
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-xl transition-all duration-200 shadow-sm shadow-orange-200"
                  >
                    <AvatarSVG size={32} />
                    <span className="text-sm font-bold max-w-[100px] truncate">{displayName}</span>
                    <motion.span animate={{ rotate: profileOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <FaChevronDown size={11} />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden z-50"
                      >
                        {/* profile header */}
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4">
                          <div className="flex items-center gap-3">
                            <AvatarSVG size={52} />
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-black text-base truncate">{displayName}</p>
                              <p className="text-orange-100 text-xs truncate">{displayEmail}</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 space-y-2">
                          <button
                            onClick={() => { navigate("/user-dashboard"); setProfileOpen(false); }}
                            className="w-full flex items-center gap-3 bg-orange-50 hover:bg-orange-100 text-orange-700 py-2.5 px-4 rounded-xl font-semibold text-sm transition-colors duration-200"
                          >
                            <FaTachometerAlt size={14} /> Dashboard
                          </button>
                          <button
                            onClick={() => { logout(navigate); setProfileOpen(false); }}
                            className="w-full flex items-center gap-3 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 px-4 rounded-xl font-semibold text-sm transition-colors duration-200"
                          >
                            <FaSignOutAlt size={14} /> Logout
                          </button>
                        </div>

                        {/* social strip */}
                        <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-center gap-4">
                          {socials.map(({ Icon, href, label, color }) => (
                            <a key={label} href={href} aria-label={label} className={`text-gray-400 ${color} transition-colors duration-200`}>
                              <Icon size={15} />
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full font-semibold text-sm shadow-sm shadow-orange-200 hover:shadow-md hover:shadow-orange-200 transition-all duration-200"
                >
                  <FaSignInAlt size={13} /> Login
                </Link>
              )}
            </div>
          </div>



          {/* MOBILE HAMBURGER */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors duration-200"
            aria-label="Open menu"
          >
            <FaBars size={18} />
          </button>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
            />

            {/* DRAWER PANEL */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-white z-50 md:hidden flex flex-col shadow-2xl"
            >
              {/* DRAWER HEADER */}
              <div className="bg-gradient-to-br from-orange-600 to-orange-400 px-5 pt-1 pb-6 shrink-0">
                <div className="flex items-center justify-between mb">
                  <img src={Logo} alt="Career Mitra" className="w-auto h-20 object-contain " />
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>

                {/* user block or login prompt */}
                {token ? (
                  <div className="flex items-center gap-3 bg-white/15 rounded-2xl p-3">
                    <AvatarSVG size={48} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-black text-base truncate">{displayName}</p>
                      <p className="text-orange-100 text-xs truncate">{displayEmail}</p>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 w-full bg-white text-orange-600 font-bold py-3 rounded-2xl text-sm shadow-sm"
                  >
                    <FaSignInAlt size={14} /> Login to your account
                  </Link>
                )}
              </div>

              {/* DRAWER BODY — scrollable */}
              <div className="flex-1 overflow-y-auto">

                {/* NAV LINKS */}
                <div className="px-4 py-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Navigation</p>
                  <nav className="space-y-1">
                    {navLinks.map(({ name, path, Icon }, i) => (
                      <motion.div
                        key={name}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 + 0.1 }}
                      >
                        <Link
                          to={path}
                          className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 ${isActive(path)
                              ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                              : "text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                            }`}
                        >
                          <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isActive(path) ? "bg-white/20" : "bg-orange-100"}`}>
                            <Icon size={15} className={isActive(path) ? "text-white" : "text-orange-500"} />
                          </span>
                          {name}
                          {isActive(path) && (
                            <span className="ml-auto w-2 h-2 rounded-full bg-white" />
                          )}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </div>

                {/* ACCOUNT ACTIONS (if logged in) */}
                {token && (
                  <div className="px-4 pb-4">
                    <div className="h-px bg-gray-100 mb-4" />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Account</p>
                    <div className="space-y-2">
                      <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
                        <button
                          onClick={() => { navigate("/user-dashboard"); setDrawerOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold text-sm transition-colors duration-200"
                        >
                          <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                            <FaTachometerAlt size={14} className="text-orange-500" />
                          </span>
                          Dashboard
                        </button>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.42 }}>
                        <button
                          onClick={() => { logout(navigate); setDrawerOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm transition-colors duration-200"
                        >
                          <span className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                            <FaSignOutAlt size={14} className="text-red-500" />
                          </span>
                          Logout
                        </button>
                      </motion.div>
                    </div>
                  </div>
                )}

                {/* SOCIAL MEDIA */}
                <div className="px-4 pb-6">
                  <div className="h-px bg-gray-100 mb-4" />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Follow Us</p>
                  <div className="grid grid-cols-5 gap-2">
                    {socials.map(({ Icon, href, label, color }, i) => (
                      <motion.a
                        key={label}
                        href={href}
                        aria-label={label}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.06 + 0.3 }}
                        whileTap={{ scale: 0.9 }}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-gray-50 hover:bg-orange-50 text-gray-400 ${color} transition-all duration-200 group`}
                      >
                        <Icon size={18} />
                        <span className="text-[9px] font-semibold text-gray-400 group-hover:text-orange-400">{label}</span>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>

              {/* DRAWER FOOTER */}
              <div className="shrink-0 border-t border-gray-100 px-5 py-4 bg-gray-50">
                <p className="text-center text-xs text-gray-400 font-medium">
                  © 2026 <span className="text-orange-500 font-bold">Career Mitra</span> · Hyderabad, Telangana
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* spacer so content doesn't go under nav */}
      {/* <div className="h-16 md:h-[4.75rem]" /> */}
    </>
  );
}