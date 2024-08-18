import React, { useState } from 'react';
import './HeaderBar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const HeaderBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate()

    const handleLogoClick = () => {
        navigate('/');
    }

    return (
        <div className="header-container d-flex align-items-center justify-content-between p-3">
            <div className="logo-container d-flex" onClick={handleLogoClick}>
                <img src="../../../../public/img/quizhub-logo.png" alt="Logo" className="logo" />
            </div>
            <div className='header-bar d-flex'>
                <div className="pin-input-container d-flex align-items-center">
                    <p className='text mb-0 me-2'>Join game? Enter PIN:</p>
                    <input
                        type="password"
                        className="form-control pin-input"
                        placeholder="123 456"
                        maxLength="6"
                    />
                </div>
            </div>
            <div className="login-section d-flex align-items-center ms-3">
                    {isLoggedIn ? (
                        <img src="/img/user-avatar.png" alt="User Avatar" className="user-avatar" />
                    ) : (
                        <a href="/login" className='btn btn-primary d-flex align-items-center'>
                            Sign in
                        </a>
                    )}
                </div>          
        </div>
    );
};

export default HeaderBar;