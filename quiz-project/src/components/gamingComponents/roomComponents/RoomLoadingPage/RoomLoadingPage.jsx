import React, {useContext, useEffect, useState} from "react";
import {Button, Container} from "react-bootstrap";
import {AppContext} from "../../../../appState/app.context.js";
import {toast} from "react-toastify";
import {setPlayer} from "../../../../services/room.service.js";

export const RoomLoadingPage = ({
                                    players,
                                    setPlayers,
                                    roomId
                                }) => {

    const {user} = useContext(AppContext);

    console.log('players')
    console.log(players)
    console.log('player')
    console.log(players.find(player => player.id === user.uid))

    const [isReady, setIsReady] = useState(players ? players.find(player => player.id === user.uid)?.isReady : false);
    const [willJoin, setWillJoin] = useState(players.some(player => player.id === user.uid));



    const joinGameHandler = async () => {
        try {
            const player = await setPlayer(roomId, user.uid);
            players ? setPlayers(prevState => [...prevState, player]) : setPlayers([player]);
            setWillJoin(true);

        } catch (e) {
            toast.error('Failed to join game:', e);
        }
    }

    const setReadyHandler = async () => {

        console.log(players);

        const player = players.find(player => player.id === user.uid);

        console.log(player);

        if (player && !player.isReady) {
            try {
                await setPlayer(roomId, user.uid, true);
                setIsReady(true);
            } catch (e) {
                toast.error('Failed to set ready:', e);
            }

        } else {
            toast.error('We are waiting for the other player to be ready!');
        }

    }

    if (players.length < 1) {
        return <h1>Loading</h1>
    }

    return (
        <Container>
            {!willJoin && players && players.length > 1 && <h1>There are no more available spots for the game!</h1>}
            {!willJoin &&
                <Container><h1>
                    You have been invited to join the game. Click the button below to join the game.
                </h1>
                    <Button variant="primary" onClick={joinGameHandler}>
                        Join Game
                    </Button>
                </Container>
            }
            {willJoin && !isReady && <h1>
                Are you are ready? Click the button below to start the game.
                <Button variant="primary" onClick={setReadyHandler}>
                    I am ready!
                </Button>
            </h1>}
        </Container>
    )
}