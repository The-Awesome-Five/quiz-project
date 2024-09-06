import React, {useState} from 'react';
import {Card, Col, Row} from "react-bootstrap";

export const Question = ({question, quizTitle, handleAnswer, handleOpenAnswer}) => {

    const [resetState, setResetState] = useState(true);

    const changeAnswer = (index) => {
        handleAnswer(index);
        setResetState(!resetState);
    }

    return (
        <Card className=" align-items-center mw-100 mh-100">
            <Card.Title>{quizTitle}</Card.Title>
            <Row className="text-center">
                {question.question}
            </Row>
            <Row className="d-flex flex-column ">
                {question.answers ? question.answers.map((answer, index) => {
                    return (
                        <Col key={index}>
                             {String.fromCharCode(65 + index)}   {
                            <button style={question.selectedAnswer === index
                                ? {background: "blue"}
                                : {background: "green"}} onClick={() => changeAnswer(index)}>{answer}</button>
                        }</Col>
                    )
                }):    <input
                type="text"
                style={{ width: "500px",
                     height: "300px", 
                    textAlign: 'left',
                    padding: '10px',
                    verticalAlign: 'top'}}
              
                placeholder="Type Your Answer"
                defaultValue={''}
                onChange={(e) => handleOpenAnswer(e)}
            />}
            </Row>
        </Card>
    )
                    
}

/*
style={
    question.selectedAnswer &&
        question.selectedAnswer === index &&
        {background:"blue"}*/
