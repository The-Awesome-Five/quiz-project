import {Button, Card, Col, Container} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";

import {AppContext} from "../../../../appState/app.context.js";
import {getUserDataByUID} from "../../../../services/user.service.js";


export const AvatarComponent = ({userId}) => {


    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState({});
    const [selectedHeadItem, setSelectedHeadItem] = useState("");
    const [selectedTorsoItem, setSelectedTorsoItem] = useState("");
    const [selectedLegsItem, setSelectedLegsItem] = useState("");

    useEffect(() => {
        if (userId) {
            getUserDataByUID(userId)
                .then((data) => {
                    const userProfile = Object.values(data)[0];
                    console.log("User Profile:", userProfile); // Проверяваме какво съдържа потребителският профил
                    if (userProfile) {
                        setProfileData(userProfile);

                        setSelectedHeadItem(userProfile.selectedHeadItem || "");
                        setSelectedTorsoItem(userProfile.selectedTorsoItem || "");
                        setSelectedLegsItem(userProfile.selectedLegsItem || "");
                    }
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Failed to fetch user data:", error);
                    setIsLoading(false);
                });
        }

    }, [userId]);

    if (!userId) {
        return (
            <h1>Loading...</h1>
        )
    }

    return (
        <Container>
            <Col xs={12} md={6} className="info-col text-center text-md-start">
                <h2 className="name mb-4" style={{fontWeight: "bold"}}>
                    {profileData?.username}
                </h2>
                <p className="mb-0">
                    <img
                        className="mb-1"
                        src="/img/R (2).png"
                        alt=""
                        height={20}
                    />{" "}
                    FIRST NAME: {profileData?.firstName}
                </p>
                <p className="mb-0">
                    <img
                        className="mb-1"
                        src="/img/R (2).png"
                        alt=""
                        height={20}
                    />{" "}
                    LAST NAME: {profileData?.lastName}
                </p>
                <Col style={{width: "250px"}} className="text-center">
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
                                        {/* Наслагване на избрания head item */}
                                        {selectedHeadItem && (
                                            <img
                                                src={selectedHeadItem}
                                                alt="Head Accessory"
                                                className="hero-image overlay-head"
                                            />
                                        )}
                                        {/* Наслагване на избрания torso item */}
                                        {selectedTorsoItem && (
                                            <img
                                                src={selectedTorsoItem}
                                                alt="Torso Accessory"
                                                className="hero-image overlay-torso"
                                            />
                                        )}
                                        {/* Наслагване на избрания legs item */}
                                        {selectedLegsItem && (
                                            <img
                                                src={selectedLegsItem}
                                                alt="Leg Accessory"
                                                className="hero-image overlay-legs"
                                            />
                                        )}
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>

                <br/>
            </Col>

        </Container>
    )
}
