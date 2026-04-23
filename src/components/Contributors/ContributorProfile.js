import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Home/NavBar';
import Footer from '../Home/Footer';
import '../../styles/Contributors.css';
import '../../styles/ArticlesCarousel.css';

const ContributorProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contributor, setContributor] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContributorData = async () => {
            try {
                const [usersRes, articlesRes] = await Promise.all([
                    axios.get('https://suhail-al-zarooni-backend.vercel.app/allUsers'),
                    axios.get('https://suhail-al-zarooni-backend.vercel.app/articles')
                ]);

                const user = usersRes.data.data.find(u => u._id === id);
                if (!user) {
                    navigate('/contributors');
                    return;
                }

                const userArticles = articlesRes.data.data.filter(a => a.userId === id);
                
                setContributor(user);
                setArticles(userArticles);
                setLoading(false);
                document.title = `${user.firstName} ${user.lastName} | Contributor Profile`;
            } catch (err) {
                console.error("Error fetching profile:", err);
                setLoading(false);
            }
        };

        fetchContributorData();
        window.scrollTo(0, 0);
    }, [id, navigate]);

    if (loading) return (
        <div className="contributors-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h2 style={{ color: '#c8a96e' }}>Unveiling the contributor...</h2>
        </div>
    );

    const initials = (contributor.firstName?.charAt(0) || '') + (contributor.lastName?.charAt(0) || '');

    return (
        <>
            <Navbar />
            <div className="contributors-page">
                <header className="profile-header">
                    <div className="profile-avatar-large">
                        {contributor.role === 'super_admin' ? (
                            <img 
                                src="/zarooni.png" 
                                alt="Zarooni" 
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                            />
                        ) : contributor.profilePicture ? (
                            <img 
                                src={contributor.profilePicture} 
                                alt={contributor.firstName} 
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                            />
                        ) : (
                            initials.toUpperCase()
                        )}
                    </div>
                    <h1 className="profile-name">{contributor.firstName} {contributor.lastName}</h1>
                    <p className="page-subtitle" style={{ marginBottom: 0 }}>{contributor.role?.replace('_', ' ')}</p>
                    
                    <div className="profile-meta">
                        <div className="stat-item">
                            <span className="stat-num">{articles.length}</span>
                            <span className="stat-label">Published Articles</span>
                        </div>
                    </div>
                </header>

                <section className="articles-section">
                    <div className="section-header" style={{ textAlign: 'left' }}>
                        <h2 style={{ fontSize: '2.5rem' }}>Recent Publications</h2>
                        <p style={{ color: '#c8a96e', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Curated work by {contributor.firstName}
                        </p>
                        <div style={{ width: '60px', height: '4px', background: 'var(--gold-grad)', marginTop: '10px' }}></div>
                    </div>

                    {articles.length === 0 ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>
                            This contributor hasn't published any articles yet.
                        </div>
                    ) : (
                        <div className="articles-grid">
                            {articles.map(article => (
                                <div 
                                    key={article._id} 
                                    className="article-card" 
                                    onClick={() => navigate(`/article/${article.slug || article._id}`)}
                                    style={{ background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }}
                                >
                                    <img src={article.imageUrl} alt={article.title} className="article-card-image" />
                                    <div className="article-card-title" style={{ color: '#fff' }}>{article.title}</div>
                                    <div className="article-card-excerpt" style={{ color: '#aaa' }}>
                                        {article.content ? article.content.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...' : ''}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
            <Footer />
        </>
    );
};

export default ContributorProfilePage;
