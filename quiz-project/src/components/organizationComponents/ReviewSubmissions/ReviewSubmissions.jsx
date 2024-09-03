/* eslint-disable react/prop-types */
import { Accordion, Col, Row } from "react-bootstrap";
import React from "react";
import { useLocation } from "react-router-dom";

const ReviewSubmissions = () => {
  const { state } = useLocation();
  const { orgInfo, quiz } = state || {};

  if (!orgInfo || !quiz || !quiz.submission || !quiz.questions) {
    return <div>No data available</div>;
  }

  return (
    <Accordion>
      {Object.keys(quiz.submission).map((userId, index) => (
        
        <Accordion.Item key={userId} eventKey={index.toString()}>
          <Accordion.Header className="d-flex justify-content-between align-items-center py-2 border-bottom">
          {orgInfo.students && orgInfo.students[userId] ? orgInfo.students[userId] : "Unknown User"}
            <h5 className="mb-0 text-muted">
              Result: {quiz.submission[userId].score} / {quiz.numberOfQuestions}
            </h5>
          </Accordion.Header>
          <Accordion.Body>
            {quiz.questions.map((question, questionIndex) => (
              <Col key={questionIndex} style={{ margin: "10px" }}>
                <Row xs={2}>
                  <strong>{question.question}</strong>
                </Row>
                <Row>
                  <hr />
                </Row>
                <Row xs={1}>
                  {question.answers.map((answer, answerIndex) => (
                    <Row
                      key={answerIndex}
                      style={
                        answerIndex === question.correctAnswerIndex && quiz.submission[userId].answers[questionIndex] === question.correctAnswerIndex
                          ? { border: "2px solid green" }
                          : answerIndex === question.correctAnswerIndex
                          ? { border: "2px solid black" }
                          : quiz.submission[userId].answers[questionIndex] === answerIndex
                          ? { border: "2px solid red" }
                          : {}
                      }
                    >
                      {String.fromCharCode(65 + answerIndex)} {answer}
                    </Row>
                  ))}
                </Row>
              </Col>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default ReviewSubmissions;