import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isDropdownActive, setIsDropdownActive] = useState(false);
    const [isAiActive, setIsAiActive] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [aiInput, setAiInput] = useState('');
    const [chatMessages, setChatMessages] = useState([
        { sender: 'AI', text: 'Hi there! How can I help you with accounting or investments today?' }
    ]);

    // --- 1. AUTH CHECK ON LOAD ---
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            // specific: If not logged in, kick them back to login page
            navigate('/login');
        } else {
            setUser(JSON.parse(userData));
        }
    }, [navigate]);

    // --- 2. LOGOUT LOGIC ---
    const handleLogout = () => {
        // Clear the data we saved during login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // --- UI HANDLERS ---
    const toggleAi = () => setIsAiActive(!isAiActive);
    const toggleDropdown = () => setIsDropdownActive(!isDropdownActive);
    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const sendAiMessage = () => {
        if (!aiInput.trim()) return;
        // Add user message
        setChatMessages(prev => [...prev, { sender: 'You', text: aiInput }]);
        const currentInput = aiInput;
        setAiInput('');

        // Simulate AI response after 700ms
        setTimeout(() => {
             setChatMessages(prev => [...prev, { 
                sender: 'AI', 
                text: `Good question about "${currentInput}"! Let’s review your insights.` 
            }]);
        }, 700);
    };

    // Prevent rendering until we confirm user is logged in
    if (!user) return null;

    return (
        <div className={`dashboard-body ${isDarkMode ? 'dark' : ''}`}>
            <header className="dash-header">
                <h1>Apna CA Dashboard</h1>
                <div className="profile-container" onClick={toggleDropdown}>
                    <img 
                        src={user.picture || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} 
                        alt="Profile" 
                        className="profile-img" 
                    />
                    <div className={`dropdown-menu ${isDropdownActive ? 'active' : ''}`}>
                        <div style={{padding: '10px', borderBottom: '1px solid #eee', color: '#333', fontSize: '0.9rem'}}>
                            <strong>{user.name}</strong>
                        </div>
                        <button onClick={() => navigate('/')}>🏠 Home</button>
                        <button>Edit Profile</button>
                        <button>Settings</button>
                        <button onClick={(e) => { e.stopPropagation(); toggleTheme(); }}>
                            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                        </button>
                        <button onClick={handleLogout} style={{color: 'red'}}>🚪 Logout</button>
                    </div>
                </div>
            </header>

            <div className="main-content">
                <h1>Welcome back, {user.name.split(' ')[0]}!</h1>
                <p>Manage your accounting, bills, and investments with ease.</p>

                <div className="menu-grid">
                    <div className="menu-item">📄 Accounting</div>
                    <div className="menu-item">💳 Bills</div>
                    <div className="menu-item">📈 Investments</div>
                    <div className="menu-item">💼 Tax Filing</div>
                    <div className="menu-item">📊 Reports</div>
                    <div className="menu-item">⚙️ Settings</div>
                </div>
            </div>

            {/* --- AI PANEL --- */}
            <div className={`ai-panel ${isAiActive ? 'active' : ''}`}>
                <div className="ai-header">
                    🤖 Apna CA Assistant
                    <button className="close-ai" onClick={() => setIsAiActive(false)}>&times;</button>
                </div>
                <div className="ai-body">
                    {chatMessages.map((msg, index) => (
                        <p key={index}><b>{msg.sender}:</b> {msg.text}</p>
                    ))}
                </div>
                <div className="ai-input-area">
                    <input 
                        type="text" 
                        placeholder="Ask something..." 
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendAiMessage()}
                    />
                    <button onClick={sendAiMessage}>Send</button>
                </div>
            </div>
            <button className="ai-toggle-btn" onClick={toggleAi}>💬</button>
        </div>
    );
}

export default Dashboard;