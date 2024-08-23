import {Row, Col} from "react-bootstrap";
import React from "react";

export const AdminQuestionItem = ({ question}) => {

    return (
        <Col style={{margin:"10px"}}>
            <Row xs={2}>
                {question.question}
            </Row>
            <Row>
                <hr></hr>
            </Row>
            <Row xs={1}>
                {question.answers.map((answer, index) => {
                    return (
                        <Row key={index} style={index === question.correctAnswerIndex ? {border:"2px, solid, black"} : {}}>
                            {String.fromCharCode(65 + index)}) {answer}
                        </Row>
                    )
                })}
            </Row>
        </Col>
    )

}
