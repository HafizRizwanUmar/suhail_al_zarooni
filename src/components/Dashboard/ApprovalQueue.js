import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Table, Button, Tag, Space, Modal, notification } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const ApprovalQueue = () => {
    const { token } = useAuth();
    const [articles, setArticles]   = useState([]);
    const [loading, setLoading]     = useState(false);
    const [preview, setPreview]     = useState({ open: false, title: '', content: '', id: null });

    const fetchPending = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get('https://suhail-al-zarooni-backend.vercel.app/articles?all=true', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setArticles(res.data.data.filter((a) => !a.isApproved));
        } catch {
            notification.error({ message: 'Error fetching queue' });
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchPending(); }, [fetchPending]);

    const handleApprove = async (id) => {
        try {
            await axios.put(`https://suhail-al-zarooni-backend.vercel.app/articles/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            notification.success({ message: 'Article approved and published.' });
            fetchPending();
        } catch {
            notification.error({ message: 'Approval failed.' });
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.delete(`https://suhail-al-zarooni-backend.vercel.app/articles/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            notification.warning({ message: 'Article rejected and removed.' });
            fetchPending();
        } catch {
            notification.error({ message: 'Rejection failed.' });
        }
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (t) => <span style={{ fontWeight: 500, color: 'var(--text-primary, #f0ece4)' }}>{t}</span>,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (cat) => (
                <Tag style={{
                    background: 'rgba(201,168,76,0.1)', color: '#c9a84c',
                    border: '1px solid rgba(201,168,76,0.2)', borderRadius: 20,
                    fontSize: 11, fontWeight: 500,
                }}>
                    {cat}
                </Tag>
            ),
        },
        {
            title: 'Author',
            dataIndex: ['user', 'firstName'],
            key: 'author',
            render: (n) => <span style={{ color: 'var(--text-secondary, #8a8fa8)' }}>{n || '—'}</span>,
        },
        {
            title: 'Submitted',
            dataIndex: 'createdAt',
            key: 'date',
            render: (d) => (
                <span style={{ color: 'var(--text-muted, #555a6e)', fontSize: 12 }}>
                    {new Date(d).toLocaleString()}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <Space size={6}>
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => setPreview({ open: true, title: record.title, content: record.content, id: record._id })}
                    >
                        Review
                    </Button>
                    <Button
                        size="small"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleApprove(record._id)}
                        style={{ color: '#34d399', borderColor: 'rgba(52,211,153,0.3)', background: 'rgba(52,211,153,0.08)' }}
                    >
                        Approve
                    </Button>
                    <Button
                        size="small"
                        danger
                        icon={<CloseCircleOutlined />}
                        onClick={() => handleReject(record._id)}
                    >
                        Reject
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                    <h2>Approval Queue</h2>
                    <p>Review and approve articles before they go live.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Pending count badge */}
                    <div style={{
                        background: articles.length > 0 ? 'rgba(251,191,36,0.1)' : 'rgba(52,211,153,0.08)',
                        border: `1px solid ${articles.length > 0 ? 'rgba(251,191,36,0.3)' : 'rgba(52,211,153,0.25)'}`,
                        borderRadius: 10,
                        padding: '8px 18px',
                        textAlign: 'center',
                        minWidth: 72,
                    }}>
                        <div style={{
                            fontFamily: "'Syne', sans-serif",
                            fontSize: 24,
                            fontWeight: 700,
                            lineHeight: 1,
                            color: articles.length > 0 ? '#fbbf24' : '#34d399',
                        }}>
                            {articles.length}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted, #555a6e)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            pending
                        </div>
                    </div>
                    <Button icon={<ReloadOutlined />} onClick={fetchPending}>Refresh</Button>
                </div>
            </div>

            {/* Table */}
            <Table
                columns={columns}
                dataSource={articles}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10, size: 'small' }}
                size="middle"
                locale={{ emptyText: <span style={{ color: 'var(--text-muted, #555a6e)' }}>No articles pending review</span> }}
            />

            {/* Preview Modal */}
            <Modal
                title={preview.title}
                open={preview.open}
                onCancel={() => setPreview((p) => ({ ...p, open: false }))}
                onOk={() => { handleApprove(preview.id); setPreview((p) => ({ ...p, open: false })); }}
                okText="Approve & Publish"
                cancelText="Close"
                width={880}
            >
                <div
                    style={{
                        maxHeight: '60vh',
                        overflowY: 'auto',
                        padding: '14px 0',
                        borderTop: '1px solid rgba(255,255,255,0.07)',
                        fontSize: 14,
                        color: 'var(--text-primary, #f0ece4)',
                        lineHeight: 1.75,
                    }}
                    dangerouslySetInnerHTML={{ __html: preview.content }}
                />
            </Modal>
        </div>
    );
};

export default ApprovalQueue;
