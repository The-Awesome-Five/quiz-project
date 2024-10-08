import { getDatabase, push, get, query, orderByChild, equalTo, update, ref } from "firebase/database";

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

export const getAllQuestionFromSearch = async (search, orgId) => {
  try {
    const path1 = "questionBank";
    const snapshot1 = await get(ref(db, `${path1}`));
    const data1 = snapshot1.exists() ? snapshot1.val() : {};

    let filteredQuestions = [];

    Object.values(data1).forEach( (q, index) => {
        if((q.orgID === 'public' || orgId.indexOf(q.orgID) !== -1) && q.category.includes(search)) {
            filteredQuestions[index] = q;
            index++;
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

    return Object.values(questionBanks.val());

  } catch {
    throw new Error('Could not fetch the question banks!');
  }

}

export const getQuestionsByCategoryAndDifficulty = async (category,difficulty) => {

  const path = 'questionBank';
  let allQuestions = [];

  console.log('category', category);
  console.log('difficulty', difficulty);

  try {
    const queries = [
      query(ref(db, path), orderByChild('category'), equalTo(category))
    ];

    const snapshots = await Promise.all(queries.map(q => get(q)));

    snapshots.forEach(snapshot => {

      if (snapshot && snapshot.val) {

        if (snapshot.exists()) {
          const questions = snapshot.val();

          allQuestions = [...allQuestions, ...Object.values(questions).filter(q => q.category === category && q.difficultyLevel === difficulty)];
        }

      } else {
        console.log('Could not fetch the question banks!');
      }
    });

    console.log('allQuestions', allQuestions);
    return allQuestions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}


export const getQuestionsByCategory = async (category,) => {

  const path = 'questionBank';
  let allQuestions = [];

  console.log('category', category);


  try {
    const queries = [
      query(ref(db, path), orderByChild('category'), equalTo(category))
    ];

    const snapshots = await Promise.all(queries.map(q => get(q)));

    snapshots.forEach(snapshot => {

      if (snapshot && snapshot.val) {

        if (snapshot.exists()) {
          const questions = snapshot.val();

          allQuestions = [...allQuestions, ...Object.values(questions).filter(q => q.category === category)];
        }

      } else {
        console.log('Could not fetch the question banks!');
      }
    });

    console.log('allQuestions', allQuestions);
    return allQuestions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}
