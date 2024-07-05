import { useState, useEffect, useRef  } from "react";
import {AiOutlineHome,AiOutlineShopping,AiOutlineLogin,AiOutlineUserAdd,AiOutlineShoppingCart} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";
import "./Navigation.css";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };


  

  return (
    <div
      style={{ zIndex: 9999 }}
      className="flex justify-between p-4 text-black bg-[#FF671F] w-[100%] h-[7%] fixed"
      id="navigation-container"
    >
      <div className="flex">
        <Link
          to="/"
          className="flex items-center mr-10 hover:text-white text-sm"
        >
          <AiOutlineHome className="mr-3 mt-[0rem]" size={20} />
          <span className="nav-item-name mt-[0rem]">HOME</span>{" "}
        </Link>

        <Link
          to="/shop"
          className="flex items-center mr-10 hover:text-white text-sm"
        >
          <AiOutlineShopping className="mr-3 mt-[0rem]" size={20} />
          <span className="nav-item-name mt-[0rem]">SHOP</span>{" "}
        </Link>

        <Link to="/cart" className="flex items-center mr-10 hover:text-white">
          
            <AiOutlineShoppingCart className="mr-3 mt-[0rem]" size={20} />
            <span className="nav-item-name text-sm mt-[0rem]">CART</span>{" "}

          <div className="absolute top-9">
            {cartItems.length > 0 && (
              <span>
                <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              </span>
            )}
          </div>
        </Link>

        <Link to="/favorite" className="flex items-center mr-10 hover:text-white text-sm">
            <FaHeart className="mt-[0rem] mr-2" size={20} />
            <span className="nav-item-name mt-[0rem]">
              FAVORITES
            </span>{" "}
            <FavoritesCount />
        </Link>
      </div>

      <div className="flex justify-end  items-center w-[100%]">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-800 focus:outline-none"
        >
          {userInfo ? (
            <span className="text-white text-lg">{userInfo.username.charAt(0).toUpperCase() + userInfo.username.slice(1)}</span>
          ) : (
            <></>
          )}
          {userInfo && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 ${
                dropdownOpen ? "transform rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          )}
        </button>

        {dropdownOpen && userInfo && (
          <ul
            ref={dropdownRef}
            className={`absolute right-0 mr-0.2 ${userInfo.isAdmin? "mt-[24rem]" : "mt-[9rem]"} space-y-2 bg-white text-black w-[10rem] text-center${
              !userInfo.isAdmin ? "-top-20" : "-top-80"
            } `}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 hover:bg-green-500  hover:text-white font-medium"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productlist"
                    className="block px-4 py-2 hover:bg-green-500  hover:text-white font-medium"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categorylist"
                    className="block px-4 py-2 hover:bg-green-500  hover:text-white font-medium"
                  >
                    Category
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderlist"
                    className="block px-4 py-2 hover:bg-green-500  hover:text-white font-medium"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="block px-4 py-2 hover:bg-green-500  hover:text-white font-medium"
                  >
                    Users
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link to="/profile" className="block px-4 py-2 hover:bg-green-500  hover:text-white font-medium">
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={logoutHandler}
                className="block w-full px-4 py-2 text-left hover:bg-red-500  hover:text-white"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
        {!userInfo && (
          <ul className="flex justify-center mt-[0rem]">
            <li>
              <Link
                to="/login"
                className="flex items-center mr-10 hover:text-white"
              >
                <AiOutlineLogin className="mr-2" size={20} />
                <span className="nav-item-name ">LOGIN</span>
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="flex items-center hover:text-white"
              >
                <AiOutlineUserAdd className="mr-2" size={20} />
                <span className="nav-item-name">REGISTER</span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navigation;