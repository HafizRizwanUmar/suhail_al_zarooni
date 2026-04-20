import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const SecurityGuard = ({ children }) => {
    const { user } = useAuth();
    
    // Check if user is a legacy member (contributor, admin, or super_admin)
    const isProtected = !user || !['contributor', 'admin', 'super_admin'].includes(user.role);

    useEffect(() => {
        if (!isProtected) return;

        const handleContextMenu = (e) => {
            e.preventDefault();
            // alert("Content is protected. Join the Zarooni Legacy Program to unlock full access.");
        };

        const handleKeyDown = (e) => {
            // Disable F12
            if (e.keyCode === 123) {
                e.preventDefault();
                return false;
            }
            // Disable Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (Inspect)
            if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
                e.preventDefault();
                return false;
            }
            // Disable Ctrl+U (View Source)
            if (e.ctrlKey && e.keyCode === 85) {
                e.preventDefault();
                return false;
            }
            // Disable Ctrl+S (Save)
            if (e.ctrlKey && e.keyCode === 83) {
                e.preventDefault();
                return false;
            }
        };

        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isProtected]);

    return (
        <div className={isProtected ? 'content-protected' : ''}>
            <style>
                {isProtected ? `
                    .content-protected {
                        user-select: none !important;
                        -webkit-user-select: none !important;
                        -moz-user-select: none !important;
                        -ms-user-select: none !important;
                    }
                    .content-protected img {
                        pointer-events: none !important;
                        -webkit-user-drag: none !important;
                    }
                ` : ''}
            </style>
            {children}
        </div>
    );
};

export default SecurityGuard;
