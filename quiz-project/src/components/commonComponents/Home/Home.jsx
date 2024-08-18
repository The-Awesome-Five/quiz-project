import React, { useEffect } from "react";
import './Home.css';

const Home = () => {

    useEffect(() => {
        const buttons = document.querySelectorAll(".create-btn");

        buttons.forEach(button => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
        
                if (!button.classList.contains("animate")) {
                    button.classList.add("animate");
                    setTimeout(() => {
                        button.classList.remove("animate");
                    }, 800); 
                }
            });
        });
    }, []);

    return (
        <div className="home-container d-flex flex-column justify-content-center align-items-center mt-4">
            <div className="d-flex quiz-section">
                
                <div className="createquiz-container d-flex align-items-center">
                    <div className="img-container">
                        <img src="https://via.placeholder.com/150" alt="Quiz Image" />
                    </div>
                    <div className="text-container text-center ms-4">
                        <h3 className="text-center"><strong>Create a quiz</strong></h3>
                        <p>Play for free with</p>
                        <p>your friends</p>
                        <button className="create-btn btn btn-success">Quiz editor</button>
                    </div>
                </div>

                
                <div className="createquiz-container d-flex align-items-center ms-4">
                    <div className="img-container">
                        <img src="https://via.placeholder.com/150" alt="Organization Image" />
                    </div>
                    <div className="text-container text-center ms-4">
                        <h3 className="text-center"><strong>Create an organization</strong></h3>
                        <p>with your friends and</p>
                        <p>conquer new knowledge</p>
                        <button className="create-btn btn btn-info">Organization creator</button>
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
