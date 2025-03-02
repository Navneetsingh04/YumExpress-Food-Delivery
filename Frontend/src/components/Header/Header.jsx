import React from "react";

import "./Header.css";
const Header = () => {
  const scrollToMenu = () => {
    const menuSection = document.getElementById("explore-menu");
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="header">
      <div className="header-contents">
        <h2>Order your favourite food here</h2>
        <p>
          Explore a diverse menu featuring a delectable array of dishes,
          expertly crafted with the finest ingredients. Satisfy your cravings
          and elevate your dining experience—one delicious meal at a time.
        </p>
        <button onClick={scrollToMenu}>View Menu</button>
      </div>
    </div>
  );
};

export default Header;
