import {getQuestionsByCategoryAndDifficulty} from "./quizBank.service.js";
import {get, push, ref, update} from "firebase/database";
import {db} from "../firebase/config.js";

export const createRoom = async (room) => {

    console.log('Room created: ');
    console.log(room);

    try {
        let id;
        const questions = await getQuestionsByCategoryAndDifficulty(room.category, room.difficulty);

        room.questions = questions;

        try {
            const result = await push(ref(db, 'room'), room);
            id = result.key;
            await update(ref(db), {
                [`room/${id}/id`]: id,
            })
        } catch (e) {
            console.log(e);
        }

        return id;

    } catch (e) {
        console.error('Failed to create room:', e);
    }
}

export const getRoom = async (roomId) => {

    try {
        const room = await get(ref(db, `room/${roomId}`));
        return room.val();
    } catch (e) {
        console.error('Failed to get room:', e);
    }

}

export const setPlayer = async (roomId, playerId, isReady = false) => {

    const player = {
        id: playerId,
        isReady,
        score: 0,
    }
    try {
        await update(ref(db), {
            [`room/${roomId}/players/${playerId}`]: player,
        });

        return player;
    } catch (e) {
        console.error('Failed to set player:', e);
    }

}

export const startGame = async (roomId) => {

    try {

        await update(ref(db), {
            [`room/${roomId}/game`]: {
                started: true,
                currentQuestion: 0,
                currentRound: 1,
                currentPlayers: [],
        }});
    } catch (e) {
        console.error('Failed to start game:', e);
    }
}

export const endGame = (roomId) => {
    return;
}

export const getGameQuestions = (category = null) => {
    return;
}

export const submitAnswer = (roomId, playerId) => {
    return;
}