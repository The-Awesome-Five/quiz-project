import React, { useState, useEffect, useContext } from "react";
import { getAllShopItems, addItemToUser } from "../../../services/shop.service"; 
import { getUserByID, editUserByUserId } from "../../../services/user.service"; 
import { AppContext } from '../../../appState/app.context'; 
import './Shop.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const Shop = () => {
    const [shopItems, setShopItems] = useState([]);
    const [userItems, setUserItems] = useState({}); 
    const [loading, setLoading] = useState(true);
    const { userData } = useContext(AppContext); 
  
    useEffect(() => {
      const fetchItems = async () => {
        try {
          const items = await getAllShopItems();
          setShopItems(items);

          
          const user = await getUserByID(userData.uid);
          setUserItems(user.items || {}); 

          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch shop items or user data:", error);
          setLoading(false);
        }
      };
  
      fetchItems();
    }, [userData.uid]);
    
    const getItemsByCategory = (category) => {
      return shopItems.filter((item) => item.type === category);
    };

    
    const userHasItem = (category, itemId) => {
      return userItems[category] && userItems[category][itemId];
    };
  
    const handleBuy = async (item) => {
      try {
        const user = await getUserByID(userData.uid);

        if (!user || user.currency < item.price) {
          alert("Недостатъчно средства за покупката.");
          return;
        }

        const category = item.type; 
        
        if (userHasItem(category, item.id)) {
          alert("Вече притежавате този артикул.");
          return;
        }
        
        await addItemToUser(userData.uid, item, category);

        const newCurrency = user.currency - item.price;
        await editUserByUserId(userData.uid, { currency: newCurrency });

        
        setUserItems((prevUserItems) => ({
          ...prevUserItems,
          [category]: {
            ...prevUserItems[category],
            [item.id]: item
          }
        }));

        alert(`Успешно купихте ${item.name}!`);
      } catch (error) {
        console.error("Error buying item:", error);
        alert("Възникна грешка по време на покупката.");
      }
    };
  
    if (loading) {
      return <div>Зареждане...</div>;
    }
  
    return (
      <div className="container mt-5 p-4 border rounded">
        
        <div className="row mb-4">
          <h3 className="text-center">Head Armor</h3>
          <div className="d-flex justify-content-center">
            <div className="row justify-content-center">
              {getItemsByCategory("head").map((item, index) => (
                <div key={index} className="armor-box col-2 text-center">
                  <div className="img-box border rounded mb-2 p-4">
                    <img
                      src={item.image}  
                      alt={item.name}
                      className="img-box-inner img-fluid"
                      style={{ height: '100px', width: '100px' }}
                    />
                  </div>
                  <p>{item.name}</p> 
                  <p>{item.price} WP</p> 

                  {userHasItem("head", item.id) ? ( 
                    <button className="btn btn-secondary btn-sm" disabled>
                      Already owned
                    </button>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={() => handleBuy(item)}>
                      Buy {item.name}
                    </button>
                  )}

                </div>
              ))}
            </div>
          </div>
        </div>
  
     
        <div className="row mb-4">
          <h3 className="text-center">Torso Armor</h3>
          <div className="d-flex justify-content-center">
            <div className="row justify-content-center">
              {getItemsByCategory("torso").map((item, index) => (
                <div key={index} className="armor-box col-2 text-center">
                  <div className="img-box border rounded mb-2 p-4">
                    <img
                      src={item.image}  
                      alt={item.name}
                      className="img-box-inner img-fluid"
                      style={{ height: '100px', width: '100px' }}
                    />
                  </div>
                  <p>{item.name}</p> 
                  <p>{item.price} WP</p> 

                  {userHasItem("torso", item.id) ? ( 
                    <button className="btn btn-secondary btn-sm" disabled>
                      Already owned
                    </button>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={() => handleBuy(item)}>
                      Buy {item.name}
                    </button>
                  )}

                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <h3 className="text-center">Torso Armor</h3>
          <div className="d-flex justify-content-center">
            <div className="row justify-content-center">
              {getItemsByCategory("legs").map((item, index) => (
                <div key={index} className="armor-box col-2 text-center">
                  <div className="img-box border rounded mb-2 p-4">
                    <img
                      src={item.image}  
                      alt={item.name}
                      className="img-box-inner img-fluid"
                      style={{ height: '100px', width: '100px' }}
                    />
                  </div>
                  <p>{item.name}</p> 
                  <p>{item.price} WP</p> 

                  {userHasItem("legs", item.id) ? ( 
                    <button className="btn btn-secondary btn-sm" disabled>
                      Already owned
                    </button>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={() => handleBuy(item)}>
                      Buy {item.name}
                    </button>
                  )}

                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Shop;