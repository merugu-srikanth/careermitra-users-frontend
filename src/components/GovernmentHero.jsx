import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/bg-images/image.png";

/* ─── Inline SVG icons ─────────────────────────────────────────────────── */
const Ic = {
  bell: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  arrow: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  rocket: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
  grad: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  heart: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  bulb: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>,
  target: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  globe: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  grid: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
};

/* ─── Feature data ─────────────────────────────────────────────────────── */
const FEATURES = [
  { label: "Internship Opportunities", sub: "Govt. internships near you",     icon: Ic.rocket, accent: "#f97316", path: "/internship"  },
  { label: "Skill-Up Opportunities",   sub: "Top upskilling programmes",      icon: Ic.grad,   accent: "#3b82f6", path: "/coming-soon" },
  { label: "Career Counseling",        sub: "Free expert guidance",           icon: Ic.heart,  accent: "#10b981", path: "/coming-soon" },
  { label: "Informed Choices",         sub: "Data-backed career clarity",     icon: Ic.bulb,   accent: "#f59e0b", path: "/coming-soon" },
  { label: "Matching Alerts",          sub: "Age & qualification-based",      icon: Ic.target, accent: "#8b5cf6", path: "/coming-soon" },
  { label: "Diverse Fields",           sub: "Admin, defence, policy & more",  icon: Ic.globe,  accent: "#ec4899", path: "/coming-soon" },
];

