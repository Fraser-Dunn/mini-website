import React, { useState } from "react";
import { Link } from "react-router-dom";

import { MenuIcon, XIcon } from "@heroicons/react/outline";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const handleClick = () => setNav(!nav);

  return (
    <div>
      <div className=" min-w-fit w-screen h-[80px] z-10 bg-orange-400 fixed drop-shadow-lg ">
        <div className="px-2 flex justify-between items-center w-full h-full">
          <div className="flex items-center">
            <Link to="/">
              <h1 className="text-3xl text-white font-bold mr-8 pl-4 sm:text-4xl">
                MyMinis
              </h1>
            </Link>
            <ul className="hidden md2:flex text-xl text-white px-4">
              <li>
                <Link className="px-8" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="px-8" to="/sets">
                  Sets
                </Link>
              </li>
              <li>
                <Link className="px-8" to="/newin">
                  New
                </Link>
              </li>
              <li>
                <Link className="px-8" to="/gallery">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>
          <div>
            {/* Search Bar needs to be hidden below 910px*/}
            <input
              className="flex w-max rounded-md text-lg px-2 py-0.5 outline-none mr-6"
              type="text"
              placeholder="Search here..."
            />
          </div>

          {/* Admin Button needs to be hidden at 1050px */}
          <div className="hidden lg:flex pr-4">
            <button className="px-4 py-3 ml-6">Admin</button>
          </div>

          <div className="md2:hidden mr-4" onClick={handleClick}>
            {!nav ? (
              <MenuIcon className="w-5 text-white" />
            ) : (
              <XIcon className="w-5 text-white" />
            )}
          </div>
        </div>

        <ul
          className={
            !nav ? "hidden" : "absolute bg-orange-400 w-full px-8 pb-3"
          }
        >
          <li className="border-b-2 border-white w-full">
            <Link className="text-white" to="/home">
              Home
            </Link>
          </li>
          <li className="border-b-2 border-white w-full">
            <Link className="text-white" to="/sets">
              Sets
            </Link>
          </li>
          <li className="border-b-2 border-white w-full">
            <Link className="text-white" to="/newin">
              New In
            </Link>
          </li>
          <li className="border-b-2 border-white w-full">
            <Link className="text-white" to="/gallery">
              Gallery
            </Link>
          </li>

          <div className="flex justify-end my-4">
            <button className="px-2 py-1 mb-2">Admin</button>
          </div>
        </ul>
      </div>
      <div className="headerOffset"></div>
    </div>
  );
};

export default Navbar;
