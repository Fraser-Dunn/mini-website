import { useState } from "react";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import { Link } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import type { Theme } from "../types/mini";

interface NavbarProps {
  isAuthed: boolean;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const Navbar = ({ isAuthed, theme, setTheme }: NavbarProps) => {
  const [nav, setNav] = useState(false);
  const handleClick = () => setNav(!nav);

  return (
    <div>
      <div className="navbar-background">
        <div className="navbar-container">
          <div className="navbar-first-half">
            <div className="navbar-title">
              <Link to="/">
                <h1>MyMinis</h1>
              </Link>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/gallery">Gallery</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="navbar-second-half">
            {/* Search Bar */}
            <div className="searchbar-main-div">
              <SearchBar />
            </div>

            {/* Theme Toggle */}
            <ThemeToggle theme={theme} setTheme={setTheme} />

            {/* Admin Button */}
            <div className="nav-admin-btn-div">
              <Link to={isAuthed ? "/admin" : "/login"}>
                <button className="nav-admin-btn">Admin</button>
              </Link>
            </div>
          </div>

          <div className="navbar-small" onClick={handleClick}>
            {!nav ? (
              <Bars3Icon className="nav-menu-icon" />
            ) : (
              <XMarkIcon className="nav-x-icon" />
            )}
          </div>
        </div>

        <ul className={!nav ? "nav-hidden-true" : "nav-hidden-false"}>
          <li>
            <Link to="/">
              <p>Home</p>
            </Link>
          </li>
          <li>
            <Link to="/about">
              <p>About</p>
            </Link>
          </li>
          <li>
            <Link to="/gallery">
              <p>Gallery</p>
            </Link>
          </li>
          <li>
            <Link onClick={handleClick} to={isAuthed ? "/admin" : "/login"}>
              <p>Admin</p>
            </Link>
          </li>
          <div className="searchbar-drop-div">
            <SearchBar />
          </div>
        </ul>
      </div>

      <div className="headerOffset"></div>
    </div>
  );
};

export default Navbar;
