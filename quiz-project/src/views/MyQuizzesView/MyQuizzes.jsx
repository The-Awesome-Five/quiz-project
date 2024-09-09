import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from "../../appState/app.context";
import { getQuizDetails } from "../../services/quiz.service";
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MyQuizzes = () => {
    const { userData } = useContext(AppContext);
    const [completedQuizzes, setCompletedQuizzes] = useState([]);
    const [acceptedQuizzes, setAcceptedQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState({});
    const navigate= useNavigate();
    useEffect(() => {
        if (userData) {
            const fetchQuizzes = async () => {
                try {
                    const acceptedQuizIDs = Object.keys(userData.notifications.accepted);
                    const completedQuizIDs = Object.keys(userData.completed);

                    const incompleteAcceptedQuizzes = acceptedQuizIDs.filter(quizID => !completedQuizIDs.includes(quizID));

                    const [infoCompleted, infoNotCompleted] = await Promise.all([
                        getQuizDetails(completedQuizIDs),
                        getQuizDetails(incompleteAcceptedQuizzes),
                    ]);
                    setCompletedQuizzes(infoCompleted);
                    setAcceptedQuizzes(infoNotCompleted);
                    const initialTimeLeft = {};
                    infoNotCompleted.forEach(quiz => {
                        if (quiz.ruleSet?.openDuration) {
                            initialTimeLeft[quiz.id] = quiz.ruleSet.openDuration;
                        }
                    });
                    setTimeLeft(initialTimeLeft);

                } catch (err) {
                    setError(err.message || 'An error occurred');
                } finally {
                    setLoading(false);
                }
            };

            fetchQuizzes();
        }
    }, [userData]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTimeLeft => {
                const updatedTimeLeft = { ...prevTimeLeft };
                Object.keys(updatedTimeLeft).forEach(quizID => {
                    const timeLimit = new Date(updatedTimeLeft[quizID]);
                    const now = new Date();
                    const timeDiff = timeLimit - now;

                    if (timeDiff <= 0) {
                        delete updatedTimeLeft[quizID];
                    } else {
                        updatedTimeLeft[quizID] = new Date(now.getTime() + timeDiff).toISOString();
                    }
                });

                return updatedTimeLeft;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">Error: {error}</Alert>;

    return (
        <Container>
            <h2 className="my-4">Completed Quizzes</h2>
            <Row>
                {completedQuizzes.length > 0 ? (
                    completedQuizzes.map(quiz => (
                        <Col md={4} key={quiz.id} className="mb-4">
                            <Card>
                                <Card.Img variant="top" src={quiz.avatar ? quiz.avatar : '/img/quizhub-logo.png'} style={{ width: 'auto', height: '200px' }} />
                                <Card.Body>
                                    <Card.Title>{quiz.name}</Card.Title>
                                    <Card.Text>
                                        <strong>Description:</strong> {quiz.description}
                                        <br />
                                        <strong>Difficulty Level:</strong> {quiz.difficultyLevel}
                                        <br />
                                        <strong>Number of Questions:</strong> {quiz.numberOfQuestions}
                                        <br />
                                        <strong>Score:</strong> {quiz.submission[userData.uid]?.score || 'N/A'}
                                    </Card.Text>
                                    <Button variant="primary" disabled>Completed</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Alert variant="info">No completed quizzes.</Alert>
                )}
            </Row>

            <h2 className="my-4">Accepted but Incomplete Quizzes</h2>
            <Row>
                {acceptedQuizzes.length > 0 ? (
                    acceptedQuizzes.map(quiz => (
                        <Col md={4} key={quiz.id} className="mb-4">
                            <Card>
                                <Card.Img className="quiz-img-card" variant="top" src={quiz.avatar} />
                                <Card.Body>
                                    <Card.Title>{quiz.name}</Card.Title>
                                    <Card.Text>
                                        <strong>Difficulty Level:</strong> {quiz.difficultyLevel}
                                        <br />
                                        <strong>Number of Questions:</strong> {quiz.numberOfQuestions}
                                        <br />
                                        <strong>Created On:</strong> {new Date(quiz.createdOn).toLocaleDateString()}
                                        <br />
                                        {timeLeft[quiz.id] && (
                                            <div>
                                                <strong>Time Left:</strong> {calculateTimeLeft(timeLeft[quiz.id])}
                                            </div>
                                        )}
                                    </Card.Text>
                                    {quiz.ruleSet?.openDuration ? (
                                        calculateTimeLeft(quiz.ruleSet?.openDuration) !== "Time's up!" ? (
                                            <Button variant="primary" onClick={()=>navigate(`/quizzes/${quiz.id}`, {state: { path: `/quizzes/${quiz.id}` }})}>Take Test</Button>
                                        ) : (
                                            <Button variant="primary" disabled>Time's up</Button>
                                        )
                                    ) : (
                                        
                                        <Button variant="primary" onClick={()=>navigate(`/quizzes/${quiz.id}`, {state: { path: `/quizzes/${quiz.id}` }})}>Take Test</Button>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Alert variant="info">No accepted but incomplete quizzes.</Alert>
                )}
            </Row>
        </Container>
    );
};

const calculateTimeLeft = (timeLimit) => {
    const now = new Date();
    const endTime = new Date(timeLimit);
    const timeDiff = endTime - now;

    if (timeDiff <= 0) return "Time's up!";

    const hours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
    const minutes = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
};

export default MyQuizzes;   