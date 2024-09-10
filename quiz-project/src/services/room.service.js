import {getQuestionsByCategory, getQuestionsByCategoryAndDifficulty} from "./quizBank.service.js";
import {get, push, ref, update} from "firebase/database";
import {db} from "../firebase/config.js";

export const createRoom = async (room) => {

    try {
        let id;
        const questions = await getQuestionsByCategoryAndDifficulty(room.category.toLowerCase(), room.difficulty.toLowerCase());

        if (questions.length === 0) {
            throw new Error('No questions found for this difficulty and category');
        }

        console.log('Questions:', questions);

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
        throw new Error(e.message);
    }
}



export const createRoomPvE = async (room) => {

    try {
        let id;
        const questions = await getQuestionsByCategory(room.category.toLowerCase());

        if (questions.length === 0) {
            throw new Error('No questions found for this category');
        }

        console.log('Questions:', questions);

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
        throw new Error(e.message);
    }
}



export const getRoom = async (roomId) => {

    console.log('Room ID: ', roomId);

    try {
        const room = await get(ref(db, `room/${roomId}`));
        return room.val();
    } catch (e) {
        console.error('Failed to get room:', e.message);
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


export const startSoloGame = async (roomId, players, timePerRound) => {

    try {

        await update(ref(db), {
            [`room/${roomId}/game`]: {
                started: true,
                currentQuestion: 0,
                currentRound: 1,
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

export const nextRoundSoloPvE = async (roomId, room, currentQuestion) => {
    try {

        const currentRound = room.game.currentRound;
        await update(ref(db), {
            [`room/${roomId}/game/currentRound`]: currentRound + 1,
            [`room/${roomId}/game/currentQuestion`]: currentQuestion
        });
    } catch (e) {
        console.error('Failed to start next round:', e);
    }
}

export const endGame = async (roomId, winner, loser) => {
    try {
        await update(ref(db), {
            [`room/${roomId}/game/finished`]: true,
            [`room/${roomId}/game/winner`]: winner,
            [`room/${roomId}/game/loser`]: loser
        });
    } catch (e) {
        console.error('Failed to end game:', e);
    }
}

export const rewardWinner = async (roomId, playerId, currency) => {

    try {

        await get(ref(db, `users/${playerId}/currency`)).then((snapshot) => {
            currency = snapshot.val() + 100;
        });
        await update(ref(db), {
            [`users/${playerId}/currency`]: currency
        });

    } catch (e) {
        throw new Error(e.message);
    }
}

export const getGameQuestions = (category = null) => {
    return;
}

export const submitAnswer = (roomId, playerId) => {
    return;
}



export const startCoOpGape = async (roomId, players, timePerRound, playerHP) => {

    try {

        await update(ref(db), {
            [`room/${roomId}/game`]: {
                started: true,
                currentQuestion: 0,
                currentRound: 1,
                nextPlayer: players[0].id,
                playerHP:playerHP,
                bossHP:10
        }});
    } catch (e) {
        console.error('Failed to start game:', e);
    }
}



export const nextRoundCoOpPvE = async (roomId, nextQuestionIndex,takingDamage) => {
    try {
        const room = await getRoom(roomId);
        const currentRound = room.game.currentRound;
        const playerId=room.game.nextPlayer;
        let bossHP;
        let playerHP;
        if(takingDamage===true){
            bossHP=room.game.bossHP;
            playerHP= room.game.playerHP-1 ;
            ('Flag:Player taking Damage')
            console.log(bossHP);
        console.log(playerHP)
        }
        else{
           
            bossHP=room.game.bossHP-1;
            playerHP= room.game.playerHP;
            ('Flag:Boss taking Damage')
            console.log(bossHP);
            console.log(playerHP)
        }
      
        await update(ref(db), {
            [`room/${roomId}/game/currentRound`]: currentRound + 1,
            [`room/${roomId}/game/currentQuestion`]: nextQuestionIndex, 
            [`room/${roomId}/game/nextPlayer`]: Object.values(room.players).find(player => player.id !== playerId).id,
            [`room/${roomId}/game/playerHP`]: playerHP, 
            [`room/${roomId}/game/bossHP`]: bossHP, 
            
        });
    } catch (error) {
        console.error("Error updating to next round:", error);
        throw error; 
    }
};


export const endGameCoOp = async (roomId, result) => {
    try {
        await update(ref(db), {
            [`room/${roomId}/game/finished`]: result,

        });
    } catch (e) {
        console.error('Failed to end game:', e);
    }
}