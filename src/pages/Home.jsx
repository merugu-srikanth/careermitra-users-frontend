import { Link } from "react-router-dom";
import HeroSection from "../components/Herosection";
import JobCard from "../components/Jobcard";
import AnimatedSection from "../components/Animatedsection";
import StudentCareerSession from "../components/Studentcareersession";
import JobCategories from "../components/Jobcategories";
import SEO from "../components/SEO";
// import HeroSection from "../components/HeroSection";
// import JobCard from "../components/JobCard";
// import AnimatedSection from "../components/AnimatedSection";
// import StudentCareerSession from "../components/StudentCareerSession";
// import JobCategories from "../components/JobCategories";

const ArrowRightIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const dummyJobs = [
  { title: "AP Police Constable 2026", org: "AP Police", lastDate: "20 Jan 2026", location: "Andhra Pradesh", slug: "ap-police-constable-recruitment-2026", description: "Andhra Pradesh Police invites applications for Constable posts. Candidates must meet physical standards and eligibility criteria. A great opportunity for defense aspirants." },
  { title: "Railway RRB NTPC Notification", org: "Indian Railways", lastDate: "15 Feb 2026", location: "All India", slug: "railway-jobs-2026-notification", description: "Railway Recruitment Board (RRB) NTPC exam for clerk, typist, and station master roles. Open to graduates across India with attractive salary and job security." },
  { title: "SBI Probationary Officer (PO)", org: "State Bank of India", lastDate: "10 Mar 2026", location: "All India", slug: "sbi-po-2026", description: "State Bank of India recruits Probationary Officers. Candidates with graduation can apply. Offers high salary, career growth, and banking sector exposure." },
  { title: "TSPSC Group 2 Services", org: "Telangana PSC", lastDate: "05 Feb 2026", location: "Telangana", slug: "tspsc-group-2", description: "Telangana Public Service Commission Group 2 recruitment for administrative roles. Ideal for graduates seeking government jobs in Telangana state." },
  { title: "SSC CGL Examination 2026", org: "Staff Selection Commission", lastDate: "28 Feb 2026", location: "All India", slug: "ssc-cgl-2026", description: "SSC Combined Graduate Level exam for central government jobs. Includes posts in ministries, departments, and organizations across India." },
  { title: "UPSC Civil Services Prelims", org: "UPSC", lastDate: "25 Mar 2026", location: "All India", slug: "upsc-civil-services-2026", description: "UPSC Civil Services exam for IAS, IPS, IFS and other top government roles. One of the most prestigious exams in India for graduates." },
];

const states = [
  "Goa","Delhi","Sikkim","Assam","Bihar","Punjab","Odisha","Telangana","Andhra Pradesh",
  "Kerala","Gujarat","Haryana","Tripura","Manipur","Mizoram","Nagaland","Karnataka",
  "Jharkhand","Meghalaya","Rajasthan","Tamil Nadu","West Bengal","Uttarakhand",
  "Uttar Pradesh","Madhya Pradesh","Himachal Pradesh","Arunachal Pradesh","Chhattisgarh","Maharashtra",
];

const categories = [
  { name: "10th Pass Jobs", slug: "10th-pass" },
  { name: "12th Pass Jobs", slug: "12th-pass" },
  { name: "Degree Jobs", slug: "degree" },
  { name: "Engineering Jobs", slug: "engineering" },
  { name: "Bank Jobs", slug: "bank" },
  { name: "Defence Jobs", slug: "defence" },
];

