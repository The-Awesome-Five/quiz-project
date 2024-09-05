import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/config.js";
 
export const uploadImage = async (imageFile, itemName) => {
    try {
      const storageRef = ref(storage, `shop/${itemName}`);  // Store image under shop/itemName.jpg
      await uploadBytes(storageRef, imageFile);  // Upload the image
      const downloadURL = await getDownloadURL(storageRef);  // Get the download URL
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Error uploading image');
    }
};