import React, { useEffect } from "react";
import './Home.css';
import { useNavigate } from "react-router-dom";

const Home = () => {

    const navigate = useNavigate()

    const handleCreateQuizOnClick = () => {
        navigate('/create-quiz')
    }

    const handleCreateOrganizationOnClick = () => {
        navigate('/create-organization')
    }

    return (
        <div className="home-container d-flex flex-column justify-content-center align-items-center mt-4">
            <div className="d-flex quiz-section">

                <div className="createquiz-container d-flex align-items-center">
                    <div className="img-container">
                        <img src="../../../../public/img/brain-icon.png" alt="Quiz Image" />
                    </div>
                    <div className="text-container text-center ms-4">
                        <h3 className="text-center"><strong>Create a quiz</strong></h3>
                        <p>Play for free with</p>
                        <p>your friends</p>
                        <button className="btn create-btn btn-success" onClick={handleCreateQuizOnClick}>Quiz creator</button>
                    </div>
                </div>


                <div className="createquiz-container d-flex align-items-center ms-4">
                    <div className="img-container">
                        <img src="../../../../public/img/organization-icon.png" alt="Organization Image" />
                    </div>
                    <div className="text-container text-center ms-4">
                        <h3 className="text-center"><strong>Create an organization</strong></h3>
                        <p>with your friends and</p>
                        <p>conquer new knowledge</p>
                        <button className="btn create-btn btn-info" onClick={handleCreateOrganizationOnClick}>Organization creator</button>
                    </div>
                </div>
            </div>


            <div className="game-modes-container row mt-4 text-start">
                <h4>Game modes</h4>
                <div className="quiz-list d-flex">
                    <div className="quiz-item">
                        <img src="https://via.placeholder.com/150" alt="Quiz" />
                        <p>Countries</p>
                    </div>
                    <div className="quiz-item">
                        <img src="https://via.placeholder.com/150" alt="Quiz" />
                        <p>Astrology</p>
                    </div>
                    <div className="quiz-item">
                        <img src="https://via.placeholder.com/150" alt="Quiz" />
                        <p>Astrology</p>
                    </div>
                    <div className="quiz-item">
                        <img src="https://via.placeholder.com/150" alt="Quiz" />
                        <p>Astrology</p>
                    </div>
                    <div className="quiz-item">
                        <img src="https://via.placeholder.com/150" alt="Quiz" />
                        <p>Astrology</p>
                    </div>
                    <div className="quiz-item">
                        <img src="https://via.placeholder.com/150" alt="Quiz" />
                        <p>Astrology</p>
                    </div>


                </div>
            </div>
        </div>
    );
}

export default Home;
