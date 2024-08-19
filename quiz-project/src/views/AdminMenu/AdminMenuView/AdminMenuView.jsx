import {Button, Card, Col, Container, Nav, NavLink, Row} from "react-bootstrap";
import React from "react";

export const AdminMenuView = () => {

    return (
            <Container>
                <Row>
                    <Col>
                        <Card className="text-center">
                            <Card.Body>
                                <Button variant="primary"><Nav.Link href="/user-management">User Menu</Nav.Link></Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="text-center">
                            <Card.Body>
                                <Button variant="primary"><Nav.Link href="/organisation-management">Organisation Menu</Nav.Link></Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card className="text-center">
                            <Card.Body>
                                <Button variant="primary"><Nav.Link href="/quiz-management">Quiz Menu</Nav.Link></Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="text-center">
                            <Card.Body>
                                <Button variant="primary"><Nav.Link href="/questionbank-management">Question Bank Menu</Nav.Link></Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
    )

}
