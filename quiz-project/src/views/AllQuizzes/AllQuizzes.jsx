import React, {useEffect, useState} from 'react';
import {getAllQuizzes} from "../../services/quiz.service.js";
import {toast} from "react-toastify";
import {Container, ListGroup} from "react-bootstrap";

import {QuizItem} from "../../components/QuizComponents/QuizItem.jsx";

export const AllQuizzes = () => {

    const [quizData, setQuizData] = useState([]);

    useEffect(() => {

        const fetchQuizzes = async () => {
            const quizzes = await getAllQuizzes();
            setQuizData(prevState => [...prevState, ...quizzes]);
        }

        try {
            fetchQuizzes();
        } catch (e) {
            toast.error(e);
        }

    }, []);


    return (
        <Container>
                {Object.entries(quizData).map(([accessKey, accessValue]) =>
                    Object.entries(accessValue).map(([categoryKey, category]) =>
                        Object.entries(category).map(([diffKey, diff]) =>
                            Object.entries(diff).map(([quizKey, quiz]) => {
                                return (
                                    <QuizItem
                                        key={quizKey}
                                        quiz={quiz}
                                        categoryKey={categoryKey}
                                        diffKey={diffKey}
                                    />
                                );
                            })
                        )
                    )
                )}
        </Container>
    )
}
