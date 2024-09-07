import React, { useEffect, useState } from "react";
import {
  getAllQuizzes,
  getQuizzesByCat,
} from "../../../services/quiz.service.js";
import { QuizItem } from "../../QuizComponents/QuizItem.jsx";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
// Import Swiper styles
import "./Home.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Home = () => {
  const navigate = useNavigate();

  const handleCreateQuizOnClick = () => {
    navigate("/create-quiz");
  };

  const handleCreateOrganizationOnClick = () => {
    navigate("/create-organization");
  };
  const [quizData, setQuizData] = useState([]);
  const [historyQuizData, setHistoryQuizData] = useState([]);
  const [mathQuizData, setMathQuizData] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const quizzes = await getAllQuizzes();
      const historyQuizzes = await getQuizzesByCat("history");
      const mathQuizzes = await getQuizzesByCat("math");
      setMathQuizData(mathQuizzes);
      setHistoryQuizData(historyQuizzes);
      setQuizData(quizzes);
    };

    try {
      fetchQuizzes();
    } catch (e) {
      toast.error(e);
    }
  }, []);

  return (
    <div className="home-container d-flex flex-column justify-content-center align-items-center mt-4">
      <div className="d-flex quiz-section">
        <div className="card-container d-flex align-items-center ms-4">
          <div className="circle" style={{ "--clr": "#19444a" }}>
            <img
              src="../../../../public/img/question-mark.png"
              alt="Coca Cola Logo"
              className="logo"
            />
          </div>
          <div className="content text-start ms-4">
            <h3 className="text-start mb-3">
              <strong>Create a quiz</strong>
            </h3>
            <p>with your friends and</p>
            <p>conquer new knowledge</p>
            <button
              className="btn create-btn btn-info mt-4"
              onClick={handleCreateQuizOnClick}
            >
              Quiz creator
            </button>
          </div>
          <img
            src="../../../../public/img/brain-icon.png"
            alt="Coca Cola Product"
            className="product_img"
          />
        </div>

        <div className="card-container d-flex align-items-center ms-4">
          <div className="circle" style={{ "--clr": "#19444a" }}>
            <img
              src="../../../../public/img/org-icon.png"
              alt="Coca Cola Logo"
              className="logo"
            />
          </div>
          <div className="content text-start ms-4">
            <h3 className="text-start mb-3">
              <strong>Create an organization</strong>
            </h3>
            <p>with your friends or</p>
            <p>for your students</p>
            <button
              className="btn create-btn btn-info mt-4"
              onClick={handleCreateQuizOnClick}
            >
              Organization creator
            </button>
          </div>
          <img
            src="../../../../public/img/organization-icon.png"
            alt="Coca Cola Product"
            className="product_img"
          />
        </div>
      </div>

      <div className="game-modes-container row mt-4 text-start">
        <h4>All quizzes</h4>
        <Swiper
  navigation={true}
  modules={[Navigation]}
  slidesPerView={6}
  spaceBetween={10}
  pagination={{ clickable: true }}
  className="mySwiper"
>
  {Object.entries(historyQuizData).map(([id, info]) => {
    return (
      <SwiperSlide key={id}>
        <div className="quiz-item-container">
          <QuizItem key={id} quiz={info} id={info.id} className="quiz-item" />
        </div>
      </SwiperSlide>
    );
  })}
</Swiper>


        <h4>History quizzes</h4>
        <Swiper
          navigation={true}
          modules={[Navigation]}
          slidesPerView={6}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          className="mySwiper"
        >
          {Object.entries(historyQuizData).map(([id, info]) => {
            return (
              <SwiperSlide key={id}>
                <QuizItem key={id} quiz={info} id={info.id} />
              </SwiperSlide>
            );
          })}
        </Swiper>

        <h4>Math quizzes</h4>
        <Swiper
          navigation={true}
          modules={[Navigation]}
          slidesPerView={6}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          className="mySwiper"
        >
          {Object.entries(mathQuizData).map(([id, info]) => {
            return (
              <SwiperSlide key={id}>
                <QuizItem key={id} quiz={info} id={info.id} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default Home;
