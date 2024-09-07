import { useContext, useState, useEffect } from 'react';
import './HeaderBar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown, Button, Spinner } from "react-bootstrap";
import { AppContext } from '../../../appState/app.context';
import React from "react";
import {toast} from "react-toastify";

const HeaderBar = ({ logout }) => {
    const [loading, setLoading] = useState(true);
    const [roomId, setRoomId] = useState('');

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

    const handleJoin = () => {

        if(roomId.length < 1){

            return toast.error('Room Id must not be empty!');
        }

        navigate(`/room/${roomId}`);
    }

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand onClick={(e) => handleOnClickButton('/',e)}><img src="../../../../public/img/quizhub-logo.png" alt="Logo" className="logo" /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title={<span className="fs-1">≡</span>} id="basic-nav-dropdown">
                            <NavDropdown.Item href="/" onClick={(e) => handleOnClickButton('/all-quizes',e)}>
                                All Quizzes
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/about"  onClick={(e) => handleOnClickButton('/about',e)}>
                                About
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
                <div className="header-container d-flex align-items-center justify-content-between">
                    <div className='header-bar d-flex'>
                        <p className='text mb-0 me-2'>Join game?</p>
                        <input
                            type="text"
                            value={roomId}
                            className="form-control pin-input"
                            placeholder="Enter Room Id:"
                            onChange={(e) => setRoomId(e.target.value)}
                        />
                        <button className="btn btn-primary m-3" onClick={handleJoin}>Join</button>
                    </div>
                </div>
                <Nav.Link href="/shop" className="m-3" onClick={(e) => handleOnClickButton('/shop', e)}><Button>Shop</Button></Nav.Link>
                <Nav.Link href="/gaming-modes" onClick={(e) => handleOnClickButton('/gaming-modes', e)}><Button>Gaming
                    Modes</Button></Nav.Link>

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
                            <NavDropdown.Item href="/organizations"  onClick={(e) => handleOnClickButton('/organizations',e)}>
                                My Organizations
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/notifications"  onClick={(e) => handleOnClickButton('/notifications',e)}>
                                My Notifications
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/my-quizzes"  onClick={(e) => handleOnClickButton('/my-quizzes',e)}>
                                My Quizzes
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/admin"  onClick={(e) => handleOnClickButton('/admin',e)}>Admin Menu</NavDropdown.Item>
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
