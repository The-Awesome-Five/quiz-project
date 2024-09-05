import {getQuestionsByCategoryAndDifficulty} from "./quizBank.service.js";
import {push, ref, update} from "firebase/database";
import {db} from "../firebase/config.js";

export const createRoom = async (room) => {

    console.log('Room created: ');
    console.log(room);

    try {
        let id;
        const questions = await getQuestionsByCategoryAndDifficulty(room.category,room.difficulty);

        room.questions = questions;

        try {
            const result = await push(ref(db, 'room'), room);
            id = result.key;
            await update(ref(db), {
                [`room/${id}/id`]: id,
            })}
        catch(e){
            console.log(e);
        }

        return id;

    } catch (e) {
        console.error('Failed to create room:', e);
    }
}

export const getPlayers = (roomId) => {
    return;
}

export const startGame = (roomId) => {
    return;
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