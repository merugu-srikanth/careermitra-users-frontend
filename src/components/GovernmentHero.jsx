import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaArrowRight,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaCalendarAlt,
  FaBuilding,
  FaLandmark,
  FaTrain,
  FaShieldAlt,
  FaChalkboardTeacher,
  FaUniversity,
  FaBriefcase,
  FaShip,
  FaBus,
  FaIndustry,
  FaChevronRight,
  FaStar,
  FaRegStar,
  FaUsers,
  FaRocket,
  FaCertificate,
  FaHandHoldingHeart,
  FaGlobe,
  FaRegCompass,
  FaHeartbeat,
  FaClock
} from "react-icons/fa";
import { MdLocationOn, MdWork, MdSchool, MdSecurity } from "react-icons/md";
import { GiIndiaGate, GiPalmTree, GiHillFort } from "react-icons/gi";
import heroImg from "../assets/bg-images/image.png";


// India Map SVG Component with hover states
const IndiaMap = ({ selectedState, onStateHover, onStateLeave }) => {
  const states = [
    { name: "JAMMU & KASHMIR", path: "M180,80 L200,75 L210,90 L195,100 L175,95 Z", x: 190, y: 85 },
    { name: "HIMACHAL PRADESH", path: "M210,95 L225,90 L235,100 L220,110 L205,105 Z", x: 220, y: 100 },
    { name: "PUNJAB", path: "M200,105 L215,100 L220,115 L205,120 L195,110 Z", x: 208, y: 110 },
    { name: "UTTARAKHAND", path: "M225,105 L240,100 L245,115 L230,120 L220,112 Z", x: 235, y: 112 },
    { name: "HARYANA", path: "M215,120 L230,115 L235,130 L220,135 L210,125 Z", x: 225, y: 125 },
    { name: "DELHI", path: "M220,130 L230,128 L232,138 L222,140 Z", x: 226, y: 134 },
    { name: "RAJASTHAN", path: "M190,140 L215,135 L220,155 L195,160 L185,150 Z", x: 200, y: 148 },
    { name: "UTTAR PRADESH", path: "M230,135 L260,130 L265,155 L235,160 L225,145 Z", x: 245, y: 145 },
    { name: "GUJARAT", path: "M175,170 L200,165 L205,190 L180,195 L170,180 Z", x: 188, y: 180 },
    { name: "MADHYA PRADESH", path: "M215,170 L250,165 L255,195 L220,200 L210,185 Z", x: 235, y: 182 },
    { name: "BIHAR", path: "M265,150 L285,148 L290,165 L270,168 L260,158 Z", x: 275, y: 158 },
    { name: "WEST BENGAL", path: "M295,155 L315,150 L320,175 L300,180 L290,165 Z", x: 305, y: 165 },
    { name: "JHARKHAND", path: "M270,170 L290,168 L295,190 L275,192 L265,180 Z", x: 280, y: 180 },
    { name: "CHHATTISGARH", path: "M250,200 L270,195 L275,220 L255,225 L245,210 Z", x: 260, y: 210 },
    { name: "ODISHA", path: "M285,200 L310,195 L315,225 L290,230 L280,215 Z", x: 298, y: 215 },
    { name: "MAHARASHTRA", path: "M210,210 L250,205 L260,240 L215,245 L205,225 Z", x: 230, y: 225 },
    { name: "TELANGANA", path: "M260,230 L285,225 L290,255 L265,260 L255,245 Z", x: 275, y: 242 },
    { name: "ANDHRA PRADESH", path: "M290,240 L315,235 L320,265 L295,270 L285,255 Z", x: 305, y: 252 },
    { name: "KARNATAKA", path: "M230,255 L265,250 L270,285 L235,290 L225,270 Z", x: 248, y: 270 },
    { name: "GOA", path: "M210,270 L220,268 L222,280 L212,282 Z", x: 216, y: 275 },
    { name: "KERALA", path: "M245,305 L260,300 L265,325 L250,330 L240,315 Z", x: 252, y: 315 },
    { name: "TAMIL NADU", path: "M275,285 L300,280 L305,310 L280,315 L270,295 Z", x: 288, y: 298 },
  ];

  return (
    <svg
      viewBox="0 0 500 400"
      className="w-full h-full"
      style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}
    >
      {/* Map Background */}
      <rect width="500" height="400" fill="rgba(249, 115, 22, 0.05)" rx="16" />

      {/* Ocean Effect */}
      <motion.circle
        cx="250"
        cy="200"
        r="180"
        fill="rgba(59, 130, 246, 0.03)"
        animate={{ scale: [1, 1.02, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* State Paths */}
      {states.map((state) => (
        <g key={state.name}>
          <motion.path
            d={state.path}
            fill={selectedState === state.name ? "#f97316" : "rgba(249, 115, 22, 0.3)"}
            stroke="#f97316"
            strokeWidth={selectedState === state.name ? "2" : "1"}
            strokeOpacity="0.6"
            initial={{ opacity: 0.6 }}
            whileHover={{
              opacity: 1,
              fill: "#f97316",
              strokeWidth: 2.5,
              transition: { duration: 0.2 }
            }}
            onMouseEnter={() => onStateHover(state.name)}
            onMouseLeave={onStateLeave}
            className="cursor-pointer transition-all duration-200"
          />
          <motion.text
            x={state.x}
            y={state.y}
            fontSize="4"
            fill={selectedState === state.name ? "#f97316" : "#9ca3af"}
            className="text-[4px] font-bold cursor-pointer"
            textAnchor="middle"
            opacity={selectedState === state.name ? 1 : 0.5}
            whileHover={{ opacity: 1, fill: "#f97316" }}
            onMouseEnter={() => onStateHover(state.name)}
            onMouseLeave={onStateLeave}
          >
            {state.name.split(" ")[0]}
          </motion.text>
        </g>
      ))}

      {/* India Border Outline */}
      <path
        d="M170,70 L330,60 L370,100 L380,170 L360,250 L400,300 L370,360 L300,380 L200,370 L120,340 L90,280 L80,200 L100,120 L150,80 Z"
        fill="none"
        stroke="#f97316"
        strokeWidth="1.5"
        strokeOpacity="0.4"
        strokeDasharray="4 4"
      />

      {/* Location Pins Animation */}
      <motion.circle
        cx="226"
        cy="134"
        r="3"
        fill="#ef4444"
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </svg>
  );
};

export default function IndiaJobsHero() {
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    { icon: FaUsers, label: "Active Users", value: "10,000+", color: "text-orange-500" },
    { icon: FaBriefcase, label: "Live Jobs", value: "2,500+", color: "text-blue-500" },
    { icon: FaBuilding, label: "Recruiters", value: "500+", color: "text-green-500" },
    { icon: FaStar, label: "Success Rate", value: "94%", color: "text-yellow-500" },
  ];

  const categories = [
    { name: "Central Govt", icon: FaLandmark, color: "from-red-500 to-orange-500", jobs: "1,284" },
    { name: "State Govt", icon: FaBuilding, color: "from-blue-500 to-cyan-500", jobs: "2,156" },
    { name: "PSU Jobs", icon: FaIndustry, color: "from-purple-500 to-pink-500", jobs: "845" },
    { name: "Banking", icon: FaUniversity, color: "from-green-500 to-emerald-500", jobs: "567" },
    { name: "Defence", icon: FaShieldAlt, color: "from-amber-600 to-orange-600", jobs: "432" },
    { name: "Railways", icon: FaTrain, color: "from-sky-500 to-blue-600", jobs: "1,892" },
    { name: "SSC", icon: FaCertificate, color: "from-indigo-500 to-purple-500", jobs: "723" },
    { name: "Teaching", icon: FaChalkboardTeacher, color: "from-teal-500 to-green-500", jobs: "1,045" },
    { name: "And More", icon: FaRocket, color: "from-orange-500 to-red-500", jobs: "3,000+" },
  ];

  const features = [
    { icon: FaCalendarAlt, title: "AGE", description: "Get alerts matching your age criteria", bg: "from-amber-50 to-orange-50" },
    { icon: FaGraduationCap, title: "QUALIFICATION", description: "Find jobs that match your qualifications", bg: "from-blue-50 to-cyan-50" },
    { icon: FaMapMarkerAlt, title: "LOCATION", description: "Get alerts from your preferred locations", bg: "from-green-50 to-emerald-50" },
    { icon: FaHeartbeat, title: "AND MORE", description: "Experience smarter job search", bg: "from-purple-50 to-pink-50" },
  ];

  const handleStateHover = (stateName) => {
    setHoveredState(stateName);
  };

  const handleStateLeave = () => {
    setHoveredState(null);
  };

  return (
    <div className="h-screen overflow-hidden">
      <div className="relative h-full">

        {/* Background Image */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 1, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          <img
            src={heroImg}
            alt="Hero Background"
            className="scale-110 h-screen w-screen object-cover"
          />
        </motion.div>

        {/* Left-side dark overlay so content is readable */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0) 100%)",
          }}
        />

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-orange-400/30 rounded-full"
              initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
              animate={{ y: [null, -100], opacity: [0, 1, 0] }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Main Hero Content — two columns, content only on LEFT side, fits exactly in h-screen */}
        <div className="relative z-10 h-full px-6 md:px-10 lg:px-10 pt-30 overflow-y-auto">
          <div className="flex h-full items-center">
            {/* Left Column — all content here */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-3xl mx-auto lg:mx-0"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 mb-0 w-fit"
              >
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                <span className="text-orange-300 text-xs font-bold tracking-wider">
                  Build Your Future with  Career Opportunities in Government Sector
                </span>
              </motion.div>

             

              {/* Full content panel matching requested image style */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl p-4 md:p-5 shadow-2xl"
              >
                

                {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-5xl font-black text-white leading-tight mb-3"
              >
                Welcome to{" "}
                <span className="bg-linear-to-r from-orange-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
                  Careermitra...
                </span>
              </motion.h1>

                <div className="space-y-3 text-white/90  text-base md:text-s leading-relaxed font-medium ">
                  {[
                    "A fulfilling career begins with informed choices - not forced decisions",
                    "Career mitra empowers you with matching career alerts aligned with your profile",
                    "Career Mitra is very comprehensive and covers diverse fields including administration, research, defence, policy and beyond",
                    "Stay informed with curated insights on internships, upskill programes and opportunities that evolve time to time with dynamic world.",
                    "Career mitra Brings to you various opportunities in the Government sector be it various recruitments, internship opportunities, skill upgradation programmes and alike",

                  ].map((point) => (
                    <div key={point} className="flex items-start gap-2.5 ">
                      <span className="text-[#079a70] text-lg md:text-xl leading-8">✓</span>
                      <p className="">{point}</p>
                    </div>
                  ))}
                </div>

                {/* <div className="mt-6 pt-4 border-t border-[#d2b893] text-[#e27607] text-lg md:text-sm font-semibold flex flex-wrap gap-x-6 gap-y-3">
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full border-2 border-[#079a70] text-[#079a70] text-xs flex items-center justify-center">✓</span>
                    One-Click Applications
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full border-2 border-[#079a70] text-[#079a70] text-xs flex items-center justify-center">✓</span>
                    No Clutter, Just Careers
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full border-2 border-[#079a70] text-[#079a70] text-xs flex items-center justify-center">✓</span>
                    Always in the Loop
                  </span>
                </div> */}

                  <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                    className="flex flex-nowrap gap-3 mt-3 mb-5 overflow-x-auto pb-1"
              >
                {[
                  // { label: "Eligibility Based Alerts", Icon: FaCertificate },
                  { label: "Internship Opportunities", Icon: FaRocket, path: "/internship" },
                  { label: "Skill-Up Opportunities", Icon: FaGraduationCap, path: "/coming-soon" },
                  { label: "Career Counseling", Icon: FaHandHoldingHeart, path: "/coming-soon" },
                ].map(({ label, Icon, path }, i) => (
                  <motion.button
                    key={label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + i * 0.08 }}
                    whileHover={{ y: -3, scale: 1.02 }}
                    onClick={() => navigate(path)}
                    className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 shrink-0"
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-linear-to-br from-orange-400 to-amber-500 text-white shadow-md shrink-0">
                      <Icon className="text-sm" />
                    </div>
                    <span className="text-orange-50 text-xs md:text-sm font-semibold tracking-wide leading-tight">
                      {label}
                    </span>
                  </motion.button>
                ))}
              </motion.div>

                {/* CTA Buttons */}
                <div className="mt-6 flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate("/register")}
                    className="px-6 py-3 rounded-full bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold text-base flex items-center gap-2 shadow-xl shadow-orange-500/25 hover:scale-105 transition-transform"
                  >
                    <FaBell className="animate-pulse" />
                    Get Free Job Alerts
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => navigate("/user-dashboard")}
                    className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold flex items-center gap-2 text-base hover:bg-white/20 transition-all hover:scale-105"
                  >
                    User Dashboard
                    <FaArrowRight />
                  </button>
                </div>
              </motion.div>
            </motion.div>
            {/* END Left Column */}

            {/* Right Column — empty */}
            <div className="hidden lg:block flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}