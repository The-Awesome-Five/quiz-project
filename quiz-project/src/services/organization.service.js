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

    const data= {organizationID: id, organizationName: org.name, organizationImage: org.imgUrl, role: 'owner'}
    await update(dataRef, data);

    return id;

    }
    catch(e){
        alert(e.message);
    }
}

export const getSingleOrganization  = async (orgId) => {
    try{
    const path= `organizations/${orgId}`;
    const snapshot = await get(ref(db, `${path}`));
    return snapshot.val() || [];
    }
    catch(err){
        console.log(err);
    }

}


export const updateOrganizationParticipants = async (info, role, organizationId) => {
    try {
        const updatePath = `organizations/${organizationId}/${role}`;

        const dataRef = ref(db, updatePath);

        await update(dataRef, info);

        return 'Element edited successfully!';
    } catch (e) {
        console.error('Update failed', e);
        return e.message;
    }
}

export const getAllOrganizations = async () => {
    try{
        const path = 'organizations';
        const snapshot = await get(ref(db, `${path}`));
        return Object.values(snapshot.val());
    }
    catch(e){
        console.log(e);
    }
}

export const leaveOrganizationUser = async (pathForUser, pathForOrg) =>{
    await update(ref(db), {
        [`${pathForUser}`]: null,
    });
    await update(ref(db), {
        [`${pathForOrg}`]: null,
    });
}