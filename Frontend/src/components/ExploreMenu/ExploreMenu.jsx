import React, { useContext } from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const ExploreMenu = ({ category, setCatgory }) => {
  const { searchFood } = useContext(StoreContext);
  
  const handleCategoryClick = (menuName) => {
    // Clear search when selecting a category
    searchFood("");
    setCatgory((prev) =>
      prev === menuName ? "All" : menuName
    );
  };
  return (
    <div className="explore-menu" id="menu">
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a mouthwatering selection of
        dishes, expertly crafted with the finest ingredients. Satisfy your
        cravings and elevate your dining experience one delicious bite at a
        time!.
      </p>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div
              onClick={() => handleCategoryClick(item.menu_name)}
              key={index}
              className="explore-menu-list-item"
            >
              <img
                className={category === item.menu_name ? "active" : ""}
                src={item.menu_image}
              />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
