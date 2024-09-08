import {Card, Container} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {getRoom, nextRound, startGame} from "../../../../../services/room.service.js";
import TimeCounter from "../../../../../utills/TimeCounter.jsx";
import {Question} from "../../../../QuizComponents/Question.jsx";
import {GameQuestion} from "./GameQuestion/GameQuestion.jsx";
import {toast} from "react-toastify";
import {saveQuizToUser, submitQuizByUser} from "../../../../../services/quiz.service.js";

export const GameQuiz = ({
    roomId,
    players
                         }) => {

    const [room, setRoom] = useState({});
    const [indexOfQuestion, setIndexOfQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [round, setRound] = useState(1);
    const [reset, setReset] = useState(false);

    useEffect(() => {

        const beginGame = async () => {
            await startGame(roomId, players);
        }

        const fetchRoom = async () => {
            const fetchedRoom = await getRoom(roomId);
            setRoom(fetchedRoom);

            if (!fetchedRoom.game) {
                await beginGame();
            } else {
                setRound(fetchedRoom.game.currentRound);
            }
        }

        fetchRoom();



    }, [roomId]);

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

        await nextRound(roomId, players);
        setRound(round + 1);
        setReset(!reset);

    }

    const finish = () => {

        submit(false);

    }

    if(!room.questions){
        return (<h2>...loading</h2>)
    }

    console.log('Room: ')
    console.log(room)

    return (
        <Container>
            <Container className="d-flex align-items-center flex-column">
            <h1>{room.name}</h1>
            <h2>Round: {round}</h2>
            </Container>
            <div>
                {
                    <TimeCounter initialSeconds={room.timePerRound * 60} reset={reset} finish={finish}/>

                }
                <GameQuestion
                    question={room.questions[indexOfQuestion]}
                    handleAnswer={handleAnswer}
                />

                {
                    indexOfQuestion === room.questions.length - 1
                        ? <button onClick={submit}>Submit Quiz</button>
                        : <button onClick={forwards}>Next</button>

                }

                <button onClick={backwards} disabled={indexOfQuestion === 0}>Back</button>
            </div>
        </Container>
    )
}