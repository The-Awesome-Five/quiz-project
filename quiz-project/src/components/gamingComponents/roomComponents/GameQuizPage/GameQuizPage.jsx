import React from "react";
import {Container, Row} from "react-bootstrap";
import {PlayerStatusBar} from "./PlayerStatusBar/PlayerStatusBar.jsx";
import {GameQuiz} from "./GameQuiz/GameQuiz.jsx";

export const GameQuizPage = ({
    players,
    roomId
                         }) => {
    return (
        <Container className="d-flex flex-row justify-content-center">
            <Row className="m-1 text-lg-start"><PlayerStatusBar player={players[0]} /></Row>
            <Row className="m-1"><GameQuiz roomId={roomId} /></Row>
            <Row className="m-1 text-lg-end"><PlayerStatusBar player={players[1]} /></Row>
        </Container>
    )
}