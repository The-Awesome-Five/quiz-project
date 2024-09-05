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
                            <Link to="/organization-management">
                                <Button variant="primary">Organization Menu</Button>
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
                            <Link to="/qbank-management">
                                <Button variant="primary">Question Bank Menu</Button>
                            </Link>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="text-center">
                            <Link to="/shop-management">
                                <Button variant="primary">Shop menu</Button>
                            </Link>
                        </Card>
                    </Col>
                </Row>
            </Container>
    )

}
