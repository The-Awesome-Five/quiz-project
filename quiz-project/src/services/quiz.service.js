import {get, getDatabase, ref, set} from "firebase/database";

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

    return Object.values(quizzes.val());
  } catch (e) {
    throw Error(e);
  }

}
