import {Button, Container} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {createRoom} from "../../services/room.service.js";
import React from "react";

export const GamingModeView = () => {


    const navigate = useNavigate();

    const handleCreateRoom = async () => {


        const roomId = createRoom();

        if (roomId) {
            console.log('Room created:', roomId);
            navigate(`/room/${roomId}`);
        } else {
            console.error('Failed to create room');


        }
    }

    return (
        <Container>
            <Button onClick={handleCreateRoom}>Create Game</Button>
        </Container>
    )
}