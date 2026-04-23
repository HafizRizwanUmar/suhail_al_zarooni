import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, notification, Switch } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './Login.css';
import { useAuth } from '../../context/AuthContext';

// Typography imports removed as unused

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('https://suhail-al-zarooni-backend.vercel.app/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        notification.success({
          message: 'Access Granted',
          description: `Welcome back, ${data.user.firstName}. Redirecting…`,
          placement: 'topRight',
        });
        navigate('/admindashboard');
      } else {
        notification.error({
          message: 'Access Denied',
          description: data.message || 'Invalid credentials. Please try again.',
          placement: 'topRight',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      notification.error({
        message: 'Connection Error',
        description: 'Could not reach the authentication server.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="containerLogin">
      {/* Back to site link floating */}
      <Link to="/home" className="back-home">
        <ArrowLeftOutlined /> Back to home
      </Link>

      <div className="login-left">
        <div className="login-quote-wrapper">
          <h1 className="login-quote">
            "Vision is the art of seeing what is invisible to others."
          </h1>
          <p className="login-author">Suhail Al Zarooni</p>
          <p className="login-tag">Visionary & Founder</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <div className="login-header">
            <h2>Welcome back</h2>
            <p>Access the official portal management system.</p>
          </div>

          <Form 
            name="login_form" 
            layout="vertical" 
            onFinish={onFinish} 
            requiredMark={false}
          >
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: 'Email is required' },
                { type: 'email',  message: 'Enter a valid email' },
              ]}
            >
              <Input
                placeholder="Enter your email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Password is required' }]}
            >
              <Input.Password
                placeholder="Enter your password"
                size="large"
              />
            </Form.Item>

            <div className="login-options">
              <div className="remember-me">
                <Switch size="small" defaultChecked />
                <span>Remember sign in details</span>
              </div>
              <a href="#!" className="forgot-link">Forgot password?</a>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={loading}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>

          <p className="login-footer">
            Admin access only. Don't have an account? <Link to="#!" className="signup-link">Contact Admin</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
