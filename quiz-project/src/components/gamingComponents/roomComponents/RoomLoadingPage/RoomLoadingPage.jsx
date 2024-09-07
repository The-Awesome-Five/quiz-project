import React, {useContext, useEffect, useState} from "react";
import {Button, Container} from "react-bootstrap";
import {AppContext} from "../../../../appState/app.context.js";
import {toast} from "react-toastify";
import {getRoom, getUser, updatePlayer} from "../../../../services/room.service.js";

export const RoomLoadingPage = ({
                                    players,
                                    setPlayers,
                                    roomId,
                                    user

                                }) => {

    const [isReady, setIsReady] = useState(false);
    const [hasJoined, setHasJoined] = useState(false);
    const [player, setPlayer] = useState(null);

    useEffect(() => {

        const fetchUser = async () => {
            const fetchedPlayer = await getUser(user.uid, roomId);

            if (fetchedPlayer) {
                setHasJoined(true);
                setIsReady(fetchedPlayer.isReady);
                setPlayer(fetchedPlayer);
            }
        }

        fetchUser();

    }, [user]);

    const joinGameHandler = async () => {
        try {
            const player = await updatePlayer(roomId, user.uid);
            players ? setPlayers(prevState => [...prevState, player]) : setPlayers([player]);
            setHasJoined(true);

        } catch (e) {
            toast.error('Failed to join game:', e);
        }
    }

    const setReadyHandler = async () => {

        if (player && !player.isReady) {
            try {
                await updatePlayer(roomId, player.id, true);
                setIsReady(true);
            } catch (e) {
                toast.error('Failed to set ready:', e);
            }

        } else {
            toast.error('We are waiting for the other player to be ready!');
        }

    }

    return (
        <Container>
            {!hasJoined &&
                <Container><h1>
                    You have been invited to join the game. Click the button below to join the game.
                </h1>
                    <Button variant="primary" onClick={joinGameHandler}>
                        Join Game
                    </Button>
                </Container>
            }
            {hasJoined && !isReady &&
                <Container><h1>
                    Are you ready to start the game?
                </h1>
                    <Button variant="primary" onClick={setReadyHandler}>
                        I am ready!
                    </Button>
                </Container>}
        </Container>
    )
}