import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import './VictoryScreen.css';
import { useNavigate } from "react-router-dom";

const VictoryScreen = () => {

    const navigate = useNavigate();

    const handleRetry = () => {
        navigate('/gaming-modes');
    };

    const handleMainMenu = () => {
        navigate('/');
    };
    return (
        <Container className="victory-screen d-flex flex-column justify-content-center align-items-center vh-100">
            <Row className="text-center">
                <Col>
                    <h1 className="victory-title">Victory!</h1>
                    <h2>You have won 20 wisdom points!</h2>
                    <h3 className="victory-message">Congratulations, you have won the battle!</h3>
                    <Button variant="success" size="lg" className="retry-button" onClick={handleRetry}>
                        Play Again
                    </Button>
                    <Button variant="success" size="lg" className="retry-button" onClick={handleMainMenu}>
                            Main Menu
                        </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default VictoryScreen;