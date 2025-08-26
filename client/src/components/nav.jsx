import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  if (location.pathname === "/" || location.pathname === "/register") {
    return null;
  }

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
      <div className="text-lg font-bold">
        Lead Management
      </div>
      <div className="space-x-4">
        <input type="text" />
        <Link to="/showleads" className="hover:underline">
          Leads List
        </Link>
        <Link to="/leads" className="hover:underline">
          Create Lead
        </Link>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
