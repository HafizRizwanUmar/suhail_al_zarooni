import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import ContributorCard from './ContributorCard';
import '../../styles/Contributors.css';

const TopContributors = ({ limit = 3, showHeader = true }) => {
    const [topContributors, setTopContributors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch users and articles in parallel
                const [usersRes, articlesRes] = await Promise.all([
                    axios.get('http://localhost:5000/allUsers'),
                    axios.get('http://localhost:5000/articles')
                ]);

                const users = usersRes.data.data;
                const articles = articlesRes.data.data;

                // Map users to their article counts
                const contributorsWithCounts = users
                    .filter(u => u.role === 'contributor' || u.role === 'admin' || u.role === 'editor')
                    .map(user => {
                        const userArticles = articles.filter(a => a.userId === user._id);
                        const articleCount = userArticles.length;
                        const totalViews = userArticles.reduce((sum, art) => sum + (art.views || 0), 0);
                        
                        return { ...user, articleCount, totalViews };
                    })
                    // Sort by views descending
                    .sort((a, b) => b.totalViews - a.totalViews)
                    .slice(0, limit);

                setTopContributors(contributorsWithCounts);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching contributors:", err);
                setLoading(false);
            }
        };

        fetchData();
    }, [limit]);

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    if (loading) return null;
    if (topContributors.length === 0) return null;

    return (
        <section className="top-contributors-section">
            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="contributors-container"
            >
                {showHeader && (
                    <motion.div variants={fadeInUp} className="section-header">
                        <span className="section-label">Performance Leaders</span>
                        <h2>Top Contributors</h2>
                        <div className="section-underline" />
                    </motion.div>
                )}
                
                <motion.div variants={staggerContainer} className="top-table-container">
                    {topContributors.map((contributor) => {
                        const initials = (contributor.firstName?.charAt(0) || '') + (contributor.lastName?.charAt(0) || '');
                        
                        return (
                            <motion.div 
                                key={contributor._id} 
                                variants={fadeInUp}
                                whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                                className="top-table-row"
                            >
                                <div className="top-table-left">
                                    <div className="top-table-avatar">
                                        {contributor.role === 'super_admin' ? (
                                            <img src="/zarooni.png" alt="Zarooni" className="table-avatar-img" />
                                        ) : contributor.profilePicture ? (
                                            <img src={contributor.profilePicture} alt={contributor.firstName} className="table-avatar-img" />
                                        ) : (
                                            <span className="table-avatar-initials">{initials.toUpperCase()}</span>
                                        )}
                                    </div>
                                    <h3 className="top-table-name">
                                        {contributor.firstName} {contributor.lastName}
                                    </h3>
                                </div>
                                <div className="top-table-right">
                                    <div className="top-table-metric">
                                        <span className="table-views-count">{contributor.totalViews.toLocaleString()}</span>
                                        <span className="table-views-label">Article Views</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default TopContributors;
