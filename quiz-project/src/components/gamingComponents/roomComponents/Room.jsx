import React, {useContext, useEffect, useState} from "react";
import {Card, Col, Container} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {RoomLoadingPage} from "./RoomLoadingPage/RoomLoadingPage.jsx";
import {AppContext} from "../../../appState/app.context.js";
import {GameQuizPage} from "./GameQuizPage/GameQuizPage.jsx";
import {onValue, ref} from "firebase/database";
import {db} from "../../../firebase/config.js";

export const Room = ({}) => {

    const [players, setPlayers] = useState([]);
    const [ready, setReady] = useState(false);
    const [room, setRoom] = useState({});
    const {user, userData} = useContext(AppContext);

    const {roomId} = useParams();

    useEffect(() => {

        // fetch room -> check for players -> if players.length === 2 navigate to home page

        if (userData) {
            const roomRef = ref(db, `room/${roomId}`);
            const unsubscribe = onValue(roomRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setRoom(data);
                    setPlayers(data.players ? Object.values(data.players) : []);

                    if (data.players && Object.values(data.players).length === 2 && Object.values(data.players).every(player => player.isReady)) {
                        setReady(true);
                    }

                    // if players.some(player => player.id === user.uid) && isComplete === true => finish game function -> navigate to gameResults + state( room )

                } else {
                    setRoom({});
                }
            });

            return () => {

                // if !winner
                // update database - isCompleted = true, winner, loser = userData.uid, score

                return unsubscribe()
            };
        }
    }, [userData]);

    if (players.length === 2 && !players.some(player => player.id === user.uid)) {
        return <h1>Room is full</h1>
    }

    console.log('players:');
    console.log(players);

    return (
        <Container className="text-center d-flex justify-content-center flex-column align-items-center">
            <Col md={4} className="mb-4">
                <Card className="bg-success text-center align-items-center">
                    <h1>{room.name}</h1>
                    <h3>Room ID:</h3>
                    <h3>{roomId}</h3>
                </Card>
            </Col>

            {/*if isComplete === true -> navigate to home*/}

            {
                players.length === 0 &&
                <Col md={4} className="mb-4">
                    <RoomLoadingPage user={user} userData={userData} setPlayers={setPlayers}
                                                              players={players}
                                                              roomId={roomId}/>
                </Col>
            }
            {
                players.length === 2 && !ready && <Col md={4} className="mb-4">
                    <Card className="bg-warning-subtle text-center align-items-center">
                        <h3>Game is ready to start! Waiting for players to select start</h3>
                    </Card>
                </Col>
            }

            {
            players.length > 0 && !ready &&
                <Col md={4} className="mb-4">
                    <RoomLoadingPage user={user} userData={userData} setPlayers={setPlayers} players={players}
                                     roomId={roomId}/>
                </Col>
            }
            {
                players && ready && <GameQuizPage players={players} roomId={roomId}/>
            }

        </Container>
    )
}