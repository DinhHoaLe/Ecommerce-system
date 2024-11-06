import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WishlistContext } from "../../Products/Context/WishlistContext";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TestImg from "../../Admin-UI/components/img/464112140_122128355468442990_2366169051644275698_n.jpg";
import { ToastContainer, toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const Navbar = ({ profile }) => {
  const { getWishlistCount } = useContext(WishlistContext);
  const wishlistCount = getWishlistCount();
  const [searchQuery, setSearchQuery] = useState("");
  const [token, setToken] = useState("");
  const [user, setUser] = useState("");
  const [dropDown, setDropDown] = useState(false);

  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle form submission to navigate with search query
  const handleSearchSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    navigate(`/productlist?search=${encodeURIComponent(searchQuery)}`);
  };

  const getCookieValue = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  };

  const deleteCookie = (name) => {
    document.cookie =
      name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const logOut = () => {
    deleteCookie("token");
    navigate("/login");
  };

  useEffect(() => {
    const getToken = getCookieValue("token");
    if (getToken) {
      setToken(getToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      setUser(jwtDecode(token));
    }
  }, [token]);

  return (
    <nav className="w-full relative top-0 left-0">
      {/* Top Bar */}
      <div className="bg-black text-white text-center py-2 text-sm">
        Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
        <a href="#" className="font-bold ml-1">
          ShopNow
        </a>
        <div className="absolute right-4 top-2">
          <select className="bg-black text-white">
            <option>English</option>
            <option>Español</option>
            <option>Français</option>
          </select>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between py-4 px-4 mx-auto">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-semibold">Exclusive</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-decoration-line: underline font-semibold"
                  : "text-gray-900 hover:text-blue-700"
              }
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/productlist"
              className={({ isActive }) =>
                isActive
                  ? "text-decoration-line: underline font-semibold"
                  : "text-gray-900 hover:text-blue-700"
              }
            >
              Products
            </NavLink>
            <NavLink
              to="/contactpage"
              className={({ isActive }) =>
                isActive
                  ? "text-decoration-line: underline font-semibold"
                  : "text-gray-900 hover:text-blue-700"
              }
            >
              Contact
            </NavLink>
            <NavLink
              to="/aboutpage"
              className={({ isActive }) =>
                isActive
                  ? "text-decoration-line: underline font-semibold"
                  : "text-gray-900 hover:text-blue-700"
              }
            >
              About
            </NavLink>
          </div>

          {/* Icons and Search */}
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="border rounded-full py-2 px-4 text-gray-500 w-60"
                placeholder="What are you looking for?"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                <SearchOutlinedIcon />
              </button>
            </form>
            <NavLink to="/shopping-cart">
              <div className="relative">
                <ShoppingCartOutlinedIcon className="h-6 w-6 text-gray-600" />
              </div>
            </NavLink>
            <NavLink to="/productwishlist">
              <div className="relative">
                <FavoriteBorderOutlinedIcon className="h-6 w-6 text-gray-600" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {wishlistCount}
                  </span>
                )}
              </div>
            </NavLink>
            {token ? (
              <div
                className="relative"
                onMouseEnter={() => setDropDown(true)} // Hiển thị dropdown khi hover vào container
                onMouseLeave={() => setDropDown(false)} // Ẩn dropdown khi chuột rời khỏi container
              >
                <NavLink to="/profile">
                  <img
                    src={profile ? profile.avatar : TestImg}
                    alt="Account Icon"
                    className="h-6 w-6 cursor-pointer"
                  />
                </NavLink>

                {dropDown && (
                  <div className="absolute right-0 mt-2 w-28 bg-slate-100 text-white border border-gray-200 rounded shadow-lg z-10 p-2">
                    {/* Khoảng cách trống phía trên dropdown */}
                    <div className="h-[30px] w-full absolute top-0 left-0 -translate-y-[70%] bg-transparent"></div>

                    {/* Các liên kết trong dropdown */}
                    {(user?.role === "admin" || user?.role === "super") && (
                      <NavLink
                        to="/admin"
                        className="block px-4 py-2 text-left transform -translate-x-[7%] hover:bg-blue-500 text-sm"
                      >
                        Admin
                      </NavLink>
                    )}
                    <NavLink
                      to="/profile"
                      className="block px-4 py-2 text-left transform -translate-x-[7%] hover:bg-blue-500 text-sm"
                    >
                      Profile
                    </NavLink>
                    <button
                      className="w-full text-left px-4 py-2 transform -translate-x-[7%] hover:bg-blue-500 text-sm"
                      onClick={() => logOut()}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/login">
                <AccountCircleOutlinedIcon className="h-6 w-6 text-gray-600" />
              </NavLink>
            )}
          </div>
        </div>
      </div>
      {/* <ToastContainer /> */}
    </nav>
  );
};

export default Navbar;
