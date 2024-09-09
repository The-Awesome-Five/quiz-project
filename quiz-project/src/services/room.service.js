import {getQuestionsByCategoryAndDifficulty} from "./quizBank.service.js";
import {get, push, ref, update} from "firebase/database";
import {db} from "../firebase/config.js";

export const createRoom = async (room) => {

    try {
        let id;
        const questions = await getQuestionsByCategoryAndDifficulty(room.category.toLowerCase(), room.difficulty.toLowerCase());

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

    console.log('Room ID: ', roomId);

    try {
        const room = await get(ref(db, `room/${roomId}`));
        return room.val();
    } catch (e) {
        console.error('Failed to get room:', e);
    }

}

export const updatePlayer = async (roomId, providedPlayer, isReady = false, score = 0) => {

    const player = {
        id: providedPlayer.id ? providedPlayer.id : providedPlayer.uid,
        isReady,
        username: providedPlayer.username,
        hasJoined: true,
        score
    }
    try {
        await update(ref(db), {
            [`room/${roomId}/players/${providedPlayer.id ? providedPlayer.id : providedPlayer.uid}`]: player,
        });

        return player;
    } catch (e) {
        console.error('Failed to set player:', e);
    }

}
export const startGame = async (roomId, players, timePerRound) => {

    try {

        await update(ref(db), {
            [`room/${roomId}/game`]: {
                started: true,
                currentQuestion: 0,
                currentRound: 1,
                nextPlayer: players[0].id,
        }});
    } catch (e) {
        console.error('Failed to start game:', e);
    }
}

export const getUser = async (userId, roomId) => {
    try {
        const user = await get(ref(db, `room/${roomId}/players/${userId}`));
        return user.val();
    } catch (e) {
        console.error('Failed to get user:', e);
    }
}

export const nextRound = async (roomId, score, playerId, currentQuestion) => {
    try {
        const room = await getRoom(roomId);
        const currentRound = room.game.currentRound;
        await update(ref(db), {
            [`room/${roomId}/game/currentRound`]: currentRound + 1,
            [`room/${roomId}/players/${playerId}/score`]: room.players[playerId].score + score,
            [`room/${roomId}/game/nextPlayer`]: Object.values(room.players).find(player => player.id !== playerId).id,
            [`room/${roomId}/game/currentQuestion`]: currentQuestion
        });
    } catch (e) {
        console.error('Failed to start next round:', e);
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