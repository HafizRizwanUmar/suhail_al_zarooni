import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    EyeOutlined,
    LikeOutlined,
    LikeFilled,
    ArrowLeftOutlined,
    LinkedinFilled,
    TwitterOutlined,
    FacebookFilled,
    WhatsAppOutlined,
    CopyOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import { notification, Tooltip } from 'antd';
import Navbar from '../Home/NavBar';
import Footer from '../Home/Footer';
import { useAuth } from '../../context/AuthContext';

/* ─────────────────────────────────────────────
   Injected global styles (scoped to component)
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --ink:      #0f0f0f;
    --ink-soft: #4a4a4a;
    --ink-mute: #8a8a8a;
    --cream:    #faf9f7;
    --white:    #ffffff;
    --accent:   #00124e;
    --accent-2: #c8a96e;
    --rule:     #e8e6e1;
    --radius:   4px;
    --serif:    'Cormorant Garamond', Georgia, serif;
    --sans:     'DM Sans', system-ui, sans-serif;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.08);
    --shadow-lg: 0 16px 48px rgba(0,0,0,0.12);
  }

  .adp-root * { box-sizing: border-box; }
  .adp-root { font-family: var(--sans); background: var(--cream); min-height: 100vh; }

  /* ── Back button ── */
  .adp-back {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--sans); font-size: 13px; font-weight: 500;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: var(--ink-mute); border: none; background: none;
    cursor: pointer; padding: 0; transition: color 0.2s;
    text-decoration: none;
  }
  .adp-back:hover { color: var(--accent); }
  .adp-back svg { transition: transform 0.2s; }
  .adp-back:hover svg { transform: translateX(-3px); }

  /* ── Hero ── */
  .adp-hero {
    position: relative; overflow: hidden;
    background: var(--accent);
    min-height: 520px; display: flex; align-items: flex-end;
  }
  .adp-hero-img {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; display: block;
    opacity: 0.35;
    transform: scale(1.04);
    transition: opacity 0.8s ease, transform 1.2s ease;
  }
  .adp-hero-img.loaded { opacity: 0.38; transform: scale(1); }
  .adp-hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,18,78,0.92) 0%, rgba(0,18,78,0.45) 55%, rgba(0,18,78,0.15) 100%);
  }
  .adp-hero-content {
    position: relative; z-index: 2;
    width: 100%; max-width: 1100px; margin: 0 auto;
    padding: 60px 40px 56px;
  }

  /* ── Category badge ── */
  .adp-badge {
    display: inline-block;
    font-family: var(--sans); font-size: 10px; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--accent-2); border: 1px solid var(--accent-2);
    padding: 4px 12px; border-radius: 2px; margin-bottom: 20px;
  }

  /* ── Hero title ── */
  .adp-title {
    font-family: var(--serif); font-size: clamp(2rem, 5vw, 3.4rem);
    font-weight: 400; line-height: 1.18; letter-spacing: -0.01em;
    color: #fff; margin: 0 0 28px;
  }

  /* ── Meta row ── */
  .adp-meta {
    display: flex; align-items: center; flex-wrap: wrap; gap: 20px;
    font-size: 13px; color: rgba(255,255,255,0.65);
    font-family: var(--sans);
  }
  .adp-meta-item { display: flex; align-items: center; gap: 6px; }
  .adp-meta-sep { width: 3px; height: 3px; background: rgba(255,255,255,0.35); border-radius: 50%; }

  /* ── Layout ── */
  .adp-layout {
    max-width: 1100px; margin: 0 auto; padding: 0 40px 80px;
  }

  /* ── Body card ── */
  .adp-body {
    background: var(--white);
    border: 1px solid var(--rule);
    border-top: none;
    padding: 56px 64px;
    box-shadow: var(--shadow-md);
    position: relative;
  }
  .adp-body::before {
    content: ''; display: block;
    width: 48px; height: 3px; background: var(--accent-2);
    margin-bottom: 48px;
  }

  /* ── Article content typography ── */
  .adp-content { font-family: var(--sans); font-size: 17px; line-height: 1.82; color: var(--ink); }
  .adp-content p { margin: 0 0 1.5em; }
  .adp-content h2 {
    font-family: var(--serif); font-size: 1.9rem; font-weight: 500;
    letter-spacing: -0.01em; color: var(--accent);
    margin: 2.2em 0 0.6em; line-height: 1.2;
  }
  .adp-content h3 {
    font-family: var(--serif); font-size: 1.45rem; font-weight: 500;
    color: var(--ink); margin: 1.8em 0 0.5em;
  }
  .adp-content blockquote {
    border-left: 3px solid var(--accent-2);
    margin: 2em 0; padding: 4px 0 4px 28px;
    font-family: var(--serif); font-size: 1.25rem; font-style: italic;
    color: var(--ink-soft); line-height: 1.6;
  }
  .adp-content a { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
  .adp-content img { max-width: 100%; border-radius: var(--radius); margin: 1.5em 0; }
  .adp-content ul, .adp-content ol { padding-left: 1.6em; margin: 0 0 1.5em; }
  .adp-content li { margin-bottom: 0.5em; }
  .adp-content strong { font-weight: 600; color: var(--ink); }

  /* ── Divider ── */
  .adp-rule { border: none; border-top: 1px solid var(--rule); margin: 48px 0; }

  /* ── Actions row ── */
  .adp-actions {
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 20px;
  }

  /* ── Like button ── */
  .adp-like-btn {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: var(--sans); font-size: 14px; font-weight: 500;
    letter-spacing: 0.04em;
    padding: 12px 28px; border-radius: 2px; cursor: pointer;
    transition: all 0.22s ease; border: 1.5px solid var(--accent);
    background: transparent; color: var(--accent);
  }
  .adp-like-btn:hover {
    background: var(--accent); color: #fff;
    box-shadow: 0 4px 14px rgba(0,18,78,0.22);
  }
  .adp-like-btn.liked {
    background: var(--accent); color: #fff;
    box-shadow: 0 4px 14px rgba(0,18,78,0.22);
  }
  .adp-like-btn .count {
    font-size: 12px; opacity: 0.75; font-weight: 400;
  }

  /* ── Share section ── */
  .adp-share { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .adp-share-label {
    font-family: var(--sans); font-size: 12px; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--ink-mute); font-weight: 500;
    margin-right: 4px;
  }
  .adp-share-btn {
    width: 38px; height: 38px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: 1.5px solid var(--rule); background: transparent;
    color: var(--ink-mute); cursor: pointer;
    transition: all 0.2s ease; font-size: 15px;
  }
  .adp-share-btn:hover {
    border-color: var(--accent); color: var(--accent);
    background: rgba(0,18,78,0.05);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }

  /* ── Reading progress bar ── */
  .adp-progress {
    position: fixed; top: 0; left: 0; height: 2px;
    background: var(--accent-2); z-index: 9999;
    transition: width 0.1s linear;
    box-shadow: 0 0 8px rgba(200,169,110,0.5);
  }

  /* ── Floating stats pill ── */
  .adp-stats-pill {
    display: flex; align-items: center; gap: 18px;
    background: rgba(255,255,255,0.96);
    border: 1px solid var(--rule);
    border-radius: 100px; padding: 10px 22px;
    font-size: 13px; color: var(--ink-soft);
    box-shadow: var(--shadow-md);
    position: sticky; top: 80px; float: right;
    margin: 0 10px 32px 32px; /* Fixed: Removed negative -80px margin that caused overflow */
    font-family: var(--sans);
    z-index: 10;
  }
  .adp-stats-pill .stat { display: flex; align-items: center; gap: 5px; }
  .adp-stats-pill .stat-num { font-weight: 600; color: var(--ink); }

  /* ── Skeleton loader ── */
  .adp-skeleton { animation: adp-pulse 1.6s ease-in-out infinite; }
  @keyframes adp-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.45; }
  }
  .adp-skel-bar {
    background: #e2e0db; border-radius: 3px; display: block;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .adp-hero-content { padding: 40px 20px 44px; }
    .adp-layout { padding: 0 16px 60px; }
    .adp-body { padding: 36px 24px; }
    .adp-stats-pill { display: none; }
    .adp-actions { flex-direction: column; align-items: flex-start; }
    .adp-title { font-size: 1.9rem; }
  }

  /* ── Entry animation ── */
  @keyframes adp-fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .adp-fade-up { animation: adp-fade-up 0.6s ease both; }
  .adp-delay-1 { animation-delay: 0.1s; }
  .adp-delay-2 { animation-delay: 0.2s; }
  .adp-delay-3 { animation-delay: 0.35s; }
