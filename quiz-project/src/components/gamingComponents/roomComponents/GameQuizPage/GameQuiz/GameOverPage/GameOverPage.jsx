import {useLocation} from "react-router-dom";
import {PlayerStatusBar} from "../../PlayerStatusBar/PlayerStatusBar.jsx";
import React from "react";
import {Card, Container, Row} from "react-bootstrap";

export const GameOverPage = () => {

    const location = useLocation();

    const { room } = location.state || {};

    const players = Object.values(room.players);

    return (
        <Container className="d-flex flex-row justify-content-center text-center align-items-center">
            <Row xs={1} className="text-lg-start">
                <PlayerStatusBar player={players[0]}/>
            </Row>
            <Row xs={1} className="d-flex flex-column align-items-center justify-content-center">
                    <h1>Game Over</h1>
                    <h2>Winner: {room.game.winner.username}</h2>
                    <h3>Score: {room.game.winner.score}</h3>
                </Row>

            <Row style={{paddingLeft: "100px"}} className="p-12 text-lg-end">
                <PlayerStatusBar player={players[1]}/>
            </Row>
        </Container>
    )


}
