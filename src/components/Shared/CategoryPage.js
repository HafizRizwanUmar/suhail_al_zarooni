import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import Navbar from '../Home/NavBar';
import Footer from '../Home/Footer';
import { useNavigate } from 'react-router-dom';
import './CategoryPage.css';

/* ─────────────────────────────────────────────
   Arrow components
───────────────────────────────────────────── */
const PrevArrow = ({ onClick }) => (
    <button className="cp-arrow cp-arrow--prev" onClick={onClick} aria-label="Previous slide">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 13.5L6.5 9L11 4.5" stroke="currentColor" strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </button>
);

const NextArrow = ({ onClick }) => (
    <button className="cp-arrow cp-arrow--next" onClick={onClick} aria-label="Next slide">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 4.5L11.5 9L7 13.5" stroke="currentColor" strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </button>
);

/* ─────────────────────────────────────────────
   Hero Carousel (custom — no slick dependency)
───────────────────────────────────────────── */
const HeroCarousel = ({ slides, category, onNavigate }) => {
    const [active, setActive] = useState(0);
    const [animating, setAnimating] = useState(false);
    const timerRef = useRef(null);
    const total = slides.length;

    const goTo = useCallback((idx) => {
        if (animating || idx === active) return;
        setAnimating(true);
        setActive(idx);
        setTimeout(() => setAnimating(false), 700);
    }, [active, animating]);

    const next = useCallback(() => goTo((active + 1) % total), [active, total, goTo]);
    const prev = useCallback(() => goTo((active - 1 + total) % total), [active, total, goTo]);

    /* auto-advance */
    useEffect(() => {
        timerRef.current = setInterval(next, 5500);
        return () => clearInterval(timerRef.current);
    }, [next]);

    const pause  = () => clearInterval(timerRef.current);
    const resume = () => { timerRef.current = setInterval(next, 5500); };

    return (
        <section
            className="cp-hero"
            aria-label="Featured articles"
            onMouseEnter={pause}
            onMouseLeave={resume}
        >
            {slides.map((art, i) => (
                <div
                    key={art._id}
                    className={`cp-slide ${i === active ? 'is-active' : ''}`}
                    style={{
                        position: 'absolute', inset: 0,
                        opacity: i === active ? 1 : 0,
                        transition: 'opacity 0.75s cubic-bezier(0.16,1,0.3,1)',
                        pointerEvents: i === active ? 'auto' : 'none',
                        zIndex: i === active ? 1 : 0,
                    }}
                    onClick={() => onNavigate(art)}
                    role="button"
                    tabIndex={i === active ? 0 : -1}
                    onKeyDown={(e) => e.key === 'Enter' && onNavigate(art)}
                    aria-label={`Read: ${art.title}`}
                >
                    {/* Full-bleed background image */}
                    <img
                        className="cp-slide-img"
                        src={art.imageUrl}
                        alt=""
                        aria-hidden="true"
                        loading={i === 0 ? 'eager' : 'lazy'}
                    />

                    {/* Navy gradient overlay */}
                    <div className="cp-slide-overlay" />

                    {/* Text content over image */}
                    <div className="cp-slide-content">
                        <div className="cp-slide-eyebrow">
                            <span className="cp-badge">{category}</span>
                            <span className="cp-slide-sep" />
                            <span className="cp-slide-counter">{i + 1} / {total}</span>
                        </div>

                        <h1 className="cp-slide-title">{art.title}</h1>

                        <span className="cp-slide-cta">
                            Read article
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                <path d="M2.5 7.5H12.5M8.5 3.5L12.5 7.5L8.5 11.5"
                                    stroke="currentColor" strokeWidth="1.5"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </div>
                </div>
            ))}

            {/* Arrows */}
            {total > 1 && (
                <>
                    <PrevArrow onClick={prev} />
                    <NextArrow onClick={next} />

                    {/* Progress pips */}
                    <div className="cp-pips" aria-hidden="true">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                className={`cp-pip ${i === active ? 'active' : ''}`}
                                onClick={(e) => { e.stopPropagation(); goTo(i); }}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

/* ─────────────────────────────────────────────
   Article Card
───────────────────────────────────────────── */
const ArticleCard = ({ art, featured, onClick }) => (
    <article
        className={`cp-card ${featured ? 'cp-card--featured' : ''}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
        <div className="cp-card-img-wrap">
            <img
                src={art.imageUrl}
                alt={art.title}
                className="cp-card-img"
                loading="lazy"
            />
            {art.category && (
                <span className="cp-card-tag">{art.category}</span>
            )}
        </div>

        <div className="cp-card-body">
            <h3 className="cp-card-title">{art.title}</h3>
            <div
                className="cp-card-excerpt"
                dangerouslySetInnerHTML={{
                    __html: art.content?.replace(/<[^>]+>/g, '').substring(0, featured ? 230 : 140) + '…'
                }}
            />
            <div className="cp-card-footer">
                <span className="cp-read-more">
                    Read article
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M2 6.5H11M7.5 3L11 6.5L7.5 10"
                            stroke="currentColor" strokeWidth="1.4"
                            strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </div>
        </div>
    </article>
);

/* ─────────────────────────────────────────────
   CategoryPage
───────────────────────────────────────────── */
const CategoryPage = ({ category, title }) => {
    const [articles, setArticles]   = useState([]);
    const [loading, setLoading]     = useState(true);
    const navigate                  = useNavigate();

    const displayTitle = title || category;

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/articles');
                const filtered = data.data.filter(
                    art => art.category?.toLowerCase() === category.toLowerCase()
                );
                setArticles(filtered);
            } catch (err) {
                console.error('Error fetching articles:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, [category]);

    const handleNavigate = (art) =>
        navigate(`/article/${art.slug || art._id}`);

    if (loading) {
        return (
            <div className="category-page">
                <Navbar />
                <div className="cp-loading">
                    <div className="cp-loading-track">
                        <div className="cp-loading-fill" />
                    </div>
                    <span className="cp-loading-label">Loading {displayTitle}</span>
                </div>
                <Footer />
            </div>
        );
    }

    const heroSlides = articles.slice(0, 5);

    return (
        <div className="category-page">
            <Navbar />

            {/* ── Hero Carousel ── */}
            {heroSlides.length > 0 && (
                <HeroCarousel
                    slides={heroSlides}
                    category={displayTitle}
                    onNavigate={handleNavigate}
                />
            )}

            {/* ── Articles Grid ── */}
            <section className="cp-section">
                <header className="cp-section-header">
                    <span className="cp-section-eyebrow">Latest</span>
                    <h2 className="cp-section-title">{displayTitle}</h2>
                </header>

                {articles.length === 0 ? (
                    <div className="cp-empty">
                        <p>No articles in <em>{displayTitle}</em> yet.</p>
                    </div>
                ) : (
                    <div className="cp-grid">
                        {articles.map((art, i) => (
                            <ArticleCard
                                key={art._id}
                                art={art}
                                featured={i === 0}
                                onClick={() => handleNavigate(art)}
                            />
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
};

export default CategoryPage;