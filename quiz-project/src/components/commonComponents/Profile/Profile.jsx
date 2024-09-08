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
  const [organizations, setOrganizations] = useState([]);

  const [selectedHeadItem, setSelectedHeadItem] = useState("");
  const [selectedTorsoItem, setSelectedTorsoItem] = useState("");
  const [selectedLegsItem, setSelectedLegsItem] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (uid) {
      getUserDataByUID(uid)
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
    } else {
      setProfileData(userData);
      console.log("User Data from Context:", userData); // Проверяваме данните от контекста
      setSelectedHeadItem(userData?.selectedHeadItem || "");
      setSelectedTorsoItem(userData?.selectedTorsoItem || "");
      setSelectedLegsItem(userData?.selectedLegsItem || "");
      setIsLoading(false);
    }

    if (uid) {
      // Fetch organizations
      getUserDataByUID(uid)
        .then((data) => {
          const userProfile = Object.values(data)[0];
          console.log("Organizations:", userProfile?.organizations); // Проверяваме организациите
          if (userProfile?.organizations) {
            const orgs = Object.values(userProfile.organizations);
            setOrganizations(orgs);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch organizations:", error);
        });
    }
  }, [uid, userData]);

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
          <Col className="mt-3">
            <Col>
              <div className="btn-edit d-flex justify-content-center justify-content-md-start">
                {isCurrentUserProfile && (
                  <Link to="/edit-profile">
                    <button className="btn-success">Edit Profile</button>
                  </Link>
                )}
                {isCurrentUserProfile && (
                  <Link to="/shop">
                    <button className="btn-success ms-3">Shop</button>
                  </Link>
                )}
              </div>
            </Col>
          </Col>
          <div className="org-container mt-4">
            <h5>ORGANIZATIONS</h5>
            {profileData?.organizations ? (
              <ul className="list">
                {Object.values(profileData.organizations).map((org, index) => (
                  <li key={index}>
                    <Link to={`/organization/${org.organizationID}`}>
                    <img
                      className="org-img"
                      src={org.organizationImage}
                      alt={org.organizationName}
                      width={100}
                      height={100}
                    />{" "}
                    
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No organizations available.</p>
            )}
          </div>
        </Col>

        {/* Колона за информация за профила */}
        <Col xs={12} md={6} className="info-col text-center text-md-start">
          <h2 className="name mb-4" style={{ fontWeight: "bold" }}>
            {profileData?.username}
          </h2>
          <p className="mb-0">
            <img
              className="mb-1"
              src="../../../../public/img/R (2).png"
              alt=""
              height={20}
            />{" "}
            FIRST NAME: {profileData?.firstName}
          </p>
          <p className="mb-0">
            <img
              className="mb-1"
              src="../../../../public/img/R (2).png"
              alt=""
              height={20}
            />{" "}
            LAST NAME: {profileData?.lastName}
          </p>
          <p className="mb-0">
            <img
              className="mb-1"
              src="../../../../public/img/R (2).png"
              alt=""
              height={20}
            />{" "}
            PHONE NUMBER: {profileData?.phone || "N/A"}
          </p>
          <p className="mb-0">
            <img
              className="mb-1"
              src="../../../../public/img/R (2).png"
              alt=""
              height={20}
            />
            {profileData?.customInfo || " No additional info provided."}
          </p>
          <br />
          <p className="mb-0">
            <img
              className="mb-1"
              src="../../../../public/img/coin-icon.png"
              alt=""
              height={20}
            />{" "}
            WINDSOM POINTS: {profileData?.currency}
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
                    background: "#977746",
                    border: "#977746",
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
                    background: "#977746",
                    border: "#977746",
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
                  className="btn-success"
                  variant="success"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "5px 10px",
                    fontSize: "12px",
                    background: "#977746",
                    border: "#977746",
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
      </Modal>
    </Container>
  );
};

export default Profile;