/* ─── Hub-Spoke Column Component ───────────────────────────────────────── */
function HubSpoke({ onNav }) {
  const [vis, setVis] = useState([]);
  const [hov, setHov] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    FEATURES.forEach((_, i) =>
      setTimeout(() => setVis((v) => [...v, i]), 160 + i * 200)
    );
  }, [inView]);

  /* SVG coordinate constants */
  const VW = 420;
  const hubX = 52, hubR = 42;

  const pillH = 58, pillGap = 10;
  const pillX = hubX + hubR + 20;  /* spoke start */
  const pillW = VW - pillX - 8;
  const capW  = 58;
  const totalH = FEATURES.length * (pillH + pillGap) - pillGap;
  const hubY = Math.round(totalH / 2 + 24);
  const VH   = totalH + 48;

  return (
    <div ref={ref} className="w-full">
      <svg
        viewBox={`170 20 ${VW} ${VH}`}
        className="w-full h-auto"
        style={{ overflow: "visible" }}
      >
        {/* ── Hub pulse rings ── */}
        {[34, 24, 34].map((d, ri) => (
          <circle key={ri} cx={hubX} cy={hubY} r={hubR + d}
            fill="none" stroke="#f97316" strokeWidth="0.7"
            strokeOpacity={0.22 - ri * 0.06}
          >
            <animate attributeName="r"
              values={`${hubR+d};${hubR+d+8};${hubR+d}`}
              dur={`${2.8 + ri * 0.7}s`} repeatCount="indefinite" />
            <animate attributeName="stroke-opacity"
              values={`${0.22 - ri*0.06};0.03;${0.22 - ri*0.06}`}
              dur={`${2.8 + ri * 0.7}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Hub body */}
        <circle cx={hubX} cy={hubY} r={hubR + 5}
          fill="none" stroke="#f97316" strokeWidth="1" strokeOpacity="0.3" />
        <circle cx={hubX} cy={hubY} r={hubR} fill="#f97316" />
        <circle cx={hubX} cy={hubY} r={hubR}
          fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" />

        <text x={hubX} y={hubY - 10} textAnchor="middle"
          fontSize="9.5" fontWeight="800" fill="#fff"
          fontFamily="system-ui, sans-serif" letterSpacing="0.07em">
          CAREER
        </text>
        <text x={hubX} y={hubY + 4} textAnchor="middle"
          fontSize="9.5" fontWeight="800" fill="#fff"
          fontFamily="system-ui, sans-serif" letterSpacing="0.07em">
          MITRA
        </text>
        <text x={hubX} y={hubY + 17} textAnchor="middle"
          fontSize="6.8" fontWeight="400" fill="rgba(255,255,255,0.65)"
          fontFamily="system-ui, sans-serif">
          Your Guide
        </text>

        {/* ── Per-feature ── */}
        {FEATURES.map((f, i) => {
          const py   = 24 + i * (pillH + pillGap);
          const midY = py + pillH / 2;
          const isV  = vis.includes(i);
          const isH  = hov === i;

          /* spoke endpoint on hub perimeter (toward pill) */
          const dy   = midY - hubY;
          const dx   = pillX - hubX;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const sx   = hubX + (dx / dist) * (hubR + 5);
          const sy   = hubY + (dy / dist) * (hubR + 5);

          return (
            <g key={f.label}>
              {/* Dashed animated spoke */}
              {isV && (
                <line
                  x1={sx} y1={sy}
                  x2={pillX} y2={midY}
                  stroke={f.accent}
                  strokeWidth="1.4"
                  strokeDasharray="5.5 4"
                  strokeOpacity={isH ? 1 : 0.5}
                  style={{ transition: "stroke-opacity 0.2s" }}
                >
                  <animate attributeName="stroke-dashoffset"
                    from="0" to="-19" dur="1s" repeatCount="indefinite" />
                </line>
              )}

              {/* Hub-edge dot */}
              {isV && (
                <circle cx={sx} cy={sy} r="2"
                  fill={f.accent} stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" />
              )}

              {/* ── Pill button ── */}
              {isV && (
                <g
                  style={{ cursor: "pointer" }}
                  onClick={() => onNav(f.path)}
                  onMouseEnter={() => setHov(i)}
                  onMouseLeave={() => setHov(null)}
                >
                  {/* Shadow layer */}
                  <rect
                    x={pillX + 3} y={py + 3}
                    width={pillW} height={pillH}
                    rx={pillH / 2}
                    fill={f.accent} fillOpacity="0.62"
                  />

                  {/* Main pill background */}
                  <rect
                    x={pillX} y={py}
                    width={pillW} height={pillH}
                    rx={pillH / 2}
                    fill={isH ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)"}
                    stroke={f.accent}
                    strokeWidth={isH ? "1.8" : "1"}
                    strokeOpacity={isH ? 1 : 0.4}
                    style={{ transition: "all 0.22s ease" }}
                  />

                  {/* ── Colored right cap — exact SVG-reference pattern ──
                      A full pill rect clipped so only the right half shows,
                      with a flat rect bridging the seam. */}
                  <clipPath id={`cc${i}`}>
                    <rect x={pillX + pillW - capW - 4} y={py}
                          width={capW + 4} height={pillH} rx={pillH / 2} />
                  </clipPath>
                  <rect
                    x={pillX + pillW - capW - 4} y={py}
                    width={capW + 4} height={pillH}
                    rx={pillH / 2}
                    fill={isH ? f.accent : f.accent}
                    fillOpacity={isH ? 1 : 0.88}
                    clipPath={`url(#cc${i})`}
                    style={{ transition: "fill-opacity 0.22s" }}
                  />
                  {/* Seam cover — flat left side of the cap */}
                  <rect
                    x={pillX + pillW - capW - 4} y={py}
                    width={10} height={pillH}
                    fill={f.accent}
                    fillOpacity={isH ? 1 : 0.88}
                    style={{ transition: "fill-opacity 0.22s" }}
                  />

                  {/* Icon inside cap — centered */}
                  <foreignObject
                    x={pillX + pillW - capW + 5}
                    y={midY - 11}
                    width={22} height={22}
                    style={{ overflow: "visible" }}
                  >
                    <div xmlns="http://www.w3.org/1999/xhtml"
                      style={{ color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                      {f.icon}
                    </div>
                  </foreignObject>

                  {/* Arrow chevron at cap right */}
                  <polyline
                    points={`${pillX + pillW - 20},${midY - 5} ${pillX + pillW - 14},${midY} ${pillX + pillW - 20},${midY + 5}`}
                    fill="none" stroke="rgba(255,255,255,0.85)"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  />

                  {/* Label */}
                  <text
                    x={pillX + 20} y={midY - 6}
                    fontSize="12" fontWeight="700"
                    fill="rgba(255,255,255,0.95)"
                    fontFamily="system-ui, sans-serif"
                    letterSpacing="0.01em"
                  >
                    {f.label}
                  </text>
                  {/* Sublabel */}
                  <text
                    x={pillX + 20} y={midY + 12}
                    fontSize="9" fontWeight="400"
                    fill="rgba(255,255,255,0.5)"
                    fontFamily="system-ui, sans-serif"
                  >
                    {f.sub}
                  </text>

                  {/* Pill left-edge dot */}
                  <circle cx={pillX} cy={midY} r="3.5"
                    fill={f.accent} stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" />
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── Hero Page ──────────────────────────────────────────────────────────── */
export default function IndiaJobsHero() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background photo */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <img src={heroImg} alt="" className="h-full w-full object-cover scale-110" />
      </motion.div>

      {/* Left-heavy dark overlay */}
      <div className="absolute inset-0 z-0" style={{
        background:
          "linear-gradient(108deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.82) 35%, rgba(0,0,0,0.4) 65%, rgba(0,0,0,0.06) 100%)",
      }} />

      {/* Subtle ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute block rounded-full"
            style={{
              width: 2, height: 2,
              background: "#fb923c",
              left: `${5 + Math.random() * 58}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ y: [-8, -100], opacity: [0, 0.4, 0] }}
            transition={{
              duration: 4 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 6,
            }}
          />
        ))}
      </div>

      {/* ── Page content ── */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="w-full px-5 sm:px-8 md:px-12 lg:px-16 pt-24 pb-12">

          {/* Responsive layout:
              mobile  → column (text on top, hub-spoke below)
              lg+     → two columns (text left, hub-spoke right) */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-12 max-w-6xl">

            {/* ── LEFT COLUMN: text content ── */}
            <motion.div
              initial={{ opacity: 0, x: -44 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex-1 min-w-0"
            >
              {/* Live tag */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "6px 16px",
                  borderRadius: 999,
                  background: "rgba(249,115,22,0.15)",
                  border: "1px solid rgba(249,115,22,0.35)",
                  backdropFilter: "blur(8px)",
                  marginBottom: 20,
                }}
              >
                <span style={{
                  display: "block", width: 7, height: 7,
                  background: "#fb923c", borderRadius: "50%",
                  animation: "cm-pulse 1.6s ease-in-out infinite",
                }} />
                <span style={{
                  color: "#fdba74", fontSize: 11,
                  fontWeight: 700, letterSpacing: "0.09em",
                  textTransform: "uppercase", fontFamily: "system-ui, sans-serif",
                }}>
                  Government Career Opportunities
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                style={{
                  fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
                  fontWeight: 900, color: "#fff",
                  lineHeight: 1.15, marginBottom: 16,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                Welcome to{" "}
                <span style={{
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  backgroundImage: "linear-gradient(90deg, #fb923c 0%, #fbbf24 55%, #fde68a 100%)",
                }}>
                  Careermitra
                </span>
              </motion.h1>

             

               <motion.div
              initial={{ opacity: 0, x: 38 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.38, duration: 0.72 }}
              className="w-full lg:w-auto"
              style={{ flexShrink: 0, maxWidth: 600, margin: "0 auto" }}
            >
              <HubSpoke onNav={navigate} />
            </motion.div>

              {/* ── Primary action buttons ── */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 32 }}
              >
                {/* ── Get Free Job Alerts (orange gradient pill) ── */}
                <motion.button
                  whileHover={{ scale: 1.045, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/register")}
                  style={{
                    display: "flex", alignItems: "center", gap: 9,
                    padding: "12px 24px",
                    borderRadius: 999,
                    background: "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)",
                    boxShadow: "0 4px 24px rgba(249,115,22,0.38), inset 0 1px 0 rgba(255,255,255,0.18)",
                    border: "none",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13.5,
                    letterSpacing: "0.01em",
                    cursor: "pointer",
                    fontFamily: "system-ui, sans-serif",
                    transition: "box-shadow 0.2s",
                  }}
                >
                  {/* Bell icon badge */}
                  <span style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 28, height: 28, borderRadius: "50%",
                    background: "rgba(255,255,255,0.22)",
                    flexShrink: 0,
                  }}>
                    {Ic.bell}
                  </span>
                  Get Free Job Alerts
                  <span style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 24, height: 24, borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                  }}>
                    {Ic.arrow}
                  </span>
                </motion.button>

                {/* ── User Dashboard (ghost pill) ── */}
                <motion.button
                  whileHover={{
                    scale: 1.045, y: -2,
                    backgroundColor: "rgba(255,255,255,0.15)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/user-dashboard")}
                  style={{
                    display: "flex", alignItems: "center", gap: 9,
                    padding: "12px 24px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    backdropFilter: "blur(10px)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13.5,
                    letterSpacing: "0.01em",
                    cursor: "pointer",
                    fontFamily: "system-ui, sans-serif",
                    transition: "background 0.2s",
                  }}
                >
                  {/* Grid icon badge */}
                  <span style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 28, height: 28, borderRadius: "50%",
                    background: "rgba(255,255,255,0.14)",
                    flexShrink: 0,
                  }}>
                    {Ic.grid}
                  </span>
                  User Dashboard
                  <span style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 24, height: 24, borderRadius: "50%",
                    background: "rgba(255,255,255,0.12)",
                  }}>
                    {Ic.arrow}
                  </span>
                </motion.button>
              </motion.div>

              {/* ── Stats ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{
                  display: "flex", flexWrap: "wrap", gap: "20px 32px",
                  paddingTop: 24,
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {[
                  { v: "10,000+", l: "Active Users" },
                  { v: "2,500+",  l: "Live Jobs" },
                  { v: "500+",    l: "Recruiters" },
                  { v: "94%",     l: "Success Rate" },
                ].map((s) => (
                  <div key={s.l}>
                    <div style={{
                      fontSize: 22, fontWeight: 800, color: "#fb923c",
                      lineHeight: 1.1, fontFamily: "system-ui, sans-serif",
                    }}>
                      {s.v}
                    </div>
                    <div style={{
                      fontSize: 11, color: "rgba(255,255,255,0.42)",
                      marginTop: 3, fontWeight: 500,
                      letterSpacing: "0.04em",
                      fontFamily: "system-ui, sans-serif",
                    }}>
                      {s.l}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* ── RIGHT COLUMN: Hub-spoke diagram ── */}
           

          </div>
        </div>
      </div>

      <style>{`
        @keyframes cm-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.45; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}