import Styles from "./Login.module.css";
import Logo from "../../assets/Logo.png";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAppContext from "../../context/useAppContext";
import api from "../../utils/axios";
import { showToast } from "../../utils/common";
const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const navigate = useNavigate();

  const { handleLoading } = useAppContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { username?: string; password?: string } = {};
    if (!form.username) newErrors.username = "User ID is required";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        handleLoading(true, "Logging in...");
        const result = await api.post("/user/login", form, {
          withCredentials: true,
        });
        showToast("success", "Logged in successfully!");
        sessionStorage.setItem("token", result.data.data?.token);
        navigate("/users");
      } catch (error) {
        showToast("error", error.response.data?.message || "Login failed!");
        console.log(error);
      } finally {
        handleLoading(false);
      }
    }
  };

  return (
    <>
      <div className={Styles.container}>
        <div>
          <img src={Logo} alt="InvoiceNest Logo" />
        </div>
        <form className={Styles.loginContainer} onSubmit={handleLogin}>
          <h2 className={Styles.welcome}>Welcome back!</h2>
          <div className={Styles.loginForm}>
            <h2>Log in</h2>
            <div className={Styles.inputContainer}>
              <label htmlFor="username">User Id</label>
              <input
                type="text"
                name="username"
                value={form.username}
                placeholder="Enter user id.."
                onChange={handleChange}
              />
              {errors.username && (
                <span className={Styles.error}>{errors.username}</span>
              )}
            </div>
            <div className={Styles.inputContainer}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                placeholder="Enter password.."
                onChange={handleChange}
              />
              {errors.password && (
                <span className={Styles.error}>{errors.password}</span>
              )}
            </div>
            <button type="submit">Log in</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
