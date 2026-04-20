import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CalIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 text-orange-500">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const PinIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 text-orange-400">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const BagIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 text-orange-400">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);
const PersonIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 text-orange-400">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const PostsIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 text-green-500">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default function AllJobCard({ title, org, lastDate, postedDate, location, applyLink, noOfPosts, age, qualifications, category }) {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const isExpired = lastDate && new Date(lastDate) < new Date();
  const isLoggedIn = Boolean(user || token || localStorage.getItem("token"));

  const handleApply = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      const url = applyLink?.startsWith("http") ? applyLink : `https://${applyLink}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-orange-100 shadow-sm hover:shadow-2xl hover:shadow-orange-100 hover:-translate-y-2 transition-all duration-300 flex flex-col h-full overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 shrink-0" />
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl" />

      <div className="relative z-10 p-5 flex flex-col flex-1 gap-3">
        {category && (
          <span className="self-start text-xs font-bold bg-orange-50 text-orange-500 border border-orange-100 px-2.5 py-0.5 rounded-full truncate max-w-full">
            {category}
          </span>
        )}

        <h2 className="text-base font-extrabold text-gray-800 leading-snug group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
          {title} 
        </h2>

        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold">
          <BagIcon />
          <span className="line-clamp-1">{org}</span>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 flex-1">
          {qualifications}
        </p>

        <div className="flex flex-wrap gap-2">
          {location && (
            <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
              <PinIcon /> {location}
            </span>
          )}
          {age && (
            <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
              <PersonIcon /> Age: {age}
            </span>
          )}
          {noOfPosts && (
            <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
              <PostsIcon /> {noOfPosts} {noOfPosts === 1 ? "Post" : "Posts"}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-orange-50 mt-1 gap-2 flex-wrap">
          <div className="flex flex-col gap-1 text-xs shrink-0">
            {postedDate && (
              <div className="flex items-center gap-1.5 text-gray-500">
                <CalIcon />
                <span className="font-semibold">Posted: {postedDate}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <CalIcon />
              <span className={`font-bold ${isExpired ? "text-red-500" : "text-orange-600"}`}>
                {isExpired ? "Expired: " : "Last Date: "}{lastDate}
              </span>
            </div>
          </div>
          <button
            onClick={handleApply}
            disabled={isExpired}
            className={`text-xs font-extrabold px-4 py-2 rounded-xl transition-all duration-200 shrink-0
              ${isExpired
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 active:scale-95 text-white shadow-sm hover:shadow-md cursor-pointer"
              }`}
          >
            {isExpired ? "Closed" : isLoggedIn ? "Apply Now →" : "Register & Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}