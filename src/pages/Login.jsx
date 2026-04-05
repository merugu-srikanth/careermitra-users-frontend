"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import loginImg from "../assets/bg-images/Login.png";
import { Link, useNavigate } from "react-router-dom";
import AnimatedBg from "../components/Animate";

export default function Login() {
  const { loginWithPassword, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState("login"); // login | otp
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // 🔐 PASSWORD LOGIN
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setError("");
    setLoading(true);
    
    try {
      const res = await loginWithPassword(email, password);
      if (!res?.status) {
        setError(res?.message || "Login failed");
      } else {
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
        alert("Login Successful! 🎉");
        navigate("/user-dashboard");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 📩 SEND OTP
  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setError("");
    setLoading(true);
    
    try {
      const res = await sendOtp(email);
      if (!res?.status) {
        setError(res?.message || "Email not registered");
      } else {
        setStep("otp");
        alert("OTP sent successfully! 📧");
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ VERIFY OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setError("");
    setLoading(true);
    
    try {
      const res = await verifyOtp(email, otp);
      if (!res?.token) {
        setError("Invalid OTP. Please try again");
      } else {
        alert("OTP Login Successful! 🎉");
        navigate("/user-dashboard");
      }
    } catch (err) {
      setError("OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (step === "login") {
        handleLogin();
      } else {
        handleVerifyOtp();
      }
    }
  };

  // Load remembered email
  useState(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen relative flex items-center justify-center py-20">
      {/* Animated Background */}
      <AnimatedBg />
      
      {/* Main Container - Same dimensions as Register page */}
      <div className="max-w-7xl bg-white rounded-2xl shadow-xl grid md:grid-cols-2 overflow-hidden relative z-10">
        
        {/* LEFT SIDE IMAGE */}
        <div className="hidden md:flex items-center justify-center p-8">
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={loginImg}
              alt="Login illustration"
              className="object-contain max-h-[500px] w-full rounded-3xl shadow-2xl shadow-orange-200"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/500x500?text=Login+Image";
              }}
            />
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="p-10 flex flex-col justify-center bg-white">
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Login</h2>
          <p className="text-gray-500 text-center mb-6">
            {step === "login" 
              ? "Enter your credentials to access your account" 
              : "Enter the OTP sent to your email"}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* PASSWORD LOGIN STEP */}
          {step === "login" && (
            <>
              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                className="w-full py-2 px-3 border rounded-xl mb-3 focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition"
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                value={email}
              />

              {/* Password */}
              <input
                type="password"
                placeholder="Password"
                className="w-full py-2 px-3 border rounded-xl mb-3 focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition"
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                value={password}
              />

              {/* Remember + Forgot */}
              <div className="flex justify-between items-center text-sm mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-400" 
                  /> 
                  <span className="text-gray-600">Remember me</span>
                </label>
                <span className="text-orange-500 cursor-pointer hover:text-orange-600 transition">
                  Forgot Password?
                </span>
              </div>

              {/* Button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className={`w-full bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 transition ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-400">or</span>
                </div>
              </div>

              {/* OTP Login Button */}
              <button
                onClick={handleSendOtp}
                className="w-full bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition"
              >
                Login with OTP
              </button>
            </>
          )}

          {/* OTP STEP */}
          {step === "otp" && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full py-2 px-3 border rounded-xl mb-3 focus:ring-2 focus:ring-green-400 focus:outline-none focus:border-green-400 transition text-center text-2xl tracking-widest"
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                onKeyPress={handleKeyPress}
                value={otp}
                maxLength="6"
              />

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className={`w-full bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                onClick={() => {
                  setStep("login");
                  setOtp("");
                  setError("");
                }}
                className="w-full text-gray-600 p-3 rounded-xl hover:bg-gray-50 transition mt-2"
              >
                ← Back to Login
              </button>
            </>
          )}

          {/* Register Link */}
          <p className="text-sm text-center mt-6 text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-orange-500 hover:text-orange-600 font-medium transition">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}