import React, { useState } from 'react';
import './HeaderBar.css';

const HeaderBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // const handleLogin = () => {
    //     setIsLoggedIn(true);
    // };

    return (
        <div className="header-bar d-flex align-items-center justify-content-between p-3">
            <div className="logo-container">
                <img src="/img/GameHub-logo-stroked.png" alt="Logo" className="logo" />
            </div>

            <div className="pin-input-container">
                <input
                    type="password"
                    className="form-control pin-input"
                    placeholder="Enter PIN"
                    maxLength="4"
                />
            </div>

            <div className="login-section">
                {isLoggedIn ? (
                    <img src="/img/user-avatar.png" alt="User Avatar" className="user-avatar" />
                ) : (
                    <a href="/login" className='btn btn-primary'>
                        Sign in
                    </a>
                )}
            </div>
        </div>
    );
};

export default HeaderBar;
