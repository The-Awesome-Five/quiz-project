import { getDatabase, ref, push, get, query, orderByChild, equalTo, update } from "firebase/database";

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

export const addQuestionToQuestionBank = async (info) => {
  try {
    let id;
    try {
    const result = await push(ref(db, 'questionBank'), info);
    id = result.key;
   await update(ref(db), {
        [`questionBank/${id}/id`]: id,
    })}
    catch(e){
      console.log(e);
    }


  } catch (error) {
    throw new Error(error);
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
export const getQuestionsByOrgIds = async (orgIds) => {

  const path = 'questionBank';
  let allQuestions = [];

  try {
    const queries = [
      query(ref(db, path), orderByChild('orgID'), equalTo('public')),
      ...orgIds.map(orgId => query(ref(db, path), orderByChild('orgID'), equalTo(orgId)))
    ];
    const snapshots = await Promise.all(queries.map(q => get(q)));
    snapshots.forEach(snapshot => {
      if (snapshot && snapshot.val) {

        if (snapshot.exists()) {
          const questions = snapshot.val();
          allQuestions = [...allQuestions, ...Object.values(questions)];
        }
      } else {
       
      }
    });

    return allQuestions;
  } catch (error) {
    console.error("Error fetching questions:", error);
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
