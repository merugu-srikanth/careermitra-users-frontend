import { Link } from "react-router-dom";

const CalIcon = () => <svg width="14" height="14" fill="none" stroke="#f97316" strokeWidth="2" viewBox="0 0 24 24" style={{flexShrink:0}}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const PinIcon = () => <svg width="14" height="14" fill="none" stroke="#f97316" strokeWidth="2" viewBox="0 0 24 24" style={{flexShrink:0}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const BagIcon = () => <svg width="14" height="14" fill="none" stroke="#f97316" strokeWidth="2" viewBox="0 0 24 24" style={{flexShrink:0}}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;

export default function JobCard({ title, org, lastDate, location, slug, description }) {
  return (
    <div
      style={{
        background: "#fff", borderRadius: 24, border: "1px solid #fed7aa",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        overflow: "hidden", transition: "all 0.4s",
        display: "flex", flexDirection: "column", height: "100%",
        position: "relative",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(249,115,22,0.15)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
      }}
    >
      {/* Hover glow overlay */}
      <div className="job-card-glow" style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(249,115,22,0.06), rgba(249,115,22,0.10))",
        opacity: 0, transition: "opacity 0.4s", pointerEvents: "none",
      }} />

      {/* Top strip */}
      <div style={{ height: 6, background: "linear-gradient(90deg, #fb923c, #ea580c)", flexShrink: 0 }} />

      <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1, gap: 8, position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1f2937", lineHeight: 1.3, margin: 0 }}
          onMouseEnter={e => e.target.style.color = "#ea580c"}
          onMouseLeave={e => e.target.style.color = "#1f2937"}
        >
          {title}
        </h2>

        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#6b7280", fontSize: 13 }}>
          <BagIcon /> <span>{org}</span>
        </div>

        <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.5, margin: 0,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
        }}>
          {description}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#6b7280", fontSize: 13 }}>
          <PinIcon /> <span>{location}</span>
        </div>

        <div style={{ marginTop: "auto", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <CalIcon />
            <span style={{ fontWeight: 700, color: "#ea580c" }}>Deadline: {lastDate}</span>
          </div>
          <Link to={`/jobs/${slug}`} style={{
            padding: "7px 16px", background: "#f97316", color: "#fff",
            borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none",
            transition: "all 0.3s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#ea580c"; e.currentTarget.style.transform = "scale(1.05)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#f97316"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            View More →
          </Link>
        </div>
      </div>
    </div>
  );
}