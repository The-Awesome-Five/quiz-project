import {child, get, getDatabase, push, ref, set, update} from "firebase/database";

const db = getDatabase();

export const createQuizInFirebase = async (quizData) => {
  try {
    let id;
    try {
    const result = await push(ref(db, 'quizzes'), quizData);
    id = result.key;
    console.log(id);
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
  
    return quizzes.val();
  } catch (e) {
    throw Error(e);
  }

}

export const fetchQuizByPath = async (path) => {

  try {
    const quiz = await get(ref(db, path));
    console.log(path);
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


export const updateQuiz = async (organizationID, quizID, updatedQuizData) => {

  const db = getDatabase();
  const orgRef = ref(db, `quizzes/organisation/${organizationID}`);
  try {
    console.log('Fetching data from:', orgRef.toString()); 
    const snapshot = await get(orgRef);
    if (snapshot.exists()) {
      console.log('Snapshot Data:', snapshot.val());
      let quizFound = false;
      snapshot.forEach(async (subjectSnapshot) => {
        const subjectQuizzes = subjectSnapshot.val();
        console.log('Subject Quizzes:', subjectQuizzes);
        if (subjectQuizzes && subjectQuizzes[quizID]) {
          quizFound = true;
          const quizRef = child(subjectSnapshot.ref, quizID);
          try {
            await update(quizRef, updatedQuizData);
            console.log("Quiz updated successfully!");
          } catch (updateError) {
            console.error("Error updating quiz:", updateError);
          }
          return;
        }
      });

      if (!quizFound) {
        console.error("Quiz not found.");
      }
    } else {
      console.error("No data available for the organization.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
