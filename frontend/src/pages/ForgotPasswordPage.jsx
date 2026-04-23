import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send } from "lucide-react";
import useAuthStore from "../store/useAuthStore";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const { forgotPassword, isForgottingPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6 md:p-8">
        <Link to="/login" className="btn btn-ghost btn-sm rounded-xl mb-4">
          <ArrowLeft size={16} />
          Back to Login
        </Link>

        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Mail size={24} />
          </div>
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-base-content/60 mt-2">
            Enter your email address and we will send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label font-medium">Email Address</label>
            <input
              type="email"
              className="input input-bordered w-full"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full rounded-xl"
            disabled={isForgottingPassword}
          >
            {isForgottingPassword ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <Send size={18} />
                Send Reset Link
              </>
            )}
          </button>
        </form>

        <p className="text-sm text-base-content/60 text-center mt-6">
          Remember your password?{" "}
          <Link to="/login" className="text-primary font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
