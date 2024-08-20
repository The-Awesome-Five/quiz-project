import {getAllUsers} from "../../../services/user.service.js";
import {useEffect, useState} from "react";
import {Button, Col, Container, Image, ListGroup, Row, Form} from "react-bootstrap";

export const AdminUserMenuView = () => {

    const [users, setUsers] = useState([{
        uid: 'header',
        username: 'Username',
        email: 'Email',
        firstName: 'First Name',
        lastName: 'Last Name',
    }]);

    const [editUserId, setEditUserId] = useState(null); // State to track the user being edited
    const [userData, setUserData] = useState(users); // State to hold the user data for editing

    useEffect(() => {
        const fetchUsers = async () => {
            const users = await getAllUsers();
            setUsers(prevState => [...prevState, ...users]);
            setUserData(users)
        }
        fetchUsers();
    }, []);



    const handleEditClick = (userId) => {
        setEditUserId(userId); // Set the user to be edited
    };

    const handleInputChange = (e, userId, field) => {
        const newUserData = userData.map(user => {
            if (user.uid === userId) {
                return { ...user, [field]: e.target.value };
            }
            return user;
        });
        setUserData(newUserData); // Update the user data state
    };

    const handleSave = (userId) => {
        setEditUserId(null); // Disable edit mode after saving
        console.log('Saved data for user:', userData.find(user => user.uid === userId));
        // Add your save logic here
    };

    return (
        <Container>
            <ListGroup>
                {userData.map((user) => (
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
                                {editUserId === user.uid
                                    ? <Form.Control
                                        type="text"
                                        value={user.username}
                                        onChange={(e) => handleInputChange(e, user.uid, 'username')}
                                    />
                                    : user.username
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
                ))}
            </ListGroup>
        </Container>
    );

}
