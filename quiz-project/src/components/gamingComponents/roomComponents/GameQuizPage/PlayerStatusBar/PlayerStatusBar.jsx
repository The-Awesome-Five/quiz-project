import {Container} from "react-bootstrap";

export const PlayerStatusBar = ({player}) => {

    if (!player) {
        return (
        <h1>Loading...</h1>
        )
    }

        return (
            <Container>
                <h1>{player.username}</h1>
                <h2>Score: {player.score}</h2>
            </Container>
        )
}