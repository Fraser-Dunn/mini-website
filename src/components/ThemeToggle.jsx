import React from "react";
import darkmode from "../assets/svg/darkmode.svg";

const ThemeToggle = ({ theme, setTheme }) => {
  const handleClick = () => {
    if (theme === "light") {
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="theme-toggle-body">
      <div className="theme-toggle-img-div">
        <img
          onClick={handleClick}
          className="theme-toggle-img"
          src={darkmode}
          alt=""
        />
      </div>
    </div>
  );
};

export default ThemeToggle;
