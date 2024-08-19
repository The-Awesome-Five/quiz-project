import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth} from '../firebase/config.js';

export const registerUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  export const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  export const logoutUser = () => {
    return signOut(auth);
  };
