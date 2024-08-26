import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {fetchQuizByPath} from "../../services/quiz.service";
import {toast} from "react-toastify";
import {Question} from "./Question.jsx";
import {Card, Container} from "react-bootstrap";

export const Quiz = () => {

    const [quiz, setQuiz] = useState([])
    const [answers, setAnswers] = useState([]);
    const [indexOfQuestion, setIndexOfQuestion] = useState(0);
    const [isStarted, setIsStarted] = useState(false);
    const [score, setScore] = useState(0);
    const location = useLocation();
    const path = location.state?.path;


    useEffect(() => {

        const fetchQuiz = async (path) => {

            try {
                const quiz = await fetchQuizByPath(path);

                setQuiz(quiz);

            } catch (e) {
                toast.error("Could not fetch the quiz successfully!")
            }
        }

        fetchQuiz(path);

    }, [])

    const forwards = () => {
        setIndexOfQuestion(indexOfQuestion + 1);
    }
    const backwards = () => {
        setIndexOfQuestion(indexOfQuestion - 1);
    }

    const handleAnswer = (selectedIndex) => {

        quiz.questions[indexOfQuestion].selectedAnswer = selectedIndex;

        setAnswers((prevAnswers) => {
            prevAnswers[indexOfQuestion] = selectedIndex;

            return prevAnswers;
        });

    }


    const submit = () => {
        console.log('answers');
        console.log(answers);
    }

    return (

        <Container className="d-flex justify-content-center">
            {!isStarted
                ? <Card className="w-50 text-center align-items-center">
                    <Card.Img variant="top" src={quiz.avatar && quiz.avatar.includes('http') ?
                        quiz.avatar :
                        'https://img.freepik.com/premium-vector/quiz-logo-with-speech-bubble-icon_149152-811.jpg'}
                              className="w-50 h-50 object-fill m-1"/>
                    <Card.Title>{quiz.name}</Card.Title>
                    <Card.Text className="text-center">{quiz.description}</Card.Text>
                    <button onClick={() => setIsStarted(true)}>Start</button>
                </Card>
                : (
                    <div>
                        <Question
                            question={quiz.questions[indexOfQuestion]}
                            quizTitle={quiz.name}
                            handleAnswer={handleAnswer}/>
                        {
                            indexOfQuestion === quiz.questions.length - 1
                                ? <button onClick={submit}>Submit Quiz</button>
                                : <button onClick={forwards}>Next</button>

                        }

                        <button onClick={backwards} disabled={indexOfQuestion === 0}>Back</button>
                    </div>
                )}
        </Container>


    )
}
