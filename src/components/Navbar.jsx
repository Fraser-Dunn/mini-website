import React, { useState } from "react";
import { Link } from "react-router-dom";

import { MenuIcon, XIcon } from "@heroicons/react/outline";

const Navbar = (props) => {
  const [nav, setNav] = useState(false);
  const handleClick = () => setNav(!nav);

  return (
    <div>
      <div className="navbar-background drop-shadow-lg">
        <div className="navbar-container">
          <div className="navbar-title">
            <Link to="/">
              <h1>MyMinis</h1>
            </Link>
            <ul>
              <li>
                <Link className="header-link" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="header-link" to="/newin">
                  New
                </Link>
              </li>
              <li>
                <Link className="header-link" to="/gallery">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>
          {/* Search Bar */}
          <div className="navbar-search-div">
            <input type="text" placeholder="Search here..." />
          </div>

          {/* Admin Button needs to be hidden at 910px */}
          <Link to={props.isAuthed ? "/admin" : "/login"}>
            <div className="nav-admin-btn-div">
              <button className="nav-admin-btn">Admin</button>
            </div>
          </Link>

          <div className="navbar-small" onClick={handleClick}>
            {!nav ? (
              <MenuIcon className="nav-menu-icon" />
            ) : (
              <XIcon className="nav-x-icon" />
            )}
          </div>
        </div>

        <ul
          onClick={handleClick}
          className={!nav ? "nav-hidden-true" : "nav-hidden-false"}
        >
          <li>
            <Link to="/">
              <p>Home</p>
            </Link>
          </li>
          <li>
            <Link to="/newin">
              <p>New In</p>
            </Link>
          </li>
          <li>
            <Link to="/gallery">
              <p>Gallery</p>
            </Link>
          </li>
          <li>
            <Link
              onClick={handleClick}
              to={props.isAuthed ? "/admin" : "/login"}
            >
              <p>Admin</p>
            </Link>
          </li>
          <input
            className="navbar-search-input-drop"
            type="text"
            placeholder="Search here..."
          />
        </ul>
      </div>
      <div className="headerOffset"></div>
    </div>
  );
};

export default Navbar;
