import React, {useState} from 'react'
import {Button, Col, Row, ListGroup, Form, Image} from "react-bootstrap";
import {AdminQuestionItem} from "./AdminQuestionItem/AdminQuestionItem.jsx";

// Avatar, Delete button, Creator / Organization

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
            <Row style={{alignItems: "center"}}>
                <Col xs={1}>
                    {quiz.avatar.includes('http')
                        ? <Image src={quiz.avatar} alt='Organization Image' thumbnail />
                        : <Image src="https://img.freepik.com/premium-vector/school-logo-design_706452-12.jpg" alt='Organization Image' thumbnail />}
                </Col>
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
                    <Button variant="danger">Delete</Button>
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
