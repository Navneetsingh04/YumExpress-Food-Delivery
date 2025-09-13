import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
const FoodDisplay = ({ category }) => {
  // get food list using context Api
  const { food_list, filteredFoodList, searchTerm, isLoadingFood } = useContext(StoreContext);
  
  // Use filtered list when searching, otherwise use original list
  const displayList = searchTerm ? filteredFoodList : food_list;
  
  // Filter items based on category
  const filteredItems = displayList.filter(item => {
    if (searchTerm) return true; // Show all search results
    return category === "All" || category === item.category;
  });

  // Get category-specific message and suggestions
  const getCategoryMessage = (categoryName) => {
    const suggestions = {
      "Salad": "Try our fresh appetizers or healthy smoothies instead!",
      "Rolls": "Check out our sandwiches or wraps section!",
      "Deserts": "Browse our beverages or sweet treats!",
      "Sandwich": "Explore our rolls or burger options!",
      "Cake": "Look at our desserts or bakery items!",
      "Pure Veg": "Try our salads or healthy options!",
      "Pasta": "Check out our Italian dishes or noodles!",
      "Noodles": "Browse our pasta or Asian cuisine!"
    };
    
    return suggestions[categoryName] || "Try exploring other delicious categories from our menu!";
  };
  
  return (
    <div className="food-display" id="food-display">
      <h2>
        {searchTerm 
          ? `Search results for "${searchTerm}" (${displayList.length} items)` 
          : category === "All" 
            ? "Top dishes near you"
            : `${category} dishes (${filteredItems.length} items)`
        }
      </h2>
      <div className="food-display-list">
        {isLoadingFood ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <h3> Loading delicious food items...</h3>
            <p>We're fetching the freshest dishes just for you!</p>
          </div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <FoodItem
              key={index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))
        ) : (
          <div className="no-results">
            <h3>  No {category !== "All" ? category.toLowerCase() : "food"} items available at the moment.</h3>
            <p>
              {searchTerm 
                ? `No items match your search for "${searchTerm}". Try different keywords or browse our categories!`
                : category !== "All"
                  ? `We're currently out of ${category.toLowerCase()} dishes. ${getCategoryMessage(category)}`
                  : "No food items available right now. Our chefs are preparing fresh dishes for you. Please check back later!"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
