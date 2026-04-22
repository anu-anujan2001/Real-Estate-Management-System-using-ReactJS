import React, { useEffect, useState } from "react";
import { ShoppingCart, Heart, User, Search, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";
import useWishlistStore from "../store/useWishlistStore";

export default function Navbar() {
  const { authUser, logout } = useAuthStore();
  const { wishlist, fetchWishlist, clearWishlist } = useWishlistStore();

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (authUser) {
      fetchWishlist();
    } else {
      clearWishlist();
    }
  }, [authUser, fetchWishlist, clearWishlist]);

  const handleProtectedNavigation = (path) => {
    if (!authUser) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (!authUser.isVerified) {
      toast.error("Please verify your email first");
      navigate("/verify-email");
      return;
    }

    navigate(path);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const trimmed = searchTerm.trim();

    if (!trimmed) {
      navigate("/shop");
      return;
    }

    navigate(`/shop?search=${encodeURIComponent(trimmed)}`);
    setSearchTerm("");
  };

  const handleLogout = async () => {
    clearWishlist();
    await logout();
  };

  const wishlistCount = authUser ? wishlist.length : 0;

  return (
    <div className="navbar bg-base-100 shadow-md px-3 sm:px-4 lg:px-8 sticky top-0 z-50">
      <div className="navbar-start">
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

        <Link
          to="/"
          className="btn btn-ghost text-lg sm:text-xl font-bold text-primary px-2"
        >
          ShopEase
        </Link>
      </div>

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

      <div className="navbar-end gap-2 items-center">
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center bg-base-200 rounded-full px-3 h-11 w-40 lg:w-56"
        >
          <button
            type="submit"
            className="shrink-0 flex items-center justify-center"
          >
            <Search className="w-4 h-4 text-gray-500 mr-2" />
          </button>

          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent outline-none w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <button
          type="button"
          onClick={() => handleProtectedNavigation("/wishlist")}
          className="btn btn-ghost btn-circle relative flex items-center justify-center"
        >
          <Heart className="w-5 h-5" />
          {authUser?.isVerified && wishlistCount > 0 && (
            <span className="badge badge-sm badge-primary absolute -top-1 -right-1">
              {wishlistCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleProtectedNavigation("/cart")}
          className="btn btn-ghost btn-circle relative flex items-center justify-center"
        >
          <ShoppingCart className="w-5 h-5" />
          {authUser?.isVerified && (
            <span className="badge badge-sm badge-secondary absolute -top-1 -right-1">
              3
            </span>
          )}
        </button>

        {authUser ? (
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle flex items-center justify-center p-0"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-primary text-primary-content border border-base-300">
                {authUser?.profilePic ? (
                  <img
                    src={authUser.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : authUser?.name ? (
                  <span className="text-sm font-semibold leading-none">
                    {authUser.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
            </label>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li className="px-2 py-1 text-xs text-base-content/60">
                {authUser?.email || "Account"}
              </li>

              <li>
                <button onClick={() => handleProtectedNavigation("/profile")}>
                  My Profile
                </button>
              </li>

              <li>
                <button onClick={() => handleProtectedNavigation("/orders")}>
                  Orders
                </button>
              </li>

              <li>
                <button onClick={() => handleProtectedNavigation("/wishlist")}>
                  Wishlist
                </button>
              </li>

              <li>
                <button onClick={handleLogout}>Logout</button>
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
