import {get, getDatabase, ref, set, update} from "firebase/database";

const db = getDatabase();

export const createQuizInFirebase = async (
  quizData,
  isOrganisation = true,
  organisationId,
  categoryTagName,
  difficultyTagLevel = null
) => {
  try {
    let quizRef;

    if (isOrganisation) {
      quizRef = ref(
        db,
        `quizzes/organisation/${organisationId}/${categoryTagName}/${quizData.quizId}`
      );
    } else {
      quizRef = ref(
        db,
        `quizzes/public/${categoryTagName}/${difficultyTagLevel}/${quizData.quizId}`
      );
    }

    await set(quizRef, quizData);

  } catch (error) {
    throw new Error(error);
  }
};

export const getAllQuizzes = async () => {

  try {
    const quizzes = await get(ref(db, 'quizzes'));
    console.log('Raw Data');
    console.log(quizzes.val());
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
    throw Error(e);
  }

}

export const submitQuizByUser = async (info, path, uid) =>{
  try{
    const pathForUpdate= path+`/submission/${uid}`
    const dataRef = ref(db, pathForUpdate);

    await update(dataRef, info);


  }
  catch(e){
    throw new Error(e);
  }

}

export const saveQuizToUser = async (quizId, uid, score) =>{
  try{
    const pathForUpdate= `users/${uid}/completed/${quizId}`;

    console.log(pathForUpdate);

    const oldScore= await get(ref(db, pathForUpdate)) || 0;

    console.log(oldScore);

    console.log(oldScore.val())

    const scoreToCheck = oldScore.val() || 0;

    console.log(scoreToCheck);

    if (!scoreToCheck || scoreToCheck < score){

      await update(ref(db), {
        [`users/${uid}/completed/${quizId}`]: score,
      })}
  }
  catch(e){
    throw new Error(e);
  }
}
