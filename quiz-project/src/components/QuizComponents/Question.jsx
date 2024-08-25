import React from 'react';
import {Card, Col, Row} from "react-bootstrap";

export const Question = ({ question, quizTitle }) => {

    return (
        <Card className="text-center align-items-center">
            <Card.Title>{quizTitle}</Card.Title>
            <Row className="text-center">
                {question.question}
            </Row>
            <Row>
                {question.answers.map((answer, index) => {
                    return (
                        <Col key={index}>{String.fromCharCode(65 + index)}) {answer}</Col>
                    )
                })}
            </Row>
        </Card>
    )

}
