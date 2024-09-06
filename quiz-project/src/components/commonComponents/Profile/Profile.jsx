import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Card } from 'react-bootstrap';
import { AppContext } from '../../../appState/app.context';
import { getUserDataByUID } from "../../../services/user.service";
import './Profile.css';
import { Link, useNavigate, useParams } from "react-router-dom";

const Profile = () => {
    const { uid } = useParams();
    const { userData } = useContext(AppContext);
    const [profileData, setProfileData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("userId:", uid);
        console.log("userData:", userData);

        if (uid) {
            getUserDataByUID(uid)
                .then(data => {
                    console.log("Fetched data:", data);
                    setProfileData(Object.values(data)[0]);
                })
                .catch(error => console.error("Failed to fetch user data:", error));
        } else {
            setProfileData(userData);
        }
    }, [uid, userData]);

    if (!profileData) {
        return <div>Loading...</div>;
    }

    const isCurrentUserProfile = uid === userData.uid || !uid;

    const handleOnClickEditProfile = () => {
        navigate('/edit-profile');
    };

    return (
        <Container className="profile-page">
            <Row className="align-items-center">
                <Col xs={12} md={3} className="text-start custom-avatar-col me-4">
                    <img
                        src={profileData.avatarUrl || "/img/default-user-icon.png"}
                        alt="User Avatar"
                        className="profile-avatar"
                    />
                </Col>
                <Col xs={12} md={6}>
                    <h2 className="mb-4">{profileData.username}</h2>
                    <p className="mb-0"> First Name: {profileData.firstName}</p>
                    <p className="mb-0">Last Name: {profileData.lastName}</p>
                    <p className="mb-0">Phone Number:{profileData.phone}</p>
                    <p className="mb-0"> {profileData.customInfo}</p>
                </Col>
                <Col xs={12} md={3}>
                    <div className="hero-section">
                        <Card className="text-center">
                            <Card.Body className="hero-container">
                                <Card.Text className="mb-4"></Card.Text>
                                <div className="hero-customization-container">
                                    <div className="hero-customization">
                                        {/* Основно тяло на героя */}
                                        <img
                                            src={"/img/main-charackter.png"}
                                            alt="Main Body"
                                            className="hero-image base-body"
                                        />
                                        {/* Наслагване на аксесоари */}
                                        <img
                                            src={"/img/head-armor-1.png"}
                                            alt="Head Accessory"
                                            className="hero-image overlay-head"
                                        />
                                        <img
                                            src={"/img/torso-armor-1.png"}
                                            alt="Torso Accessory"
                                            className="hero-image overlay-torso"
                                        />
                                        <img
                                            src={"/img/legs-armor-1.png"}
                                            alt="Leg Accessory"
                                            className="hero-image overlay-legs"
                                        />
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>

            <Row className="mt-3">
                <Col>
                    <div className="d-flex">
                        <button className="btn btn-success me-3">All Quizzes</button>
                        {isCurrentUserProfile && (
                            <Link to='/edit-profile'>
                                <button className="btn btn-success">Edit Profile</button>
                            </Link>
                        )}
                        {isCurrentUserProfile && (
                            <Link to='/shop'>
                                <button className="btn btn-success ms-3">Shop</button>
                            </Link>
                        )}
                    </div>
                </Col>
            </Row>

            <hr />

            <Row>
                <Col>
                    <h4>{profileData.username}'s Quizzes</h4>
                    <Card className="mt-2">
                        <Card.Body>
                            <p>Quiz 1</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Profile;
