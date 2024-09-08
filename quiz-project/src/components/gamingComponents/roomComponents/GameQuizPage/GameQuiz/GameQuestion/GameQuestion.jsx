import React, {useState} from 'react';
import {Card, Col, Row} from "react-bootstrap";

export const GameQuestion = ({question, handleAnswer,notYourTurn}) => {

    const [resetState, setResetState] = useState(true);

    const changeAnswer = (index) => {
        handleAnswer(index);
        setResetState(!resetState);
    }

    return (
        <Card className="align-items-center mw-100 mh-100 bg-success p-4">
            <hr/>
            <Row className="text-center m-2">
                <Card className="border border-dark bg-warning-subtle p-3 mb-4">
                    <h2>{question.question}</h2>
                </Card>
            </Row>
            <Row>
                {Object.keys(question.answers).map((answer, index) => {
                    return (
                        <Col xs={6} className="mb-2">
                            <Card className="border border-dark bg-warning-subtle p-3 mb-4"> {
                            <button disabled={notYourTurn} style={question.selectedAnswer === index
                                ? {background: "red"}
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
