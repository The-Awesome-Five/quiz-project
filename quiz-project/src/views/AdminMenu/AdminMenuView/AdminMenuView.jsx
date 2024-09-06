import {Button, Card, Col, Container, Nav, NavLink, Row} from "react-bootstrap";
import React from "react";
import {Link} from "react-router-dom";

export const AdminMenuView = () => {

    return (
        <Container>
            <Row style={{ alignItems: "center" }}>
                <Col xs={5}>
                    <Card className="text-center">
                        <Card.Body>
                            <Link to="/user-management">
                                <Button variant="primary">User Menu</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={5}>
                    <Card className="text-center">
                        <Link to="/organization-management">
                            <Button variant="primary">Organization Menu</Button>
                        </Link>
                    </Card>
                </Col>
            </Row>
            <Row style={{ alignItems: "center" }}>
                <Col xs={5}>
                    <Card className="text-center">
                        <Link to="/quiz-management">
                            <Button variant="primary">Quiz Menu</Button>
                        </Link>
                    </Card>
                </Col>
                <Col xs={5}>
                    <Card className="text-center">
                        <Link to="/qbank-management">
                            <Button variant="primary">Question Bank Menu</Button>
                        </Link>
                    </Card>
                </Col>
            </Row>
            <Row style={{ alignItems: "center" }}>
                <Col xs={5}>
                    <Card className="text-center m-2">
                        <Link to="/shop-management">
                            <Button variant="primary">Shop Menu</Button>
                        </Link>
                    </Card>
                </Col>
                <Col xs={5}>
                    <Card className="text-center">

                    </Card>
                </Col>
            </Row>

        </Container>
    )

}
