import { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

const API = "https://g2u.mavenerp.in/g2uapi/public/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

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

  // 🚪 LOGOUT
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
        sendOtp,
        verifyOtp,
        register,
        verifyRegisterOtp,
        forgotPassword,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);