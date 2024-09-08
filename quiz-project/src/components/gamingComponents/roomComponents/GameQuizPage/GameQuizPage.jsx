import React, {useEffect} from "react";
import {Container, Row} from "react-bootstrap";
import {PlayerStatusBar} from "./PlayerStatusBar/PlayerStatusBar.jsx";
import {GameQuiz} from "./GameQuiz/GameQuiz.jsx";
import {startGame} from "../../../../services/room.service.js";

export const GameQuizPage = ({
    players,
    roomId,
    setPlayers,
    room,
    setRoom
                         }) => {

    return (
        <Container className="d-flex flex-row justify-content-center">
            <Row className="m-1 text-lg-start"><PlayerStatusBar player={players[0]} /></Row>
            <Row className="m-1"><GameQuiz room={room} setRoom={setRoom} setPlayers={setPlayers} players={players} roomId={roomId} /></Row>
            <Row className="m-1 text-lg-end"><PlayerStatusBar player={players[1]} /></Row>
        </Container>
    )
}