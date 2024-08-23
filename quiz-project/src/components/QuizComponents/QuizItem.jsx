import React from "react";
import {Card, ListGroup} from "react-bootstrap";
import {Link} from "react-router-dom";

export const QuizItem = ({
                                quiz,
                                categoryKey,
                                diffKey
                         }) => {

    const access = quiz.organizationID ? 'organizations' : 'public';

    return (
        <Card border="primary" style={{ width: '18rem' }}>
            <Card.Img variant="top" src={quiz.avatar} />
            <Card.Body>
                <Card.Title>{quiz.name}</Card.Title>
                <Card.Text>
                    {quiz.description}
                </Card.Text>
            </Card.Body>
            <Card.Body>
                <Link
                    to={`/quizzes/${quiz.quizId}`}
                    state={{
                        path: `/quizzes/${access}/${categoryKey}/${diffKey}/${quiz.quizId}`
                    }}
                >
                    Start Quiz
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
