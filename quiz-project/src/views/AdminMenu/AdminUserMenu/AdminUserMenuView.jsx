import {editUserByUserId, getAllUsers} from "../../../services/user.service.js";
import {useEffect, useState} from "react";
import {Button, Col, Container, Image, ListGroup, Row, Form} from "react-bootstrap";
import {toast} from "react-toastify";
import {AdminUserMenuItem} from "../../../components/adminComponents/AdminUserManagement/AdminUserMenuItem.jsx";
import React from "react";
export const AdminUserMenuView = () => {

    const [editUserId, setEditUserId] = useState(null); // State to track the user being edited
    const [userData, setUserData] = useState([{
        uid: 'header',
        username: 'Username',
        email: 'Email',
        firstName: 'First Name',
        lastName: 'Last Name',
    }]); // State to hold the user data for editing

    useEffect(() => {
        const fetchUsers = async () => {
            const users = await getAllUsers();
            setUserData(prevState => [...prevState, ...users]);
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

    const handleSave = async (userId) => {

        const userToBeEdited = userData.filter(user => user.uid === userId)[0];

        setEditUserId(null); // Disable edit mode after saving

        try {
            await editUserByUserId(userId, userToBeEdited);
        } catch (e) {
            toast.error(e)
        }
    };

    return (
        <Container>
            <ListGroup>
                {userData.map((user) => (
                    <AdminUserMenuItem key={user.uid} user={user} editUserId={editUserId} handleInputChange={handleInputChange} handleSave={handleSave} handleEditClick={handleEditClick} />
                ))}
            </ListGroup>
        </Container>
    );

}
