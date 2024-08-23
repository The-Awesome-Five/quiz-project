import React, {useState} from 'react'
import {Button, Col, Row, ListGroup, Form} from "react-bootstrap";
import {AdminQuestionItem} from "./AdminQuestionItem/AdminQuestionItem.jsx";

export const AdminQuizItem = ({ quiz,
                                  editQuizId,
                                  handleInputChange,
                                  handleSave,
                                  handleEditClick,
                                  categoryKey,
                                  diffKey }) => {

    const [isVisible, setIsVislble ] = useState(false);

    console.log(quiz.questions)

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
                    <button onClick={() => setIsVislble(!isVisible)}>{isVisible ? "Hide" : "Show"}</button>
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
            <Row>
                {isVisible && quiz.questions.map(question => {
                    return (
                        <AdminQuestionItem key={question.answers[0]} question={question}/>
                    )
                })}
            </Row>
        </ListGroup.Item>
    )
}
