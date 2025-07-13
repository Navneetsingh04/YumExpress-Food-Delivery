import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItem, setCartItem] = useState({});
  const url = "https://yumexpress-backend.onrender.com";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFoodList, setFilteredFoodList] = useState([]);

  const addToCart = async (itemId) => {
    setCartItem((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
    }));
    if (token) {
      try {
        await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
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
        await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItem) {
      if (cartItem[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItem[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      if (response.data.success) {
        setFoodList(response.data.data);
        setFilteredFoodList(response.data.data); // Initialize filtered list
      } else {
        console.error("Error fetching food list");
      }
    } catch (error) {
      console.error("API Error fetching food list:", error);
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
        console.error("Error fetching cart data");
      }
    } catch (error) {
      console.error("API Error fetching cart data:", error);
    }
  };

  // Search functionality
  const searchFood = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
      }
    };
    loadData();
  }, [token]); // Depend on `token` to re-fetch data when it changes

  // Update filtered list whenever search term or food list changes
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
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
