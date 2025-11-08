import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const [tempUser, setTempUser] = useState(null); // Holds user info BEFORE full backend login

    // --- 1. AUTO-REDIRECT: If already fully logged in, go to dashboard ---
    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    // --- 2. GOOGLE SUCCESS: Decode token immediately for UI ---
    const handleGoogleSuccess = (credentialResponse) => {
        // Decode the Google token directly on the client to show profile immediately
        const decoded = jwtDecode(credentialResponse.credential);
        setTempUser({
            ...decoded,
            googleToken: credentialResponse.credential // Keep the raw token for backend verification later
        });
    };

    // --- 3. CONTINUE TO APP: Send token to backend to finalize login ---
    const handleContinue = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/google', {
                id_token: tempUser.googleToken
            });

            const { token, user } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/dashboard');

        } catch (error) {
            console.error("Backend Login Failed:", error);
            alert("Login failed. Please try again.");
            setTempUser(null); // Reset UI on failure
        }
    };

    // --- 4. SIGN OUT (Cancel before continuing) ---
    const handleCancel = () => {
        setTempUser(null);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Welcome</h2>

                {!tempUser ? (
                    /* --- STATE 1: Not signed in yet --- */
                    <div className="google-btn-wrapper">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => alert("Google Login Failed")}
                            theme="outline"
                            size="large"
                            width="250"
                        />
                    </div>
                ) : (
                    /* --- STATE 2: Signed in, waiting to continue --- */
                    <div className="signed-in-view">
                        <img 
    src={tempUser.picture} 
    alt="Profile" 
    className="avatar-large" 
    referrerPolicy="no-referrer" 
/>
                        <p className="user-name"><strong>{tempUser.name}</strong></p>
                        <p className="user-email">{tempUser.email}</p>

                        <div className="login-actions">
                            <button className="btn-cancel" onClick={handleCancel}>Sign out</button>
                            <button className="btn-continue" onClick={handleContinue}>Continue to App</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;