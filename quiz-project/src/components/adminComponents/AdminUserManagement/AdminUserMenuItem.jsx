import {Button, Col, Form, Image, ListGroup, Row} from "react-bootstrap";
import React from "react";
export const AdminUserMenuItem = ({user, editUserId, handleInputChange, handleSave, handleEditClick}) => {
    return (
        <ListGroup.Item key={user.uid}>
            <Row style={{ alignItems: "center" }}>
                <Col xs={2}>
                    {user.uid === 'header'
                        ? 'Avatar Image'
                        : user.avatarUrl.includes('http')
                            ? <Image src={user.avatarUrl} alt='Avatar Image' thumbnail />
                            : <Image src="https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133351928-stock-illustration-default-placeholder-man-and-woman.jpg" alt='Avatar Image' thumbnail />
                    }
                </Col>
                <Col xs={2}>
                    {
                        user.username
                    }
                </Col>
                <Col xs={2}>
                    {editUserId === user.uid
                        ? <Form.Control
                            type="email"
                            value={user.email}
                            onChange={(e) => handleInputChange(e, user.uid, 'email')}
                        />
                        : user.email
                    }
                </Col>
                <Col xs={2}>
                    {editUserId === user.uid
                        ? <Form.Control
                            type="text"
                            value={user.firstName}
                            onChange={(e) => handleInputChange(e, user.uid, 'firstName')}
                        />
                        : user.firstName
                    }
                </Col>
                <Col xs={2}>
                    {editUserId === user.uid
                        ? <Form.Control
                            type="text"
                            value={user.lastName}
                            onChange={(e) => handleInputChange(e, user.uid, 'lastName')}
                        />
                        : user.lastName
                    }
                </Col>
                <Col className="mx-auto" xs={1}>
                    {user.uid === 'header' ? 'Edit' : (
                        editUserId === user.uid
                            ? <Button variant="success" onClick={() => handleSave(user.uid)}>Save</Button>
                            : <Button
                                variant="success"
                                onClick={() => handleEditClick(user.uid)}
                                disabled={editUserId !== null && editUserId !== user.uid}
                            >
                                Edit
                            </Button>
                    )}
                </Col>
                <Col className="mx-auto" xs={1}>
                    {user.uid === 'header' ? 'Delete' : <Button variant="danger">Delete</Button>}
                </Col>
            </Row>
        </ListGroup.Item>
    )
}