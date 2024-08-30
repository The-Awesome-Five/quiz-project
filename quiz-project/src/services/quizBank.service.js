import { getDatabase, ref, push, get } from "firebase/database";

const db = getDatabase();

export const addQuestionToOrgBank = async (
  info,
  orgId,
  category,
  difficulty
) => {
  const path = `questionBank/organization/${orgId}/${category}/${difficulty}`;
  try {
    await push(ref(db, path), info);
    return;
  } catch (e) {
    console.log(e);
    console.log("Path being used: ", path);
  }
};

export const addQuestionToPublicBank = async (info, category, difficulty) => {
  const path = `questionBank/public/${category}/${difficulty}`;
  try {
    await push(ref(db, path), info);
    return;
  } catch (e) {
    console.log(e);
  }
};

export const getQuestionFromBank = async (path) => {
  try {
    const snapshot = await get(ref(db, `questionBank/${path}`));
    return snapshot.val();
  } catch (e) {
    console.log(e);
  }
};

export const getAllQuestionFromBank = async () => {
  try {
    const path1 = "questionBank/public";
    const snapshot1 = await get(ref(db, `${path1}`));
    const data1 = snapshot1.exists() ? snapshot1.val() : {};
    let allQuestions = [];

    Object.entries(data1).forEach(([category, questionsByDifficulty]) => {
      Object.values(questionsByDifficulty).forEach((questions) => {
        allQuestions = [...allQuestions, ...Object.values(questions)];
      });
    });

    return allQuestions;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export const getAllQuestionFromSearch = async (search) => {
  try {
    const path1 = "questionBank/public";
    const snapshot1 = await get(ref(db, `${path1}`));
    const data1 = snapshot1.exists() ? snapshot1.val() : {};

    let filteredQuestions = [];

    Object.entries(data1).forEach(([category, questionsByDifficulty]) => {
      if (category.includes(search)) {
        Object.values(questionsByDifficulty).forEach((questions) => {
          filteredQuestions = [
            ...filteredQuestions,
            ...Object.values(questions),
          ];
        });
      }
    });

    return filteredQuestions;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export const getAllQuestionBanks = async () => {

  try {

    const questionBanks = await get(ref(db, 'questionBank'));

    return Object.entries(questionBanks.val());

  } catch {
    throw new Error('Could not fetch the question banks!');
  }

}
