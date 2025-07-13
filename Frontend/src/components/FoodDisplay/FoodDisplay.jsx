import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
const FoodDisplay = ({ category }) => {
  // get food list using context Api
  const { food_list, filteredFoodList, searchTerm } = useContext(StoreContext);
  
  // Use filtered list when searching, otherwise use original list
  const displayList = searchTerm ? filteredFoodList : food_list;
  return (
    <div className="food-display" id="food-display">
      <h2>
        {searchTerm 
          ? `Search results for "${searchTerm}" (${displayList.length} items)` 
          : "Top dishes near you"
        }
      </h2>
      <div className="food-display-list">
        {displayList.length > 0 ? (
          displayList.map((item, index) => {
            // When searching, show all results regardless of category
            if (searchTerm || category === "All" || category === item.category) {
              return (
                <FoodItem
                  key={index}
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                />
              );
            }
            return null;
          })
        ) : (
          <div className="no-results">
            <p>No food items found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
