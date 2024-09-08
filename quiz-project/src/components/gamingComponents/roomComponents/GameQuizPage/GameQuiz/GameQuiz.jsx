import {Card, Container} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {getRoom, nextRound, startGame} from "../../../../../services/room.service.js";
import TimeCounter from "../../../../../utills/TimeCounter.jsx";
import {Question} from "../../../../QuizComponents/Question.jsx";
import {GameQuestion} from "./GameQuestion/GameQuestion.jsx";
import {toast} from "react-toastify";
import {saveQuizToUser, submitQuizByUser} from "../../../../../services/quiz.service.js";
import {AppContext} from "../../../../../appState/app.context.js";

export const GameQuiz = ({
                             roomId,
                             players,
                             setPlayers
                         }) => {

    const [room, setRoom] = useState({});
    const [indexOfQuestion, setIndexOfQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [round, setRound] = useState(1);
    const [reset, setReset] = useState(false);
    const [player, setPlayer] = useState(null);
    const {user, userData} = useContext(AppContext);

    useEffect(() => {

        const beginGame = async (timePerRound) => {
            await startGame(roomId, players, timePerRound);
        }

        const fetchRoom = async () => {
            const fetchedRoom = await getRoom(roomId);
            setRoom(fetchedRoom);

            if (!fetchedRoom.game) {
                await beginGame(fetchedRoom.timePerRound);
                setPlayer(fetchedRoom.game.nextPlayer);
            } else {
                setRound(fetchedRoom.game.currentRound);
                setPlayer(fetchedRoom.game.nextPlayer);
            }
        }

        fetchRoom();


    }, [reset]);

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

    if (!room.questions) {
        return (<h2>...loading</h2>)
    }


    return (
        <Container>
            <Container className="d-flex align-items-center flex-column">
                <h1>{room.name}</h1>
                <h2>Round: {round}</h2>
            </Container>
            <div>
                {
                    <TimeCounter initialSeconds={room.timePerRound * 5} reset={reset} finish={finish}/>

                }
                {player === user.uid &&
                    <>
                        <GameQuestion
                            question={room.questions[indexOfQuestion]}
                            handleAnswer={handleAnswer}
                        />
                        <button onClick={submit}>Submit Quiz</button>
                    </>
                }

                {
                    player !== user.uid &&
                    <h2>Waiting for other player to finish</h2>
                }

                <button onClick={backwards} disabled={indexOfQuestion === 0}>Back</button>
            </div>
        </Container>
    )
}