import React from "react";
import { ShoppingCart, Heart, User, Search, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function Navbar() {
  const { authUser, logout } = useAuthStore();

  return (
    <div className="navbar bg-base-100 shadow-md px-3 sm:px-4 lg:px-8 sticky top-0 z-50">
      {/* Left */}
      <div className="navbar-start">
        {/* Mobile Menu */}
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <Menu className="w-5 h-5" />
          </label>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[100] p-3 shadow bg-base-100 rounded-box w-56"
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/shop">Shop</Link>
            </li>
            <li>
              <Link to="/categories">Categories</Link>
            </li>
            <li>
              <Link to="/offers">Offers</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Logo */}
        <Link
          to="/"
          className="btn btn-ghost text-lg sm:text-xl font-bold text-primary px-2"
        >
          ShopEase
        </Link>
      </div>

      {/* Center - Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-medium gap-1">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/shop">Shop</Link>
          </li>
          <li>
            <Link to="/categories">Categories</Link>
          </li>
          <li>
            <Link to="/offers">Offers</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </div>

      {/* Right */}
      <div className="navbar-end gap-1 sm:gap-2">
        {/* Search - hidden on very small devices */}
        <div className="hidden md:flex items-center bg-base-200 rounded-full px-3 py-2 w-40 lg:w-56">
          <Search className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        {/* Wishlist */}
        {authUser?.isVerified && (
          <button className="btn btn-ghost btn-circle relative">
            <Heart className="w-5 h-5" />
            <span className="badge badge-sm badge-primary absolute -top-1 -right-1">
              2
            </span>
          </button>
        )}

        {/* Cart */}
        <button className="btn btn-ghost btn-circle relative">
          <ShoppingCart className="w-5 h-5" />
          <span className="badge badge-sm badge-secondary absolute -top-1 -right-1">
            3
          </span>
        </button>

        {/* Auth Section */}
        {authUser ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-9 sm:w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
            </label>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to="/profile">My Profile</Link>
              </li>
              <li>
                <Link to="/orders">Orders</Link>
              </li>
              <li>
                <Link to="/wishlist">Wishlist</Link>
              </li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <button className="btn btn-primary btn-sm sm:btn-md">
                Login
              </button>
            </Link>
            <Link to="/signup" className="hidden sm:block">
              <button className="btn btn-outline btn-sm sm:btn-md">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
