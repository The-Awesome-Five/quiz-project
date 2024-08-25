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
        const path2 = 'questionBank/organization'; 
        const snapshot1 = await get(ref(db, `${path1}`));  
        const snapshot2 = await get(ref(db, `${path2}`));  
        const data1 = snapshot1.exists() ? snapshot1.val() : {};
        const data2 = snapshot2.exists() ? snapshot2.val() : {};
        const combinedData = { ...data1, ...data2 };
        return Object.values(combinedData);
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
};
