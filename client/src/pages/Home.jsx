import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [income, setIncome] = useState('');
  const [taxResult, setTaxResult] = useState('');
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // -- 1. Check for logged-in user on load --
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // -- Close dropdown when clicking outside --
  useEffect(() => {
    const closeDropdown = () => setIsDropdownOpen(false);
    if (isDropdownOpen) {
      document.addEventListener('click', closeDropdown);
    }
    return () => document.removeEventListener('click', closeDropdown);
  }, [isDropdownOpen]);

  // -- Scroll Function --
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  // -- Tax Calculator Logic --
  const calculateTax = () => {
    const inc = parseFloat(income);
    if (isNaN(inc) || inc < 0) {
      setTaxResult("Please enter a valid amount!");
      return;
    }
    let tax = 0;
    if (inc <= 250000) tax = 0;
    else if (inc <= 500000) tax = 0.05 * (inc - 250000);
    else if (inc <= 1000000) tax = 12500 + 0.2 * (inc - 500000);
    else tax = 112500 + 0.3 * (inc - 1000000);
    setTaxResult(`Estimated Tax: ₹ ${tax.toFixed(2)}`);
  };

  // -- Logout Logic --
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsDropdownOpen(false);
    navigate('/'); // Reload home page state
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Apna CA</h1>
        
        <nav className="home-nav">
          <ul>
            <li><button className="nav-link" onClick={() => scrollToSection('home')}>Home</button></li>
            <li><button className="nav-link" onClick={() => scrollToSection('services')}>Services</button></li>
            <li><button className="nav-link" onClick={() => scrollToSection('calculator')}>Calculator</button></li>
            <li><button className="nav-link" onClick={() => scrollToSection('contact')}>Contact</button></li>
            
            {/* Show Logout in nav if logged in, otherwise show Login */}
            {user ? (
               <li><button className="nav-link" onClick={handleLogout} style={{ color: '#ff6b6b' }}>Logout</button></li>
            ) : (
               <li><button className="nav-link login-nav-btn" onClick={() => navigate('/login')}>Login</button></li>
            )}
          </ul>
        </nav>

        {/* Profile Dropdown Area */}
        {user && (
          <div className="profile-container">
            <img 
              src={user.picture || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} 
              alt="Profile" 
              className="profile-img"
              onClick={(e) => {
                e.stopPropagation(); // Prevents immediate closing by document click listener
                setIsDropdownOpen(!isDropdownOpen);
              }}
            />
            
            {isDropdownOpen && (
              <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                <div className="dropdown-header">
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                </div>
                <button onClick={() => navigate('/dashboard')}>📊 Dashboard</button>
                <button onClick={handleLogout} className="logout-btn">🚪 Sign Out</button>
              </div>
            )}
          </div>
        )}
      </header>

      <section id="home" className="hero">
        <h2>Your Trusted Partner in Tax & Finance</h2>
        <p>We simplify your accounting, so you can focus on growth.</p>
        <button className="hero-btn" onClick={() => scrollToSection('contact')}>Get in Touch</button>
      </section>

      <section id="services">
        <h2>Our Services</h2>
        <div className="service-list">
          <div className="service-card">
            <h3>Tax Filing</h3><p>Quick and accurate income tax filing.</p>
          </div>
          <div className="service-card">
            <h3>GST Registration</h3><p>Easy GST registration & filing.</p>
          </div>
          <div className="service-card">
            <h3>Business Setup</h3><p>Start your business right.</p>
          </div>
        </div>
      </section>

      <section id="calculator">
        <h2>Quick Tax Calculator</h2>
        <div className="calc-box">
          <label htmlFor="income">Enter annual income (₹):</label>
          <input 
            type="number" 
            id="income" 
            placeholder="e.g. 600000"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
          <button className="calc-btn" onClick={calculateTax}>Calculate</button>
          <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{taxResult}</p>
        </div>
      </section>

      <section id="contact">
        <h2>Contact Us</h2>
        <form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert("Message Sent!"); }}>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Email" required />
          <textarea placeholder="Your Message" rows="5" required></textarea>
          <button type="submit" className="hero-btn">Send Message</button>
        </form>
      </section>

      <footer className="footer">
        <p>© 2025 Apna CA. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Home;