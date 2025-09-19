import { useDispatch, useSelector } from 'react-redux';

// Custom hooks for better reusability
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Specific selector hooks for common use cases
export const useAuth = () => useAppSelector(state => state.auth);
export const useCart = () => useAppSelector(state => state.cart);
export const useFood = () => useAppSelector(state => state.food);

// Combined selectors for complex data
export const useCartTotal = () => useAppSelector(state => {
  const { cart, food } = state;
  let totalAmount = 0;
  
  for (const itemId in cart.items) {
    if (cart.items[itemId] > 0) {
      const itemInfo = food.foodList.find(product => String(product._id) === String(itemId));
      if (itemInfo) {
        totalAmount += itemInfo.price * cart.items[itemId];
      }
    }
  }
  
  return totalAmount;
});

export const useCartItemCount = () => useAppSelector(state => {
  const { items } = state.cart;
  return Object.values(items).reduce((total, quantity) => total + quantity, 0);
});