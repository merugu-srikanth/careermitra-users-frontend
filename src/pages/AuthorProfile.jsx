import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SEO from "../components/SEO";

const AuthorProfile = () => {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const slugify = (value = "") =>
    String(value)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const formatSlugToName = (value = "") =>
    String(value)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const getAuthorName = (blog) =>
    blog?.author?.author_name || blog?.author_name || "";

  const authorName = useMemo(() => {
    if (blogs.length > 0) return getAuthorName(blogs[0]) || formatSlugToName(slug);
    return formatSlugToName(slug);
  }, [blogs, slug]);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("https://careermitra.tech/api/blogs?page=1&limit=100");
        const data = await res.json();

        const rawBlogs = Array.isArray(data?.data?.blogs)
          ? data.data.blogs
          : Array.isArray(data?.blogs)
            ? data.blogs
            : [];

        const filtered = rawBlogs.filter((b) => slugify(getAuthorName(b)) === slug);

        setBlogs(filtered);
        setAllBlogs(rawBlogs);
      } catch {
        setError("Unable to load author blogs right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [slug]);

  const otherBlogs = allBlogs
    .filter((b) => slugify(getAuthorName(b)) !== slug)
    .slice(0, 6);

  return (
    <>
      <SEO
        title={`${authorName} | Career Mitra Author`}
        description={`Read articles written by ${authorName} on Career Mitra.`}
        keywords={`${authorName}, author, career blog, govt jobs`}
        url={`https://www.careermitra.in/author/${slug}`}
      />

      <div style={{ background: "#ffffff", minHeight: "100vh" }}>
        {/* Subtle Background Pattern */}
        <div style={styles.bgPattern}></div>

        {/* Hero Section */}
        <div style={styles.heroSection}>
          <div style={styles.heroContent}>
            <div style={styles.avatarContainer}>
              <div style={styles.avatarRing}></div>
              <div style={styles.avatar}>
                {authorName?.charAt(0)?.toUpperCase()}
              </div>
            </div>
            <h1 style={styles.authorName}>{authorName}</h1>
            <div style={styles.statsWrapper}>
              <div style={styles.statCard}>
                <span style={styles.statNumber}>{blogs.length}</span>
                <span style={styles.statLabel}>Articles</span>
              </div>
              <div style={styles.statDivider}></div>
              <div style={styles.statCard}>
                <span style={styles.statNumber}>
                  {blogs.reduce((sum, blog) => sum + (blog.views || 0), 0).toLocaleString()}
                </span>
                <span style={styles.statLabel}>Total Reads</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.container}>
          {loading && (
            <div style={styles.loaderWrapper}>
              <div style={styles.loader}></div>
              <p style={styles.loaderText}>Loading articles...</p>
            </div>
          )}

          {error && !loading && (
            <div style={styles.errorWrapper}>
              <p style={styles.errorText}>{error}</p>
            </div>
          )}

          {!loading && !error && blogs.length === 0 && (
            <div style={styles.emptyWrapper}>
              <p style={styles.emptyText}>No blogs found by {authorName}</p>
            </div>
          )}

          {!loading && !error && blogs.length > 0 && (
            <>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Articles by {authorName}</h2>
                <div style={styles.sectionLine}></div>
              </div>

              <div style={styles.blogsGrid}>
                {blogs.map((blog, index) => (
                  <Link
                    key={blog._id}
                    to={`/blog/${blog.slug}`}
                    style={styles.blogLink}
                    className="blog-card"
                  >
                    <div style={styles.blogCard}>
                      {blog.featured_image && (
                        <div style={styles.imageWrapper}>
                          <img
                            src={blog.featured_image}
                            alt={blog.image_alt_text || blog.title}
                            style={styles.blogImage}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          <div style={styles.imageOverlay}></div>
                        </div>
                      )}
                      <div style={styles.blogContent}>
                        <h3 style={styles.blogTitle}>{blog.title}</h3>
                        <p style={styles.blogDescription}>{blog.short_description}</p>
                        <div style={styles.readMore}>
                          <span>Read Article</span>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {!loading && !error && otherBlogs.length > 0 && (
            <>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>More Blogs You May Like</h2>
                <div style={styles.sectionLine}></div>
              </div>

              <div style={styles.otherBlogsGrid}>
                {otherBlogs.map((blog) => (
                  <Link
                    key={blog._id}
                    to={`/blog/${blog.slug}`}
                    style={styles.otherBlogLink}
                    className="other-blog-card"
                  >
                    <div style={styles.otherBlogCard}>
                      <h4 style={styles.otherBlogTitle}>{blog.title}</h4>
                      <p style={styles.otherBlogDescription}>{blog.short_description}</p>
                      <div style={styles.otherBlogFooter}>
                        <span style={styles.otherBlogAuthor}>
                          By {getAuthorName(blog) || "Career Mitra"}
                        </span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
        
        .blog-card {
          animation: slideUp 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .other-blog-card {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .blog-card:hover {
          transform: translateY(-8px);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .other-blog-card:hover {
          transform: translateY(-4px);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </>
  );
};

const styles = {
  // Background Pattern
  bgPattern: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 20% 50%, rgba(249, 115, 22, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(249, 115, 22, 0.02) 0%, transparent 50%),
      repeating-linear-gradient(45deg, rgba(249, 115, 22, 0.01) 0px, rgba(249, 115, 22, 0.01) 1px, transparent 1px, transparent 20px)
    `,
    pointerEvents: "none",
    zIndex: 0,
  },

  // Hero Section
  heroSection: {
    background: "linear-gradient(135deg, #fff8f0 0%, #ffffff 100%)",
    borderBottom: "1px solid rgba(249, 115, 22, 0.1)",
    padding: "80px 20px 60px",
    position: "relative",
    zIndex: 1,
  },
  heroContent: {
    maxWidth: 900,
    margin: "0 auto",
    textAlign: "center",
  },
  avatarContainer: {
    position: "relative",
    width: 120,
    height: 120,
    margin: "0 auto 24px",
  },
  avatarRing: {
    position: "absolute",
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #f97316, #fed7aa, #f97316)",
    animation: "pulse 2s ease-in-out infinite",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #f97316, #ea580c)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 48,
    fontWeight: "bold",
    color: "#ffffff",
    position: "relative",
    zIndex: 1,
    boxShadow: "0 8px 20px rgba(249, 115, 22, 0.2)",
  },
  authorName: {
    fontSize: "clamp(2rem, 5vw, 3rem)",
    fontWeight: "700",
    color: "#111827",
    marginBottom: 24,
    letterSpacing: "-0.02em",
  },
  statsWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
  },
  statCard: {
    textAlign: "center",
  },
  statNumber: {
    display: "block",
    fontSize: "clamp(1.5rem, 3vw, 2rem)",
    fontWeight: "700",
    color: "#f97316",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: "0.875rem",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  statDivider: {
    width: 1,
    height: 40,
    background: "linear-gradient(to bottom, transparent, #f97316, transparent)",
  },

  // Container
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "48px 24px 80px",
    position: "relative",
    zIndex: 1,
  },

  // Section Header
  sectionHeader: {
    textAlign: "center",
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  sectionLine: {
    width: 60,
    height: 3,
    background: "linear-gradient(90deg, #f97316, #fed7aa, #f97316)",
    margin: "0 auto",
    borderRadius: 2,
  },

  // Blogs Grid
  blogsGrid: {
    display: "grid",
    gap: 28,
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    marginBottom: 60,
  },
  blogLink: {
    textDecoration: "none",
    color: "inherit",
  },
  blogCard: {
    background: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid rgba(249, 115, 22, 0.15)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  imageWrapper: {
    position: "relative",
    overflow: "hidden",
    height: 200,
  },
  blogImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(to bottom, transparent, rgba(249, 115, 22, 0.05))",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  blogContent: {
    padding: 20,
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  blogTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: 10,
    lineHeight: 1.4,
  },
  blogDescription: {
    fontSize: "0.875rem",
    color: "#6b7280",
    lineHeight: 1.6,
    marginBottom: 16,
    flex: 1,
  },
  readMore: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#f97316",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "gap 0.3s ease",
  },

  // Other Blogs Grid
  otherBlogsGrid: {
    display: "grid",
    gap: 20,
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  },
  otherBlogLink: {
    textDecoration: "none",
    color: "inherit",
  },
  otherBlogCard: {
    background: "#ffffff",
    padding: 20,
    borderRadius: 14,
    border: "1px solid rgba(249, 115, 22, 0.12)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    transition: "all 0.3s ease",
  },
  otherBlogTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    lineHeight: 1.4,
  },
  otherBlogDescription: {
    fontSize: "0.8125rem",
    color: "#6b7280",
    lineHeight: 1.5,
    marginBottom: 12,
  },
  otherBlogFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  otherBlogAuthor: {
    fontSize: "0.75rem",
    color: "#f97316",
    fontWeight: "500",
  },

  // Loader
  loaderWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
  },
  loader: {
    width: 48,
    height: 48,
    border: "3px solid rgba(249, 115, 22, 0.2)",
    borderTop: "3px solid #f97316",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loaderText: {
    marginTop: 16,
    color: "#6b7280",
    fontSize: "0.875rem",
  },

  // Error & Empty States
  errorWrapper: {
    textAlign: "center",
    padding: "60px 20px",
  },
  errorText: {
    color: "#ef4444",
    fontSize: "1rem",
  },
  emptyWrapper: {
    textAlign: "center",
    padding: "60px 20px",
  },
  emptyText: {
    color: "#6b7280",
    fontSize: "1rem",
  },
};

export default AuthorProfile;