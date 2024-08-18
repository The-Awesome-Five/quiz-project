import React from "react";
import './Home.css';

const Home = () => {
    return (
        <div className="home-container d-flex justify-content-center align-items-center mt-4">
            
            <div className="d-flex quiz-section">
                
            
                <div className="createquiz-container d-flex align-items-center">
                    <div className="img-container">
                        <img src="https://via.placeholder.com/150" alt="image" />
                    </div>
                    <div className="text-container ms-4">
                        <h3 className="text-center"><strong>Create a quiz</strong></h3>
                        <p>Play for free with</p>
                        <p>300 participants</p>
                        <button className="create-btn btn btn-success">Quiz editor</button>
                    </div>
                </div>
                
                
                <div className="createquiz-container d-flex align-items-center ms-4">
                    <div className="img-container">
                        <img src="https://via.placeholder.com/150" alt="image" />
                    </div>
                    <div className="text-container ms-4">
                        <h3 className="text-center"><strong>Create an organization</strong></h3>
                        <p>with your friends and</p>
                        <p>conquer new knowledge</p>
                        <button className="create-btn btn btn-info">Organization creator</button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Home;