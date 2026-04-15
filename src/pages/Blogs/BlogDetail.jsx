// BlogDetail.jsx — Complete, SEO-Optimized Blog Detail Page with Base64 Images
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FaShare, FaHome, FaChevronRight, FaCalendar, FaUser, FaEye, FaClock,
  FaFacebook, FaTwitter, FaLinkedin, FaLink, FaArrowLeft, FaFire,
  FaTag, FaBell, FaNewspaper, FaChartLine, FaHeart, FaBookmark
} from "react-icons/fa";
import blogImg from "../../assets/blog-sample.png";

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

// SEO-Friendly Image Component
const OptimizedImage = ({ src, alt, className, sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px", width, height, loading = "lazy" }) => {
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    if (src && src.startsWith('http')) {
      convertImageToBase64(src)
        .then(base64 => setImageSrc(base64))
        .catch(err => {
          console.warn(`Base64 conversion failed for ${src}:`, err);
          setImageSrc(blogImg);
        });
    } else if (!src) {
      setImageSrc(blogImg);
    }
  }, [src]);

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
      onError={(e) => { e.target.onerror = null; e.target.src = blogImg; }}
    />
  );
};

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);

  const API_BASE = 'https://careermitra.tech/api';

  useEffect(() => {
    fetchBlog();
    fetchRecentAndTrending();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/blogs/slug/${slug}`);
      const result = await response.json();
      if (result.success && result.data) {
        setBlog(result.data);
        setLikesCount(result.data.likes || 0);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentAndTrending = async () => {
    try {
      const response = await fetch(`${API_BASE}/blogs?page=1&limit=10`);
      const result = await response.json();
      if (result.success && result.data) {
        const allBlogs = result.data.blogs || [];
        const recent = allBlogs.filter(b => b.slug !== slug).slice(0, 4);
        setRecentBlogs(recent);
        const trending = [...allBlogs].sort((a, b) => (b.views || 0) - (a.views || 0)).filter(b => b.slug !== slug).slice(0, 5);
        setTrendingBlogs(trending);
      }
    } catch (error) {
      console.error('Error fetching recent blogs:', error);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  // Structured Data for SEO
  const structuredData = blog ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.short_description,
    "image": blog.featured_image,
    "datePublished": blog.published_at,
    "dateModified": blog.updated_at || blog.published_at,
    "author": {
      "@type": "Person",
      "name": blog.author_name || "CareerMitra"
    },
    "publisher": {
      "@type": "Organization",
      "name": "CareerMitra",
      "logo": {
        "@type": "ImageObject",
        "url": "https://careermitra.tech/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    }
  } : {};

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-green-200 border-b-green-500 rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 pt-24 md:pt-28">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-orange-500 transition-colors flex items-center gap-1"><FaHome size={12} /> Home</Link>
          <FaChevronRight size={10} />
          <Link to="/" className="hover:text-orange-500">Blog</Link>
          <FaChevronRight size={10} />
          <span className="text-gray-700 truncate max-w-[200px]">{blog.title}</span>
        </div>
      </div>

      {/* Main Content - 70/30 Layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Side - 70% Main Content */}
          <div className="lg:w-[70%]">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden mb-6">
              <OptimizedImage
                src={blog.featured_image}
                alt={blog.image_alt_text || blog.title}
                className="w-full h-auto object-cover rounded-2xl"
                width="1200"
                height="630"
                loading="eager"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-orange-500 text-white text-sm font-semibold rounded-full">{blog.category || 'Article'}</span>
              </div>
            </div>

            {/* Title & Meta */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">{blog.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-6 border-b border-gray-200 mb-6">
              <span className="flex items-center gap-1.5"><FaUser className="text-orange-500" /> {blog.author_name || 'CareerMitra'}</span>
              <span className="flex items-center gap-1.5"><FaCalendar className="text-green-500" /> {formatDate(blog.published_at)}</span>
              <span className="flex items-center gap-1.5"><FaEye className="text-blue-500" /> {blog.views || 0} views</span>
              <span className="flex items-center gap-1.5"><FaClock className="text-purple-500" /> 6 min read</span>
            </div>

            {/* Short Description */}
            {blog.short_description && (
              <div className="bg-gradient-to-r from-orange-50 to-green-50 p-6 rounded-2xl mb-8 border-l-4 border-orange-500">
                <p className="text-gray-700 text-base md:text-lg leading-relaxed italic">"{blog.short_description}"</p>
              </div>
            )}

            {/* Main Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-headings:font-bold prose-p:text-gray-600 prose-a:text-orange-500 prose-strong:text-gray-800 prose-li:text-gray-600 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: blog.content || '<p>Content coming soon...</p>' }}
            />

            {/* Image Gallery */}
            {blog.images && blog.images.length > 0 && (
              <div className="my-10">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><FaNewspaper className="text-orange-500" /> Image Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {blog.images.map((img, idx) => (
                    <OptimizedImage key={idx} src={img.url} alt={img.alt_text || 'Blog image'} className="rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer hover:scale-105" width="300" height="200" />
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 my-6">
                {blog.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-orange-100 hover:text-orange-600 transition-all cursor-pointer">#{tag}</span>
                ))}
              </div>
            )}

            {/* Interaction Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 mt-6 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">Share this article:</span>
                <button className="p-2 bg-[#1877F2] text-white rounded-full hover:bg-[#1877F2]/80 transition-all" aria-label="Share on Facebook"><FaFacebook size={14} /></button>
                <button className="p-2 bg-[#1DA1F2] text-white rounded-full hover:bg-[#1DA1F2]/80 transition-all" aria-label="Share on Twitter"><FaTwitter size={14} /></button>
                <button className="p-2 bg-[#0A66C2] text-white rounded-full hover:bg-[#0A66C2]/80 transition-all" aria-label="Share on LinkedIn"><FaLinkedin size={14} /></button>
                <button onClick={handleShare} className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-all" aria-label="Copy link"><FaLink size={14} /></button>
              </div>
              {copied && <span className="text-green-500 text-sm">Link copied!</span>}
            </div>
          </div>

          {/* Right Side - 30% Sidebar */}
          <div className="lg:w-[30%] space-y-6 sticky top-24 self-start">
            <Link to="/" className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium bg-orange-50 px-4 py-3 rounded-xl transition-all"><FaArrowLeft /> Back to All Articles</Link>

            {/* Trending Posts */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3"><h3 className="text-white font-bold flex items-center gap-2"><FaFire /> Trending Now</h3></div>
              <div className="p-4 space-y-4">
                {trendingBlogs.slice(0, 4).map((post, idx) => (
                  <Link key={post._id} to={`/blog/${post.slug}`} className="flex gap-3 group cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-100 to-green-100 flex items-center justify-center font-bold text-orange-600 text-sm">{idx + 1}</div>
                    <div className="flex-1"><h4 className="text-sm font-semibold text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-2">{post.title}</h4><p className="text-xs text-gray-400 mt-1">{post.views || 0} views</p></div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-5 py-3"><h3 className="text-white font-bold flex items-center gap-2"><FaClock /> Recent Posts</h3></div>
              <div className="p-4 space-y-4">
                {recentBlogs.slice(0, 4).map((post) => (
                  <Link key={post._id} to={`/blog/${post.slug}`} className="flex gap-3 group cursor-pointer">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <OptimizedImage src={post.featured_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" width="80" height="80" />
                    </div>
                    <div className="flex-1"><h4 className="text-sm font-semibold text-gray-800 group-hover:text-green-600 transition-colors line-clamp-2">{post.title}</h4><p className="text-xs text-gray-400 mt-1">{formatDate(post.published_at)}</p></div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-green-500 px-5 py-3"><h3 className="text-white font-bold flex items-center gap-2"><FaTag /> Categories</h3></div>
              <div className="p-4 flex flex-wrap gap-2">
                {['Government Jobs', 'Sarkari Naukri', 'Exam Tips', 'Career Guide', 'Recruitment'].map(cat => (
                  <Link key={cat} to="/" className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-orange-100 hover:text-orange-600 transition-all">{cat}</Link>
                ))}
              </div>
            </div>

            {/* Job Alert Bell */}
            <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-200">
              <FaBell className="text-orange-500 text-2xl mx-auto mb-2" />
              <h4 className="font-bold text-gray-800 text-sm">Get Job Alerts</h4>
              <p className="text-xs text-gray-500 mt-1">Be the first to know</p>
              <button onClick={() => navigate("/user-dashboard")} className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-600 w-full">Enable Notifications</button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts Section */}
      {recentBlogs.length > 0 && (
        <div className="bg-gray-50 py-12 mt-8">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8"><h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">You Might Also Like</h2><p className="text-gray-500">Continue exploring career insights and opportunities</p></div>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentBlogs.slice(0, 4).map((post) => (
                <Link key={post._id} to={`/blog/${post.slug}`} className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="h-36 overflow-hidden">
                    <OptimizedImage src={post.featured_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" width="400" height="250" />
                  </div>
                  <div className="p-4"><h3 className="font-semibold text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-2 text-sm">{post.title}</h3><p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><FaCalendar size={10} /> {formatDate(post.published_at)}</p></div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 py-10"><div className="container mx-auto px-4 text-center"><p className="text-gray-400 text-sm">© 2026 CareerMitra. All rights reserved. Your trusted partner for career success.</p></div></footer>
    </div>
  );
};

export default BlogDetail;