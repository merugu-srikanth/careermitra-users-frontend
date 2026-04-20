import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AllJobCard from "../components/AllJobCard";
import { STATIC_JOBS, JOB_CATEGORIES } from "./staticJobs";

// ── Icons ─────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400 shrink-0">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const FilterIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const ChevLeft = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevRight = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const LockIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const BriefcaseEmptyIcon = () => (
  <svg width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24" className="text-orange-200 mx-auto mb-4">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);
const GridIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const TableIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </svg>
);
const DownloadIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const CalendarIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const LocationIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const BuildingIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="16" x2="13" y2="16" />
  </svg>
);
const UsersIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const GraduationIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 3L1 9l11 6 11-6-11-6z" />
    <path d="M5 13v6a8 8 0 0 0 14 0v-6" />
  </svg>
);

const ITEMS_PER_PAGE = 12;

// ── Pagination ─────────────────────────────────────────────────────────────────
function Pagination({ current, total, onChange }) {
  if (total <= 1) return null;
  const pages = [];
  const delta = 2;
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  pages.push(1);
  if (left > 2) pages.push("...");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push("...");
  if (total > 1) pages.push(total);

  return (
    <div className="flex items-center justify-center gap-1.5 pt-12">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-orange-300 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevLeft />
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-9 h-9 rounded-xl text-sm font-bold transition-all duration-200
              ${p === current
                ? "bg-orange-500 text-white shadow-md shadow-orange-200 scale-110"
                : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500"
              }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-orange-300 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevRight />
      </button>
    </div>
  );
}

