import React from 'react'
import {Button, Col, Row, ListGroup, Form} from "react-bootstrap";

export const AdminQuizItem = ({ quiz,
                                  editQuizId,
                                  handleInputChange,
                                  handleSave,
                                  handleEditClick,
                                  categoryKey,
                                  diffKey }) => {

    return (
        <ListGroup.Item>
            <Row>
                <Col xs={2}>
                    {editQuizId === quiz.id
                        ? <Form.Control
                            type="text"
                            value={quiz.name}
                            onChange={(e) => handleInputChange(e, quiz.id, 'name')}
                        />
                        : quiz.name
                    }
                </Col>
                <Col xs={2}>
                    {editQuizId === quiz.id
                        ? <Form.Control
                            type="text"
                            value={quiz.description}
                            onChange={(e) => handleInputChange(e, quiz.id, 'description')}
                        />
                        : quiz.description
                    }
                </Col>
                <Col xs={2}>
                    {editQuizId === quiz.id
                        ? <Form.Control
                            type="text"
                            value={categoryKey}
                            onChange={(e) => handleInputChange(e, quiz.id, 'category')}
                        />
                        : categoryKey
                    }
                </Col>
                <Col xs={2}>
                    {editQuizId === quiz.id
                        ? <Form.Control
                            type="text"
                            value={diffKey}
                            onChange={(e) => handleInputChange(e, quiz.id, 'difficulty')}
                        />
                        : diffKey
                    }
                </Col>
                <Col xs={2}>
                    {/*{editQuizId === quiz.id
                        ? <Form.Control
                            type="text"
                            value={quiz.questions}
                            onChange={(e) => handleInputChange(e, quiz.id, 'questions')}
                        />
                        : quiz.questions
                    }*/}
                </Col>
                <Col className="mx-auto" xs={1}>
                    {editQuizId === quiz.id
                        ? <Button variant="success" onClick={() => handleSave(quiz.id)}>Save</Button>
                        : <Button
                            variant="success"
                            onClick={() => handleEditClick(quiz.id)}
                        >
                            Edit
                        </Button>
                    }
                </Col>
            </Row>
        </ListGroup.Item>
    )
}
