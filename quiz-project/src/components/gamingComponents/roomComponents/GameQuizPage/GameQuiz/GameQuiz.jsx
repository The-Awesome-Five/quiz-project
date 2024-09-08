import {Card, Container, Row} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {getRoom, nextRound, startGame} from "../../../../../services/room.service.js";
import TimeCounter from "../../../../../utills/TimeCounter.jsx";
import {Question} from "../../../../QuizComponents/Question.jsx";
import {GameQuestion} from "./GameQuestion/GameQuestion.jsx";
import {toast} from "react-toastify";
import {saveQuizToUser, submitQuizByUser} from "../../../../../services/quiz.service.js";
import {AppContext} from "../../../../../appState/app.context.js";
import {onValue, ref} from "firebase/database";
import {db} from "../../../../../firebase/config.js";
import {PlayerStatusBar} from "../PlayerStatusBar/PlayerStatusBar.jsx";

export const GameQuiz = ({
                             roomId,
    room,
    setRoom
                         }) => {

    const [indexOfQuestion, setIndexOfQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [round, setRound] = useState(1);
    const [reset, setReset] = useState(false);
    const [player, setPlayer] = useState(null);
    const {user, userData} = useContext(AppContext);
    const [players, setPlayers ] = useState([]);

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

                }
            });

            return () => unsubscribe();
        }
    }, [userData]);

    const forwards = () => {
        setIndexOfQuestion(indexOfQuestion + 1);
    }
    const backwards = () => {
        setIndexOfQuestion(indexOfQuestion - 1);
    }

    const handleAnswer = (selectedIndex) => {

        room.questions[indexOfQuestion].selectedAnswer = selectedIndex;

        setAnswers((prevAnswers) => {
            prevAnswers[indexOfQuestion] = selectedIndex;

            return prevAnswers;
        });

    }

    const submit = async (isTimeOver) => {

        const score = 100;

        await nextRound(roomId, score, player);
        setRound(round + 1);
        if (indexOfQuestion === room.questions.length - 1) {
            console.log('Quiz Submitted');
        } else {
            setIndexOfQuestion(indexOfQuestion + 1);
        }
        setReset(!reset);

    }

    const finish = () => {

        submit(false);

    }

    if (!room) {
        return (<h2>...loading</h2>)
    }

    console.log(players);


    return (
        <Container className="d-flex flex-row justify-content-center">
            <Row className="m-1 text-lg-start"><PlayerStatusBar player={players[0]} /></Row>

            <Row><Container className="d-flex align-items-center flex-column">
                <h1>{room.name}</h1>
                <h2>Round: {round}</h2>
            </Container>
            <div>
                {player === user.uid &&
                    <>
                        <TimeCounter initialSeconds={room.timePerRound * 10} reset={reset} finish={finish}/>
                        <GameQuestion
                            question={room.questions[indexOfQuestion]}
                            handleAnswer={handleAnswer}
                        />
                        <button onClick={submit}>Submit Quiz</button>
                    </>
                }

                {
                    players.length === 2 && player !== user.uid &&
                    <>
                    <h2>Waiting for {players.filter(currPlayer => currPlayer.id === player)[0].username} to finish</h2>
                    <GameQuestion
                        question={room.questions[indexOfQuestion]}
                        handleAnswer={handleAnswer}
                        notYourTurn={true}
                    />
                    </>

                }

                <button onClick={backwards} disabled={indexOfQuestion === 0}>Back</button>
            </div>
            </Row>
            <Row className="m-1 text-lg-end"><PlayerStatusBar player={players[1]} /></Row>
        </Container>
    )
}