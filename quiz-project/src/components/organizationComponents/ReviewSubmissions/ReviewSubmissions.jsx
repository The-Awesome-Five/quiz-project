/* eslint-disable react/prop-types */
import { Accordion, Col, Row, Form, Button } from "react-bootstrap";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { updateUserSubmission } from "../../../services/quiz.service";
import { toast } from "react-toastify";

const ReviewSubmissions = () => {
  const { state } = useLocation();
  const { orgInfo, quiz } = state || {};

  const [feedback, setFeedback] = useState({});
  const [scores, setScores] = useState({});

  if (!orgInfo || !quiz || !quiz.submission || !quiz.questions) {
    return <div>No data available</div>;
  }

  const handleOverallFeedbackChange = (userId, value) => {
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [userId]: value,
    }));
  };

  const handleScoreChange = (userId, questionIndex, value) => {
    const maxScore = quiz.questions[questionIndex].points;
    const validValue = Math.max(0, Math.min(maxScore, value));
    setScores(prevScores => ({
      ...prevScores,
      [userId]: {
        ...prevScores[userId],
        [questionIndex]: validValue,
      },
    }));
  };

  const submitFeedback = async (userId) => {
    const quizId = quiz.id;
    const totalScore = calculateTotalScore(userId);
    const quizName = quiz.name;

    try {
      await updateUserSubmission(userId, quizId, feedback, scores, quizName, totalScore, quiz);
      toast.error("Feedback submitted!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const calculateTotalScore = (userId) => {
    let totalScore = 0;

    quiz.questions.forEach((question, questionIndex) => {
      if (question.correctAnswerIndex !== undefined) {

        const userAnswer = quiz.submission[userId]?.answers[questionIndex];
        if (userAnswer !== undefined && userAnswer === question.correctAnswerIndex) {
          totalScore += +question.points;
        }
      } else {

        totalScore += scores[userId]?.[questionIndex] || 0;
      }
    });

    return totalScore;
  };

  return (
    <Accordion className="my-3">
      {Object.keys(quiz.submission).map((userId, index) => (
        <Accordion.Item key={userId} eventKey={index.toString()} className="mb-3">
          <Accordion.Header className="d-flex justify-content-between align-items-center py-2 border-bottom">
            {orgInfo.students && orgInfo.students[userId] ? orgInfo.students[userId] : "Peter"}
            <h5 className="mb-0 text-muted">
              Result: {quiz.submission[userId].score} / {quiz.totalScore}
            </h5>
          </Accordion.Header>
          <Accordion.Body>
            {quiz.questions.map((question, questionIndex) => (
              <Col key={questionIndex} className="mb-4">
                <Row xs={2}>
                  <strong>{question.question}</strong>
                </Row>
                <Row>
                  <hr />
                </Row>
                <Row xs={1} className="px-2">
                  {question.correctAnswerIndex !== undefined ? (
                    question.answers.map((answer, answerIndex) => (
                      <Row
                        key={answerIndex}
                        className="py-1"
                        style={
                          answerIndex === question.correctAnswerIndex && quiz.submission[userId]?.answers[questionIndex] === question.correctAnswerIndex
                            ? { border: "2px solid green", borderRadius: "5px", padding: "5px" }
                            : answerIndex === question.correctAnswerIndex
                              ? { border: "2px solid black", borderRadius: "5px", padding: "5px" }
                              : quiz.submission[userId]?.answers[questionIndex] === answerIndex
                                ? { border: "2px solid red", borderRadius: "5px", padding: "5px" }
                                : { padding: "5px" }
                        }
                      >
                        {String.fromCharCode(65 + answerIndex)} {answer}
                      </Row>
                    ))
                  ) : (
                    <>
                      <Row className="mb-2">
                        <strong>Student's Answer:</strong>
                        <div>{quiz.submission[userId]?.answers[questionIndex]}</div>
                      </Row>
                      <Row className="mb-3">
                        <Form.Label>Assign Points (Max: {question.points})</Form.Label>
                        <Form.Control
                          type="number"
                          max={question.points}
                          min={0}
                          value={scores[userId]?.[questionIndex] || ""}
                          onInput={(e) => handleScoreChange(userId, questionIndex, e.target.value)}
                          onBlur={(e) => handleScoreChange(userId, questionIndex, e.target.value)}
                        />
                      </Row>
                    </>
                  )}
                </Row>
              </Col>
            ))}
            <Row className="mb-3">
              <Form.Label>Overall Feedback</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={feedback[userId] || ""}
                onChange={(e) => handleOverallFeedbackChange(userId, e.target.value)}
              />
            </Row>

            <Button variant="primary" onClick={() => submitFeedback(userId)} className="mt-3">
              Submit Feedback
            </Button>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default ReviewSubmissions;