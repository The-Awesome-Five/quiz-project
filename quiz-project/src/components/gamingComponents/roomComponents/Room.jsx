import React, {useContext, useEffect, useState} from "react";
import {Container} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {getRoom} from "../../../services/room.service.js";
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

 /*   useEffect(() => {

        const fetchRoom = async () => {
            const room = await getRoom(roomId);
            setRoom(room);
            setPlayers(room.players ? Object.values(room.players) : []);

            if (room.players && Object.values(room.players).length === 2 && Object.values(room.players).every(player => player.isReady)) {
                setReady(true);
            }
        }

        fetchRoom();

    }, [roomId]);*/

    useEffect(() => {
        if(userData){
            const roomRef = ref(db, `room/${roomId}`);
            const unsubscribe = onValue(roomRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setRoom(data);
                    setPlayers(data.players ? Object.values(data.players) : []);

                    if (data.players && Object.values(data.players).length === 2 && Object.values(data.players).every(player => player.isReady)) {
                        setReady(true);
                    }

                } else {
                    setRoom({});
                }
            });

            return () => unsubscribe();
        }
    }, [userData]);

    if (players.length === 2 && !players.some(player => player.id === user.uid)) {
        return <h1>Room is full</h1>
    }

    return (
        <Container>
            <h1>Room: {room.name}</h1>

            {players.length === 0 &&
                <div>
                    <h1>Waiting for players to join. Room ID: {roomId}</h1>
                    <RoomLoadingPage user={user} userData={userData} setPlayers={setPlayers} players={players}
                                     roomId={roomId}/>
                </div>
            }

            {players.length > 0 && !ready &&
                <div>
                    {players.length === 1 && <h1>Waiting for another player to join</h1>}
                    <RoomLoadingPage user={user} userData={userData} setPlayers={setPlayers} players={players}
                                     roomId={roomId}/>
                </div>
            }
            {
                players.length === 2 && !ready && <h1>Game is ready to start! Waiting for players to select start</h1>
            }
            {
                players && ready && <GameQuizPage players={players} roomId={roomId}/>
            }

        </Container>
    )
}