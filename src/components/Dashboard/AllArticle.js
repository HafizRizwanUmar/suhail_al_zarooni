import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Tag, Space, Modal, notification, Image } from "antd";
import { ReloadOutlined, EyeOutlined, CheckOutlined, DeleteOutlined, ReadOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";

const statusTag = (approved) =>
  approved ? (
    <Tag style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
      PUBLISHED
    </Tag>
  ) : (
    <Tag style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
      PENDING
    </Tag>
  );

const categoryTag = (cat) => (
  <Tag style={{ background: "rgba(201,168,76,0.1)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 20, fontSize: 11, fontWeight: 500 }}>
    {cat}
  </Tag>
);

const ArticleList = () => {
  const { token, user }         = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [preview, setPreview]   = useState({ open: false, content: "", title: "" });

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/articles?all=true", {
        headers: { Authorization: `Bearer ${token}` },
      });
      let data = response.data.data;
      if (user.role === "editor" || user.role === "contributor") {
        data = data.filter((a) => a.user?._id === user.id || a.user === user.id);
      }
      setArticles(data);
    } catch {
      notification.error({ message: "Failed to load articles" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/articles/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      notification.success({ message: "Article approved and published." });
      fetchArticles();
    } catch {
      notification.error({ message: "Approval failed." });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      notification.success({ message: "Article deleted." });
      fetchArticles();
    } catch {
      notification.error({ message: "Deletion failed." });
    }
  };

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "image",
      width: 68,
      render: (url) => (
        <Image
          src={url}
          width={46}
          height={46}
          style={{ objectFit: "cover", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}
          fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='46' height='46'%3E%3Crect width='46' height='46' fill='%231e222c'/%3E%3C/svg%3E"
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <span style={{ fontWeight: 500, color: "var(--text-primary, #f0ece4)", fontSize: 13.5 }}>{text}</span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: categoryTag,
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
      width: 80,
      render: (v) => <span style={{ color: "var(--text-secondary, #8a8fa8)" }}>{v || 0}</span>,
    },
    {
      title: "Likes",
      dataIndex: "likes",
      key: "likes",
      width: 80,
      render: (l) => <span style={{ color: "var(--text-secondary, #8a8fa8)" }}>{l || 0}</span>,
    },
    {
      title: "Status",
      dataIndex: "isApproved",
      key: "status",
      width: 110,
      render: statusTag,
    },
    {
      title: "Author",
      dataIndex: ["user", "firstName"],
      key: "author",
      render: (name) => <span style={{ color: "var(--text-secondary, #8a8fa8)", fontSize: 13 }}>{name || "External"}</span>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      render: (d) => (
        <span style={{ color: "var(--text-muted, #555a6e)", fontSize: 12 }}>
          {new Date(d).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size={6}>
          <Button
            size="small"
            icon={<ReadOutlined />}
            onClick={() => window.open(`/article/${record.slug || record._id}`, "_blank")}
          >
            Read
          </Button>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => setPreview({ open: true, content: record.content, title: record.title })}
          >
            Preview
          </Button>
          {isAdmin && !record.isApproved && (
            <Button
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleApprove(record._id)}
              style={{ color: "#34d399", borderColor: "rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.08)" }}
            >
              Approve
            </Button>
          )}
          {isAdmin && (
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record._id)}
            >
              Delete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h2>Articles</h2>
          <p>{articles.length} article{articles.length !== 1 ? "s" : ""} found</p>
        </div>
        <Button icon={<ReloadOutlined />} onClick={fetchArticles}>Refresh</Button>
      </div>

      <Table
        columns={columns}
        dataSource={articles}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 15, size: "small" }}
        size="middle"
      />

      <Modal
        title={preview.title}
        open={preview.open}
        onCancel={() => setPreview((p) => ({ ...p, open: false }))}
        onOk={() => setPreview((p) => ({ ...p, open: false }))}
        width={820}
        okText="Close"
      >
        <div
          style={{
            maxHeight: "60vh",
            overflowY: "auto",
            padding: "12px 0",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            fontSize: 14,
            color: "var(--text-primary, #f0ece4)",
            lineHeight: 1.75,
          }}
          dangerouslySetInnerHTML={{ __html: preview.content }}
        />
      </Modal>
    </div>
  );
};

export default ArticleList;
