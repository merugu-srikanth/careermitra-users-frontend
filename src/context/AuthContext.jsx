import { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

const API = "https://careermitra.in/api/public/api";
const PENDING_REGISTER_KEY = "pendingRegisterCredentials";

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
  };

  const getPendingRegisterCredentials = () => readPendingRegisterCredentials();

  // 🔐 LOGIN WITH PASSWORD
  const loginWithPassword = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/user/login`, { email, password });

      if (res.data.status) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user || { email });
        toast.success("Login successful");
      } else {
        toast.error(res.data.message);
      }

      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      return err.response?.data || { status: false };
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

  // 📩 SEND OTP (LOGIN)
  const sendOtp = async (email) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/login`, { email });
      toast.success(res.data.message || "OTP sent");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
      return err.response?.data || { status: false };
    } finally {
      setLoading(false);
    }
  };

  // ✅ VERIFY OTP (LOGIN)
  const verifyOtp = async (email, otp) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/verify-otp`, { email, otp });

      if (res.data.token) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        setUser({ email });
        toast.success("Login successful");
      } else {
        toast.error(res.data.message);
      }

      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
      return err.response?.data || { status: false };
    } finally {
      setLoading(false);
    }
  };

  // 📝 REGISTER
  const register = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/register`, data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (res.data.status) {
        toast.success(res.data.message || "OTP sent");
      } else {
        toast.error(res.data.message);
      }

      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      return err.response?.data || { status: false };
    } finally {
      setLoading(false);
    }
  };

  // ✅ VERIFY REGISTER OTP
  const verifyRegisterOtp = async (email, otp) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/verify-register-otp`, {
        email,
        otp,
      });

      if (res.data.status) {
        toast.success("Account created successfully");
      } else {
        toast.error(res.data.message);
      }

      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
      return err.response?.data || { status: false };
    } finally {
      setLoading(false);
    }
  };

  // 🔑 FORGOT PASSWORD
  const forgotPassword = async (email) => {
    try {
      const res = await axios.post(`${API}/forgot-password`, { email });
      toast.success(res.data.message);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset email");
      return err.response?.data || { status: false };
    }
  };

  // 🔄 RESET PASSWORD
  const resetPassword = async (data) => {
    try {
      const res = await axios.post(`${API}/reset-password`, data);
      toast.success(res.data.message);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
      return err.response?.data || { status: false };
    }
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