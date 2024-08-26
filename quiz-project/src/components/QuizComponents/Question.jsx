import React, {useState} from 'react';
import {Card, Col, Row} from "react-bootstrap";
import backdrop from "bootstrap/js/src/util/backdrop.js";

export const Question = ({question, quizTitle, handleAnswer}) => {

    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const changeAnswer = (index) => {
        setSelectedAnswer(index);

        handleAnswer(index);
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
                        <Col key={index} style={selectedAnswer === index
                            ? {background: "blue"}
                            : {background: "green"}}>
                             {String.fromCharCode(65 + index)}) {
                            <button onClick={() => changeAnswer(index)}>{answer}</button>
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
