import React, { useContext, useEffect, useState } from 'react';
import './HeaderBar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import {Container, Navbar, Nav, NavDropdown, Button} from "react-bootstrap";
import { AppContext } from '../../../appState/app.context';
import { getUserAvatarUrlByUID } from '../../../services/user.service';

const HeaderBar = ({logout}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [avatatarURL, setAvatarUrl] = useState(null);
    const navigate = useNavigate()
    const {userData}= useContext(AppContext);


    useEffect(() => {
        if (userData && userData.uid) {
            getUserAvatarUrlByUID(userData.uid)
                .then((url) => {
                    setAvatarUrl(url || '../../../../public/img/default-user-icon.png');
                })
                .catch(() => {
                    console.error("Error fetching avatar URL:", error);
                    setAvatarUrl('../../../../public/img/default-user-icon.png');
                });
        }
    }, [userData]);

    const handleOnClickProfile = () => {
        navigate('/profile');
    }

    return (
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/"><img src="../../../../public/img/quizhub-logo.png" alt="Logo" className="logo" /></Navbar.Brand>
                    <div className="header-container d-flex align-items-center justify-content-between p-3">
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
                    </div>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            
                            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                <NavDropdown.Item href="/organizations">Organization</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">
                                    Another action
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">
                                    Separated link
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                    <div className="login-section d-flex align-items-center ms-3">
                    {userData ? (
                        <NavDropdown
                            title={
                                <img
                                    src={avatatarURL}
                                    alt="User Avatar"
                                    className="avatar"
                                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                />
                            }
                            id="user-nav-dropdown"
                            align="end"
                        >
                            <NavDropdown.Item onClick={handleOnClickProfile}>Profile</NavDropdown.Item>
                            <NavDropdown.Item onClick={logout}>Log Out</NavDropdown.Item>
                            <NavDropdown.Item href="/admin">Admin Menu</NavDropdown.Item>
                            
                        </NavDropdown>
                    ) : (
                        <a href="/signin" className='btn btn-primary d-flex align-items-center'>
                            Sign in
                        </a>
                    )}
                </div>
                </Container>
            </Navbar>
    );
};

export default HeaderBar;
