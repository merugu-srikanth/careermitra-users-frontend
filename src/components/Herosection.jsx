import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import heroImg from "../assets/bg-images/hero-bg-img2.png";

const sparkles = [
  { top: "12%", left: "7%", delay: 0, size: "text-base" },
  { top: "20%", left: "89%", delay: 0.7, size: "text-base" },
  { top: "68%", left: "4%", delay: 1.4, size: "text-[0.9rem]" },
  { top: "73%", left: "93%", delay: 0.3, size: "text-[1.3rem]" },
  { top: "44%", left: "2%", delay: 1, size: "text-[0.8rem]" },
  { top: "38%", left: "96%", delay: 1.7, size: "text-base" },
];

const particles = [
  { top: "36%", left: "72%", delay: 0 },
  { top: "15%", left: "68%", delay: 0.3 },
  { top: "91%", left: "24%", delay: 0.6 },
  { top: "96%", left: "31%", delay: 0.9 },
  { top: "3%", left: "15%", delay: 1.2 },
  { top: "61%", left: "9%", delay: 1.5 },
];

const trust = ["🏛️ 100% Free", "🔔 Daily Updates", "📱 No Spam", "🆓 10K+ Users Subscribed"];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0c0500] ">

      {/* ── Background Image with Smooth Pan/Zoom ── */}
      <motion.div
        initial={{ scale: 1.1, x: "-2%" }}
        animate={{
          scale: [1.1, 1.15, 1.1],
          x: ["-2%", "2%", "-2%"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 z-0"
      >
        <img
          src={heroImg}
          alt="Hero Background"
          className="w-full h-full object-cover opacity-40"
        />
      </motion.div>

      {/* ── Sophisticated Overlays ── */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/20 to-[#0c0500]" />
      <div className="absolute inset-0 z-[1] bg-radial-gradient from-transparent via-black/10 to-black/40" />

      {/* ── Animated Sparkles ── */}
      {sparkles.map((s, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
            rotate: [0, 180]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut"
          }}
          style={{ top: s.top, left: s.left }}
          className={`absolute z-[2] pointer-events-none text-amber-400/60 ${s.size}`}
        >
          {i % 2 === 0 ? "✦" : "★"}
        </motion.span>
      ))}

      {/* ── Main Content Container ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-35 pb-20 text-center">

        {/* Animated Headline Group */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="font-serif text-[clamp(2.5rem,3vw,5rem)] font-black text-white leading-tight mb-2 drop-shadow-lg">
            Latest Govt Jobs Notifications 2026
          </h1>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative inline-block"
          >
            <h1 className="font-serif text-[clamp(2.8rem,7vw,5.5rem)] font-black leading-none mb-0 bg-gradient-to-r from-white via-amber-200 to-amber-500 bg-clip-text text-transparent">
              Personalized Alerts For You
            </h1>
            {/* Underline decoration */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 1 }}
              className="h-1.5 bg-amber-500/50 rounded-full blur-[1px]"
            />
          </motion.div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-amber-50/90 text-[clamp(1rem,2.5vw,1.25rem)] max-w-4xl mx-auto my-6 font-medium leading-relaxed"
        >
          Your one-stop destination for the latest government job updates, with

          <span className="text-amber-400 font-bold mx-1"> personalized job notifications</span>
          at your fingertips, curated based on your profile, interests, and location.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <Link
            to="/latest-govt-jobs"
            className="group relative flex items-center gap-3 px-10 py-5 rounded-full bg-orange-600 text-white font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-orange-900/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span>Let Every Update Find You First.</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <Link
            to="/state-jobs"
            className="px-10 py-5 rounded-full backdrop-blur-md bg-white/5 border border-white/20 text-white font-bold text-lg hover:bg-white/10 transition-all active:scale-95"
          >
            Browse Latest Jobs
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 ">
          {trust.map((b, i) => (
            <span
              key={i}
              className="text-amber-50/90 text-sm font-semibold  bg-amber-500 p-1 px-2 rounded-2xl  tracking-widest uppercase"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Decorative Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[30vh] bg-gradient-to-t from-amber-900/20 to-transparent blur-3xl pointer-events-none" />
    </section>
  );
}