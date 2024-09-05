import {Button, Container} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {createRoom} from "../../services/room.service.js";
import React, {useState} from "react";
import {CreateRoom} from "../../components/gamingComponents/roomComponents/CreateRoom.jsx";

export const GamingModeView = () => {

    const [isCreateRoom, setIsCreateRoom] = useState(false);
    const [isJoinRoom, setIsJoinRoom] = useState(false);

    const handleJoinRoom = () => {

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
            {isJoinRoom && <Button onClick={handleJoinRoom}>Join Room</Button>}
        </Container>
    )
}