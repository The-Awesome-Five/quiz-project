import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { AppContext } from "../../../appState/app.context";
import {
  getUserDataByUID,
  updateUserSelectedItems,
} from "../../../services/user.service";
import "./Profile.css";
import { Link, useNavigate, useParams } from "react-router-dom";

const Profile = () => {
  const { uid } = useParams();
  const { userData } = useContext(AppContext);
  const [profileData, setProfileData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [selectedHeadItem, setSelectedHeadItem] = useState("");
  const [selectedTorsoItem, setSelectedTorsoItem] = useState("");
  const [selectedLegsItem, setSelectedLegsItem] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (uid) {
      getUserDataByUID(uid)
        .then((data) => {
          const userProfile = Object.values(data)[0];
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
    } else {
      setProfileData(userData);
      setSelectedHeadItem(userData?.selectedHeadItem || "");
      setSelectedTorsoItem(userData?.selectedTorsoItem || "");
      setSelectedLegsItem(userData?.selectedLegsItem || "");
      setIsLoading(false);
    }
  }, [userData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profileData) {
    return <div>No profile data found</div>;
  }

  const isCurrentUserProfile = uid === userData.uid || !uid;

  const handleShowModal = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory("");
  };

  const handleItemClick = async (item) => {
    if (selectedCategory === "head") {
      setSelectedHeadItem(item.image);
      await updateUserSelectedItems(userData.uid, {
        selectedHeadItem: item.image,
      });
    } else if (selectedCategory === "torso") {
      setSelectedTorsoItem(item.image);
      await updateUserSelectedItems(userData.uid, {
        selectedTorsoItem: item.image,
      });
    } else if (selectedCategory === "legs") {
      setSelectedLegsItem(item.image);
      await updateUserSelectedItems(userData.uid, {
        selectedLegsItem: item.image,
      });
    }
    handleCloseModal();
  };

  const handleRemoveItem = async () => {
    if (selectedCategory === "head") {
      setSelectedHeadItem("");
      await updateUserSelectedItems(userData.uid, { selectedHeadItem: "" });
    } else if (selectedCategory === "torso") {
      setSelectedTorsoItem("");
      await updateUserSelectedItems(userData.uid, { selectedTorsoItem: "" });
    } else if (selectedCategory === "legs") {
      setSelectedLegsItem("");
      await updateUserSelectedItems(userData.uid, { selectedLegsItem: "" });
    }
    handleCloseModal();
  };

  const renderItemsByCategory = (category) => {
    const items =
      profileData?.items && profileData.items[category]
        ? profileData.items[category]
        : {};

    const itemsArray = Object.values(items);

    return (
      <>
        <div onClick={handleRemoveItem} className="remove-item">
          None
        </div>
        {itemsArray.length > 0 ? (
          itemsArray.map((item, index) => (
            <div key={index} onClick={() => handleItemClick(item)}>
              <img src={item.image} alt={item.name} className="item-image" />
            </div>
          ))
        ) : (
          <p>No items available in this category.</p>
        )}
      </>
    );
  };

  return (
    <Container className="profile-page">
      <Row className="container">
        {/* Колона за аватар */}
        <Col xs={12} md={3} className=" text-md-start custom-avatar-col">
          <img
            src={profileData?.avatarUrl || "/img/default-user-icon.png"}
            alt="User Avatar"
            className="profile-avatar"
          />
        </Col>

        {/* Колона за информация за профила */}
        <Col xs={12} md={6} className="text-center text-md-start">
          <h2 className="mb-4">{profileData?.username}</h2>
          <p className="mb-0">First Name: {profileData?.firstName}</p>
          <p className="mb-0">Last Name: {profileData?.lastName}</p>
          <p className="mb-0">Phone Number: {profileData?.phone || "N/A"}</p>
          <p className="mb-0">Wisdom points: {profileData?.currency}</p>
          <p className="mb-0">
            {profileData?.customInfo || "No additional info provided."}
          </p>
        </Col>

        {/* Колона за героя (hero section) */}
        <Col xs={12} md={3} className="text-center">
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

              {/* Добавяне на бутоните за категориите Head, Torso, Legs */}
              <div className="d-flex justify-content-around p-3">
                <Button
                  variant="success"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "5px 10px",
                    fontSize: "12px",
                  }}
                  onClick={() => handleShowModal("head")}
                >
                  <img
                    src="../../../../public/img/head-icon.png"
                    alt="head icon"
                    style={{ width: "22px", height: "22px" }}
                  />
                </Button>

                <Button
                  variant="success"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "5px 10px",
                    fontSize: "12px",
                  }}
                  onClick={() => handleShowModal("torso")}
                >
                  <img
                    src="../../../../public/img/torso-icon.png"
                    alt="torso icon"
                    style={{ width: "22px", height: "22px" }}
                  />
                </Button>

                <Button
                  variant="success"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "5px 10px",
                    fontSize: "12px",
                  }}
                  onClick={() => handleShowModal("legs")}
                >
                  <img
                    src="../../../../public/img/leg-icon.png"
                    alt="legs icon"
                    style={{ width: "22px", height: "22px" }}
                  />
                </Button>
              </div>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Модал за показване на предметите */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCategory.toUpperCase()} Items</Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderItemsByCategory(selectedCategory)}</Modal.Body>
        {/* Removed the Close button from the footer */}
      </Modal>

      <Row className="mt-3">
        <Col>
          <div className="d-flex justify-content-center justify-content-md-start">
            <button className="btn btn-success me-3">All Quizzes</button>
            {isCurrentUserProfile && (
              <Link to="/edit-profile">
                <button className="btn btn-success">Edit Profile</button>
              </Link>
            )}
            {isCurrentUserProfile && (
              <Link to="/shop">
                <button className="btn btn-success ms-3">Shop</button>
              </Link>
            )}
          </div>
        </Col>
      </Row>

      <hr />

      <Row>
        <Col>
          <h4>{profileData?.username}'s Quizzes</h4>
          <Card className="mt-2">
            <Card.Body>
              <p>Quiz 1</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
