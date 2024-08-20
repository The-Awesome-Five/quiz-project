import {get, set, ref, query, equalTo, orderByChild, update} from 'firebase/database';
import { db } from '../firebase/config';

export const getUserByID = async (id) => {
    const snapshot = await get(ref(db, `users/${id}`));
    return snapshot.val();
  };

export const createUserID = async (username, firstName, lastName, uid, email, avatarUrl, role) => {
   const user = { username, firstName, lastName, uid, email, avatarUrl, role, createdOn: new Date().toString() };
   await set(ref(db, `users/${uid}`), user);
};


export const getUserDataByUID = async (uid) => {
    const snapshot = await get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
    return snapshot.val();
};

export const getUserDataByUsername = async (username) => {
    const snapshot = await get(query(ref(db, 'users'), orderByChild('username'), equalTo(username)));
    return snapshot.val();
};


export const getUserDataByEmail = async (email) => {
   const snapshot = await get(query(ref(db, 'users'), orderByChild('email'), equalTo(email)));
   return snapshot.val();
};

export const getAllUsers = async () => {

    const awaitUsers = await get(ref(db, 'users'));

    console.log(Object.values(awaitUsers.val()));

    return Object.values(awaitUsers.val());

}

export const editUserByUserId = async (userId, editedUser) => {

    const userRef = ref(db, `users/${userId}`);

    return update(userRef, editedUser);

}


export const updateOrganizationUserInfo = async (uid, organizationId,organizationName, organizationImageUrl) => {
    try {
        const updatePath = `users/${uid}/organizations`;

        const data = { [organizationId]: {
            organizationID: organizationId,
            organizationName: organizationName,
            organizationImage: organizationImageUrl
        } };
    
        const dataRef = ref(db, updatePath);
     
        await update(dataRef, data);
        
        return 'Element edited successfully!';
    } catch (e) {
        console.error('Update failed', e);
        return e.message;
    }
}

export const getUserAvatarUrlByUID = async (uid) => {
    const snapshot = await get(ref(db, `users/${uid}`));
    const userData = snapshot.val();
    if (userData) {
        return userData.avatarUrl;
    } else {
        throw new Error('User not found');
    }
};

export const getUserNameUrlByUID = async (uid) => {
    try {
        const snapshot = await get(ref(db, `users/${uid}`));
        const userData = snapshot.val();

        if (userData) {
            return {
                username: userData.username,
                avatarUrl: userData.avatarUrl
            };
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};

export const updateUserAvatar = async (uid, avatarUrl) => {
  const userRef = ref(db, `users/${uid}/avatarUrl`);
  await set(userRef, avatarUrl);
};


 const updateElement = async (data, pathForUpdate) => {
    try {
        const dataRef = ref(db, pathForUpdate);

        await update(dataRef, data);
 
        return 'Element edited successfully!';
    } catch (e) {
        console.error('Update failed', e);
        return e.message;
    }
}

export const updateUserFirstName = async (uid, firstName) => {
    const updatePath = `users/${uid}`
    const data = { firstName: firstName};
    const result = await updateElement(data, updatePath)
    return result;
  }
  
  export const updateUserLastName = async (uid, lastName) => {
    const updatePath = `users/${uid}`
    const data = { lastName: lastName};
    const result = await updateElement(data, updatePath)
    return result;
  }
  
  export const updateCustomInfo = async (uid, info) => {
    const updatePath = `users/${uid}`
    const data = { customInfo: info};
    const result = await updateElement(data, updatePath)
    return result;
  }
