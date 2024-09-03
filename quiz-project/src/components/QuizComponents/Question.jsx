import React, {useState} from 'react';
import {Card, Col, Row} from "react-bootstrap";

export const Question = ({question, quizTitle, handleAnswer}) => {

    const [resetState, setResetState] = useState(true);

    const changeAnswer = (index) => {
        handleAnswer(index);
        setResetState(!resetState);
    }

    return (
        <Card className="text-center align-items-center">
            <Card.Title>{quizTitle}</Card.Title>
            <Row className="text-center">
                {question.question}
            </Row>
            <Row className="d-flex flex-column">
                {question.answers.map((answer, index) => {
                    return (
                        <Col key={index}>
                             {String.fromCharCode(65 + index)}   {
                            <button style={question.selectedAnswer === index
                                ? {background: "blue"}
                                : {background: "green"}} onClick={() => changeAnswer(index)}>{answer}</button>
                        }</Col>
                    )
                })}
            </Row>
        </Card>
    )

}

/*
style={
    question.selectedAnswer &&
        question.selectedAnswer === index &&
        {background:"blue"}*/
