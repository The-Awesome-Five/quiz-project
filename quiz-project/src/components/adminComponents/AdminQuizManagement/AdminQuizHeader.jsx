import {Col,Row,ListGroup} from "react-bootstrap";
import React from "react";

export const AdminQuizHeader = () => {
    return (
        <ListGroup.Item>
            <Row>
                <Col xs={1}>
                    <h5>Avatar</h5>
                </Col>
                <Col xs={2}>
                    <h5>Quiz Name</h5>
                </Col>
                <Col xs={2}>
                    <h5>Quiz Description</h5>
                </Col>
                <Col xs={2}>
                    <h5>Category</h5>
                </Col>
                <Col xs={2}>
                    <h5>Difficulty</h5>
                </Col>
                <Col xs={2}>
                    <h5>Questions</h5>
                </Col>
                <Col xs={1}>
                    <h5>Actions</h5>
                </Col>
            </Row>
        </ListGroup.Item>
    )
}
