import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {fetchQuizByPath} from "../../services/quiz.service";
import {toast} from "react-toastify";
import {Question} from "./Question.jsx";

export const Quiz = () => {

    const [quiz, setQuiz] = useState([])
    const [indexOfQuestion, setIndexOfQuestion] = useState(0);
    const [isStarted, setIsStarted] = useState(false);
    const location = useLocation();
    const path = location.state?.path;


    useEffect(() => {

        const fetchQuiz = async (path) => {

            try {
                const quiz = await fetchQuizByPath(path);

                console.log('quiz')
                console.log(quiz)

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
    const submit = () => {
        console.log('submit')
    }

    return (

        <div>
            {!isStarted
                ? <button onClick={() => setIsStarted(true)}>Start</button>
                : (
                    <div>
                        <h1>{quiz.title}</h1>
                        <Question question={quiz.questions[indexOfQuestion]}/>
                        {
                            indexOfQuestion === quiz.questions.length - 1
                                ? <button onClick={submit}>Submit Quiz</button>
                                : <button onClick={forwards}>Next</button>

                        }

                        <button onClick={backwards} disabled={indexOfQuestion === 0}>Back</button>
                    </div>
                )}
        </div>


    )
}
