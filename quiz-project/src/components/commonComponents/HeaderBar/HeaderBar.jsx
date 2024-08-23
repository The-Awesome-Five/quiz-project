import { useContext, useState, useEffect } from 'react';
import './HeaderBar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link, useNavigate} from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown, Button, Spinner } from "react-bootstrap";
import { AppContext } from '../../../appState/app.context';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../../firebase/config.js";
import React from "react";

const HeaderBar = ({ logout }) => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { userData } = useContext(AppContext);
    const [user] = useAuthState(auth)

    useEffect(() => {
        if (userData === null) {

            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        } else {
            setLoading(false);
        }
    }, [userData]);

    const handleOnClickProfile = () => {
        navigate('/profile');
    }

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Link to="/"><img src="../../../../public/img/quizhub-logo.png" alt="Logo" className="logo" /></Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title={<span className="fs-1">≡</span>} id="basic-nav-dropdown">
                            <NavDropdown.Item>
                                <Link to="/all-quizzes"><button>All Quizzes</button></Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <Link to="/about"><button>About</button></Link>
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
                <Link to="/leaderboard"><Button>Global Leaderboard</Button></Link>
                <Link to="/gaming-modes"><Button>Gaming Modes</Button></Link>

                <div className="login-section d-flex align-items-center ms-3">
                    {user && userData && userData.avatarUrl ? (
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
                            <NavDropdown.Item>
                                <Link to="/organizations"><button>My Organizations</button></Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <Link to="/my-quizzes"><button>My Quizzes</button></Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item >
                                <Link to="/admin"><button>Admin</button></Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={logout}><button>Log Out</button></NavDropdown.Item>
                        </NavDropdown>
                    ) : (
                            <Link to="/signin" className='btn btn-primary d-flex align-items-center'>
                                <button>Sign in</button>
                            </Link>
                    )}
                </div>
            </Container>
        </Navbar>
    );
};

export default HeaderBar;
