import { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

const DEFAULT_API_BASE_URL = "https://careermitra.tech";
const API_BASE = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");
const API = `${API_BASE}/api`;
const AUTH_API = `${API_BASE}/api/auth`;
const PENDING_REGISTER_KEY = "pendingRegisterCredentials";
const PENDING_REGISTER_TOKEN_KEY = "pendingRegisterToken";

const OTP_PURPOSE = {
  EMAIL_VERIFICATION: "email_verification",
  LOGIN: "login",
  FORGOT_PASSWORD: "forgot-password",
};

const normalizeAuthResponse = (data, fallbackMessage = "Request successful") => {
  const token =
    data?.token ||
    data?.accessToken ||
    data?.access_token ||
    data?.data?.token ||
    data?.data?.accessToken ||
    data?.user?.token ||
    null;

  const user = data?.user || data?.data?.user || data?.data || null;
  const explicitStatus = data?.status ?? data?.success;

  return {
    ...data,
    status: typeof explicitStatus === "boolean" ? explicitStatus : true,
    message: data?.message || fallbackMessage,
    token,
    user,
  };
};

const normalizeAuthError = (err, fallbackMessage) => ({
  ...(err.response?.data || {}),
  status: false,
  message: err.response?.data?.message || fallbackMessage,
});

const readPendingRegisterCredentials = () => {
  try {
    const raw = localStorage.getItem(PENDING_REGISTER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  const storePendingRegisterCredentials = (email, password) => {
    if (!email || !password) return;
    localStorage.setItem(PENDING_REGISTER_KEY, JSON.stringify({ email, password }));
  };

  const clearPendingRegisterCredentials = () => {
    localStorage.removeItem(PENDING_REGISTER_KEY);
    localStorage.removeItem(PENDING_REGISTER_TOKEN_KEY);
  };

  const getPendingRegisterCredentials = () => readPendingRegisterCredentials();

  // 🔐 LOGIN WITH PASSWORD
  const loginWithPassword = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${AUTH_API}/login`, { email, password });
      const data = normalizeAuthResponse(res.data, "Login successful");
      const loginData = data.token
        ? data
        : { ...data, status: false, message: data.message || "Login token missing" };

      if (loginData.status) {
        setToken(loginData.token);
        localStorage.setItem("token", loginData.token);
        setUser(loginData.user || { email });
        toast.success("Login successful");
      } else {
        toast.error(loginData.message || "Login failed");
      }

      return loginData;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      return normalizeAuthError(err, "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const loginPendingRegisteredUser = async (fallbackEmail, fallbackPassword) => {
    const stored = getPendingRegisterCredentials();
    const email = fallbackEmail || stored?.email;
    const password = fallbackPassword || stored?.password;

    if (!email || !password) {
      return { status: false, message: "Registered user login details not found" };
    }

    const res = await loginWithPassword(email, password);
    if (res?.status) {
      clearPendingRegisterCredentials();
    }

    return res;
  };

  const requestOtpByPurpose = async ({ email, purpose, authToken }) => {
    setLoading(true);
    try {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      const res = await axios.post(
        `${AUTH_API}/request-otp`,
        { email, purpose },
        { headers }
      );

      return normalizeAuthResponse(res.data, "OTP sent successfully");
    } catch (err) {
      return normalizeAuthError(err, "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // 📩 SEND OTP (LOGIN)
  const sendOtp = async (email) => {
    return requestOtpByPurpose({ email, purpose: OTP_PURPOSE.LOGIN });
  };

  // ✅ VERIFY OTP (LOGIN)
  const verifyOtp = async (email, otp) => {
    setLoading(true);
    try {
      const res = await axios.post(`${AUTH_API}/login/verify-otp`, { email, otp });
      const data = normalizeAuthResponse(res.data, "Login successful");

      if (data.status && data.token) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setUser(data.user || { email });
      }

      return data;
    } catch (err) {
      return normalizeAuthError(err, "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // 📝 REGISTER
  const register = async (data) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        interest: data.interest || data.interested_in || "Govt Jobs",
        interested_in: data.interested_in || data.interest || "Govt Jobs",
      };

      const res = await axios.post(`${AUTH_API}/register`, payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const responseData = normalizeAuthResponse(res.data, "User registered successfully");

      if (responseData.status) {
        if (responseData.token) {
          localStorage.setItem(PENDING_REGISTER_TOKEN_KEY, responseData.token);
        }
        toast.success(responseData.message || "OTP sent");
      } else {
        toast.error(responseData.message);
      }

      return responseData;
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      return normalizeAuthError(err, "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ VERIFY REGISTER OTP
  const verifyRegisterOtp = async (email, otp) => {
    setLoading(true);
    try {
      const pendingToken = localStorage.getItem(PENDING_REGISTER_TOKEN_KEY);
      const res = await axios.post(
        `${AUTH_API}/email-verification`,
        { otp },
        {
          headers: pendingToken
            ? {
                Authorization: `Bearer ${pendingToken}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              }
            : {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
        }
      );
      const data = normalizeAuthResponse(res.data, "Email verified successfully");

      if (data.status) {
        const verifiedToken = data.token || pendingToken;
        if (verifiedToken) {
          setToken(verifiedToken);
          localStorage.setItem("token", verifiedToken);
        }
        if (data.user) {
          setUser(data.user);
        }
        localStorage.removeItem(PENDING_REGISTER_TOKEN_KEY);
        toast.success("Account created successfully");
      } else {
        toast.error(data.message);
      }

      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
      return normalizeAuthError(err, "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // 🔑 FORGOT PASSWORD
  const forgotPassword = async (email) => {
    return requestOtpByPurpose({ email, purpose: OTP_PURPOSE.FORGOT_PASSWORD });
  };

  // 🔄 RESET PASSWORD
  const resetPassword = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(`${AUTH_API}/forgot-password/reset`, {
        email: data.email,
        otp: data.otp,
        new_password: data.new_password,
      });

      return normalizeAuthResponse(res.data, "Password reset successfully");
    } catch (err) {
      return normalizeAuthError(err, "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  const requestRegisterEmailVerificationOtp = async (email) => {
    const pendingToken = localStorage.getItem(PENDING_REGISTER_TOKEN_KEY);
    return requestOtpByPurpose({
      email,
      purpose: OTP_PURPOSE.EMAIL_VERIFICATION,
      authToken: pendingToken,
    });
  };

  // � CHECK PROFILE COMPLETION
  const checkProfile = async (authToken) => {
    try {
      const res = await axios.get(`${API}/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.data?.status) return false;
      const ed = res.data.data?.education || {};
      return !!(
        ed.qualification_level ||
        ed.tenth?.board ||
        ed.intermediate?.course ||
        ed.graduation?.course ||
        ed.iti?.trade ||
        ed.post_graduation?.course
      );
    } catch {
      return false;
    }
  };

  // �🚪 LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem(PENDING_REGISTER_TOKEN_KEY);
    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loginWithPassword,
        loginPendingRegisteredUser,
        sendOtp,
        verifyOtp,
        register,
        verifyRegisterOtp,
        requestRegisterEmailVerificationOtp,
        forgotPassword,
        resetPassword,
        logout,
        checkProfile,
        storePendingRegisterCredentials,
        clearPendingRegisterCredentials,
        getPendingRegisterCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
