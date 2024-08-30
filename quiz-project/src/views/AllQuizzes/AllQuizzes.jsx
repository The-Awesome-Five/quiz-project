import React, {useEffect, useState} from 'react';
import {getAllQuizzes} from "../../services/quiz.service.js";
import {toast} from "react-toastify";
import {Col, Container, ListGroup, Row} from "react-bootstrap";

import {QuizItem} from "../../components/QuizComponents/QuizItem.jsx";

export const AllQuizzes = () => {

    const [quizData, setQuizData] = useState(null);

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

    }, []);
    if (!quizData) {
        return <div>Loading...</div>; 
    }

    return (
        <Container>
            <Row xs={4} md={4} className="g-1">
                {Object.entries(quizData).map(([id, info]) =>
                    {
                        {console.log(info)}
                                return (
                                    <Col key={id}>
                                    <QuizItem
                                        key={id}
                                        quiz={info}
                                        id={info.id}
                                    />
                                    </Col>
                                );
                            })
                }   
                 
                </Row>
        </Container>
    )
}
