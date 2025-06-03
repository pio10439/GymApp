import React from "react";
import { fireEvent, render, waitFor, act } from "@testing-library/react-native";
import { Alert } from "react-native";
import SettingScreen from "../src/screens/SettingsScreen";
import { UserContext } from "../src/context/UserContext";
import { AuthContext } from "../src/context/AuthContext";

const mockLogout = jest.fn();
const mockSaveUserData = jest.fn();

const mockUserData = {
  height: "190",
  weight: "90",
  age: "28",
  goal: "Gain mass",
};

const renderWithContexts = (userData = mockUserData) => {
  return render(
    <AuthContext.Provider value={{ logout: mockLogout }}>
      <UserContext.Provider
        value={{ userData, saveUserData: mockSaveUserData }}
      >
        <SettingScreen />
      </UserContext.Provider>
    </AuthContext.Provider>
  );
};
describe("SettingsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //1.Render user data
  it("renders with user data", () => {
    const { getByDisplayValue } = renderWithContexts();

    expect(getByDisplayValue("190")).toBeTruthy();
    expect(getByDisplayValue("90")).toBeTruthy();
    expect(getByDisplayValue("28")).toBeTruthy();
    expect(getByDisplayValue("Gain mass")).toBeTruthy();
  });
  //2.Height alert
  it("shows alert when height is invalid", () => {
    const { getByTestId, getByText } = renderWithContexts();
    fireEvent.changeText(getByTestId("height-input"), "20");
    fireEvent.press(getByText("Save"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Enter the correct height in cm (80-250)"
    );
  });
  //3.Weight alert
  it("shows alert when weight is invalid", () => {
    const { getByTestId, getByText } = renderWithContexts();
    fireEvent.changeText(getByTestId("weight-input"), "20");
    fireEvent.press(getByText("Save"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Enter the correct weight in kg (30-300)"
    );
  });
  //4.Age alert
  it("shows alert when age is invalid", () => {
    const { getByTestId, getByText } = renderWithContexts();
    fireEvent.changeText(getByTestId("age-input"), "5");
    fireEvent.press(getByText("Save"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Please enter correct age (10-120 years)"
    );
  });
  //5.Goal alert
  it("shows alert when goal is empty", () => {
    const { getByTestId, getByText } = renderWithContexts();
    fireEvent.changeText(getByTestId("goal-input"), "");
    fireEvent.press(getByText("Save"));

    expect(Alert.alert).toHaveBeenCalledWith("Goal cannot be empty");
  });
  //6.Save user data
  it("save user data when input is valid", async () => {
    const { getByText } = renderWithContexts();
    await act(async () => {
      fireEvent.press(getByText("Save"));
    });
    await waitFor(() => {
      expect(mockSaveUserData).toHaveBeenCalledWith({
        ...mockUserData,
      });
      expect(Alert.alert).toHaveBeenCalledWith("Data has been saved 😄");
    });
  });
  //7.Logout
  it("calls logout when logut button is pressed", () => {
    const { getByText } = renderWithContexts();
    fireEvent.press(getByText("Logout"));

    expect(mockLogout).toHaveBeenCalled();
  });
  //8.Render loading....
  it("renders loading when data is null", () => {
    const { getByText } = renderWithContexts(null);

    expect(getByText("Loading user data...")).toBeTruthy();
  });
  //Saving error
  it("shows error if saving fails", async () => {
    const mockFailSave = jest.fn(() => {
      throw new Error("Failed");
    });
    const { getByText } = render(
      <AuthContext.Provider value={{ logout: mockLogout }}>
        <UserContext.Provider
          value={{ userData: mockUserData, saveUserData: mockFailSave }}
        >
          <SettingScreen />
        </UserContext.Provider>
      </AuthContext.Provider>
    );
    await act(async () => {
      fireEvent.press(getByText("Save"));
    });
    expect(Alert.alert).toHaveBeenCalledWith(
      "Error",
      "Failed to save user data"
    );
  });
});
