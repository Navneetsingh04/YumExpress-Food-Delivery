import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTokenFromStorage } from '../../store/slices/authSlice';
import { fetchFoodList } from '../../store/slices/foodSlice';
import { loadCartData } from '../../store/slices/cartSlice';

const ReduxInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        dispatch(setTokenFromStorage(storedToken));
      }
      dispatch(fetchFoodList());
      if (storedToken) {
        dispatch(loadCartData());
      }
    };

    initializeApp();
  }, [dispatch]);

  return children;
};

export default ReduxInitializer;