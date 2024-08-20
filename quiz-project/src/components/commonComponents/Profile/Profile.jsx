import React from "react";
import { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { AppContext } from '../../../appState/app.context';
import { getUserAvatarUrlByUID } from "../../../services/user.service";
import { getUserNameUrlByUID } from "../../../services/user.service";
import './Profile.css'
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const {userData}= useContext(AppContext);
    const [avatarURL, setAvatarUrl] = useState(null);
    const [profileData, setProfileData] = useState({ username: '', avatarUrl: null });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

const handleOnClickEditProfile = () => {
    navigate('/edit-profile')
}

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

    useEffect(() => {
        if (userData && userData.uid) {
            getUserNameUrlByUID(userData.uid)
                .then((data) => {
                    setProfileData({
                        username: data.username || 'User Name',
                        avatarUrl: data.avatarUrl || '/path-to-default-avatar/default-user-icon.png'  // Adjust the path to your default icon
                    });
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                    setProfileData({
                        username: 'User Name',
                        avatarUrl: '/path-to-default-avatar/default-user-icon.png'  // Fallback to default avatar
                    });
                    setError('Error fetching user data');
                });
        }
    }, [userData]);

    return (
        <Container className="profile-page">
            
            <Row className="align-items-center">
                <Col xs={12} md={3} className="text-start custom-avatar-col me-4">
                    <img
                        src={avatarURL}
                        alt="User Avatar"
                        className="profile-avatar"
                    />
                </Col>
                <Col xs={12} md={6}>
                    <h2>{profileData.username || 'User Name'}</h2>
                    <p>custom information</p>
                </Col>
                <Col xs={12} md={3}>
                    <div className="hero-section">

                    <Card className="text-center">
      <Card.Body className="hero-container ">
        <Card.Text className="mb-4"></Card.Text>
        
        <div className="hero-customization-container ">
          <div className="hero-customization">
            {/* Head Group */}
            <div className="hero-part head">
              <img
                src={"/img/head.png"}
                alt="Head"
                className="hero-image base-head"
              />
              <img
                src={"/img/head2.png"}
                alt="Head Accessory"
                className="hero-image overlay-head"
              />
            </div>

            {/* Torso Group */}
            <div className="hero-part torso">
              <img
                src={"/img/torso.png"}
                alt="Torso"
                className="hero-image base-torso"
              />
              <img
                src={"/img/torso2.png"}
                alt="Torso Accessory"
                className="hero-image overlay-torso"
              />
            </div>

            {/* Legs Group */}
            <div className="hero-part legs">
              <img
                src={"/img/legs.png"}
                alt="Legs"
                className="hero-image base-legs"
              />
              <img
                src={"/img/legs2.png"}
                alt="Leg Accessory"
                className="hero-image overlay-legs"
              />
            </div>
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
                    <button className="btn btn-success me-3">All Quizes</button>
                    <button className="btn btn-success" onClick={handleOnClickEditProfile}>Edit Profile</button>
                    </div>
                </Col>
            </Row>

            <hr />

            
            <Row>
                <Col>
                    <h4>{profileData.username}'s Quizes</h4>
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