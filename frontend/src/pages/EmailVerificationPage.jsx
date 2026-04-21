import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import toast from "react-hot-toast";

export default function EmailVerificationPage() {
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  const {
    authUser,
    verifyEmail,
    resendVerificationCode,
    isVerifyingEmail,
    isResendingCode,
    verificationExpiresAt,
    clearExpiredUser,
  } = useAuthStore();

  useEffect(() => {
    if (!verificationExpiresAt) return;

    const updateCountdown = () => {
      const diff = Math.max(
        0,
        Math.floor((new Date(verificationExpiresAt) - new Date()) / 1000),
      );

      setTimeLeft(diff);

      if (diff <= 0) {
        clearExpiredUser();
        toast.error("Verification time expired. Please register again.");
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [verificationExpiresAt, clearExpiredUser]);

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await verifyEmail({
      email: authUser.email,
      code,
    });
  };

  const handleResend = async () => {
    await resendVerificationCode(authUser.email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Verify Your Email</h2>

          <p className="text-center text-sm text-base-content/70">
            Enter the 6-digit verification code sent to{" "}
            <span className="font-medium">{authUser.email}</span>
          </p>

          <p className="text-center text-sm font-semibold text-error mt-2">
            Time left: {timeLeft}s
          </p>

          <form className="space-y-5 mt-4" onSubmit={handleSubmit}>
            <div>
              <label className="label">
                <span className="label-text">Verification Code</span>
              </label>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="input input-bordered w-full text-center text-lg tracking-[0.5em]"
                disabled={timeLeft === 0}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isVerifyingEmail || timeLeft === 0}
            >
              {isVerifyingEmail ? "Verifying..." : "Verify Code"}
            </button>
          </form>

          <div className="text-center text-sm mt-4 space-y-2">
            <p className="text-base-content/70">Didn’t receive the code?</p>

            <button
              type="button"
              onClick={handleResend}
              className="btn btn-link p-0 min-h-0 h-auto"
              disabled={isResendingCode}
            >
              {isResendingCode ? "Sending..." : "Resend Code"}
            </button>
          </div>

          <p className="text-center text-sm mt-2">
            Back to
            <Link to="/login" className="link link-primary ml-1">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
