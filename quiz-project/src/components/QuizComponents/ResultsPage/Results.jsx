import { useLocation } from "react-router-dom";
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const ResultsPage = () => {
  const location = useLocation();
  const { quiz, totalScore, userScore } = location.state;

  return (
    <Container className="d-flex justify-content-center  vh-100">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="text-center shadow">
            <Card.Header as="h1" className="bg-primary text-white">
              {quiz}
            </Card.Header>
            <Card.Body>
              <h2 className="my-3">Your Score</h2>
              <h3 className="display-4">
                {userScore} / {totalScore}
              </h3>
            </Card.Body>
            <Card.Footer className="text-muted">
              Great job! Keep practicing to improve!
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResultsPage;