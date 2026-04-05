"use client";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import loginImg from "../assets/bg-images/Login.png";
import { Link, useNavigate } from "react-router-dom";
import AnimatedBg from "../components/Animate";

export default function Register() {
  const { register, verifyRegisterOtp, loading } = useAuth();
  const navigate = useNavigate();

  // Registration form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [jobType, setJobType] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  
  // OTP state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  
  const inputRefs = useRef([]);

  // Timer effect
  useEffect(() => {
    if (!showOtpModal) return;
    
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timer, showOtpModal]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle OTP key press (backspace)
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste event
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedNumbers = pastedData.replace(/\D/g, "").slice(0, 6);
    
    if (pastedNumbers) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedNumbers.length; i++) {
        newOtp[i] = pastedNumbers[i];
      }
      setOtp(newOtp);
      
      // Focus on the next empty input or last input
      const nextIndex = Math.min(pastedNumbers.length, 5);
      if (nextIndex <= 5) {
        inputRefs.current[nextIndex]?.focus();
      }
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      setOtpError("Please enter complete 6-digit OTP");
      return;
    }
    
    setOtpError("");
    
    try {
      const res = await verifyRegisterOtp(registeredEmail, otpString);
      
      if (res?.status) {
        alert("Account created successfully! 🎉 Please login.");
        navigate("/login");
      } else {
        setOtpError(res?.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setOtpError("OTP verification failed. Please try again.");
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setTimer(300);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    
    // Resend OTP by calling register API again
    const registrationData = {
      name: name,
      email: registeredEmail,
      password: password,
      password_confirmation: confirmPassword,
      interested_in: jobType,
    };
    
    try {
      const res = await register(registrationData);
      if (res?.status) {
        alert("OTP resent successfully! 📧");
      } else {
        setOtpError(res?.message || "Failed to resend OTP");
      }
    } catch (err) {
      setOtpError("Failed to resend OTP");
    }
  };

  // Handle registration
  const handleRegister = async () => {
    // Validation
    if (!name || !phone || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // if (!jobType) {
    //   setError("Please select your interest (Govt Jobs or IT Jobs)");
    //   return;
    // }

    if (!agreeTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    setError("");
    
    // Prepare registration data
    const registrationData = {
      name: name,
      email: email,
      phone: phone,
      password: password,
      password_confirmation: confirmPassword,
      interested_in: jobType,
    };

    try {
      const res = await register(registrationData);
      
      if (res?.status) {
        setRegisteredEmail(email);
        setShowOtpModal(true);
        setTimer(300);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
      } else {
        setError(res?.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-20">
      {/* Animated Background */}
      <AnimatedBg />
      
      {/* Main Container */}
      <div className="max-w-7xl bg-white rounded-2xl shadow-xl grid md:grid-cols-2 overflow-hidden relative z-10">
        
        {/* LEFT SIDE IMAGE */}
        <div className="hidden md:flex items-center justify-center p-8">
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={loginImg}
              alt="Register illustration"
              className="object-contain max-h-[500px] w-full rounded-3xl shadow-2xl shadow-orange-200"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/500x500?text=Register+Image";
              }}
            />
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="p-10 flex flex-col justify-center bg-white">
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Register</h2>
          <p className="text-gray-500 text-center mb-6">
            Create your account to get started
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full py-2 px-3 border rounded-xl mb-3 focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition"
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            value={name}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full py-2 px-3 border rounded-xl mb-3 focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition"
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            value={email}
          />
          {/* Email */}
          <input
            type="number"
            placeholder="Phone Number"
            className="w-full py-2 px-3 border rounded-xl mb-3 focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition"
            onChange={(e) => setPhone(e.target.value)}
            onKeyPress={handleKeyPress}
            value={phone}
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

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full py-2 px-3 border rounded-xl mb-4 focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-orange-400 transition"
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            value={confirmPassword}
          />

          {/* Radio Options - Card Style */}
          {/* <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-green-500 rounded-full"></div>
              <span className="text-gray-800 font-semibold text-xl">Are You Interested In?</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="relative group">
                <input
                  type="radio"
                  name="job"
                  value="govt"
                  onChange={(e) => setJobType(e.target.value)}
                  className="absolute opacity-0 w-full h-full cursor-pointer z-10"
                />
                <div className="p-4 rounded-xl border-2 border-gray-200 group-hover:border-orange-400 group-hover:bg-orange-50 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="w-6 h-6 rounded-full border-2 border-orange-400 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-orange-500 opacity-0 transition-opacity" 
                           style={{ opacity: jobType === 'govt' ? 1 : 0 }}></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🏛️</span>
                      <span className="font-bold text-gray-800">Govt Jobs</span>
                    </div>
                  </div>
                </div>
              </label>

              <label className="relative group">
                <input
                  type="radio"
                  name="job"
                  value="it"
                  onChange={(e) => setJobType(e.target.value)}
                  className="absolute opacity-0 w-full h-full cursor-pointer z-10"
                />
                <div className="p-4 rounded-xl border-2 border-gray-200 group-hover:border-green-400 group-hover:bg-green-50 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="w-6 h-6 rounded-full border-2 border-green-400 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 opacity-0 transition-opacity"
                           style={{ opacity: jobType === 'it' ? 1 : 0 }}></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">💻</span>
                      <span className="font-bold text-gray-800">IT Jobs</span>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div> */}

          {/* Terms and Conditions */}
          <div className="flex items-center gap-2 mb-6">
            <input 
              type="checkbox" 
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-400" 
              id="terms" 
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the{" "}
              <span className="text-orange-500 cursor-pointer hover:text-orange-600">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-orange-500 cursor-pointer hover:text-orange-600">
                Privacy Policy
              </span>
            </label>
          </div>

          {/* Button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className={`w-full bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 transition ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Sending OTP...' : 'Register'}
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

          {/* Login Link */}
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium transition">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* OTP Modal Overlay */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative animate-fadeIn">
            {/* Close button */}
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Verify OTP</h3>
              <p className="text-gray-600 text-sm">
                Please enter the 6-digit verification code sent to
              </p>
              <p className="text-orange-600 font-semibold text-sm mt-1">
                {registeredEmail}
              </p>
            </div>

            {otpError && (
              <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
                {otpError}
              </div>
            )}

            {/* Timer */}
            <div className="text-center mb-4">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${timer <= 60 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-mono font-bold">{formatTime(timer)}</span>
                <span>remaining</span>
              </div>
            </div>

            {/* 6 OTP Boxes */}
            <div className="flex gap-3 justify-center mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={index === 0 ? handleOtpPaste : undefined}
                  className="w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-bold border-2 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
                  style={{
                    borderColor: otpError ? '#ef4444' : '#e5e7eb',
                  }}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className={`w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition mb-3 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify & Create Account'
              )}
            </button>

            {/* Resend Section */}
            <div className="text-center">
              {canResend ? (
                <button
                  onClick={handleResendOtp}
                  className="text-orange-500 hover:text-orange-600 font-medium transition hover:underline"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-gray-500 text-sm">
                  Didn't receive the code?{" "}
                  <span className="text-gray-400">
                    Resend available in {formatTime(timer)}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}