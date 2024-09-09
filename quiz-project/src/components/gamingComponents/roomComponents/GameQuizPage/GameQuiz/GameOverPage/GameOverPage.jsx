import {useLocation} from "react-router-dom";

export const GameOverPage = () => {

    const location = useLocation();

    const { room } = location.state || {};

    return (
        <div>
            <h1>Winner: {room.game.winner.username}</h1>
            <h2>Score: {room.game.winner.score}</h2>
            <h1>Loser: {room.game.loser.username}</h1>
            <h2>Score: {room.game.loser.score}</h2>
        </div>
    )


}