// ── Table View Component ──────────────────────────────────────────────────────
function TableView({ jobs, isLoggedIn, onApply }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-y-auto max-h-[70vh]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-orange-50 to-amber-50 sticky top-0">
            <tr>
              <th scope="col" className="px-2 py-3 border border-amber-300 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">s no</th>
              <th scope="col" className="px-2 py-3 border border-amber-300 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Job Title</th>
              <th scope="col" className="px-2 py-3 border border-amber-300 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-2 py-3 border border-amber-300 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Posts</th>
              <th scope="col" className="px-2 py-3 border border-amber-300 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Age Limit</th>
              <th scope="col" className="px-2 py-3 border border-amber-300 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Location</th>
              <th scope="col" className="px-2 py-3 border border-amber-300 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Dates</th>
              <th scope="col" className="px-2 py-3 border border-amber-300 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {jobs.map((job, idx) => {
              const isExpired = new Date(job.lastDate) < new Date();
              const isActive = !isExpired;
              return (
                <tr key={job.id} className="hover:bg-orange-50/30 transition-colors duration-150 group">
                  <td className="px-2 py-3 border border-amber-300 whitespace-nowrap text-sm text-gray-400 font-mono">{idx + 1}</td>
                  <td className="px-2 py-3 border border-amber-300 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                      {job.title}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                      <BuildingIcon />
                      <span>{job.org}</span>
                    </div>
                    <div className="text-xs text-gray-400 truncate max-w-[200px]">{job.qualifications?.slice(0, 60)}...</div>
                  </td>
                  <td className="px-2 py-3 border border-amber-300 whitespace-nowrap">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                      {job.category}
                    </span>
                  </td>
                  <td className="px-2 py-3 border border-amber-300 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <UsersIcon />
                      <span className="text-sm font-semibold text-gray-700">{job.noOfPosts?.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-2 py-3 border border-amber-300 whitespace-nowrap text-sm text-gray-600">{job.age} years</td>
                  <td className="px-2 py-3 border border-amber-300 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <LocationIcon />
                      <span className="text-sm text-gray-600">{job.location || "All India"}</span>
                    </div>
                  </td>
                  <td className="px-2 py-3 border border-amber-200 whitespace-nowrap">
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <CalendarIcon />
                        <span>Posted: {job.postedDate || "-"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon />
                        <span className={`font-medium ${isExpired ? "text-red-500 line-through" : "text-orange-700"}`}>
                          Deadline: {job.lastDate}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3 border border-amber-300 whitespace-nowrap text-center">
                    <button
                      onClick={() => onApply(job.applyLink, isExpired)}
                      disabled={!isActive}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200
                        ${isActive
                          ? "bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      {isActive ? (isLoggedIn ? "Apply" : "Register") : "Closed"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function AllJobs() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAge, setSelectedAge] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // "grid" or "table"

  const isLoggedIn = Boolean(user || token || localStorage.getItem("token"));

  // Only show status === 0 jobs
  const activeJobs = useMemo(() => STATIC_JOBS.filter((j) => j.status === 0), []);

  // Filtered + sorted
  const filtered = useMemo(() => {
    let result = [...activeJobs];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.org.toLowerCase().includes(q) ||
          j.qualifications.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((j) => j.category === selectedCategory);
    }

    if (selectedAge) {
      result = result.filter((j) => j.age === selectedAge);
    }

    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.lastDate) - new Date(a.lastDate));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.lastDate) - new Date(b.lastDate));
    } else if (sortBy === "posts_high") {
      result.sort((a, b) => b.noOfPosts - a.noOfPosts);
    } else if (sortBy === "posts_low") {
      result.sort((a, b) => a.noOfPosts - b.noOfPosts);
    }

    return result;
  }, [activeJobs, search, selectedCategory, selectedAge, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handlePageChange = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasFilters = search || selectedCategory !== "All" || selectedAge || sortBy !== "newest";

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedAge("");
    setSortBy("newest");
    setPage(1);
  };

  const handleApply = (applyLink, isExpired) => {
    if (isExpired) return;
    if (isLoggedIn) {
      const url = applyLink?.startsWith("http") ? applyLink : `https://${applyLink}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      navigate("/register");
    }
  };

  // Unique age ranges from data
  const ageOptions = [...new Set(activeJobs.map((j) => j.age))].sort();

  const totalPosts = activeJobs.reduce((s, j) => s + (j.noOfPosts || 0), 0);

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/40 via-white to-green-50/20">

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-b from-orange-100 via-orange-100 to-orange-700 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center mt-9">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-orange-500/90 text-xs font-bold px-4 py-1.5 rounded-full mb-3 border border-white/25">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {activeJobs.length} Active Listings • {totalPosts.toLocaleString()} Total Vacancies
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black mb-4 tracking-tight leading-none">
            Government{" "}
            <span className="text-orange-600">Job Listings</span>
          </h1>
          <p className="text-orange-600 text-lg max-w-lg mx-auto mb-10">
            Verified government vacancies from top organisations across India. Updated regularly.
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="flex bg-white rounded-2xl shadow-2xl overflow-hidden p-1.5 gap-2 border border-white/30">
              <div className="flex-1 flex items-center gap-2.5 px-3">
                <SearchIcon />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search by title, organisation, qualification..."
                  className="flex-1 text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent py-2.5"
                />
                {search && (
                  <button onClick={() => { setSearch(""); setPage(1); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <XIcon />
                  </button>
                )}
              </div>
              <button className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-md shrink-0">
                Search
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { label: "Total Jobs", val: activeJobs.length },
              { label: "Total Posts", val: totalPosts.toLocaleString() },
              { label: "Organisations", val: [...new Set(activeJobs.map((j) => j.org))].length },
              { label: "Categories", val: JOB_CATEGORIES.length - 1 },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl px-5 py-2.5 text-white text-center min-w-[100px]">
                <div className="text-xl font-black">{stat.val}</div>
                <div className="text-xs text-orange-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Category Pills ───────────────────────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
          {JOB_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setPage(1); }}
              className={`shrink-0 text-xs font-bold px-4 py-2 rounded-full border transition-all duration-200 whitespace-nowrap
                ${selectedCategory === cat
                  ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Toolbar ──────────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <p className="text-sm text-gray-500">
            Showing <span className="font-bold text-gray-800">{filtered.length}</span> jobs
            {hasFilters && <span className="text-orange-500 font-semibold"> (filtered)</span>}
            <span className="text-gray-400"> • Page {page} of {totalPages || 1}</span>
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all duration-200 ${viewMode === "grid" ? "bg-white shadow-sm text-orange-500" : "text-gray-500 hover:text-orange-400"}`}
                title="Grid View"
              >
                <GridIcon />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-all duration-200 ${viewMode === "table" ? "bg-white shadow-sm text-orange-500" : "text-gray-500 hover:text-orange-400"}`}
                title="Table View"
              >
                <TableIcon />
              </button>
            </div>

           

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="text-sm border border-gray-200 bg-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-600 font-medium cursor-pointer"
            >
              <option value="newest">Deadline: Soonest</option>
              <option value="oldest">Deadline: Latest</option>
              <option value="posts_high">Posts: High to Low</option>
              <option value="posts_low">Posts: Low to High</option>
            </select>

            {/* Advanced filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl border transition-all duration-200
                ${showFilters
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600"
                }`}
            >
              <FilterIcon />
              Filters
              {(selectedAge) && (
                <span className="bg-white/30 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-black">1</span>
              )}
            </button>

            {/* Clear */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-100 px-3 py-2 rounded-xl transition-all duration-200"
              >
                <XIcon /> Clear All
              </button>
            )}
          </div>
        </div>

        {/* ── Advanced Filters Panel ───────────────────────────────────────────── */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Age Range</label>
              <select
                value={selectedAge}
                onChange={(e) => { setSelectedAge(e.target.value); setPage(1); }}
                className="w-full text-sm border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                <option value="">All Age Groups</option>
                {ageOptions.map((a) => (
                  <option key={a} value={a}>{a} years</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
                className="w-full text-sm border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                {JOB_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm py-2.5 rounded-xl transition-all duration-200"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* ── Job Display (Grid or Table) ───────────────────────────────────────── */}
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <BriefcaseEmptyIcon />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Jobs Found</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              {hasFilters
                ? "No jobs match your current filters. Try adjusting your search."
                : "No active listings right now. Check back soon."}
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all duration-200"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginated.map((job) => (
              <AllJobCard
                key={job.id}
                title={job.title}
                org={job.org}
                lastDate={job.lastDate}
                postedDate={job.postedDate}
                location={job.location}
                applyLink={job.applyLink}
                noOfPosts={job.noOfPosts}
                age={job.age}
                qualifications={job.qualifications}
                category={job.category}
              />
            ))}
          </div>
        ) : (
          <TableView jobs={paginated} isLoggedIn={isLoggedIn} onApply={handleApply} />
        )}

        {/* ── Pagination ───────────────────────────────────────────────────────── */}
        <Pagination current={page} total={totalPages} onChange={handlePageChange} />

        {filtered.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-4">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} jobs
          </p>
        )}
      </div>
    </div>
  );
}