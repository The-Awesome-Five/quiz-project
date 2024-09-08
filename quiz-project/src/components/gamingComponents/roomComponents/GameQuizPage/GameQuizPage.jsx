import React, {useEffect, useState} from "react";
import {Container, Row} from "react-bootstrap";
import {PlayerStatusBar} from "./PlayerStatusBar/PlayerStatusBar.jsx";
import {GameQuiz} from "./GameQuiz/GameQuiz.jsx";
import {startGame} from "../../../../services/room.service.js";

export const GameQuizPage = ({
    roomId,
    room,
    setRoom
                         }) => {

    return (
        <Container className="d-flex flex-row justify-content-center">
            <Row className="m-1"><GameQuiz room={room} setRoom={setRoom} roomId={roomId} /></Row>
        </Container>
    )
}