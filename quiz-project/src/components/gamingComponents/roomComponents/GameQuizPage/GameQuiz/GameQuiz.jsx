import {Container} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {getQuestions} from "../../../../../services/room.service.js";

export const GameQuiz = ({
    players,
    roomId
                         }) => {

    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            const fetchedQuestions = await getQuestions(roomId);
            setQuestions(fetchedQuestions);
        }

        fetchQuestions();
    }, [roomId]);

    return (
        <Container>
            <h1>Round 1</h1>
        </Container>
    )
}