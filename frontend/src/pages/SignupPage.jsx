import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  //const [showPassword, setShowPassword] = useState(false);
  const { signup, isSigningUp, authUser } = useAuthStore();
  const [confirmPassword, setConfirmPassword] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    if (formData.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    signup(formData);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-start justify-center bg-base-200 py-6 px-3">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body p-6 sm:p-7">
          <h2 className="text-xl sm:text-2xl font-bold text-center">
            Create Account
          </h2>

          <form className="space-y-3 mt-2" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="label py-1">
                <span className="label-text text-sm">Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="input input-bordered w-full h-10 text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="label py-1">
                <span className="label-text text-sm">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="input input-bordered w-full h-10 text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="label py-1">
                <span className="label-text text-sm">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="input input-bordered w-full h-10 text-sm"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label py-1">
                <span className="label-text text-sm">Confirm Password</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="input input-bordered w-full h-10 text-sm"
              />
            </div>

            {/* Register Button */}
            <button
              className="btn btn-primary w-full mt-2 h-10 text-sm"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>


          {/* Divider */}
          <div className="divider my-3 text-xs">OR</div>

          {/* Login */}
          <p className="text-center text-xs sm:text-sm">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
