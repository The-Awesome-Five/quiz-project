import {Container} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import { getRoom} from "../../../../../services/room.service.js";
import TimeCounter from "../../../../../utills/TimeCounter.jsx";
import {Question} from "../../../../QuizComponents/Question.jsx";
import {GameQuestion} from "./GameQuestion/GameQuestion.jsx";
import {toast} from "react-toastify";
import {saveQuizToUser, submitQuizByUser} from "../../../../../services/quiz.service.js";

export const GameQuiz = ({
    roomId
                         }) => {

    const [room, setRoom] = useState({});
    const [indexOfQuestion, setIndexOfQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        const fetchRoom = async () => {
            const fetchedRoom = await getRoom(roomId);
            console.log(fetchedRoom);
            setRoom(fetchedRoom);
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
            <h1>{room.name}</h1>
            <div>
                {
                    <TimeCounter initialSeconds={room.timePerRound * 60} finish={finish}/>

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