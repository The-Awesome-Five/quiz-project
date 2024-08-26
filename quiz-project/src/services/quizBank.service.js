import { getDatabase, ref, push, get } from "firebase/database";  

const db = getDatabase();  

export const addQuestionToOrgBank = async (info, orgId, category, difficulty) => {
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
        const path1 = 'questionBank/public'; 
        const snapshot1 = await get(ref(db, `${path1}`));  
        const data1 = snapshot1.exists() ? snapshot1.val() : {};
        let question = {}
        Object.values(data1).forEach(element => {
            Object.values(element).forEach(q => {
                Object.values(q).forEach(qu => {
                    question[qu.questionId] = {
                        question:qu.question
                    }
                })
                
            })
        });

        return Object.values(question);
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
};
