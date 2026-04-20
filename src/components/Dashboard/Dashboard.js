import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import AddArticle from './AddArticle';
import Article from './AllArticle';
import Users from './AllUsers';
import DashboardLayout from './DashboardLayout';
import ApprovalQueue from './ApprovalQueue';
import { Row, Col, Statistic } from 'antd';
import {
    FileTextOutlined,
    EyeOutlined,
    LikeOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';

const AdminDashboard = () => {
    const { token, user } = useAuth();
    const [currentView, setCurrentView] = useState('overview');
    const [stats, setStats] = useState({
        totalArticles:    0,
        totalViews:       0,
        totalLikes:       0,
        pendingApprovals: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStats(data);
            } catch (err) {
                console.error('Error fetching stats:', err);
            }
        };
        if (token) fetchStats();
    }, [token]);

    const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

    /* ── stat card metadata ── */
    const statItems = [
        {
            key:    'articles',
            title:  isAdmin ? 'Global Articles' : 'My Articles',
            value:  stats.totalArticles,
            icon:   <FileTextOutlined />,
            color:  'var(--gold)',
        },
        {
            key:    'views',
            title:  isAdmin ? 'Global Views' : 'My Views',
            value:  stats.totalViews,
            icon:   <EyeOutlined />,
            color:  'var(--accent-blue)',
        },
        {
            key:    'likes',
            title:  isAdmin ? 'Global Likes' : 'Total Likes',
            value:  stats.totalLikes,
            icon:   <LikeOutlined />,
            color:  'var(--accent-green)',
        },
        {
            key:    'pending',
            title:  'Pending Approvals',
            value:  stats.pendingApprovals,
            icon:   <ClockCircleOutlined />,
            color:  stats.pendingApprovals > 0 ? 'var(--accent-red)' : 'var(--accent-green)',
        },
    ];

    const renderContent = () => {
        switch (currentView) {
            case 'addArticle': return <AddArticle />;
            case 'articles':   return <Article />;
            case 'users':      return <Users />;
            case 'approval':   return <ApprovalQueue />;
            case 'overview':
            default:
                return (
                    <div>
                        {/* Page header */}
                        <div className="page-header">
                            <h2>Welcome back, {user?.firstName}.</h2>
                            <p>
                                {isAdmin
                                    ? 'Here is your system overall performance at a glance.'
                                    : 'Here is your content performance overview.'}
                            </p>
                        </div>

                        {/* Stat cards */}
                        <Row gutter={[14, 14]}>
                            {statItems.map((item) => (
                                <Col key={item.key} xs={24} sm={12} lg={6}>
                                    <div className="stat-card">
                                        {/* Icon row */}
                                        <div style={{
                                            width: 38,
                                            height: 38,
                                            borderRadius: 10,
                                            background: `color-mix(in srgb, ${item.color} 15%, transparent)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 17,
                                            color: item.color,
                                            marginBottom: 14,
                                        }}>
                                            {item.icon}
                                        </div>
                                        <Statistic
                                            title={item.title}
                                            value={item.value}
                                            valueStyle={{ color: item.color }}
                                        />
                                    </div>
                                </Col>
                            ))}
                        </Row>

                        {/* Welcome banner */}
                        <div className="welcome-banner">
                            <h4>Zarooni Administration Portal</h4>
                            <p>
                                Manage your foundation, events, and media categories from this
                                central hub. Use the sidebar to navigate between sections.
                            </p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <DashboardLayout
            currentView={currentView}
            onSetView={setCurrentView}
            pendingCount={stats.pendingApprovals}
        >
            {renderContent()}
        </DashboardLayout>
    );
};

export default AdminDashboard;
