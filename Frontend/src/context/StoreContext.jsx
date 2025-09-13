import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItem, setCartItem] = useState({});
  const url = import.meta.env.VITE_URL;
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFoodList, setFilteredFoodList] = useState([]);
  const [isLoadingFood, setIsLoadingFood] = useState(true);

  const addToCart = async (itemId) => {
   
    setCartItem((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
    }));
    if (token) {
      try {
        const response = await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
  
        if (!response.data.success) {
          console.error("Failed to add to cart:", response.data.message);
        }
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItem((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemId] > 1) {
        updatedCart[itemId] -= 1;
      } else {
        delete updatedCart[itemId];
      }
      return updatedCart;
    });
    if (token) {
      try {
        const response = await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { token } }
        );
        
        if (!response.data.success) {
          console.error("Failed to remove from cart:", response.data.message);
        }
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItem) {
      if (cartItem[item] > 0) {
        let itemInfo = food_list.find(
          (product) => String(product._id) === String(item)
        );
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItem[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      setIsLoadingFood(true);
      const response = await axios.get(url + "/api/food/list");
      if (response.data.success) {
        const allFoodItems = response.data.data;
        
        // Shuffle array and take only 32 random items
        const shuffledItems = [...allFoodItems].sort(() => Math.random() - 0.5);
        const randomFoodItems = shuffledItems.slice(0, 32);
        
        setFoodList(randomFoodItems);
        setFilteredFoodList(randomFoodItems);
      } else {
        console.error("Error fetching food list:", response.data.message);
      }
    } catch (error) {
      console.error("API Error fetching food list:", error);
    } finally {
      setIsLoadingFood(false);
    }
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItem(response.data.cartData);
      } else {
        console.error("Error fetching cart data:", response.data.message);
      }
    } catch (error) {
      console.error("API Error fetching cart data:", error);
    }
  };

  // Search functionality
  const searchFood = (term) => {
    setSearchTerm(term);
  };

  // Run once on mount
  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    };
    loadData();
  }, []);

  // Reload cart data when token changes
  useEffect(() => {
    if (token) {
      loadCartData(token);
    }
  }, [token]);

  // Update filtered food list when search changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFoodList(food_list);
    } else {
      const filtered = food_list.filter(
        (food) =>
          food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          food.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          food.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFoodList(filtered);
    }
  }, [searchTerm, food_list]);

  const contextValue = {
    food_list,
    filteredFoodList,
    searchTerm,
    searchFood,
    cartItem,
    setCartItem,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    isLoadingFood,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
