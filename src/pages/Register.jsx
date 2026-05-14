"use client";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import loginImg from "../assets/bg-images/Login.webp";
import { Link, useNavigate } from "react-router-dom";
import AnimatedBg from "../components/Animate";
import SEO from "../components/SEO";
import { toast } from "react-toastify";

export default function Register() {
  const { register, verifyRegisterOtp, requestRegisterEmailVerificationOtp, loginPendingRegisteredUser, checkProfile, storePendingRegisterCredentials, loading } = useAuth();
  const navigate = useNavigate();

  // Registration form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [jobType, setJobType] = useState("Both");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  
  // OTP state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showRegisterSuccessModal, setShowRegisterSuccessModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [autoLoginLoading, setAutoLoginLoading] = useState(false);
  
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
        toast.success("Account created successfully! 🎉");
        setShowOtpModal(false);
        setShowRegisterSuccessModal(true);
      } else {
        setOtpError(res?.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setOtpError("OTP verification failed. Please try again.");
    }
  };

  const handleGoToLogin = async () => {
    setAutoLoginLoading(true);
    setShowRegisterSuccessModal(false);

    try {
      const res = await loginPendingRegisteredUser(registeredEmail, password);

      if (!res?.status) {
        navigate("/login", {
          state: {
            email: registeredEmail,
            autoLoginNewUser: true,
          },
        });
        return;
      }

      const profileComplete = await checkProfile(res.token);
      if (profileComplete) {
        navigate("/");
      } else {
        navigate("/user-profile-filling", { state: { email: registeredEmail } });
      }
    } finally {
      setAutoLoginLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setTimer(300);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    
    try {
      const res = await requestRegisterEmailVerificationOtp(registeredEmail);
      if (res?.status) {
        toast.success("OTP resent successfully! 📧");
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

    if (!["Govt Jobs", "IT Jobs", "Both"].includes(jobType)) {
      setError("Please select your interest (Govt Jobs, IT Jobs, or Both)");
      return;
    }

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
      interest: jobType,
      interested_in: jobType,
    };

    try {
      const res = await register(registrationData);
      
      if (res?.status) {
        storePendingRegisterCredentials(email, password);
        localStorage.setItem("registerEmail", email);
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
      <SEO
        title="Register | Career Mitra"
        description="Create your Career Mitra account to receive personalized government job and internship alerts."
        keywords="career mitra register, sign up, government jobs alerts, internship alerts"
        image="/NewLogo.png"
        url="https://careermitra.in/register"
      />
      {/* Animated Background */}
      <AnimatedBg />
      
      {/* Main Container */}
      <div className="max-w-7xl bg-white rounded-2xl shadow-xl grid md:grid-cols-2 overflow-hidden relative z-10">
        
        {/* LEFT SIDE IMAGE */}
        <div className="hidden md:flex items-center justify-center p-8">
          <div className="w-full h-full flex items-center justify-center md:shadow-[14px_0_24px_-16px_rgba(249,115,22,0.55)]">
            <img
              src={loginImg}
              alt="Register illustration"
              className="object-contain max-h-[400px] w-full rounded-3xl "
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
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative mb-4">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
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
              {showConfirmPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* Interest Selection */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2 shrink-0">
                <div className="w-1 h-5 bg-gradient-to-b from-orange-500 to-green-500 rounded-full"></div>
                <span className="text-gray-800 font-semibold whitespace-nowrap">Interested In</span>
              </div>
            <div className="flex items-center gap-3 flex-nowrap overflow-x-auto pb-1">
              

              <div className="grid grid-cols-3 gap-2 p-1 bg-gray-50 border border-gray-200 rounded-xl min-w-[360px] flex-1">
              <label className="relative">
                <input
                  type="radio"
                  name="job"
                  value="Govt Jobs"
                  onChange={(e) => setJobType(e.target.value)}
                  className="sr-only"
                  checked={jobType === "Govt Jobs"}
                />
                <div
                  className={`px-3 py-2 rounded-lg border text-sm font-semibold text-center cursor-pointer transition-all duration-200 ${
                    jobType === "Govt Jobs"
                      ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-200"
                      : "border-transparent text-gray-700 hover:bg-orange-50"
                  }`}
                >
                  Govt Jobs
                </div>
              </label>

              <label className="relative">
                <input
                  type="radio"
                  name="job"
                  value="IT Jobs"
                  onChange={(e) => setJobType(e.target.value)}
                  className="sr-only"
                  checked={jobType === "IT Jobs"}
                />
                <div
                  className={`px-3 py-2 rounded-lg border text-sm font-semibold text-center cursor-pointer transition-all duration-200 ${
                    jobType === "IT Jobs"
                      ? "border-green-500 bg-green-500 text-white shadow-md shadow-green-200"
                      : "border-transparent text-gray-700 hover:bg-green-50"
                  }`}
                >
                  IT Jobs
                </div>
              </label>

              <label className="relative">
                <input
                  type="radio"
                  name="job"
                  value="Both"
                  onChange={(e) => setJobType(e.target.value)}
                  className="sr-only"
                  checked={jobType === "Both"}
                />
                <div
                  className={`px-3 py-2 rounded-lg border text-sm font-semibold text-center cursor-pointer transition-all duration-200 ${
                    jobType === "Both"
                      ? "border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-200"
                      : "border-transparent text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  Both
                </div>
              </label>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center gap-2 mb-6">
            <input 
              type="checkbox" 
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 text-orange-500 rounded cursor-pointer border-gray-300 focus:ring-orange-400" 
              id="terms" 
            />
            <label htmlFor="terms" className="text-sm cursop text-gray-600">
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
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
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

      {/* Register Success Modal */}
      {showRegisterSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 flex flex-col items-center text-center animate-[fadeInUp_0.3s_ease]">
            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-5 shadow-inner">
              <span className="text-4xl">🎉</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Registration Successful
            </h2>

            <p className="text-gray-500 text-base leading-relaxed mb-2">
              Your account is ready. Proceed to  <span className="text-orange-500 font-semibold"> complete  your profile</span> to get
              <span className="text-orange-500 font-semibold"> personalised job alerts</span> {" "}
              on your dashboard.
            </p>

            <p className="text-gray-400 text-sm mb-8">
              It only takes a few minutes.
            </p>

            <button
              onClick={handleGoToLogin}
              disabled={autoLoginLoading}
              className="w-full py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition shadow-lg shadow-orange-200"
            >
              {autoLoginLoading ? "Signing you in..." : "Login and Fill Your Profile"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
