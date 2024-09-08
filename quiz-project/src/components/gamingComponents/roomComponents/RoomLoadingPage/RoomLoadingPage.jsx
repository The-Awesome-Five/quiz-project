import React, {useContext, useEffect, useState} from "react";
import {Button, Card, Container} from "react-bootstrap";
import {AppContext} from "../../../../appState/app.context.js";
import {toast} from "react-toastify";
import {getRoom, getUser, updatePlayer} from "../../../../services/room.service.js";

export const RoomLoadingPage = ({
                                    players,
                                    setPlayers,
                                    roomId,
                                    user,
                                    userData

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

    }, [hasJoined]);

    const joinGameHandler = async () => {
        try {
            const player = await updatePlayer(roomId, userData);
            // players ? setPlayers(prevState => [...prevState, player]) : setPlayers([player]);
            setHasJoined(true);

        } catch (e) {
            toast.error('Failed to join game:', e);
        }
    }

    const setReadyHandler = async () => {

        

        if (!player.isReady) {
            try {
                await updatePlayer(roomId, player, true);
                setIsReady(true);
            } catch (e) {
                toast.error('Failed to set ready:', e);
            }

        } else {
            toast.error('We are waiting for the other player to be ready!');
        }

    }

    return (
        <Card className="d-flex flex-column text-center align-items-center bg-light-subtle ">
            {players.length === 0 && <Card className="bg-danger-subtle">
                <h3>Waiting for players to join. </h3>
            </Card>}
            {players.length === 1 && <Card className="bg-danger-subtle">
                <h3>Waiting for another player to join.</h3>
            </Card>}
            {!hasJoined &&
                <Card className="bg-warning-subtle">
                    <h3>
                        You have been invited to join the game. Click the button below to join the game.
                    </h3>
                    <button onClick={joinGameHandler}>
                        Join Game
                    </button>
                </Card>
            }
            {hasJoined && !isReady &&
                <Card className="bg-warning-subtle">
                    <h3>
                        Are you ready to start the game?
                    </h3>
                    <button onClick={setReadyHandler}>
                        I am ready!
                    </button>
                </Card>}
        </Card>
    )
}