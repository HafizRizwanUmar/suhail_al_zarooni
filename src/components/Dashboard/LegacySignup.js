import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import './Login.css'; // Reuse basic login styles

const LegacySignup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        licenseKey: '',
        occuption: '',
        description: ''
    });
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (image) data.append('image', image);

        try {
            const res = await axios.post('http://localhost:5000/api/legacy/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success(res.data.message);
            navigate('/adminlogin');
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container" style={{ minHeight: '100vh', padding: '40px 0' }}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="login-card" 
                style={{ maxWidth: '600px', width: '90%' }}
            >
                <div className="login-header">
                    <h2 style={{ fontFamily: '"Old English Text MT", serif', fontSize: '32px' }}>Legacy Program Signup</h2>
                    <p>Enter your details and Gumroad license key to join.</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div style={gridStyle}>
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" name="firstName" required onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" name="lastName" required onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" required onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" required onChange={handleChange} />
                    </div>

                    <div className="form-group" style={{ border: '2px solid #c8a96e', padding: '15px', borderRadius: '10px', background: '#fffbf2' }}>
                        <label style={{ color: '#520000', fontWeight: '700' }}>Gumroad License Key</label>
                        <input 
                            type="text" 
                            name="licenseKey" 
                            placeholder="Enter your monthly subscription key" 
                            required 
                            onChange={handleChange} 
                            style={{ border: '1px solid #c8a96e' }}
                        />
                        <p style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>Found in your Gumroad purchase receipt.</p>
                    </div>

                    <div className="form-group">
                        <label>Profile Picture</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                    </div>

                    <div className="form-group">
                        <label>Occupation</label>
                        <input type="text" name="occuption" onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Brief Bio / Description</label>
                        <textarea name="description" rows="3" onChange={handleChange} style={textareaStyle}></textarea>
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? "Validating & Creating Account..." : "Complete Registration"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
};

const textareaStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px'
};

export default LegacySignup;
