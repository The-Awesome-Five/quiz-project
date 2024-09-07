import { useContext, useState, useEffect } from 'react';
import './HeaderBar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown, Button, Spinner } from "react-bootstrap";
import { AppContext } from '../../../appState/app.context';
import React from "react";

const HeaderBar = ({ logout }) => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { userData } = useContext(AppContext);

    useEffect(() => {
        if (userData === null) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 1000); // Simulate loading
        } else {
            setLoading(false);
        }
    }, [userData]);

    const handleOnClickProfile = () => {
        navigate('/profile');
    }

    const handleOnClickButton = (path,e) => {

        e.preventDefault();

        navigate(path);

    }

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container className='navbar-container'>
                <Navbar.Brand onClick={(e) => handleOnClickButton('/',e)}><img src="../../../../public/img/quizhub-logo.png" alt="Logo" className="logo" /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title={<span className="fs-1">≡</span>} id="basic-nav-dropdown">
                            <NavDropdown.Item hrref="/" onClick={(e) => handleOnClickButton('/all-quizes',e)}>
                                All Quizzes
                            </NavDropdown.Item>
                            <NavDropdown.Item hrref="/about"  onClick={(e) => handleOnClickButton('/about',e)}>
                                About
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
                <div className="header-container d-flex align-items-center justify-content-between p-3">
                    <div className='header-bar d-flex'>
                        <div className="pin-input-container d-flex align-items-center">
                            <p className='text mb-0 me-2'>Join game?</p>
                            <input
                                type="password"
                                className="form-control pin-input"
                                placeholder="Enter PIN: 123 456"
                                maxLength="6"
                            />
                        </div>
                    </div>
                </div>
                <Nav.Link hrref="/leaderboard"  onClick={(e) => handleOnClickButton('/leaderboard',e)}><Button>Global Leaderboard</Button></Nav.Link>
                <Nav.Link hrref="/gaming-modes"  onClick={(e) => handleOnClickButton('/gaming-modes',e)}><Button>Gaming Modes</Button></Nav.Link>

                <div className="login-section d-flex align-items-center ms-3">
                    {loading ? (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    ) : userData ? (
                        <NavDropdown
                            title={
                                <img
                                    src={userData.avatarUrl || '../../../../public/img/default-user-icon.png'}
                                    alt="User Avatar"
                                    className="avatar"
                                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                />
                            }
                            id="user-nav-dropdown"
                            align="end"
                        >
                            <NavDropdown.Item onClick={handleOnClickProfile}>Profile</NavDropdown.Item>
                            <NavDropdown.Item hrref="/organizations"  onClick={(e) => handleOnClickButton('/organizations',e)}>
                                My Organizations
                            </NavDropdown.Item>
                            <NavDropdown.Item hrref="/notifications"  onClick={(e) => handleOnClickButton('/notifications',e)}>
                                My Notifications
                            </NavDropdown.Item>
                            <NavDropdown.Item hrref="/my-quizzes"  onClick={(e) => handleOnClickButton('/my-quizzes',e)}>
                                My Quizzes
                            </NavDropdown.Item>
                            <NavDropdown.Item hrref="/admin"  onClick={(e) => handleOnClickButton('/admin',e)}>Admin Menu</NavDropdown.Item>
                            <NavDropdown.Item onClick={logout}>Log Out</NavDropdown.Item>
                        </NavDropdown>
                    ) : null}

                    {!loading && userData === null && (
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