`;

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function getDeviceId() {
    let id = localStorage.getItem('cp_device_id');
    if (!id) {
        id = 'dev_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('cp_device_id', id);
    }
    return id;
}

function estimateReadTime(html = '') {
    const text = html.replace(/<[^>]+>/g, '');
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
}

/* ─────────────────────────────────────────────
   Skeleton
───────────────────────────────────────────── */
const Skeleton = () => (
    <div className="adp-root">
        <div className="adp-hero adp-skeleton" style={{ minHeight: 440, background: '#d1cfc9' }} />
        <div className="adp-layout" style={{ paddingTop: 0 }}>
            <div className="adp-body" style={{ marginTop: 0 }}>
                {[90, 70, 100, 60, 85, 75].map((w, i) => (
                    <span key={i} className="adp-skel-bar" style={{ width: `${w}%`, height: 16, marginBottom: 14 }} />
                ))}
            </div>
        </div>
    </div>
);

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
const ArticleDetailPage = () => {
    const { id } = useParams();
    useAuth(); // Context call remained for potential side effects or future use, but removed unused destructuring
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [readPct, setReadPct] = useState(0);

    const deviceId = getDeviceId();

    /* Reading progress */
    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement;
            const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
            setReadPct(Math.min(100, pct));
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const [author, setAuthor] = useState(null);

    const fetchArticle = useCallback(async () => {
        try {
            const [artRes, usersRes] = await Promise.all([
                axios.get(`https://suhail-al-zarooni-backend.vercel.app/articles?all=true`),
                axios.get(`https://suhail-al-zarooni-backend.vercel.app/allUsers`)
            ]);
            
            const found = artRes.data.data.find(a => a._id === id || a.slug === id);
            if (!found) {
                notification.error({ message: 'Article not found' });
                navigate('/home');
                return;
            }

            // Find matching author
            const matchedAuthor = usersRes.data.data.find(u => u._id === found.userId);
            setAuthor(matchedAuthor);

            setArticle(found);
            setLiked(found.likedBy?.includes(deviceId));
            setLoading(false);
            
            axios.put(`https://suhail-al-zarooni-backend.vercel.app/articles/${found._id}/view`);
            document.title = `${found.title} | Suhail Al Zarooni`;
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }, [id, navigate, deviceId]);

    useEffect(() => { fetchArticle(); }, [fetchArticle]);

    const handleLike = async () => {
        try {
            const { data } = await axios.post(
                `https://suhail-al-zarooni-backend.vercel.app/articles/${article._id}/like`, 
                { deviceId }
            );
            setArticle({ ...article, likes: data.likes });
            setLiked(data.liked);
        } catch {
            notification.error({ message: 'Action failed' });
        }
    };

    const handleShare = (platform) => {
        const url = window.location.href;
        const text = `Check out this article: ${article.title}`;
        const map = {
            twitter:  `https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(text)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
        };
        if (platform === 'copy') {
            navigator.clipboard.writeText(url);
            notification.success({ message: 'Link copied to clipboard!' });
            return;
        }
        if (map[platform]) window.open(map[platform], '_blank', 'noopener');
    };

    if (loading) return <Skeleton />;

    const readTime = estimateReadTime(article.content);
    const dateStr = new Date(article.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const shareButtons = [
        { key: 'twitter',  icon: <TwitterOutlined />,  label: 'Twitter' },
        { key: 'facebook', icon: <FacebookFilled />,   label: 'Facebook' },
        { key: 'linkedin', icon: <LinkedinFilled />,   label: 'LinkedIn' },
        { key: 'whatsapp', icon: <WhatsAppOutlined />, label: 'WhatsApp' },
        { key: 'copy',     icon: <CopyOutlined />,     label: 'Copy link' },
    ];

    return (
        <>
            <style>{STYLES}</style>
            <div className="adp-root">
                {/* Reading progress bar */}
                <div className="adp-progress" style={{ width: `${readPct}%` }} />

                <Navbar />

                {/* ── Hero ── */}
                <div className="adp-hero">
                    {article.imageUrl && (
                        <img
                            className={`adp-hero-img ${imgLoaded ? 'loaded' : ''}`}
                            src={article.imageUrl}
                            alt={article.title}
                            onLoad={() => setImgLoaded(true)}
                        />
                    )}
                    <div className="adp-hero-overlay" />
                    <div className="adp-hero-content">
                        <button className="adp-back adp-fade-up" onClick={() => navigate(-1)}>
                            <ArrowLeftOutlined style={{ fontSize: 12 }} /> Back to articles
                        </button>

                        {article.category && (
                            <div className="adp-badge adp-fade-up adp-delay-1">
                                {article.category}
                            </div>
                        )}

                        <h1 className="adp-title adp-fade-up adp-delay-2">{article.title}</h1>

                        <div className="adp-meta adp-fade-up adp-delay-3">
                            <span className="adp-meta-item">
                                <CalendarOutlined /> {dateStr}
                            </span>
                            <span className="adp-meta-sep" />
                            <span className="adp-meta-item">
                                <ClockCircleOutlined /> {readTime} min read
                            </span>
                            <span className="adp-meta-sep" />
                            <span className="adp-meta-item">
                                <EyeOutlined /> {(article.views || 0).toLocaleString()} views
                            </span>
                            <span className="adp-meta-sep" />
                            <span className="adp-meta-item">
                                <LikeOutlined /> {(article.likes || 0).toLocaleString()} likes
                            </span>
                            {author && (
                                <>
                                    <span className="adp-meta-sep" />
                                    <span className="adp-meta-item">
                                        {author.role === 'super_admin' ? (
                                            <img src="/zarooni.png" alt="Zarooni" style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.3)' }} />
                                        ) : author.profilePicture ? (
                                            <img src={author.profilePicture} alt={author.firstName} style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.3)' }} />
                                        ) : null}
                                        <span style={{ marginLeft: '8px' }}>Published by</span> 
                                        <a href={`/contributor/${author._id}`} className="publisher-name" style={{ marginLeft: '5px', color: 'var(--accent-2)', fontWeight: '600' }}>
                                            {author.firstName} {author.lastName}
                                        </a>
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="adp-layout">
                    <div className="adp-body">
                        {/* Floating stats (desktop only) */}
                        <div className="adp-stats-pill">
                            <span className="stat">
                                <EyeOutlined />
                                <span className="stat-num">{(article.views || 0).toLocaleString()}</span>
                                <span>views</span>
                            </span>
                            <span className="adp-meta-sep" style={{ background: '#ccc', width: 1, height: 16, display: 'block' }} />
                            <span className="stat">
                                {liked ? <LikeFilled style={{ color: '#00124e' }} /> : <LikeOutlined />}
                                <span className="stat-num">{(article.likes || 0).toLocaleString()}</span>
                                <span>likes</span>
                            </span>
                        </div>

                        {/* Article HTML content */}
                        <div
                            className="adp-content"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        <hr className="adp-rule" />

                        {/* ── Actions ── */}
                        <div className="adp-actions">
                            <button
                                className={`adp-like-btn ${liked ? 'liked' : ''}`}
                                onClick={handleLike}
                                aria-label={liked ? 'Unlike article' : 'Like article'}
                            >
                                {liked ? <LikeFilled /> : <LikeOutlined />}
                                {liked ? 'Liked' : 'Like this article'}
                                <span className="count">({(article.likes || 0).toLocaleString()})</span>
                            </button>

                            <div className="adp-share">
                                <span className="adp-share-label">Share</span>
                                {shareButtons.map(({ key, icon, label }) => (
                                    <Tooltip key={key} title={label}>
                                        <button
                                            className="adp-share-btn"
                                            onClick={() => handleShare(key)}
                                            aria-label={label}
                                        >
                                            {icon}
                                        </button>
                                    </Tooltip>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
};

export default ArticleDetailPage;
