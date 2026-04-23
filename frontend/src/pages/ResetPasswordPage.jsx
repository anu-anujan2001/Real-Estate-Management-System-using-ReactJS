import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";
import useAuthStore from "../store/useAuthStore";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { resetPassword, isResettingPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return;
    }

    const result = await resetPassword(token, newPassword);

    if (result.success) {
      navigate("/login");
    }
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
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-base-content/60 mt-2">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label font-medium">New Password</label>
            <input
              type="password"
              className="input input-bordered w-full"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="label font-medium">Confirm Password</label>
            <input
              type="password"
              className="input input-bordered w-full"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-error text-sm mt-2">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full rounded-xl"
            disabled={
              isResettingPassword ||
              !newPassword ||
              !confirmPassword ||
              newPassword !== confirmPassword
            }
          >
            {isResettingPassword ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
