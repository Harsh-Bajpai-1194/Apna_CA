import React, { useState, useEffect, useCallback } from 'react';
import './Profession.css'; // Assuming your CSS file is named Profession.css

// --- Configuration Data ---
const dashboardUrls = {
    'partner': 'partner-dashboard.html',
    'individual': 'individual-dashboard.html',
    'startup_org': 'startup-dashboard.html'
};

const roleCards = [
    { role: 'partner', title: 'CA Firm Partner', icon: '🌐', description: 'Manage Multi-Client Firms: Dashboard access for team task delegation and comprehensive oversight.' },
    { role: 'individual', title: 'Individual', icon: '⏱️', description: 'Streamline Solo Practice: Automated client communication, integrated deadline tracking, and checklists.' },
    { role: 'startup_org', title: 'Startup/Organization', icon: '📚', description: 'Access templates, learning resources, and dummy task environments for practice.' }
];

const SHUFFLE_DURATION_MS = 1500;
const TITLE_ANIMATION_DURATION_MS = 800; // Matches the CSS: 0.8s

const Profession = () => {
    // --- State Management ---
    const [selectedRole, setSelectedRole] = useState(null);
    const [isCtaDisabled, setIsCtaDisabled] = useState(true);
    const [isShuffling, setIsShuffling] = useState(false);
    const [isSettled, setIsSettled] = useState(false);

    // --- Animation Logic (Replaces document.addEventListener) ---
    useEffect(() => {
        // Timer to wait for the CSS 'title-throw' animation to finish
        const titleTimer = setTimeout(() => {
            
            // 1. START SHUFFLE
            setIsShuffling(true);
            
            // 2. END SHUFFLE & START SETTLE
            const shuffleTimer = setTimeout(() => {
                setIsShuffling(false);
                setIsSettled(true);
            }, SHUFFLE_DURATION_MS);

            // Cleanup for shuffle timer
            return () => clearTimeout(shuffleTimer);

        }, TITLE_ANIMATION_DURATION_MS);

        // Cleanup for title timer
        return () => clearTimeout(titleTimer);
    }, []); 

    // --- Selection and Navigation Logic ---
    
    const handleCardClick = useCallback((role) => {
        setSelectedRole(role);
        setIsCtaDisabled(false);
    }, []);

    const handleProceed = useCallback(() => {
        if (selectedRole) {
            const url = dashboardUrls[selectedRole];
            if (url) {
                // Redirecting to the defined dashboard URL
                window.location.href = url;
            }
        } else {
            alert('Please select a role before proceeding.');
        }
    }, [selectedRole]);

    // --- Dynamic Class Builders ---
    const cardColumnClasses = `card-column ${isSettled ? 'is-settled' : ''}`;

    return (
        <div className="main-container">

            <header className="page-header">
                <h1 className="title-animated">Apna CA</h1>
                <p className="subtitle">Who are you?</p>
            </header>

            <div className="role-selection-area">
                
                {/* Hidden Radio Buttons (for form submission, linked to state) */}
                <div className="role-selector">
                    {roleCards.map(card => (
                        <input 
                            key={card.role}
                            type="radio" 
                            id={card.role} 
                            name="user_role" 
                            value={card.role}
                            checked={selectedRole === card.role} 
                            readOnly 
                        />
                    ))}
                </div>

                {/* Card Column with dynamic classes */}
                <div className={cardColumnClasses}>
                    {roleCards.map((card) => {
                        // Build class for each card based on animation and selection state
                        let cardClass = 'role-card';
                        if (isShuffling) {
                            cardClass += ' is-shuffling';
                        }
                        if (selectedRole === card.role) {
                            cardClass += ' is-selected';
                        }

                        return (
                            <div 
                                key={card.role}
                                className={cardClass}
                                data-role={card.role}
                                onClick={() => handleCardClick(card.role)}
                            >
                                <span className="icon">{card.icon}</span>
                                <h3 className="card-title">{card.title}</h3>
                                <p className="card-description">{card.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <button 
                className="cta-button" 
                disabled={isCtaDisabled}
                onClick={handleProceed}
            >
                Proceed to Dashboard
            </button>

        </div>
    );
};

export default Profession;