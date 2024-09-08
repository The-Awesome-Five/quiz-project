import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import "./Question.css";

export const Question = ({
  question,
  quizTitle,
  handleAnswer,
  handleOpenAnswer,
}) => {
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);


  useEffect(() => {
    if (question.selectedAnswer !== undefined) {
      setSelectedAnswerIndex(question.selectedAnswer);
    } else {
      setSelectedAnswerIndex(null); 
    }
  }, [question.selectedAnswer, question]);

  const changeAnswer = (index) => {
    handleAnswer(index);
    setSelectedAnswerIndex(index); 
  };

  return (
    <Card className="align-items-center mw-100 mh-100 p-4">
      <Card.Title className="mb-4">{quizTitle}</Card.Title>

      {/* Въпрос */}
      <Row className="text-center mb-4">
        <h4>{question.question}</h4>
      </Row>

      {/* Отговори (ако са налични) */}
      <Row className="answers-grid">
        {question.answers ? (
          question.answers.map((answer, index) => (
            <Col xs={12} md={6} key={index} className="answer-wrapper">
              <button
                className={`answer-btn answer-btn-${index + 1} ${
                  selectedAnswerIndex === index ? "selected" : ""
                }`}
                style={
                  selectedAnswerIndex === index
                    ? { background: "blue", color: "white" }
                    : { background: "green", color: "white" }
                }
                onClick={() => changeAnswer(index)} 
              >
                {String.fromCharCode(65 + index)}. {answer}
              </button>
            </Col>
          ))
        ) : (
          <textarea
            className="open-answer-textarea"
            placeholder="Type your answer here..."
            defaultValue={question.selectedAnswer || ""}
            onChange={(e) => handleOpenAnswer(e)}
          />
        )}
      </Row>
    </Card>
  );
};
