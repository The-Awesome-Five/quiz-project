/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { Col, Row, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './DefeatScreen.css'
export const DefeatScreen = () => {
    const navigate = useNavigate();

    const handleRetry = () => {
        navigate('/gaming-modes');
    };

    const handleMainMenu = () => {
        navigate('/');
    };

    return (
        <div className="defeat-screen">
            <Row className="justify-content-center text-center py-5">
                <Col xs={12} md={8} lg={6} className="defeat-content">
                <div className="defeat-container">
            <h1 className="defeat-title">Defeat</h1>
            <p className="defeat-message">Unfortunately, you have been defeated. Better luck next time!</p>
           
        </div>
                    <div className="button-group">
                        <Button variant="primary" size="lg" onClick={handleRetry}>
                            Retry
                        </Button>
                        <Button variant="secondary" size="lg" onClick={handleMainMenu}>
                            Main Menu
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};