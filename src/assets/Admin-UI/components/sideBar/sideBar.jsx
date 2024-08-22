import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import dataSideBar from "../data/dataSideBar";

function Sidebar() {
  // const [active,setActive] = useState()
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="bg-gray-800 text-white p-4 space-y-2 w-36">
      <h2 className="text-3xl font-bold">ADMIN</h2>
      <div className="border-b-2 border-white mb-2"></div>

      {dataSideBar.map((item) => (
        <Link
          key={item.id}
          to={`/${item.name.toLowerCase()}`}
          className={`flex justify-start items-center cursor-pointer py-2 px-1 gap-2 rounded transition-colors duration-200 ease-in-out box-border ${
            currentPath === `/${item.name.toLowerCase()}`
              ? "outline-none ring-2 ring-white rounded-md"
              : "hover:bg-gray-700"
          }`}
        >
          <img src={item.img} alt="" className="py-2" />
          <button className="w-full text-left">
            {item.name}
          </button>
        </Link>
      ))}
    </nav>
  );
}

export default Sidebar;