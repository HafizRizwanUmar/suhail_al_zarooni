import React from 'react';
import { useNavigate } from 'react-router-dom';

const ContributorCard = ({ contributor, rank }) => {
    const navigate = useNavigate();
    const initials =
        (contributor.firstName?.charAt(0) || '') +
        (contributor.lastName?.charAt(0) || '');

    const roleLabel = contributor.role
        ?.replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase()) || 'Contributor';

    const rankLabels = { 1: 'No. I', 2: 'No. II', 3: 'No. III' };

    return (
        <div
            className="contributor-card"
            onClick={() => navigate(`/contributor/${contributor._id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && navigate(`/contributor/${contributor._id}`)}
            aria-label={`View profile of ${contributor.firstName} ${contributor.lastName}`}
        >
            {rank && rank <= 3 && (
                <span className="rank-badge">{rankLabels[rank]}</span>
            )}

            <div className="contributor-avatar">
                {initials.toUpperCase()}
            </div>

            <h3 className="contributor-name">
                {contributor.firstName} {contributor.lastName}
            </h3>

            <span className="contributor-role">{roleLabel}</span>

            <div className="contributor-stats">
                <div className="stat-item">
                    <span className="stat-num">{contributor.articleCount ?? 0}</span>
                    <span className="stat-label">Articles</span>
                </div>
                {contributor.views != null && (
                    <div className="stat-item">
                        <span className="stat-num">
                            {contributor.views >= 1000
                                ? `${(contributor.views / 1000).toFixed(1)}k`
                                : contributor.views}
                        </span>
                        <span className="stat-label">Views</span>
                    </div>
                )}
            </div>

            <div className="card-cta">
                <span>View Profile</span>
                <span className="card-cta-arrow">→</span>
            </div>
        </div>
    );
};

export default ContributorCard;
