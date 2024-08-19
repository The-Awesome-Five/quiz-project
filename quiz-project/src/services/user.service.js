import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
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
