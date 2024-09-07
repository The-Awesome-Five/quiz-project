import React, {useEffect, useState} from "react";
import {Container} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {getRoom} from "../../../services/room.service.js";

export const Room = ({

                     }) => {

    const [players, setPlayers] = useState([]);
    const [numPlayers, setNumPlayers] = useState(2);
    const [ready, setReady] = useState(false);
    const [room, setRoom] = useState({});

   const { roomId } = useParams();

    useEffect(() => {

        const fetchRoom = async () => {
            const room = await getRoom(roomId);
            setRoom(room);
            setPlayers(room.players);
            setNumPlayers(room.players.length);
        }

    },[roomId])


    return (
        <Container>
            {numPlayers < 1 && <h1>Waiting for players...</h1>}
            {numPlayers < 2 &&
                players.map((player, index) => {
                    return (
                        <>
                            <h1> Waiting for player number two!</h1>
                            <div key={index}>
                                <h3>{player.name}</h3>
                            </div>
                        </>
                    )
                })
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