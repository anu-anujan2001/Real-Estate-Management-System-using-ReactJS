import React, { useState } from "react";
import useAuthStore from "../store/useAuthStore";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const { login, isLoggingIn } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-start justify-center bg-base-200 py-6 px-3">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body p-6 sm:p-7">
          <h2 className="text-xl sm:text-2xl font-bold text-center">Login</h2>

          <form className="space-y-3 mt-2" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="label py-1">
                <span className="label-text text-sm">Email</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
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
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter your password"
                className="input input-bordered w-full h-10 text-sm"
              />

              <div className="flex justify-end mt-1">
                <Link to="/forgot-password" className="text-xs link link-hover">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                />
                <span>Remember me</span>
              </label>
            </div>

            {/* Login Button */}
            <button
              className="btn btn-primary w-full mt-2 h-10 text-sm"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider my-3 text-xs">OR</div>

          {/* Google */}
          <button className="btn btn-outline w-full h-10 text-sm">
            Continue with Google
          </button>

          {/* Register */}
          <p className="text-center text-xs sm:text-sm mt-3">
            Don’t have an account?{" "}
            <Link to="/signup" className="link link-primary">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
