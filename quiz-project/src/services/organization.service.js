import { get, push, ref, update } from "firebase/database";
import { db } from "../firebase/config";

export const getUserOrganizations = async (uid) =>{
    const path =  `users/${uid}/organizations`;
     try{
        const snapshot = await get(ref(db, `${path}`));
        return snapshot.val();
     }
     catch(e){
        console.log(e)
     }
}

export const  createOrganizationInDB = async (org) => {
    let id;
    try {
    const result = await push(ref(db, 'organizations'), org);
    id = result.key;
   await update(ref(db), {
        [`organizations/${id}/id`]: id,
    });

    const pathForUserUpdate=`users/${Object.keys(org.owner)[0]}/organizations/${id}`;
    const dataRef = ref(db, pathForUserUpdate);

    const data= {organizationID: id, organizationName: org.name, organizationImage: org.imgUrl}
    await update(dataRef, data);

    return id;

    }
    catch(e){
        alert(e.message);
    }
}

