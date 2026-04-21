import React, { useState } from "react";
import useAuthStore from "../store/useAuthStore";
import {Loader2} from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Login</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter your email"
                className="input input-bordered w-full"
              />
            </div>

            {/* Password */}
            <div>
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter your password"
                className="input input-bordered w-full"
              />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="cursor-pointer label">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary mr-2"
                />
                <span className="label-text">Remember me</span>
              </label>
            </div>

            {/* Login Button */}
            <button className="btn btn-primary w-full" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">OR</div>

          {/* Social Login */}
          <button className="btn btn-outline w-full disabled:*:">
            Continue with Google
          </button>

          {/* Register Link */}
          <p className="text-center text-sm mt-4">
            Don’t have an account?{" "}
            <a href="#" className="link link-primary">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
