import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCloseOutline, IoDiamondOutline, IoMailOutline } from 'react-icons/io5';
import axios from 'axios';
import { toast } from 'react-toastify';

const SubscriptionModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleBasicSubscribe = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('https://suhail-al-zarooni-backend.vercel.app/subscribe', { email });
            toast.success(res.data.message);
            setEmail('');
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || "Subscription failed");
        } finally {
            setLoading(false);
        }
    };

    const handleJoinLegacy = () => {
        // Redirection logic to Gumroad
        window.open('https://zarooni.gumroad.com/l/legacy-program', '_blank');
        onClose();
        // Option to redirect to signup page after closure or provide a link
        window.location.href = '/legacy-signup';
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal-overlay" style={overlayStyle}>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="modal-container"
                    style={modalStyle}
                >
                    <button onClick={onClose} style={closeBtnStyle}>
                        <IoCloseOutline size={24} />
                    </button>

                    <div style={modalContentStyle}>
                        <h2 style={titleStyle}>Zarooni Legacy</h2>
                        <p style={subtitleStyle}>Choose your level of engagement with the Al Zarooni Legacy.</p>

                        <div style={optionsGridStyle}>
                            {/* Option 1: Basic Updates */}
                            <div style={optionCardStyle}>
                                <div style={iconCircleStyle("#f4f4f4")}>
                                    <IoMailOutline size={28} color="#00124e" />
                                </div>
                                <h3 style={optionTitleStyle}>Stay Updated</h3>
                                <p style={optionDescStyle}>Receive notifications for new articles and event announcements.</p>
                                <form onSubmit={handleBasicSubscribe} style={formStyle}>
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={inputStyle}
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        style={submitBtnStyle}
                                    >
                                        {loading ? "Subscribing..." : "Subscribe Free"}
                                    </button>
                                </form>
                            </div>

                            {/* Option 2: Legacy Program */}
                            <div style={{...optionCardStyle, border: '1px solid #c8a96e', background: 'linear-gradient(135deg, #fff 0%, #fffbf2 100%)'}}>
                                <div style={iconCircleStyle("#c8a96e")}>
                                    <IoDiamondOutline size={28} color="#fff" />
                                </div>
                                <h3 style={optionTitleStyle}>Legacy Program</h3>
                                <p style={optionDescStyle}>Become a Contributor. Post articles, download exclusive data, and join the inner circle.</p>
                                <ul style={listStyle}>
                                    <li>✓ Post your own articles</li>
                                    <li>✓ Download restricted data</li>
                                    <li>✓ Ad-free experience</li>
                                    <li>✓ Premium contributor badge</li>
                                </ul>
                                <button 
                                    onClick={handleJoinLegacy}
                                    style={legacyBtnStyle}
                                >
                                    Join Legacy Program
                                </button>
                                <p style={footerNoteStyle}>Requires monthly Gumroad subscription</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

// Internal Styles
const overlayStyle = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
    padding: '20px'
};

const modalStyle = {
    backgroundColor: '#fff',
    borderRadius: '24px',
    maxWidth: '700px',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
};

const modalContentStyle = {
    padding: '30px'
};

const closeBtnStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#666'
};

const titleStyle = {
    fontFamily: '"Old English Text MT", serif',
    fontSize: '36px',
    color: '#00124e',
    textAlign: 'center',
    marginBottom: '8px'
};

const subtitleStyle = {
    textAlign: 'center',
    color: '#666',
    fontSize: '14px',
    marginBottom: '25px'
};

const optionsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
};

const optionCardStyle = {
    padding: '20px',
    borderRadius: '20px',
    backgroundColor: '#f9f9fb',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
};

const iconCircleStyle = (bg) => ({
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: bg,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px'
});

const optionTitleStyle = {
    fontSize: '22px',
    fontWeight: '700',
    color: '#00124e',
    marginBottom: '15px'
};

const optionDescStyle = {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '20px'
};

const formStyle = {
    width: '100%',
    marginTop: 'auto'
};

const inputStyle = {
    width: '100%',
    padding: '12px 20px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    marginBottom: '15px',
    fontSize: '14px'
};

const submitBtnStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#00124e',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s'
};

const listStyle = {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 25px 0',
    textAlign: 'left',
    fontSize: '14px',
    color: '#444'
};

const legacyBtnStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#520000',
    color: '#fff',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(82, 0, 0, 0.2)',
    marginTop: 'auto'
};

const footerNoteStyle = {
    fontSize: '11px',
    color: '#999',
    marginTop: '12px'
};

export default SubscriptionModal;
