import React from "react";
import {Card} from "react-bootstrap";
import {Link} from "react-router-dom";
import './QuizItem.css'


export const QuizItem = ({
                                quiz,
                                id,
                         }) => {

    const access = quiz.organizationID ? 'organisation' : 'public';

    return (
<Card bg="success" className="quiz-card shadow-lg p-3 mb-5 bg-white rounded text-center">
    <Card.Img variant="top" 
              src={quiz.avatar && quiz.avatar.includes('http') ? quiz.avatar : 'https://img.freepik.com/premium-vector/quiz-logo-with-speech-bubble-icon_149152-811.jpg'}
              className="quiz-card-img"/>
    <Card.Body className="quiz-card-body text-center">
        <Card.Title className="quiz-card-title">{quiz.name}</Card.Title>
    </Card.Body>
    <Card.Body>
        <Link to={`/quizzes/${id}`} state={{ path: `/quizzes/${id}` }}>
            <button className="btn-success quiz-button">Start Quiz</button>
        </Link>
    </Card.Body>
</Card>

    )

}
