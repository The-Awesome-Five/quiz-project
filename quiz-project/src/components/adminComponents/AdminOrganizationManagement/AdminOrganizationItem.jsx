import {Button, Col, Form, Image, ListGroup, Row} from "react-bootstrap";
import React  from 'react';

export const AdminOrganizationItem = ({
                                          organization,
                                          editOrgId,
                                          handleInputChange,
                                          handleSave,
                                          handleEditClick}) => {

    // id: 'header',
    //     name: 'Name',
    //     description: 'Description',
    //     email: 'Email',
    //     educators: 'Educators',
    //     owner: 'Owner',

    return (
        <ListGroup.Item key={organization.id}>
            <Row style={{ alignItems: "center" }}>
                <Col xs={1}>
                    {organization.id === 'header'
                        ? 'Organization Image'
                        : organization.imgUrl.includes('http')
                            ? <Image src={organization.imgUrl} alt='Organization Image' thumbnail />
                            : <Image src="https://img.freepik.com/premium-vector/school-logo-design_706452-12.jpg" alt='Organization Image' thumbnail />
                    }
                </Col>
                <Col xs={1}>
                    {editOrgId === organization.id
                        ? <Form.Control
                            type="text"
                            value={organization.name}
                            onChange={(e) => handleInputChange(e, organization.id, 'name')}
                        />
                        : organization.name
                    }
                </Col>
                <Col xs={2}>
                    {editOrgId === organization.id
                        ? <Form.Control
                            type="text"
                            value={organization.description}
                            onChange={(e) => handleInputChange(e, organization.id, 'description')}
                        />
                        : organization.description
                    }
                </Col>
                <Col xs={1}>
                    {editOrgId === organization.id
                        ? <Form.Control
                            type="text"
                            value={Object.values(organization.owner)}
                            onChange={(e) => handleInputChange(e, organization.id, 'owner')}
                        />
                        : Object.values(organization.owner)
                    }
                </Col>
                <Col xs={2}>
                    {organization.id === 'header' ? 'Educators'
                    : organization.educators && organization.id !== 'header' ? Object.entries(organization.educators).map(([key, value]) => {
                                return (
                                    <div key={key}>
                                        {value}
                                    </div>
                                )
                            })
                            : 'No Educators'
                    }
                </Col>
                <Col xs={2}>
                    {organization.id === 'header'
                        ? 'Students'
                        : organization.students ? Object.entries(organization.students).map(([key, value]) => {
                                return (
                                    <div key={key}>
                                        {value}
                                    </div>
                                )
                            })
                            : 'No Students'
                    }
                </Col>
                <Col className="mx-auto" xs={1}>
                    {organization.id === 'header' ? 'Edit' : (
                        editOrgId === organization.id
                            ? <Button variant="success" onClick={() => handleSave(organization.id)}>Save</Button>
                            : <Button
                                variant="success"
                                onClick={() => handleEditClick(organization.id)}
                                disabled={editOrgId !== null && editOrgId !== organization.id}
                            >
                                Edit
                            </Button>
                    )}
                </Col>
                <Col className="mx-auto" xs={1}>
                    {organization.id === 'header' ? 'Delete' : <Button variant="danger">Delete</Button>}
                </Col>
            </Row>
        </ListGroup.Item>
    )
}
