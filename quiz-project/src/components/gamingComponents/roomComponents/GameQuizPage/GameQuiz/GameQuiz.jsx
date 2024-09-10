import {Card, Container, Row} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {endGame, getRoom, nextRound, startGame} from "../../../../../services/room.service.js";
import TimeCounter from "../../../../../utills/TimeCounter.jsx";
import {Question} from "../../../../QuizComponents/Question.jsx";
import {GameQuestion} from "./GameQuestion/GameQuestion.jsx";
import {toast} from "react-toastify";
import {saveQuizToUser, submitQuizByUser} from "../../../../../services/quiz.service.js";
import {AppContext} from "../../../../../appState/app.context.js";
import {onValue, ref} from "firebase/database";
import {db} from "../../../../../firebase/config.js";
import {PlayerStatusBar} from "../PlayerStatusBar/PlayerStatusBar.jsx";
import {useNavigate} from "react-router-dom";

export const GameQuiz = ({
                             roomId,
                             room,
                             setRoom
                         }) => {

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [round, setRound] = useState(1);
    const [reset, setReset] = useState(false);
    const [player, setPlayer] = useState(null);
    const {user, userData} = useContext(AppContext);
    const [players, setPlayers] = useState([]);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {

        // fetch room -> check for players -> if players.length === 2 navigate to home page

        if (userData) {
            const roomRef = ref(db, `room/${roomId}`);
            const unsubscribe = onValue(roomRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {

                    setRoom(data);
                    setRound(data.game.currentRound);
                    setPlayer(data.game.nextPlayer);
                    setPlayers(Object.values(data.players));
                    setCurrentQuestion(data.game.currentQuestion);

                    console.log('data.game')
                    console.log(data.game);

                    if (data.game.finished) {
                        navigate('/game-over', {state: {room: data}});
                    }

                }
            });

            return () => unsubscribe();
        }
    }, [userData]);

    const handleAnswer = (selectedIndex) => {

        room.questions[currentQuestion].selectedAnswer = selectedIndex;

        setAnswers((prevAnswers) => {
            prevAnswers[currentQuestion] = selectedIndex;

            return prevAnswers;
        });

    }

    const submit = async (isTimeOver) => {

        let score = 0;
        const selectedAnswer = room.questions[currentQuestion].selectedAnswer;

        console.log(selectedAnswer);

        if (Object.values(room.questions[currentQuestion].answers)[selectedAnswer]) {
            toast.success('Correct!');
            score = 100;
        } else {
            toast.error('Wrong!');
        }

        if (currentQuestion === room.questions.length - 1) {
            toast.success('Game is finished!');
            setIsGameFinished(true);

            let winner = {};
            let loser = {};


            const currPlayer = players.find(player => player.id === user.uid);
            const otherPlayer = players.find(player => player.id !== user.uid);

            currPlayer.score += score;


            if (currPlayer.score > otherPlayer.score) {

                winner = currPlayer;
                loser = otherPlayer;

            } else if (currPlayer.score === otherPlayer.score) {

                winner = {id: 'draw', username: currPlayer.username, score: currPlayer.score};
                loser = {id: 'draw', username: otherPlayer.username, score: otherPlayer.score};

            } else {
                winner = otherPlayer;
                loser = currPlayer;
            }

            await endGame(roomId, winner, loser);
        } else {
            await nextRound(roomId, score, player, currentQuestion + 1);
            setCurrentQuestion(currentQuestion + 1);
            setReset(!reset);
            setRound(round + 1);
        }


    }

    const finish = () => {

        submit(false);

    }

    if (!room) {
        return (<h2>...loading</h2>)
    }

    console.log(players);


    return (
        <Container className="d-flex flex-row justify-content-around">

            <Row style={{width: "350px", margin: "-10px"}} className="text-lg-start">
                <PlayerStatusBar player={players[0]}/>
            </Row>
            <Row xs={1} className="">

                <Container className="d-flex align-items-center flex-column">
                    <h1>{room.name}</h1>
                    <h2>Round: {round}</h2>
                </Container>
                <div>
                    {player === user.uid &&
                        <>
                            <TimeCounter initialSeconds={room.timePerRound * 60} reset={reset} finish={finish}/>
                            <GameQuestion
                                question={room.questions[currentQuestion]}
                                handleAnswer={handleAnswer}
                            />
                            <button onClick={submit}>Submit Quiz</button>
                        </>
                    }

                    {
                        players.length === 2 && player !== user.uid &&
                        <>
                            <h2>Waiting for {players.filter(currPlayer => currPlayer.id === player)[0].username} to
                                finish</h2>
                            <GameQuestion
                                question={room.questions[currentQuestion]}
                                handleAnswer={handleAnswer}
                                notYourTurn={true}
                            />
                        </>

                    }
                </div>
            </Row>
            <Row style={{width: "350px", paddingLeft: "100px", margin: "-10px", alignItems: "center"}} className="p-12 text-lg-end">
                <PlayerStatusBar player={players[1]}/>
            </Row>
        </Container>
    )
}
