import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, notification, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const { Option } = Select;

const roleTag = (role) => {
  const map = {
    super_admin: { bg: "rgba(248,113,113,0.12)", color: "#f87171", border: "rgba(248,113,113,0.3)" },
    admin:       { bg: "rgba(201,168,76,0.12)",  color: "#c9a84c", border: "rgba(201,168,76,0.3)" },
    editor:      { bg: "rgba(96,165,250,0.12)",  color: "#60a5fa", border: "rgba(96,165,250,0.3)" },
    contributor: { bg: "rgba(52,211,153,0.12)",  color: "#34d399", border: "rgba(52,211,153,0.3)" },
  };
  const s = map[role] || map.contributor;
  return (
    <Tag style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
      {role?.replace('_', ' ').toUpperCase()}
    </Tag>
  );
};

const UserManagement = () => {
  const { token, user: currentUser } = useAuth();
  const [users,   setUsers]          = useState([]);
  const [loading, setLoading]        = useState(false);
  const [modal,   setModal]          = useState(false);
  const [form] = Form.useForm();

  const [file, setFile] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://suhail-al-zarooni-backend.vercel.app/allUsers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.data);
    } catch {
      notification.error({ message: 'Error fetching users' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleCreate = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => formData.append(k, v));
    if (file) formData.append('image', file);

    try {
      await axios.post('https://suhail-al-zarooni-backend.vercel.app/admin/create-user', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      notification.success({ message: 'User Created', description: `${values.email} has been added.` });
      setModal(false);
      form.resetFields();
      setFile(null);
      fetchUsers();
    } catch (err) {
      notification.error({ message: 'Failed to create user', description: err.response?.data?.message });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://suhail-al-zarooni-backend.vercel.app/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      notification.success({ message: 'User removed.' });
      fetchUsers();
    } catch {
      notification.error({ message: 'Error deleting user' });
    }
  };

  const getUserAvatar = (r) => {
    if (r.role === 'super_admin') return '/zarooni.png';
    return r.profilePicture || null;
  };

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (_, r) => {
        const avatar = getUserAvatar(r);
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {avatar ? (
              <img 
                src={avatar} 
                alt="user" 
                style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} 
              />
            ) : (
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--gold, #c9a84c) 0%, #7a5510 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#0a0b0e', fontWeight: 700, fontSize: 12, flexShrink: 0,
              }}>
                {r.firstName?.charAt(0).toUpperCase()}
              </div>
            )}
            <span style={{ fontWeight: 500, color: 'var(--text-primary, #f0ece4)' }}>
              {r.firstName} {r.lastName}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (e) => <span style={{ color: 'var(--text-secondary, #8a8fa8)', fontSize: 13 }}>{e}</span>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: roleTag,
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <Space>
          {currentUser?.role === 'super_admin' && record.role !== 'super_admin' && (
            <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)}>
              Remove
            </Button>
          )}
        </Space>
      ),
    },
  ];

  if (!currentUser) return null;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2>User Management</h2>
          <p>{users.length} registered user{users.length !== 1 ? 's' : ''}</p>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchUsers}>Refresh</Button>
          {currentUser?.role === 'super_admin' && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal(true)}>
              New User
            </Button>
          )}
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10, size: 'small' }}
        size="middle"
      />

      <Modal
        title="Create New User"
        open={modal}
        onCancel={() => {
          setModal(false);
          setFile(null);
        }}
        onOk={() => form.submit()}
        okText="Create User"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          initialValues={{ password: 'Zarooni123' }}
          style={{ paddingTop: 8 }}
        >
          <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
            <Input placeholder="First name" />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
            <Input placeholder="Last name" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="user@example.com" />
          </Form.Item>
          <Form.Item name="password" label="Default Password" rules={[{ required: true }]}>
            <Input.Password placeholder="Default password" />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select placeholder="Select role">
              <Option value="admin">Admin</Option>
              <Option value="editor">Editor</Option>
              <Option value="contributor">Contributor</Option>
              <Option value="super_admin">Super Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label="Profile Picture" 
            required={form.getFieldValue('role') !== 'super_admin'}
            tooltip="Mandatory for all roles except Super Admin"
          >
            <Input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setFile(e.target.files[0])} 
            />
            {form.getFieldValue('role') === 'super_admin' && (
              <p style={{ marginTop: 8, fontSize: 12, color: '#c9a84c' }}>
                Note: Super Admin will automatically use the Zarooni legacy picture.
              </p>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
