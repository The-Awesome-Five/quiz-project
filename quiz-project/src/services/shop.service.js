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
      const shopItemsSnapshot = await get(ref(db, 'shop'));
      const shopItemsData = shopItemsSnapshot.val();
      
      // Преобразуване на данните в масив
      const shopItems = [];
  
      Object.keys(shopItemsData).forEach(category => {
        Object.keys(shopItemsData[category]).forEach(itemKey => {
          const item = shopItemsData[category][itemKey];
          shopItems.push({
            ...item, // копираме всички свойства на артикула
            category // добавяме категорията (head, torso и т.н.)
          });
        });
      });
  
      return shopItems;
    } catch (e) {
      throw Error(e);
    }
  };
  
  export const addItemToUser = async (uid, item, category) => {
    try {
      const itemRef = ref(db, `users/${uid}/items/${category}/${item.id}`);
      await update(itemRef, item); // Добавяме артикул в съответната категория
    } catch (error) {
      console.error("Error adding item to user:", error);
    }
  };

 