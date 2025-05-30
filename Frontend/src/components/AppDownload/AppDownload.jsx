import React from "react";
import "./AppDownload.css";
import { assets } from "../../assets/assets";
const AppDownload = () => {
  return (
    <div className="app-download" id="app-download">
      <h2>For Better Exprience Download YumExpress App</h2>
      <div className="app-download-plateforms">
        <img src={assets.play_store} alt="play store" />
        <img src={assets.app_store} alt="app store" />
      </div>
    </div>
  );
};

export default AppDownload;
