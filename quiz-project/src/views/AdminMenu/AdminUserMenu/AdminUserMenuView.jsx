import {getAllUsers} from "../../../services/user.service.js";
import {useEffect, useState} from "react";
import {Button, Col, Container, Image, ListGroup, Row} from "react-bootstrap";

export const AdminUserMenuView = () => {

    const [users, setUsers] = useState([{
        uid: 'header',
        username: 'Username',
        email: 'Email',
        firstName: 'First Name',
        lastName: 'Last Name',
    }]);

    useEffect(() => {
        const fetchUsers = async () => {
            const users = await getAllUsers();
            setUsers(prevState => [...prevState, ...users]);
        }
        fetchUsers();
    }, []);

    return (
        <Container>
                       <ListGroup>
                            {users.map((user) => (
                                <ListGroup.Item key={user.uid}>
                                    <Row style={{alignItems: "center"}}>
                                        <Col xs={2}>
                                            {user.uid === 'header' ? 'Avatar Image' : <Image src={user.avatarUrl} alt='Avatar Image' thumbnail/>}
                                        </Col>
                                        <Col xs={2}>
                                            {user.username}
                                        </Col>
                                        <Col xs={2}>
                                            {user.email}
                                        </Col>
                                        <Col xs={2}>
                                            {user.firstName}
                                        </Col>
                                        <Col xs={2}>
                                            {user.lastName}
                                        </Col>
                                        <Col className="mx-auto" xs={1}>
                                            {user.uid === 'header' ? 'Edit' : <Button variant="success">Edit</Button>}
                                        </Col>
                                        <Col className="mx-auto" xs={1}>
                                            {user.uid === 'header' ? 'Delete' : <Button variant="danger">Delete</Button>}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
        </Container>
    );


}
