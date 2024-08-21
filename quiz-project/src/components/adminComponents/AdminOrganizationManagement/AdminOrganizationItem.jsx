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

    console.log('The organization educates are ');
    console.log(organization.educators);

    return (
        <ListGroup.Item key={organization.id}>
            <Row style={{ alignItems: "center" }}>
                <Col xs={2}>
                    {organization.id === 'header'
                        ? 'Organization Image'
                        : organization.imgUrl.includes('http')
                            ? <Image src={organization.imgUrl} alt='Organization Image' thumbnail />
                            : <Image src="https://img.freepik.com/premium-vector/school-logo-design_706452-12.jpg" alt='Organization Image' thumbnail />
                    }
                </Col>
                <Col xs={2}>
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
                <Col xs={2}>
                    {editOrgId === organization.id
                        ? <Form.Control
                            type="text"
                            value={organization.owner}
                            onChange={(e) => handleInputChange(e, organization.id, 'owner')}
                        />
                        : organization.owner
                    }
                </Col>
                <Col xs={2}>
                    {editOrgId === organization.id
                        ? <Form.Control
                            type="text"
                            value={organization.lastName}
                            onChange={(e) => handleInputChange(e, organization.id, 'educators')}
                        />
                        : organization.educators ? Object.entries(organization.educators).map(([key, value]) => {
                            return (
                                <div key={key}>
                                    {key}: {value}
                                </div>
                            )
                        })
                            : 'No Educators'
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
