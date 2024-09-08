import {Container} from "react-bootstrap";

export const PlayerStatusBar = ({player}) => {

        return (
            <Container>
                <h1>{player.username}</h1>
                <h2>Score: {player.score}</h2>
            </Container>
        )
}