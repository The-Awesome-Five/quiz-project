import { getDatabase, ref, set } from "firebase/database";

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

    alert("Quiz created successfully!");
  } catch (error) {
    console.error("Error creating quiz:", error);
    alert("Failed to create quiz. Please try again.");
  }
};
