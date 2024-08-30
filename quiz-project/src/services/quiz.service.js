import {child, get, getDatabase, push, ref, set, update} from "firebase/database";

const db = getDatabase();

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
