import React, {useState} from 'react';
import {Card, Col, Row} from "react-bootstrap";

export const GameQuestion = ({question, handleAnswer}) => {

    const [resetState, setResetState] = useState(true);

    const changeAnswer = (index) => {
        handleAnswer(index);
        setResetState(!resetState);
    }

    return (
        <Card className="align-items-center mw-100 mh-100">
            <hr/>
            <Row className="text-center">
                <h3>{question.question}</h3>
            </Row>
            <Row>
                {Object.keys(question.answers).map((answer, index) => {
                    return (
                        <Col xs={6} className="mb-2">
                            <Card className="border border-dark bg-light p-3 mb-4"> {
                            <button style={question.selectedAnswer === index
                                ? {background: "blue"}
                                : {background: "green"}} onClick={() => changeAnswer(index)}>{String.fromCharCode(65 + index)}) {answer}</button>
                        }
                            </Card>
                        </Col>
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
