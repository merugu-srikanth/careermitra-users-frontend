// BlogList.jsx — Complete, SEO-Friendly, Responsive Blog Listing with Base64 Image Conversion
// Dependencies: react-router-dom, react-icons

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaArrowRight, FaCalendarAlt, FaClock, FaEye,
  FaSearch, FaTimes, FaChevronLeft, FaChevronRight,
  FaFire, FaBookOpen, FaBell, FaUser, FaTag, FaChartLine
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import blogImg from '../../assets/blog-sample.png';

// Helper: Convert image URL to Base64
const convertImageToBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      try {
        const dataURL = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataURL);
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
};

// ── Skeleton loader ────────────────────────────────────────────────────
const CardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-3 bg-gray-200 rounded-full w-1/3" />
      <div className="h-4 bg-gray-200 rounded-full w-full" />
      <div className="h-4 bg-gray-200 rounded-full w-3/4" />
      <div className="h-3 bg-gray-200 rounded-full w-1/2 mt-4" />
    </div>
  </div>
);

// ── Category pill ──────────────────────────────────────────────────────
const CategoryPill = ({ label, active, onClick, color = 'orange' }) => {
  const activeClasses = color === 'green'
    ? 'bg-green-500 text-white shadow-green-200 shadow-md'
    : 'bg-orange-500 text-white shadow-orange-200 shadow-md';
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
        active ? activeClasses : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-600'
      }`}
    >
      {label}
    </button>
  );
};

// ── Format date helper ─────────────────────────────────────────────────
const formatDate = (dateString) => {
  if (!dateString) return 'Recent';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

// ── Read-time estimate ─────────────────────────────────────────────────
const readTime = (content = '') => {
  const words = content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
  return Math.max(1, Math.round(words / 200));
};

// ── SEO-Friendly Image Component with Base64 Conversion ────────────────
const OptimizedImage = ({ src, alt, className, sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw", width, height, loading = "lazy", onImageConverted }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isBase64, setIsBase64] = useState(false);

  useEffect(() => {
    if (src && src.startsWith('http')) {
      convertImageToBase64(src)
        .then(base64 => {
          setImageSrc(base64);
          setIsBase64(true);
          if (onImageConverted) onImageConverted(base64);
        })
        .catch(err => {
          console.warn(`Base64 conversion failed for ${src}:`, err);
          setImageSrc(blogImg);
        });
    } else if (!src) {
      setImageSrc(blogImg);
    }
  }, [src, onImageConverted]);

  return (
    <img
      src={imageSrc}
      alt={alt || "Blog post image"}
      className={className}
      sizes={sizes}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = blogImg;
      }}
    />
  );
};

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const API_BASE = 'https://careermitra.tech/api';

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/blogs?page=${currentPage}&limit=9`;
      if (selectedCategory !== 'all') url += `&category=${encodeURIComponent(selectedCategory)}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

      const res = await fetch(url);
      const result = await res.json();

      if (result.success && result.data) {
        const list = result.data.blogs || [];
        setBlogs(list);
        setPagination(result.data.pagination || {});
        const cats = [...new Set(list.map(b => b.category).filter(Boolean))];
        setCategories(cats);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, searchTerm]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(inputValue);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setInputValue('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const featuredBlog = blogs[0] || null;
  const gridBlogs = blogs.slice(1);

  const getPageNumbers = () => {
    const total = pagination.totalPages || 1;
    const cur = pagination.page || currentPage;
    const delta = 2;
    const range = [];
    for (let i = Math.max(1, cur - delta); i <= Math.min(total, cur + delta); i++) {
      range.push(i);
    }
    if (range[0] > 1) { range.unshift('...'); range.unshift(1); }
    if (range[range.length - 1] < total) { range.push('...'); range.push(total); }
    return range;
  };

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "headline": "Career Insights & Government Job Updates",
    "description": "Expert guidance, government job alerts, and exam strategies — everything you need to build your dream career.",
    "url": window.location.href,
    "mainEntity": blogs.map(blog => ({
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": blog.short_description,
      "datePublished": blog.published_at,
      "author": { "@type": "Person", "name": blog.author_name || "CareerMitra" }
    }))
  };

  return (
    <div className="bg-[#FAFAF8] min-h-screen font-sans">
      {/* SEO Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* HERO SECTION */}
      <section className="relative bg-white overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-green-100 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            <HiSparkles size={14} />
            Career Insights & Government Job Updates
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight mb-5">
            Your Path to<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-green-500">
              Career Success
            </span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Expert guidance, government job alerts, and exam strategies — everything you need to build your dream career.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
            <div className="relative flex items-center bg-white border-2 border-gray-200 rounded-2xl shadow-sm focus-within:border-orange-400 focus-within:shadow-orange-100 focus-within:shadow-md transition-all duration-300">
              <FaSearch className="absolute left-5 text-gray-400" size={16} />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search articles, topics, exams..."
                className="flex-1 pl-12 pr-4 py-4 bg-transparent text-gray-700 placeholder-gray-400 text-sm focus:outline-none"
                aria-label="Search blog posts"
              />
              {inputValue && (
                <button type="button" onClick={clearSearch} className="p-2 mr-1 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Clear search">
                  <FaTimes size={14} />
                </button>
              )}
              <button type="submit" className="m-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-colors">
                Search
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center gap-8 mt-10 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><FaBookOpen size={13} className="text-orange-400" /> {blogs.length}+ Articles</span>
            <span className="w-px h-4 bg-gray-200" />
            <span className="flex items-center gap-1.5"><FaFire size={13} className="text-green-400" /> Updated Daily</span>
            <span className="w-px h-4 bg-gray-200" />
            <span className="flex items-center gap-1.5"><FaChartLine size={13} className="text-orange-400" /> Free to Read</span>
          </div>
        </div>
      </section>

      {/* CATEGORY FILTERS */}
      <div className="sticky top-0 z-20 bg-[#FAFAF8]/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            <CategoryPill label="All Posts" active={selectedCategory === 'all'} onClick={() => { setSelectedCategory('all'); setCurrentPage(1); }} />
            {categories.map(cat => (
              <CategoryPill key={cat} label={cat} active={selectedCategory === cat} onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }} color="green" />
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {loading && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 animate-pulse h-72" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          </div>
        )}

        {!loading && blogs.length === 0 && (
          <div className="text-center py-28">
            <div className="w-20 h-20 bg-orange-50 border border-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <FaBookOpen size={32} className="text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No articles found</h3>
            <p className="text-gray-500 text-sm mb-5">Try different keywords or browse all categories</p>
            <button onClick={clearSearch} className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-semibold text-sm hover:bg-orange-600 transition-colors">
              Clear Search
            </button>
          </div>
        )}

        {!loading && blogs.length > 0 && (
          <div className="space-y-10">
            {/* Featured Hero Card */}
            {featuredBlog && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FaFire className="text-orange-500" size={14} />
                  <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Featured Post</span>
                </div>
                <Link to={`/blog/${featuredBlog.slug}`} className="group block">
                  <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-50 transition-all duration-500">
                    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-0">
                      <div className="relative h-[55vh] lg:h-auto overflow-hidden bg-gray-100">
                        <OptimizedImage
                          src={featuredBlog.featured_image}
                          alt={featuredBlog.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          width="800"
                          height="600"
                          loading="eager"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                        <div className="absolute top-5 left-5">
                          <span className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-xl uppercase tracking-wide">
                            {featuredBlog.category || 'Featured'}
                          </span>
                        </div>
                      </div>
                      <div className="p-8 lg:p-10 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-5">
                            <span className="flex items-center gap-1.5"><FaCalendarAlt size={11} className="text-orange-400" />{formatDate(featuredBlog.published_at)}</span>
                            <span className="flex items-center gap-1.5"><FaClock size={11} className="text-green-400" />{readTime(featuredBlog.content)} min read</span>
                            <span className="flex items-center gap-1.5"><FaEye size={11} className="text-orange-400" />{(featuredBlog.views || 0).toLocaleString()} views</span>
                          </div>
                          <h2 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight mb-4 group-hover:text-orange-600 transition-colors line-clamp-3">
                            {featuredBlog.title}
                          </h2>
                          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-5">{featuredBlog.short_description}</p>
                          {featuredBlog.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                              {featuredBlog.tags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="text-xs px-3 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full font-medium">#{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                              {featuredBlog.author_name?.charAt(0)?.toUpperCase() || 'C'}
                            </div>
                            <div><p className="text-xs font-semibold text-gray-800">{featuredBlog.author_name || 'CareerMitra'}</p><p className="text-xs text-gray-400">Author</p></div>
                          </div>
                          <span className="flex items-center gap-2 text-orange-500 text-sm font-bold group-hover:gap-3 transition-all">Read Article <FaArrowRight size={13} /></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Grid Section Header */}
            {gridBlogs.length > 0 && (
              <div className="flex items-center justify-between">
                <div><h2 className="text-xl font-black text-gray-900">Latest Articles</h2><p className="text-sm text-gray-400 mt-0.5">Fresh insights for your career journey</p></div>
                <span className="hidden md:flex items-center gap-1.5 text-xs text-gray-400 bg-white border border-gray-200 px-3 py-1.5 rounded-full"><FaFire size={11} className="text-orange-400" /> Trending this week</span>
              </div>
            )}

            {/* Blog Grid */}
            {gridBlogs.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridBlogs.map((blog, index) => (
                  <Link key={blog._id} to={`/blog/${blog.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50/60 hover:-translate-y-1 transition-all duration-400 flex flex-col">
                    <div className="relative h-48 overflow-hidden bg-gray-100 flex-shrink-0">
                      <OptimizedImage src={blog.featured_image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" width="400" height="250" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
                      <div className="absolute top-3 left-3"><span className="px-2.5 py-1 bg-white/95 text-orange-600 text-xs font-bold rounded-lg">{blog.category || 'Article'}</span></div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                        <span className="flex items-center gap-1 text-white/90 text-xs bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm"><FaEye size={10} /> {(blog.views || 0).toLocaleString()}</span>
                        <span className="flex items-center gap-1 text-white/90 text-xs bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm"><FaClock size={10} /> {readTime(blog.content)} min</span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{blog.author_name?.charAt(0)?.toUpperCase() || 'C'}</div>
                        <span className="text-xs text-gray-500 font-medium">{blog.author_name || 'CareerMitra'}</span>
                        <span className="text-gray-200">·</span>
                        <span className="text-xs text-gray-400">{formatDate(blog.published_at)}</span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 leading-snug mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">{blog.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 flex-1">{blog.short_description}</p>
                      {blog.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">{blog.tags.slice(0, 2).map((tag, i) => (<span key={i} className="text-xs px-2 py-0.5 bg-gray-50 text-gray-500 border border-gray-100 rounded-full">#{tag}</span>))}</div>
                      )}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                        <span className="text-orange-500 text-xs font-bold flex items-center gap-1.5 group-hover:gap-2.5 transition-all">Read More <FaArrowRight size={11} /></span>
                        <span className="text-xs text-gray-300">{formatDate(blog.published_at)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {(pagination.totalPages || 1) > 1 && (
              <div className="flex justify-center items-center gap-2 pt-4">
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={!pagination.hasPrevPage} className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all" aria-label="Previous page"><FaChevronLeft size={13} /></button>
                {getPageNumbers().map((num, i) => num === '...' ? (<span key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-gray-400 text-sm">…</span>) : (
                  <button key={num} onClick={() => setCurrentPage(num)} className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${(pagination.page || currentPage) === num ? 'bg-orange-500 text-white shadow-md shadow-orange-200' : 'border border-gray-200 text-gray-600 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600'}`}>{num}</button>
                ))}
                <button onClick={() => setCurrentPage(p => p + 1)} disabled={!pagination.hasNextPage} className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-green-50 hover:border-green-300 hover:text-green-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all" aria-label="Next page"><FaChevronRight size={13} /></button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* NEWSLETTER SECTION */}
      <section className="bg-white border-t border-gray-100 py-16 md:py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-14 h-14 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-5"><FaBell className="text-orange-500" size={22} /></div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 leading-tight">Never Miss an Update</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">Get the latest government job alerts, exam schedules, and career tips delivered straight to your inbox.</p>
          <button onClick={() => navigate('/register')} className="px-7 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition-colors shadow-sm">Register Now</button>
          <p className="text-xs text-gray-400 mt-4">No spam ever. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}