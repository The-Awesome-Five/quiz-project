import {useContext, useState, useEffect} from "react";
import "./HeaderBar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {useNavigate, useParams} from "react-router-dom";
import {
    Container,
    Navbar,
    Nav,
    NavDropdown,
    Button,
    Spinner,
} from "react-bootstrap";
import {AppContext} from "../../../appState/app.context";
import React from "react";
import {toast} from "react-toastify";
import {getUserDataByUID} from "../../../services/user.service";

const HeaderBar = ({logout}) => {
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const {userData} = useContext(AppContext);
    const {uid} = useParams();
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        if (userData === null) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        } else {
            setLoading(false);
        }

        if (uid) {
            getUserDataByUID(uid)
                .then((data) => {
                    const userProfile = Object.values(data)[0];
                    console.log("User Profile:", userProfile);
                    if (userProfile) {
                        setProfileData(userProfile);
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Failed to fetch user data:", error);
                    setLoading(false);
                });
        } else {
            setProfileData(userData);
            console.log("User Data from Context:", userData);
            setLoading(false);
        }
    }, [uid, userData]);

    const handleOnClickProfile = () => {
        navigate("/profile");
    };

    const handleOnClickButton = (path, e) => {
        e.preventDefault();
        navigate(path);
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container className="navbar-container">
                <Navbar.Brand onClick={(e) => handleOnClickButton("/", e)}>
                    <img
                        src="../../../../public/img/quizhub-logo.png"
                        alt="Logo"
                        className="logo"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>

                <div className="button-group">
                    <Nav.Link
                        href="/all-quizes"
                        className="m-3"
                        onClick={(e) => handleOnClickButton("/all-quizes", e)}
                    >
                        <Button>All quizes</Button>
                    </Nav.Link>

                    <Nav.Link
                        href="/gaming-modes"
                        className="me-3"
                        onClick={(e) => handleOnClickButton("/gaming-modes", e)}
                    >
                        <Button>Gaming Modes</Button>
                    </Nav.Link>

                    <Nav.Link
                        href="/shop"
                        className="me-3"
                        onClick={(e) => handleOnClickButton("/shop", e)}
                    >
                        <Button>Shop</Button>
                    </Nav.Link>

                    <Nav.Link
                        href="/about"
                        className=""
                        onClick={(e) => handleOnClickButton("/about", e)}
                    >
                        <Button>About</Button>
                    </Nav.Link>
                </div>

                <div className="login-section d-flex align-items-center ms-3">
                    {loading ? (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    ) : profileData ? (
                        <NavDropdown
                            title={
                                <div className="d-flex align-items-center">
                                    {profileData.currency && (
                                        <div className="d-flex align-items-center me-2">
                                            <img
                                                src="/img/coin-icon.png"
                                                alt="Currency Icon"
                                                className="currency-icon"
                                                style={{width: "20px", height: "20px", marginRight: "5px"}}
                                            />
                                            <span className="currency-display">
                        {profileData.currency}
                      </span>
                                        </div>
                                    )}
                                    <img
                                        src={
                                            profileData.avatarUrl ||
                                            "../../../../public/img/default-user-icon.png"
                                        }
                                        alt="User Avatar"
                                        className="avatar"
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                        }}
                                    />
                                </div>
                            }
                            id="user-nav-dropdown"
                            align="end"
                        >
                            <NavDropdown.Item onClick={handleOnClickProfile}>
                                Profile
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                href="/organizations"
                                onClick={(e) => handleOnClickButton("/organizations", e)}
                            >
                                My Organizations
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                href="/notifications"
                                onClick={(e) => handleOnClickButton("/notifications", e)}
                            >
                                My Notifications
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                href="/my-quizzes"
                                onClick={(e) => handleOnClickButton("/my-quizzes", e)}
                            >
                                My Quizzes
                            </NavDropdown.Item>
                            {userData && userData.role === 'Admin' && <NavDropdown.Item
                                href="/admin"
                                onClick={(e) => handleOnClickButton("/admin", e)}
                            >
                                Admin Menu
                            </NavDropdown.Item>
                            }
                            <NavDropdown.Item onClick={logout}>Log Out</NavDropdown.Item>
                        </NavDropdown>
                    ) : null}

                    {!loading && userData === null && (
                        <a
                            href="/signin"
                            className="btn btn-primary d-flex align-items-center"
                        >
                            Sign in
                        </a>
                    )}
                </div>
            </Container>
        </Navbar>
    );
};

export default HeaderBar;
