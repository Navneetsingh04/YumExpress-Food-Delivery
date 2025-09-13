import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import {Routes,Route} from "react-router-dom"
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Order from './pages/Orders/Order'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const url = import.meta.env.VITE_URL;
  return (
    <div>
      <Navbar/>
      <hr/>
      <div className='app-content'>
        <Sidebar/>
        <Routes>
          <Route path='/add' element={<Add url={url}/>}/>
          <Route path='/list' element={<List url={url}/>}/>
          <Route path='/order' element={<Order url={url}/>}/>
        </Routes>
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
      </div>
    </div>
  )
}

export default App
