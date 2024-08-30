import React, {useContext, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {fetchQuizByPath, saveQuizToUser, submitQuizByUser} from "../../services/quiz.service";
import {toast} from "react-toastify";
import {Question} from "./Question.jsx";
import {Card, Container} from "react-bootstrap";
import {AppContext} from "../../appState/app.context.js";

export const Quiz = () => {

    const [quiz, setQuiz] = useState([])
    const [answers, setAnswers] = useState([]);
    const [indexOfQuestion, setIndexOfQuestion] = useState(0);
    const [isStarted, setIsStarted] = useState(false);
    const [score, setScore] = useState(0);
    const { userData } = useContext(AppContext)

    const location = useLocation();
    const path = location.state?.path;
    const navigate = useNavigate();


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


    const submit = async () => {

        if (answers.filter(x => !!x || x === 0).length !== quiz.questions.length) {
            return toast.error('Not all questions have been answered!');

        }

        const score = quiz.questions.reduce((accScore, currQuestion, currIndex) => {

            if (currQuestion.correctAnswerIndex === answers[currIndex]) {
                accScore+=1;
            }

            return accScore;
        },0);

        try {
            await submitQuizByUser({answers, score}, path, userData.uid);

            await saveQuizToUser(quiz.quizId, userData.uid, score);

            toast.success('Quiz has been submitted!')

            navigate('/');
        } catch (e) {
            toast.error(e)
        }

    }
    if(!quiz){
        return (<h2>...loading</h2>)
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
