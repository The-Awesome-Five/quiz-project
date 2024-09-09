import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchQuizByPath,
  saveQuizToUser,
  submitQuizByUser,
} from "../../services/quiz.service";
import { toast } from "react-toastify";
import { Question } from "./Question.jsx";
import { Card, Container } from "react-bootstrap";
import { AppContext } from "../../appState/app.context.js";
import TimeCounter from "../../utills/TimeCounter.jsx";
import './Quiz.css'

export const Quiz = () => {
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [indexOfQuestion, setIndexOfQuestion] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(0);
  const { userData } = useContext(AppContext);

  const location = useLocation();
  const path = location.state?.path;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async (path) => {
      try {
        const quiz = await fetchQuizByPath(path);

        setQuiz(quiz);
      } catch (e) {
        toast.error("Could not fetch the quiz successfully!");
      }
    };

    fetchQuiz(path);
  }, []);

  const forwards = () => {
    setIndexOfQuestion(indexOfQuestion + 1);
  };
  const backwards = () => {
    setIndexOfQuestion(indexOfQuestion - 1);
  };

  const handleAnswer = (selectedIndex) => {
    quiz.questions[indexOfQuestion].selectedAnswer = selectedIndex;

    setAnswers((prevAnswers) => {
      prevAnswers[indexOfQuestion] = selectedIndex;

      return prevAnswers;
    });
  };

  const handleOpenAnswer = (e) => {
    const answer = e.target.value;
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[indexOfQuestion] = answer;
      return newAnswers;
    });
    quiz.question[indexOfQuestion].selectedAnswer = answer;
  };

  const submit = async (isTimeOver) => {
    if (
      !isTimeOver &&
      answers.filter((x) => !!x || x === 0).length !== quiz.questions.length
    ) {
      return toast.error("Not all questions have been answered!");
    }

    const score = quiz.questions.reduce((accScore, currQuestion, currIndex) => {
      if (currQuestion.correctAnswerIndex === answers[currIndex]) {
        accScore += +currQuestion.points;
      }

      return accScore;
    }, 0);

    console.log(quiz);
    if(userData){
    try {
      await submitQuizByUser({ answers, score }, path, userData.uid);

      await saveQuizToUser(quiz.id, userData.uid, score);

      toast.success("Quiz has been submitted!");

      navigate("/results-page", { state: { quiz: quiz.name, totalScore: quiz.totalScore, userScore: score } });
    } catch (e) {
      toast.error(e);
    }
  }
  else{
    navigate("/results-page", { state: { quiz: quiz.name, totalScore: quiz.totalScore, userScore: score } }); 
  }
  };

  const finish = () => {
    submit(false);
  };

  if (!quiz) {
    return <h2>...loading</h2>;
  }

  return (
    <Container className=" first-quiz-container d-flex justify-content-center">
      {!isStarted ? (
        <Card className="w-50 text-center align-items-center">
          <Card.Img
            variant="top"
            src={
              quiz.avatar && quiz.avatar.includes("http")
                ? quiz.avatar
                : "https://img.freepik.com/premium-vector/quiz-logo-with-speech-bubble-icon_149152-811.jpg"
            }
            className="w-50 h-50 object-fill m-1"
          />
          <hr />
          <Card.Title as="h1">{quiz.name}</Card.Title>
          <Card.Text as="p" className="text-center">
            {quiz.description}
          </Card.Text>
          {quiz.ruleSet && quiz.ruleSet.timeLimitPerQuiz && (
            <Card.Text as="p" className="text-center">
              Time to Solve: {quiz.ruleSet.timeLimitPerQuiz}
            </Card.Text>
          )}
          {quiz.ruleSet && quiz.ruleSet.timeLimitPerQuestion && (
            <Card.Text as="p" className="text-center">
              Time per question: {quiz.ruleSet.timeLimitPerQuestion}
            </Card.Text>
          )}
          <button onClick={() => setIsStarted(true)}>Start</button>
        </Card>
      ) : (
        <div className="btn-container">
          {quiz.ruleSet && quiz.ruleSet.timeLimitPerQuiz && (
            <TimeCounter
              initialSeconds={quiz.ruleSet.timeLimitPerQuiz}
              finish={finish}
            />
          )}
          <Question
            question={quiz.questions[indexOfQuestion]}
            quizTitle={quiz.name}
            handleAnswer={handleAnswer}
            handleOpenAnswer={handleOpenAnswer}
          />
          <button
            className="btn-success me-3"
            onClick={backwards}
            disabled={indexOfQuestion === 0}
          >
            Back
          </button>
          {indexOfQuestion === quiz.questions.length - 1 ? (
            <button className="btn-success" onClick={submit}>
              Submit Quiz
            </button>
          ) : (
            <button className="btn-success" onClick={forwards}>
              Next
            </button>
          )}
        </div>
      )}
    </Container>
  );
};
