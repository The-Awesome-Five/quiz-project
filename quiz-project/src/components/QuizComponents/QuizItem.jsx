import React from "react";
import {Card} from "react-bootstrap";
import {Link} from "react-router-dom";


export const QuizItem = ({
                                quiz,
                                id,
                         }) => {

    const access = quiz.organizationID ? 'organisation' : 'public';

    return (
        <Card bg="success" className="shadow-lg p-3 mb-5 bg-white rounded align-items-center text-center" style={{border:"2px solid green"}}>
            <Card.Img variant="top" src={quiz.avatar && quiz.avatar.includes('http') ?
                quiz.avatar :
                'https://img.freepik.com/premium-vector/quiz-logo-with-speech-bubble-icon_149152-811.jpg'}
                      className="w-75 h-75 object-fill m-1"/>
            <Card.Body className="align-items-center text-center" style={{border:"2px solid black"}}>
                <Card.Title>{quiz.name}</Card.Title>
                <Card.Text className="w-100">
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
                        path: `/quizzes/${id}`
                    }}
                >
                    <button>Start Quiz</button>
                </Link>
            </Card.Body>
        </Card>
    )

}
