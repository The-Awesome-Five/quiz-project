import React from "react";
import {Button, Card, ListGroup} from "react-bootstrap";
import {Link} from "react-router-dom";

export const QuizItem = ({
                                quiz,
                                categoryKey,
                                diffKey
                         }) => {

    const access = quiz.organizationID ? 'organizations' : 'public';

    return (
        <Card border="success" bg="primary" >
            <Card.Img variant="top" src={quiz.avatar.includes('http') ?
                quiz.avatar :
                'https://img.freepik.com/premium-vector/quiz-logo-with-speech-bubble-icon_149152-811.jpg'}
                      className="w-100"
                      style={{ height: '150px', objectFit: 'fill' }}/>
            <Card.Body>
                <Card.Title>{quiz.name}</Card.Title>
                <Card.Text>
                    {quiz.description
                        ? quiz.description.length > 100
                            ? quiz.description.slice(0,100)
                            : quiz.description
                        : 'No description available'}
                </Card.Text>
            </Card.Body>
            <Card.Body>
                <Link
                    to={`/quizzes/${quiz.quizId}`}
                    state={{
                        path: `/quizzes/${access}/${categoryKey}/${diffKey}/${quiz.quizId}`
                    }}
                >
                    <button>Start Quiz</button>
                </Link>
            </Card.Body>
        </Card>
    )

}

/*  <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{quiz.name}</Card.Title>
                <Card.Text>
                    {quiz.description}
                </Card.Text>
                <Link
                    to={`/quizzes/${quiz.quizId}`}
                    state={{
                        path: `/quizzes/${access}/${categoryKey}/${diffKey}/${quiz.quizId}`
                    }}
                >
                    Start Quiz
                </Link>
            </Card.Body>
        </Card>*/
