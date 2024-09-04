import React, {useEffect, useState} from "react";
import {Container} from "react-bootstrap";

export const Room = ({

                     }) => {

    const [players, setPlayers] = useState([]);
    const [numPlayers, setNumPlayers] = useState(0);
    const [ready, setReady] = useState(false);

    const { roomId } = room;

    useEffect(() => {
        const playerRef = getPlayers(roomId);
        const handleDataChange = (snapshot) => {
            const data = snapshot.val() || {};
            setPlayers(data);
            const count = Object.values(data).length;
            setNumPlayers(count);
        };


        onValue(playerRef, handleDataChange, (error) => {
            console.error('Error with real-time listener:', error);
        });

        return () => off(notifRef, 'value', handleDataChange);
    }, [roomId]);


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