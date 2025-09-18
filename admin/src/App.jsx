import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from './store/store'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import {Routes,Route} from "react-router-dom"
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Order from './pages/Orders/Order'
import Analytics from './pages/Analytics/Analytics'
import AdminLogin from './components/AdminLogin/AdminLogin'
import { useAppDispatch, useAdminAuth } from './store/hooks'
import { verifyAdminToken, clearError } from './store/slices/adminAuthSlice'
import { Toaster } from 'react-hot-toast'

const AdminDashboard = () => {
  return (
    <div>
      <Navbar/>
      <hr/>
      <div className='app-content'>
        <Sidebar/>
        <Routes>
          <Route path='/add' element={<Add/>}/>
          <Route path='/list' element={<List/>}/>
          <Route path='/order' element={<Order />}/>
          <Route path='/analytics' element={<Analytics/>}/>
        </Routes>
      </div>
    </div>
  )
}

const AppContent = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, token } = useAdminAuth();

  useEffect(() => {
    // Clear any previous errors
    dispatch(clearError());
    
    // Only verify token if it exists in localStorage
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken && token) {
      dispatch(verifyAdminToken());
    }
  }, [dispatch]);

  // Show loading only when actually verifying token
  if (loading && token) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#666'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e3e3e3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
      <Toaster
        toastOptions={{
          duration: 4000,
          style: {
            border: "1px solid #1a73e8", 
            background: "#e8f0fe",
            color: "#1a73e8", 
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
          },
        }}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Provider>
  )
}

export default App
