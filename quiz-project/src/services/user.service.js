import {get, set, ref, query, equalTo, orderByChild, update} from 'firebase/database';
import { db } from '../firebase/config';

export const getUserByID = async (id) => {
    const snapshot = await get(ref(db, `users/${id}`));
    return snapshot.val();
  };

export const createUserID = async (username, firstName, lastName, uid, email, avatarUrl, role) => {
   const user = { username, firstName, lastName, uid, email, avatarUrl, role, currency:1000, createdOn: new Date().toString() };
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


export const updateOrganizationUserInfo = async (uid, organizationId,organizationName, organizationImageUrl, role) => {
    try {
        const updatePath = `users/${uid}/organizations`;

        const data = { [organizationId]: {
            organizationID: organizationId,
            organizationName: organizationName,
            organizationImage: organizationImageUrl,
            role: role
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
    const userRef = ref(db, `users/${uid}/firstName`);
    await set(userRef, firstName);
  };
  
  export const updateUserLastName = async (uid, lastName) => {
    const userRef = ref(db, `users/${uid}/lastName`);
    await set(userRef, lastName);
  };
  
  export const updateCustomInfo = async (uid, customInfo) => {
    const userRef = ref(db, `users/${uid}/customInfo`);
    await set(userRef, customInfo);
  };
  export const updatePhone = async (uid, phone) => {
    const userRef = ref(db, `users/${uid}/phone`);
    await set(userRef, phone);
  };

  export const updateUserSelectedItems = async (uid, selectedItems) => {
    try {
      
      const userRef = ref(db, `users/${uid}`);
  
     
      await update(userRef, selectedItems);
  
      console.log("Selected items updated successfully");
    } catch (error) {
      console.error("Error updating selected items:", error);
      throw new Error("Failed to update selected items");
    }
  };