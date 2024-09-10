import React, {useContext, useEffect, useState} from "react";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {AppContext} from "../../../appState/app.context.js";
import {onValue, ref} from "firebase/database";
import {db} from "../../../firebase/config.js";
import {toast} from "react-toastify";
import {startGame, startSoloGame} from "../../../services/room.service.js";
 
import { GameQuiz } from "../../gamingComponents/roomComponents/GameQuizPage/GameQuiz/GameQuiz.jsx";
import { PvERoomLoadingPage } from "../PvERoomLoadingPage/PvERoomLoadingPage.jsx";
import { SoloAdventure } from "../SoloAdventurePvE/SoloAdenvturePvE.jsx";

export const RoomPvE = ({}) => {

    const [players, setPlayers] = useState([]);
    const [ready, setReady] = useState(false);
    const [room, setRoom] = useState({});
    const [copySuccess, setCopySuccess] = useState('');
    const {user, userData} = useContext(AppContext);
    const [soloAdventure, setSoloAdventure]= useState(false);
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

                       if (!data.game) {
                           const beginGame = async () => {
                               await startGame(roomId, Object.values(data.players), data.timePerRound);
                           }

                           beginGame();
                       }

                        setReady(true);

                        unsubscribe();
                    }

                    // if players.some(player => player.id === user.uid) && isComplete === true => finish game function -> navigate to gameResults + state( room )

                } else {
                    setRoom({});
                }
            });

            return () => {

                // if !winner
                // update database - isCompleted = true, winner, loser = userData.uid, score

                return () => unsubscribe();
            };
        }
    }, [userData]);

    if (players.length === 2 && !players.some(player => player.id === user.uid)) {
        return <h1>Room is full</h1>
    }

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess('Copied!');
            toast.success('Room Id has been copied!');
        }).catch((err) => {
            setCopySuccess('Failed to copy the room Id!');
            toast.error('Failed to copy the room Id: ', err);
        });
    };

    return (
        <Container className="text-center d-flex justify-content-center flex-column align-items-center">
            {!ready && !soloAdventure&&<Col md={4} className="mb-4">
                <Card className=" text-center align-items-center">
                    <h1>{room.name}</h1>
                    <h3>Room ID:</h3>
                    <h4>{roomId}</h4>
                    <button style={{background: "lightgreen", fontSize: "18px"}} onClick={() => handleCopy(roomId)}>Click to copy the Room ID</button>
                    <hr/>
                </Card>
            </Col>}

            {/*if isComplete === true -> navigate to home*/}

            {
                players.length === 0 &&!soloAdventure&&
                <Col md={4} className="mb-4">
                    <PvERoomLoadingPage 
                    user={user}
                    userData={userData} 
                    setPlayers={setPlayers}
                    players={players}
                    roomId={roomId}
                    soloAdventure={setSoloAdventure}/>
                </Col>
            }
            {
                players.length === 2 && !ready &&!soloAdventure&& <Col md={4} className="mb-4">
                    <Card className="bg-warning-subtle text-center align-items-center">
                        <h7>Game is ready to start! Waiting for players to select start</h7>
                    </Card>
                </Col>
            }

            {
            players.length > 0 && !ready &&!soloAdventure&&
                <Col md={4} className="mb-4">
                    <PvERoomLoadingPage
                     user={user}
                     userData={userData}
                     setPlayers={setPlayers}
                     players={players}
                     roomId={roomId}
                     soloAdventure={setSoloAdventure}/>
                </Col>
            }
            {
                players && ready && !soloAdventure&&
                <Row className="m-1"><GameQuiz
                                      room={room}
                                      setRoom={setRoom} 
                                      roomId={roomId} /></Row>
            }
            {
               !soloAdventure&& (players.length===1 && players[0].isReady) ?
                <button onClick={()=>{
                    {
                        if (!room.game) {
                            const beginGame = async () => {
                                await startSoloGame(roomId);
                                setSoloAdventure(true)
                            }
 
                            beginGame();
                            
                        }   
                    }
                }}>Start Solo Adventure &quot;You have no friends!&quot;</button> :
                (players && ready) ?
                <button>Start Group Adventure</button>:
                <></>
            }
            {
                soloAdventure &&   <Row className="m-1"><SoloAdventure  room={room}
                                                 setRoom={setRoom}
                                                 roomId={roomId} /></Row>
            }
        </Container>
    )
}