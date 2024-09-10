/* eslint-disable react/jsx-key */
import React, {useState} from 'react';
import {Card, Col, Row} from "react-bootstrap";
import "./GameQuestion.css";

export const GameQuestion = ({question, handleAnswer,isNotYourTurn}) => {

    const [resetState, setResetState] = useState(true);

    const changeAnswer = (index) => {
        handleAnswer(index);
        setResetState(!resetState);
    }

    return (
        <Card style={{background: "#e1ac5f"}} className="align-items-center mw-100 mh-100 p-4">
            <hr/>
            <Row className="text-center m-2">
                <Card className="border border-dark bg-warning-subtle p-3 mb-4">
                    <h2>{question.question}</h2>
                </Card>
            </Row>
            <Row>
                {Object.keys(question.answers).map((answer, index) => {
                    return (
                        <button disabled={isNotYourTurn} className={`game-button border border-dark p-3 mb-4 ${isNotYourTurn ? 'disabled-button' : ""} ${question.selectedAnswer === index ? "selected" : ""}`}
                                onClick={() => changeAnswer(index)}>{String.fromCharCode(65 + index)}) {answer}</button>
                )
                })}
            </Row>
        </Card>
    )

}

/*{Object.keys(question.answers).map((answer, index) => {
                    return (
                        <Col key={index}>
                            {String.fromCharCode(65 + index)}   {
                            <button style={question.selectedAnswer === index
                                ? {background: "blue"}
                                : {background: "green"}} onClick={() => changeAnswer(index)}>{answer}</button>
                        }</Col>
                    )
                })}*/
