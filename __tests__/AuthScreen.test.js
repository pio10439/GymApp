import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import AuthScreen from "../src/screens/AuthScreen";
import { AuthContext } from "../src/context/AuthContext";

describe("AuthScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //1.Register
  it("should register a new user and show success message", async () => {
    const mockRegister = jest.fn().mockResolvedValue({
      success: true,
      message: "Registration successful. You can now log in.",
    });

    const mockLogin = jest.fn();

    const { getByText, getByTestId } = render(
      <AuthContext.Provider
        value={{ login: mockLogin, register: mockRegister }}
      >
        <AuthScreen />
      </AuthContext.Provider>
    );

    fireEvent.press(getByText("Create an account"));

    fireEvent.changeText(getByTestId("loginInput"), "testuser");
    fireEvent.changeText(getByTestId("passwordInput"), "password123");

    fireEvent.press(getByText("Sign up"));

    await waitFor(() =>
      expect(
        getByText("Registration successful. You can now log in.")
      ).toBeTruthy()
    );

    expect(mockRegister).toHaveBeenCalledWith("testuser", "password123");
  });
  //2.Login
  it("should login a user successfully and not show error message", async () => {
    const mockLogin = jest.fn().mockResolvedValue({ success: true });
    const mockRegister = jest.fn();

    const { getByText, getByTestId, queryByText } = render(
      <AuthContext.Provider
        value={{ login: mockLogin, register: mockRegister }}
      >
        <AuthScreen />
      </AuthContext.Provider>
    );
    fireEvent.changeText(getByTestId("loginInput"), "testuser");
    fireEvent.changeText(getByTestId("passwordInput"), "password123");

    fireEvent.press(getByText("Sign in"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("testuser", "password123");
      expect(queryByText(/error/i)).toBeNull();
    });
  });
  //3.Registration error
  it("should show error message on failed registration", async () => {
    const mockRegister = jest.fn().mockResolvedValue({
      success: false,
      error: "User already exists",
    });

    const mockLogin = jest.fn();

    const { getByText, getByTestId } = render(
      <AuthContext.Provider
        value={{ login: mockLogin, register: mockRegister }}
      >
        <AuthScreen />
      </AuthContext.Provider>
    );

    fireEvent.press(getByText("Create an account"));

    fireEvent.changeText(getByTestId("loginInput"), "existinguser");
    fireEvent.changeText(getByTestId("passwordInput"), "password123");

    fireEvent.press(getByText("Sign up"));

    const errorMessage = await waitFor(() => getByText("User already exists"));
    expect(errorMessage).toBeTruthy();
  });
  //4.Toggle reg & log
  it("should toggle between Login and Register views", async () => {
    const { getByText, queryByText } = render(
      <AuthContext.Provider value={{ login: jest.fn(), register: jest.fn() }}>
        <AuthScreen />
      </AuthContext.Provider>
    );

    expect(getByText("Login")).toBeTruthy();

    fireEvent.press(getByText("Create an account"));

    expect(getByText("Register")).toBeTruthy();
    expect(getByText("Sign up")).toBeTruthy();

    fireEvent.press(getByText("I have an account"));

    expect(getByText("Login")).toBeTruthy();
    expect(queryByText("Sign up")).toBeNull();
  });
  //5.Input reset
  it("should clear username and password after switching between login and register", async () => {
    const { getByText, getByTestId } = render(
      <AuthContext.Provider value={{ login: jest.fn(), register: jest.fn() }}>
        <AuthScreen />
      </AuthContext.Provider>
    );

    fireEvent.changeText(getByTestId("loginInput"), "testuser");
    fireEvent.changeText(getByTestId("passwordInput"), "password123");

    fireEvent.press(getByText("Create an account"));

    expect(getByTestId("loginInput").props.value).toBe("");
    expect(getByTestId("passwordInput").props.value).toBe("");
  });
});
