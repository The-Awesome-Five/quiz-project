import { getDatabase, push, get, query, orderByChild, equalTo, update, ref } from 'firebase/database';

const db = getDatabase();

// Function to add predefined items and upload images to Firebase Storage and Database
export const addItemsToShop = async (itemObject) => {
  let id;
  try {
    const result = await push(ref(db, `shop/${itemObject.type}`), itemObject);
    id = result.key;
    await update(ref(db), {
      [`shop/${itemObject.type}/${id}/id`]: id,
    })
  }
  catch(e){
    console.log(e);
  }
};
 
// Function to fetch all shop items from the Realtime Database
export const getAllShopItems = async () => {
  try {
    const shopItems = await get(ref(db, 'shop'));
  
    return Object.values(shopItems.val());
  } catch (e) {
    throw Error(e);
  }
};
 

 