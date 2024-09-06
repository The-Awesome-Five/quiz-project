import {Button, Container, Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {createRoom} from "../../services/room.service.js";
import React, {useState} from "react";
import {CreateRoom} from "../../components/gamingComponents/roomComponents/CreateRoom.jsx";
import {toast} from "react-toastify";

export const GamingModeView = () => {

    const [isCreateRoom, setIsCreateRoom] = useState(false);
    const [isJoinRoom, setIsJoinRoom] = useState(false);
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();

    const handleJoinRoom = () => {

        if (roomId === '') {
            toast.error('Please enter a room ID');
        }

        navigate(`/room/${roomId}`);

    }

    return (
        <Container>
            {!isCreateRoom && !isJoinRoom &&
                <>
                    <Button onClick={() => {
                        setIsJoinRoom(true);
                        setIsCreateRoom(false);
                    }}>Join Game</Button>
                    <Button onClick={() => {
                        setIsJoinRoom(false);
                        setIsCreateRoom(true);
                    }}>Create Game</Button>
                </>
            }

            {isCreateRoom && <>
                <CreateRoom/>
                <Button onClick={() => setIsCreateRoom(false)}>Cancel</Button></>}


            {isJoinRoom && <>
            <Form onSubmit={handleJoinRoom}>

                <Form.Group controlId="formName">
                    <Form.Label>Room ID</Form.Label>
                    <Form.Control
                        type="text"
                        name="roomId"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        placeholder="Enter room id"
                    />
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form.Group>
            </Form>
            </>}
        </Container>
    )
}
