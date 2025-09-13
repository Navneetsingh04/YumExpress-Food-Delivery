import React, { useContext, useRef, useState, useEffect } from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ExploreMenu = ({ category, setCatgory }) => {
  const { searchFood } = useContext(StoreContext);
  const menuListRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const handleCategoryClick = (menuName) => {
    // Clear search when selecting a category
    searchFood("");
    setCatgory((prev) =>
      prev === menuName ? "All" : menuName
    );
  };

  const checkScrollPosition = () => {
    if (menuListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = menuListRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const menuList = menuListRef.current;
    if (menuList) {
      menuList.addEventListener('scroll', checkScrollPosition);
      return () => menuList.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);

  const scrollLeft = () => {
    if (menuListRef.current) {
      menuListRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (menuListRef.current) {
      menuListRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
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
      <div className="explore-menu-container">
        <button 
          className={`scroll-arrow scroll-arrow-left ${!canScrollLeft ? 'disabled' : ''}`} 
          onClick={scrollLeft}
          disabled={!canScrollLeft}
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="explore-menu-list" ref={menuListRef}>
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
        
        <button 
          className={`scroll-arrow scroll-arrow-right ${!canScrollRight ? 'disabled' : ''}`} 
          onClick={scrollRight}
          disabled={!canScrollRight}
        >
          <ChevronRight size={24} />
        </button>
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
