import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const loggedInUser = await AsyncStorage.getItem("currentUser");
      if (loggedInUser) {
        setCurrentUser(loggedInUser);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Error checking login status", error);
    }
  };

  const login = async (username, password) => {
    if (!username || !password) {
      return { success: false, error: "Please fill in all fields" };
    }
    try {
      const users = JSON.parse(await AsyncStorage.getItem("users")) || {};
      if (!users[username] || users[username].password !== password) {
        return { success: false, error: "Invalid username or password" };
      }
      await AsyncStorage.setItem("currentUser", username);
      setCurrentUser(username);
      setIsLoggedIn(true);
      return { success: true };
    } catch (error) {
      console.error("Login error", error);
      return {
        success: false,
        error: "An error occured during login. Please try again later.",
      };
    }
  };
  const register = async (username, password) => {
    if (!username || !password) {
      return { success: false, error: "Please fill in all fields" };
    }
    try {
      const users = JSON.parse(await AsyncStorage.getItem("users")) || {};
      if (users[username]) {
        return { success: false, error: "User already exists" };
      }
      users[username] = { password, trainings: [] };
      await AsyncStorage.setItem("users", JSON.stringify(users));
      return {
        success: true,
        message: "Registration successful. You can now log in.",
      };
    } catch (error) {
      console.error("Registration error", error);
      return {
        success: false,
        error: "An error occured during registration. Please try again later.",
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("currentUser");
      setIsLoggedIn(false);
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, currentUser, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
