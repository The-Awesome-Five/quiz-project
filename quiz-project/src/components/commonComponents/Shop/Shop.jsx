import React, {useState, useEffect} from "react";
import { getAllShopItems } from "../../../services/shop.service";
import './Shop.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const Shop = () => {
    const [shopItems, setShopItems] = useState([]);
    const [loading, setLoading] = useState(true);
  
    // Fetch на артикулите при зареждане на компонента
    useEffect(() => {
      const fetchItems = async () => {
        try {
          const items = await getAllShopItems();
          setShopItems(items);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch shop items:", error);
          setLoading(false);
        }
      };
  
      fetchItems();
    }, []);
  
    // Филтриране на артикулите по категория
    const getItemsByCategory = (category) => {
      return shopItems.filter((item) => item.type === category);
    };
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="container mt-5 p-4 border rounded">
        {/* Head Armor Section */}
        <div className="row mb-4">
          <h3 className="text-center">Head Armor</h3>
          <div className="d-flex justify-content-center">
            <div className="row justify-content-center">
              {getItemsByCategory("head").map((item, index) => (
                <div key={index} className="armor-box col-2 text-center">
                  <div className="img-box border rounded mb-2 p-4">
                    <img
                      src={item.image}  // Вземаме image URL от базата
                      alt={item.name}
                      className="img-box-inner img-fluid"
                      style={{ height: '100px', width: '100px' }}
                    />
                  </div>
                  <p>{item.name}</p> {/* Показваме името на артикула */}
                  <p>{item.price} credits</p> {/* Показваме цената на артикула */}
                  <button className="btn btn-primary btn-sm">Buy {item.name}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* Добави останалите категории, ако е нужно */}
      </div>
    );
  };
  
  export default Shop;