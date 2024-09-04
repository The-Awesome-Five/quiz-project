import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { AppContext } from '../../../appState/app.context';
import { getUserDataByUID } from "../../../services/user.service";
import './Profile.css';
import {Link, useNavigate, useParams} from "react-router-dom";

const Profile = () => {
    /*const { userData } = useContext(AppContext);
    const [avatarURL, setAvatarUrl] = useState('../../../../public/img/default-user-icon.png'); // default avatar
    const [profileData, setProfileData] = useState({
        username: 'User Name',
        avatarUrl: null,
        firstName: '',
        lastName: '',
        customInfo: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Track loading state
    const navigate = useNavigate();

    const handleOnClickEditProfile = () => {
        navigate('/edit-profile');
    };

    useEffect(() => {
        const loadUserProfileData = async () => {
            if (userData && userData.uid) {
                try {
                    console.log("Fetching user data for UID:", userData.uid);

                    // Fetching user profile data by UID using the getUserDataByUID function
                    const userDataFromDB = await getUserDataByUID(userData.uid);
                    console.log("Fetched user data:", userDataFromDB);

                    if (userDataFromDB) {
                        const firstKey = Object.keys(userDataFromDB)[0]; // Get the first key from the snapshot
                        const userProfile = userDataFromDB[firstKey]; // Access the actual user data

                        setProfileData({
                            username: userProfile.username || 'User Name',
                            avatarUrl: userProfile.avatarUrl || '../../../../public/img/default-user-icon.png',
                            firstName: userProfile.firstName || 'First name',
                            lastName: userProfile.lastName || 'Last name',
                            customInfo: userProfile.customInfo || 'Custom info'
                        });
                        setAvatarUrl(userProfile.avatarUrl || '../../../../public/img/default-user-icon.png');
                    } else {
                        setError('User not found');
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setError('Error fetching user data');
                } finally {
                    setLoading(false); // Loading is complete
                }
            }
        };

        loadUserProfileData();
    }, [userData]);

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator
    }

    if (error) {
        return <div>Error: {error}</div>; // Show error message
    }*/

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

            console.log('Current user profile:');
            console.log(profileData);
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
                        src={profileData.avatarUrl || "../../../../public/img/default-user-icon.png"}
                        alt="User Avatar"
                        className="profile-avatar"
                    />
                </Col>
                <Col xs={12} md={6}>
                    <h2 className="mb-4">{profileData.username}</h2>
                    <p className="mb-0">{profileData.firstName}</p>
                    <p className="mb-0">{profileData.lastName}</p>
                    <p className="mb-0">{profileData.customInfo}</p>
                </Col>
                <Col xs={12} md={3}>
                    <div className="hero-section">
                        <Card className="text-center">
                            <Card.Body className="hero-container">
                                <Card.Text className="mb-4"></Card.Text>
                                <div className="hero-customization-container">
                                    <div className="hero-customization">
                                        {/* Hero Customization Image Sections */}
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
                        <button className="btn btn-success me-3">All Quizzes</button>
                        {isCurrentUserProfile && (
                            <Link to='/edit-profile'><button className="btn btn-success">Edit Profile</button></Link>
                            )
                        }
                            {isCurrentUserProfile && (
                            <Link to='/shop'><button className="btn btn-success ms-3">Shop</button></Link>
                            )
                        }
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