export default function Home() {
  return (
    <div style={{ overflow: "hidden" }}>
      
      <SEO
        title="Latest Govt Jobs 2026 | Career Mitra"
        description="Find latest government jobs, internships, and private jobs in India. Apply now with Career Mitra."
        keywords="govt jobs 2026, jobs in India, internships, freshers jobs"
        url="https://www.sootradhara.in/"
      />
    
      <HeroSection />

      {/* Latest Jobs */}
      <section style={{ padding: "96px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <AnimatedSection animation="fade-up">
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#111827", marginBottom: 16 }}>
                Latest <span style={{ color: "#f97316" }}>Govt Jobs</span>
              </h2>
              <div style={{ width: 96, height: 6, background: "linear-gradient(90deg, #f97316, #22c55e)", borderRadius: 9999, margin: "0 auto 24px" }} />
              <p style={{ color: "#6b7280", maxWidth: 560, margin: "0 auto", fontSize: 17, fontWeight: 500 }}>
                Recently announced opportunities across various sectors in India.
              </p>
            </div>
          </AnimatedSection>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 32 }}>
            {dummyJobs.map((job, i) => (
              <AnimatedSection key={job.slug} animation="fade-up" delay={i * 60}>
                <div style={{ height: "100%" }}>
                  <JobCard {...job} />
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div style={{ marginTop: 64, textAlign: "center" }}>
            <Link to="/latest-govt-jobs" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "12px 32px", borderRadius: 9999,
              border: "2px solid #f97316", color: "#ea580c",
              fontWeight: 800, textDecoration: "none",
              transition: "all 0.3s",
              fontSize: 15,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#f97316"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#ea580c"; }}
            >
              View All Opportunities <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>

      <StudentCareerSession />

      {/* States Moving */}
      <section style={{ padding: "96px 0", background: "rgba(255,247,237,0.5)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 0", textAlign: "center" }}>
          <AnimatedSection animation="fade-up">
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#111827", marginBottom: 8 }}>
              Explore by <span style={{ color: "#f97316" }}>State</span>
            </h2>
            <p style={{ color: "#6b7280", fontSize: 17, marginBottom: 48 }}>
              Find career opportunities in your local region with ease.
            </p>
          </AnimatedSection>
        </div>

        <div style={{ overflow: "hidden", display: "flex", flexDirection: "column", gap: 24, padding: "8px 0" }}>
          {/* Row 1 — scrolls left */}
          <div style={{ display: "flex", gap: 16, animation: "scrollLeft 50s linear infinite", width: "max-content" }}
            onMouseEnter={e => e.currentTarget.style.animationPlayState = "paused"}
            onMouseLeave={e => e.currentTarget.style.animationPlayState = "running"}
          >
            {[...states, ...states].map((s, i) => (
              <Link key={i} to={`/state-jobs/${s.toLowerCase().replace(/\s+/g, "-")}`}
                style={{
                  padding: "12px 24px", borderRadius: 16,
                  background: "#fff", border: "1px solid #fed7aa",
                  fontWeight: 700, color: "#374151", textDecoration: "none",
                  whiteSpace: "nowrap", fontSize: 14, transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#f97316"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#f97316"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#374151"; e.currentTarget.style.borderColor = "#fed7aa"; }}
              >
                {s}
              </Link>
            ))}
          </div>

          {/* Row 2 — scrolls right */}
          <div style={{ display: "flex", gap: 16, animation: "scrollRight 50s linear infinite", width: "max-content" }}
            onMouseEnter={e => e.currentTarget.style.animationPlayState = "paused"}
            onMouseLeave={e => e.currentTarget.style.animationPlayState = "running"}
          >
            {[...states].reverse().concat([...states].reverse()).map((s, i) => (
              <Link key={i} to={`/state-jobs/${s.toLowerCase().replace(/\s+/g, "-")}`}
                style={{
                  padding: "12px 24px", borderRadius: 16,
                  background: "#fff", border: "1px solid #bbf7d0",
                  fontWeight: 700, color: "#374151", textDecoration: "none",
                  whiteSpace: "nowrap", fontSize: 14, transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#16a34a"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#374151"; e.currentTarget.style.borderColor = "#bbf7d0"; }}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: "96px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <AnimatedSection animation="fade-up">
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#111827", marginBottom: 8 }}>
              Jobs by <span style={{ color: "#f97316" }}>Category</span>
            </h2>
            <p style={{ color: "#6b7280", fontSize: 17, marginBottom: 64 }}>
              Browse based on your specific academic qualifications.
            </p>
          </AnimatedSection>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {categories.map((cat, i) => (
              <AnimatedSection key={cat.slug} animation="fade-up" delay={i * 50}>
                <Link to={`/qualification/${cat.slug}`}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: 16, borderRadius: 20, background: "#fafafa",
                    border: "1px solid #f1f5f9", textDecoration: "none",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "#f97316";
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.boxShadow = "0 16px 40px rgba(249,115,22,0.12)";
                    e.currentTarget.querySelector(".cat-name").style.color = "#ea580c";
                    e.currentTarget.querySelector(".cat-arrow").style.background = "#f97316";
                    e.currentTarget.querySelector(".cat-arrow").style.color = "#fff";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "#f1f5f9";
                    e.currentTarget.style.background = "#fafafa";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.querySelector(".cat-name").style.color = "#1f2937";
                    e.currentTarget.querySelector(".cat-arrow").style.background = "#fff";
                    e.currentTarget.querySelector(".cat-arrow").style.color = "#374151";
                  }}
                >
                  <span className="cat-name" style={{ fontWeight: 800, fontSize: 17, color: "#1f2937", transition: "color 0.3s" }}>
                    {cat.name}
                  </span>
                  <div className="cat-arrow" style={{
                    width: 40, height: 40, borderRadius: "50%", background: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "all 0.3s",
                  }}>
                    <ArrowRightIcon />
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <JobCategories />

      {/* CTA Section */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", borderRadius: 48, overflow: "hidden", position: "relative", boxShadow: "0 20px 60px rgba(249,115,22,0.4)" }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, #ea580c, #16a34a)",
            backgroundSize: "200% auto",
            animation: "gradientShift 3s ease infinite",
          }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.1)" }} />
          <AnimatedSection animation="fade-up">
            <div style={{ position: "relative", zIndex: 1, padding: "64px 32px", textAlign: "center", color: "#fff" }}>
              <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, marginBottom: 24 }}>
                Never Miss An Alert!
              </h2>
              <p style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", opacity: 0.9, marginBottom: 40, maxWidth: 560, margin: "0 auto 40px" }}>
                Get free real-time updates on WhatsApp or Telegram for every notification.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24 }}>
                <a href="#" style={{
                  padding: "16px 40px", background: "#fff", color: "#16a34a",
                  borderRadius: 9999, fontWeight: 900, fontSize: "clamp(1rem, 2vw, 1.15rem)",
                  textDecoration: "none", transition: "transform 0.2s",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  REGISTER NOW
                </a>
                <a href="#" style={{
                  padding: "16px 40px", background: "#3b82f6", color: "#fff",
                  borderRadius: 9999, fontWeight: 900, fontSize: "clamp(1rem, 2vw, 1.15rem)",
                  textDecoration: "none", border: "1px solid #60a5fa", transition: "transform 0.2s",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  JOIN TELEGRAM
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <style>{`
        @keyframes scrollLeft { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes scrollRight { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }
        @keyframes gradientShift { 0%,100%{background-position:0%} 50%{background-position:200%} }
      `}</style>
    </div>
  );
}