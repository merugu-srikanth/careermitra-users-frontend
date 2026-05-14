"use client";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import loginImg from "../assets/bg-images/Login.webp";
import AnimatedBg from "../components/Animate";
import SEO from "../components/SEO";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = async () => {
    if (!email) {
      setError("Please enter your registered email");
      return;
    }
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    if (!password || !confirmPassword) {
      setError("Please fill in both password fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await resetPassword({
        email,
        otp,
        new_password: password,
      });

      if (res?.status) {
        toast.success("Password reset successfully! Please login. ??");
        navigate("/login");
      } else {
        setError(res?.message || "Failed to reset password. Please try again.");
      }
    } catch {
      setError("Password reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleReset();
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-20">
      <SEO
        title="Reset Password | Career Mitra"
        description="Reset your Career Mitra account password securely using OTP verification."
        keywords="reset password, forgot password, otp reset, career mitra"
        image="/NewLogo.png"
        url="https://careermitra.in/reset-password"
      />
      <AnimatedBg />

      <div className="max-w-7xl bg-white rounded-2xl shadow-xl grid md:grid-cols-2 overflow-hidden relative z-10">
        <div className="hidden md:flex items-center justify-center p-8">
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={loginImg}
              alt="Reset Password"
              className="object-contain max-h-[500px] w-full rounded-3xl shadow-2xl shadow-orange-200"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/500x500?text=Reset+Password";
              }}
            />
          </div>
        </div>

        <div className="p-10 flex flex-col justify-center bg-white">
          <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Reset Password</h2>
          <p className="text-gray-500 text-center mb-6">Enter email, OTP, and your new password</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Registered Email"
            className="w-full py-2 px-3 border rounded-xl mb-3 focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition"
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            value={email}
          />

          <input
            type="text"
            placeholder="6-digit OTP"
            maxLength="6"
            className="w-full py-2 px-3 border rounded-xl mb-3 text-center tracking-[0.4em] font-mono focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition"
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            onKeyPress={handleKeyPress}
            value={otp}
          />

          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              className="w-full py-2 px-3 pr-10 border rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition"
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              value={password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="relative mb-6">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              className="w-full py-2 px-3 pr-10 border rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition"
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              value={confirmPassword}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            onClick={handleReset}
            disabled={loading}
            className={`w-full bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <button
            onClick={() => navigate("/login")}
            className="w-full text-gray-600 p-3 rounded-xl hover:bg-gray-50 transition mt-2"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
