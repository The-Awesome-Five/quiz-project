import {Button, Card, Col, Container, Nav, NavLink, Row} from "react-bootstrap";
import React from "react";
import {Link} from "react-router-dom";

export const AdminMenuView = () => {

    return (
            <Container>
                <Row>
                    <Col>
                        <Card className="text-center">
                            <Card.Body>
                                <Link to="/user-management">
                                    <Button variant="primary">User Menu</Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="text-center">
                            <Link to="/organisation-management">
                                <Button variant="primary">Organisation Menu</Button>
                            </Link>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card className="text-center">
                            <Link to="/quiz-management">
                                <Button variant="primary">Quiz Menu</Button>
                            </Link>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="text-center">
                            <Link to="/questionbank-management">
                                <Button variant="primary">Question Bank Menu</Button>
                            </Link>
                        </Card>
                    </Col>
                </Row>
            </Container>
    )

}
