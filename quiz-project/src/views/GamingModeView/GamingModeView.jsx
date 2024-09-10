import {Button, Container, Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {CreateRoom} from "../../components/gamingComponents/roomComponents/CreateRoom.jsx";
import {toast} from "react-toastify";
import { CreateRoomPvE } from "../../components/PvEMode/CreatePvERoom/CreatePvERoom.jsx";

export const GamingModeView = () => {

    const [isCreateRoom, setIsCreateRoom] = useState(false);
    const [isJoinRoom, setIsJoinRoom] = useState(false);
    
    const [isCreateRoomPvE, setIsCreateRoomPvE] = useState(false);
    const [isJoinRoomPvE, setIsJoinRoomPvE] = useState(false);
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();

    const handleJoinRoom = () => {

        if (roomId === '') {
            toast.error('Please enter a room ID');
        }

        navigate(`/room/${roomId}`);

    }

    const handleJoinRoomPvE = () => {

        if (roomId === '') {
            toast.error('Please enter a room ID');
        }

        navigate(`/room-pve/${roomId}`);

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


                <hr/>
            {!isCreateRoomPvE && !isJoinRoomPvE &&
                <>
                    <Button onClick={() => {
                        setIsJoinRoomPvE(true);
                        setIsCreateRoomPvE(false);
                    }}>Join Game</Button>
                    <Button onClick={() => {
                        setIsJoinRoomPvE(false);
                        setIsCreateRoomPvE(true);
                    }}>Create Game</Button>
                </>
            }

            {isCreateRoomPvE && <>
                <CreateRoomPvE/>
                <Button onClick={() => setIsCreateRoomPvE(false)}>Cancel</Button></>}


            {isJoinRoomPvE && <>
            <Form onSubmit={handleJoinRoomPvE}>

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
