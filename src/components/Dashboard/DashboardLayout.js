import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    DashboardOutlined,
    FileTextOutlined,
    PlusCircleOutlined,
    UserOutlined,
    CheckCircleOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import './AdminDashboard.css';

const NAV_LABELS = {
    overview:   'Overview',
    articles:   'All Articles',
    addArticle: 'Create New',
    approval:   'Approval Queue',
    users:      'User Management',
};

const DashboardLayout = ({ children, currentView, onSetView, pendingCount = 0 }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/adminlogin');
    };

    const initials = user?.firstName
        ? user.firstName.charAt(0).toUpperCase() + (user.lastName?.charAt(0).toUpperCase() || '')
        : 'U';

    const isAdminOrAbove = user?.role === 'admin' || user?.role === 'super_admin';
    const isSuperAdmin   = user?.role === 'super_admin';

    const NavItem = ({ navKey, icon, label, badge }) => (
        <button
            className={`sidebar-button ${currentView === navKey ? 'selected' : ''}`}
            onClick={() => onSetView(navKey)}
        >
            <span className="nav-icon">{icon}</span>
            {label}
            {badge > 0 && <span className="sidebar-badge">{badge}</span>}
        </button>
    );

    return (
        <div className="admin-dashboard">
            {/* ── Sidebar ── */}
            <aside className="sidebar">
                <div className="logo">
                    <div className="logo-icon">Z</div>
                    <div>
                        <div className="logo-text">Zarooni</div>
                        <div className="logo-sub">Administration</div>
                    </div>
                </div>

                <nav style={{ width: '100%', flex: 1 }}>
                    <div className="sidebar-nav-group">Main</div>
                    <NavItem navKey="overview"   icon={<DashboardOutlined />}  label="Overview" />
                    <NavItem navKey="articles"   icon={<FileTextOutlined />}   label="All Articles" />
                    <NavItem navKey="addArticle" icon={<PlusCircleOutlined />} label="Create New" />

                    {isAdminOrAbove && (
                        <>
                            <div className="sidebar-nav-group">Admin</div>
                            <NavItem
                                navKey="approval"
                                icon={<CheckCircleOutlined />}
                                label="Approval Queue"
                                badge={pendingCount}
                            />
                        </>
                    )}

                    {isSuperAdmin && (
                        <NavItem navKey="users" icon={<UserOutlined />} label="User Management" />
                    )}
                </nav>

        <div className="sidebar-footer">
                    <div className="sidebar-user">
                        {user?.role === 'super_admin' ? (
                            <img 
                                src="/zarooni.png" 
                                alt="Super Admin" 
                                className="sidebar-user-avatar"
                                style={{ objectFit: 'cover' }}
                            />
                        ) : user?.profilePicture ? (
                            <img 
                                src={user.profilePicture} 
                                alt="User" 
                                className="sidebar-user-avatar"
                                style={{ objectFit: 'cover' }}
                            />
                        ) : (
                            <div className="sidebar-user-avatar">{initials}</div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="sidebar-user-name">{user?.firstName} {user?.lastName}</div>
                            <div className="sidebar-user-role">{user?.role?.replace('_', ' ')}</div>
                        </div>
                    </div>
                    <button className="sidebar-button logout" onClick={handleLogout} style={{ marginTop: 6 }}>
                        <LogoutOutlined style={{ marginRight: 7 }} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ── Main ── */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
                {/* Topbar */}
                <div className="topbar">
                    <span className="topbar-title">{NAV_LABELS[currentView] || currentView}</span>
                    <div className="topbar-meta">
                        <span>{user?.firstName} {user?.lastName}</span>
                        <span className="role-pill">{user?.role?.replace('_', ' ')}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="content">{children}</div>
            </main>
        </div>
    );
};

export default DashboardLayout;
