import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Home/NavBar';
import Footer from '../Home/Footer';
import ContributorCard from './ContributorCard';
import TopContributors from './TopContributors';
import '../../styles/Contributors.css';

const ContributorsPage = () => {
    const [contributors, setContributors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContributors = async () => {
            try {
                const [usersRes, articlesRes] = await Promise.all([
                    axios.get('https://suhail-al-zarooni-backend.vercel.app/allUsers'),
                    axios.get('https://suhail-al-zarooni-backend.vercel.app/articles'),
                ]);

                const users    = usersRes.data.data;
                const articles = articlesRes.data.data;

                const contributorsWithCounts = users
                    .filter(u =>
                        u.role === 'contributor' ||
                        u.role === 'admin'        ||
                        u.role === 'editor'
                    )
                    .map(user => ({
                        ...user,
                        articleCount: articles.filter(a => a.userId === user._id).length,
                    }))
                    .sort((a, b) => b.articleCount - a.articleCount);

                setContributors(contributorsWithCounts);
                document.title = 'Our Contributors | Suhail Al Zarooni';
            } catch (err) {
                console.error('Error fetching contributors:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchContributors();
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Navbar />
            <div className="contributors-page">
                <div className="contributors-container">
                    {/* ── Hero ── */}
                    <div className="page-hero">
                        <p className="page-eyebrow">Est. 2024</p>
                        <h1 className="page-title">
                            The <em>Visionaries</em>
                        </h1>
                        <p className="page-subtitle">Celebrating the voices behind our stories</p>
                    </div>

                    {/* ── Top 3 Featured ── */}
                    <TopContributors limit={3} showHeader={false} />

                    {/* ── Gold divider ── */}
                    <div className="gold-divider">
                        <div className="gold-divider-diamond" />
                    </div>

                    {/* ── All Contributors ── */}
                    <div className="section-header">
                        <span className="section-label">The Full Roster</span>
                        <h2>All Contributors</h2>
                        <div className="section-underline" />
                    </div>

                    {loading ? (
                        <div className="contributors-loading">
                            <div className="loading-dot" />
                            <div className="loading-dot" />
                            <div className="loading-dot" />
                            <span style={{ marginLeft: 8 }}>Gathering our contributors</span>
                        </div>
                    ) : (
                        <div className="contributor-grid">
                            {contributors.map((contributor, index) => (
                                <ContributorCard
                                    key={contributor._id}
                                    contributor={contributor}
                                    rank={index + 1}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ContributorsPage;
