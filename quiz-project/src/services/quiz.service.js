import {child, get, getDatabase, push, ref, remove, set, update} from "firebase/database";
import { db } from "../firebase/config";
import { getUserDataByUsername } from "./user.service.js";

export const createQuizInFirebase = async (quizData) => {
  try {
    let id;
    try {
    const result = await push(ref(db, 'quizzes'), quizData);
    id = result.key;
  
   await update(ref(db), {
        [`quizzes/${id}/id`]: id,
    })}
    catch(e){
      console.log(e);
    }


  } catch (error) {
    throw new Error(error);
  }
};

export const getAllQuizzes = async () => {

  try {
    const quizzes = await get(ref(db, 'quizzes'));
  
    return Object.values(quizzes.val());
  } catch (e) {
    throw Error(e);
  }

}

export const getQuizzesByCat = async (cat) => {

  try {
    const quizzes = await get(ref(db, 'quizzes'));
    let fillteredQuizzes = {}
    Object.values(quizzes.val()).map( (el) => {
      if(el.category === cat) {
        fillteredQuizzes[el.id] = el
      }
    })
  
    return Object.values(fillteredQuizzes);
  } catch (e) {
    throw Error(e);
  }

}


export const fetchQuizByPath = async (path) => {

  try {
    const quiz = await get(ref(db, path));
    
    return quiz.val();
  } catch (e) {
    console.log(e)
  }

}

export const submitQuizByUser = async (info, path, uid) =>{
  try{
    const pathForUpdate= path+`/submission/${uid}`

    const oldScore= await get(ref(db, `${pathForUpdate}/score`)) || 0;

    const scoreToCheck = oldScore.val() || 0;

    if (!scoreToCheck || scoreToCheck < info.score) {

      const dataRef = ref(db, pathForUpdate);

      await update(dataRef, info);
    }

  }
  catch(e){
    throw new Error(e);
  }

}

export const saveQuizToUser = async (quizId, uid, score) =>{
  try{
    const pathForUpdate= `users/${uid}/completed/${quizId}`;

    const oldScore= await get(ref(db, pathForUpdate)) || 0;

    const scoreToCheck = oldScore.val() || 0;

    if (!scoreToCheck || scoreToCheck < score){

      await update(ref(db), {
        [`users/${uid}/completed/${quizId}`]: score,
      })}
  }
  catch(e){
    throw new Error(e);
  }
}


export const updateQuiz = async (quizID, updatedQuizData) => {
  const dataRef = ref(db, `quizzes/${quizID}`);
  try{
    update (dataRef,updatedQuizData)
  }
  catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const addParticipant = async (quizID, username) => {
  console.log(username);
  console.log(quizID);
  
  let userInfo;
  const dataRef = ref(db, `quizzes/${quizID}/inviteList/pending`);
  try {
    const userEntries = Object.entries(await getUserDataByUsername(username));
    const [uid, userData] = userEntries[0];
    userInfo = { uid, ...userData };
  } catch (e) {
    console.log(e);
    return;
  }
  const infoForUpdate = { [userInfo.uid]: username };
  
  try {
    await update(dataRef, infoForUpdate);
    const notificationRef = ref(db, `users/${userInfo.uid}/notifications/pending`);
    const quizRef = ref(db, `quizzes/${quizID}`);
    const quizSnapshot = await get(quizRef);
    const quizName = quizSnapshot.val().name;
    const notificationInfo = {
      quizName: quizName,
      status: 'pending'
    };
    await set(ref(db, `users/${userInfo.uid}/notifications/pending/${quizID}`), notificationInfo);
  } catch (error) {
    console.log('Error updating invite list or adding notification:', error);
  }
};

export const updateNotificationStatus = async (userId, quizID, action, username) => {
  const pendingRef = ref(db, `users/${userId}/notifications/pending/${quizID}`);
  const statusRef = ref(db, `users/${userId}/notifications/${action}/${quizID}`);
  const quizInviteRef = ref(db, `quizzes/${quizID}/inviteList/${action}`);
  const quizInviteRefRemove = ref(db, `quizzes/${quizID}/inviteList/pending/${userId}`);
  try {
      await set(statusRef, { quizID: quizID, status: action });
      await remove(pendingRef);

      const infoForUpdate = { [userId]: username }; 
      await update(quizInviteRef, infoForUpdate);
      await remove (quizInviteRefRemove)
  } catch (error) {
      console.log('Error updating notification status:', error);
  }
};


export const getQuizDetails = async (quizIDs) => {
  try {
    const dbRef = ref(db);
    const quizPromises = quizIDs.map(quizID => {
      const quizRef = child(dbRef, `quizzes/${quizID}`);
      return get(quizRef);
    });
    const quizSnapshots = await Promise.all(quizPromises);
    const quizData = quizSnapshots.map(snapshot => {
        return snapshot.val();  
    }).filter(data => data !== null); 
    return quizData;
  } catch (error) {
    console.error("Error fetching quiz details:", error);
    throw error;  
  }
};

export const updateUserSubmission = async (userId, quizId, feedback, scores, quizName, totalScore, quiz) => {
  try {
    const quizScorePath = `quizzes/${quizId}/submission/${userId}/score`;
    const userCompletedPath = `users/${userId}/completed`;
    const feedbackPath = `users/${userId}/notifications/feedback/${quizId}`;
    await set(ref(db, quizScorePath), totalScore);
    await set(ref(db, `${userCompletedPath}/${quizId}`), totalScore);
    await set(ref(db, feedbackPath), {
      quizName: quizName,
      score: totalScore,
      quizID: quizId,
      totalScore: quiz.totalScore,
      feedback: feedback[userId]
    });

    console.log('Quiz results and feedback updated successfully');
  } catch (error) {
    console.error('Error updating quiz results and feedback:', error);
  }
};