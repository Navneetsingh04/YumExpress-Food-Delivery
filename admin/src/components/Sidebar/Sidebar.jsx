import React from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import {ChartNoAxesCombined, CirclePlus, NotebookTabs, ShoppingBag} from "lucide-react"
const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/add" className="sidebar-option">
          <CirclePlus size={30}/>
          <p> Add Items</p>
        </NavLink>
        <NavLink to="/list" className="sidebar-option">
          <NotebookTabs size={30}/>
          <p> Food List</p>
        </NavLink>
        <NavLink to="/order" className="sidebar-option">
          <ShoppingBag size={30} />
          <p> Orders</p>
        </NavLink>
        <NavLink to="/analytics" className="sidebar-option">
          <ChartNoAxesCombined size={30}/>
          <p> Analytics</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
