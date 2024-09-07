import React, {useEffect, useState} from "react";
import {Container} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {getRoom} from "../../../services/room.service.js";
import {RoomLoadingPage} from "./RoomLoadingPage/RoomLoadingPage.jsx";

export const Room = ({}) => {

    const [players, setPlayers] = useState([]);
    const [numPlayers, setNumPlayers] = useState(0);
    const [ready, setReady] = useState(false);
    const [room, setRoom] = useState({});

    const {roomId} = useParams();

    useEffect(() => {

        const fetchRoom = async () => {
            const room = await getRoom(roomId);
            setRoom(room);
            setPlayers(Object.values(room.players));

            console.log('players in room')
            console.log(Object.values(room.players))
        }

        fetchRoom();

    }, [roomId]);


    return (
        <Container>
            <h1>Room: {room.name}</h1>
            {!players &&
                <div>
                    <h1>Waiting for players to join. Room ID: {roomId}</h1>
                    <RoomLoadingPage setPlayers={setPlayers} players={players} roomId={roomId}/>
                </div>
            }

            {players && !ready &&
                <div>
                    {players.length === 1 && <h1>Waiting for another player to join</h1>}
                    <RoomLoadingPage setPlayers={setPlayers} players={players} roomId={roomId}/>
                </div>
            }
            {
                numPlayers === 2 && <h1>Game is ready to start! Waiting for players to select start</h1>
            }
            {
                numPlayers === 2 && ready && <h1>Game Component</h1>
            }
        </Container>
    )
}