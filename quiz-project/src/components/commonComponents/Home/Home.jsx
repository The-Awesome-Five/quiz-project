import React, {useEffect, useState} from 'react';
import { getAllQuizzes } from '../../../services/quiz.service.js';
import { QuizItem } from "../../QuizComponents/QuizItem.jsx";
import {toast} from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from 'swiper/modules';
import { useNavigate } from "react-router-dom";
// Import Swiper styles
import './Home.css';
import "swiper/css";
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home = () => {

    const navigate = useNavigate()

    const handleCreateQuizOnClick = () => {
        navigate('/create-quiz')
    }

    const handleCreateOrganizationOnClick = () => {
        navigate('/create-organization')
    }
    const [quizData, setQuizData] = useState([]);

    useEffect(() => {

        const fetchQuizzes = async () => {
            const quizzes = await getAllQuizzes();
            setQuizData(quizzes);
        }

        try {
          fetchQuizzes();
        } catch (e) {
          toast.error(e);
        }
        console.log(quizData)
    }, []);

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
                <Swiper navigation={true} modules={[Navigation]} slidesPerView={6} spaceBetween={10}
        pagination={{
          clickable: true,
        }} className="mySwiper">
                 {Object.entries(quizData).map(([id, info]) =>
                    {
                        {console.log(info)}
                                return (
                                    <SwiperSlide key={id}>
                                    <QuizItem
                                        key={id}
                                        quiz={info}
                                        id={info.id}
                                    />
                                    </SwiperSlide>
                                );
                            })
                }   
      </Swiper>
            
            </div>
        </div>
    );
}

export default Home;
