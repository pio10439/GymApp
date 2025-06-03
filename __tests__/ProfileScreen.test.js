import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import ProfileScreen from "../src/screens/ProfileScreen";
import { UserContext } from "../src/context/UserContext";

import * as ImagePicker from "expo-image-picker";
import * as Camera from "expo-camera";
import { Alert } from "react-native";
describe("ProfileScreen", () => {
  jest.mock("expo-image-picker");
  jest.mock("expo-camera");
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //1.User data
  it("renders user data correctly", () => {
    const mockUser = {
      height: 190,
      weight: 90,
      age: 28,
      goal: "Gain mass",
      photos: [],
    };

    const { getByText } = render(
      <UserContext.Provider value={{ userData: mockUser }}>
        <ProfileScreen />
      </UserContext.Provider>
    );

    expect(getByText("📏 Height: 190 cm")).toBeTruthy();
    expect(getByText("⚖️ Weight: 90 kg")).toBeTruthy();
    expect(getByText("🎂 Age: 28 ")).toBeTruthy();
    expect(getByText("🎯 Goal: Gain mass")).toBeTruthy();
  });
  //2.No userData
  it("shows error when useData in null", () => {
    const { getByText } = render(
      <UserContext.Provider value={{ userData: null }}>
        <ProfileScreen />
      </UserContext.Provider>
    );
    expect(getByText("Failed to load profile data."));
  });
  //3.Add photo
  it("adds photo from gallery", async () => {
    const mockAddPhoto = jest.fn();
    ImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: "test-uri" }],
    });
    const { getByText } = render(
      <UserContext.Provider
        value={{ userData: { photos: [] }, addPhoto: mockAddPhoto }}
      >
        <ProfileScreen />
      </UserContext.Provider>
    );
    fireEvent.press(getByText("Add from gallery"));

    await waitFor(() => {
      expect(mockAddPhoto).toHaveBeenCalledWith("test-uri");
    });
  });
  //4.Take photo
  it("adds photo from camera when permission granted", async () => {
    const mockAddPhoto = jest.fn();

    jest
      .spyOn(require("expo-camera").Camera, "requestCameraPermissionsAsync")
      .mockResolvedValueOnce({ status: "granted" });
    jest
      .spyOn(require("expo-image-picker"), "launchCameraAsync")
      .mockResolvedValueOnce({
        canceled: false,
        assets: [{ uri: "camera-uri" }],
      });

    const { getByText } = render(
      <UserContext.Provider
        value={{ userData: { photos: [] }, addPhoto: mockAddPhoto }}
      >
        <ProfileScreen />
      </UserContext.Provider>
    );
    fireEvent.press(getByText("Take photo"));

    await waitFor(() => {
      expect(mockAddPhoto).toHaveBeenCalledWith("camera-uri");
    });
  });
  //5.Camera permission denied
  it("shows alert when camera permission denied", async () => {
    jest
      .spyOn(require("expo-camera").Camera, "requestCameraPermissionsAsync")
      .mockResolvedValueOnce({ status: "denied" });

    const alertSpy = jest
      .spyOn(require("react-native").Alert, "alert")
      .mockImplementation(() => {});
    const { getByText } = render(
      <UserContext.Provider value={{ userData: { photos: [] } }}>
        <ProfileScreen />
      </UserContext.Provider>
    );
    fireEvent.press(getByText("Take photo"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Permission denied",
        "Camera is required to take photos",
        expect.arrayContaining([
          { text: "Cancel", style: "cancel" },
          expect.objectContaining({ text: "Open Settings" }),
        ])
      );
    });
    alertSpy.mockRestore();
  });
  //6.Pick image caneled
  it("does not add photo when gallery selection is canceled", async () => {
    const mockAddPhoto = jest.fn();
    ImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
      canceled: true,
    });
    const { getByText } = render(
      <UserContext.Provider
        value={{ userData: { photos: [] }, addPhoto: mockAddPhoto }}
      >
        <ProfileScreen />
      </UserContext.Provider>
    );
    fireEvent.press(getByText("Add from gallery"));

    await waitFor(() => {
      expect(mockAddPhoto).not.toHaveBeenCalledWith();
    });
  });
  //7.Take photo canceled
  it("does not add photo when camera is canceled", async () => {
    const mockAddPhoto = jest.fn();
    jest
      .spyOn(require("expo-camera").Camera, "requestCameraPermissionsAsync")
      .mockResolvedValueOnce({ status: "granted" });
    ImagePicker.launchCameraAsync.mockResolvedValueOnce({ canceled: true });
    const { getByText } = render(
      <UserContext.Provider
        value={{ userData: { photos: [] }, addPhoto: mockAddPhoto }}
      >
        <ProfileScreen />
      </UserContext.Provider>
    );
    fireEvent.press(getByText("Take photo"));

    await waitFor(() => {
      expect(mockAddPhoto).not.toHaveBeenCalledWith();
    });
  });
  //8.Delete photo
  it("delete photo when confirmed", async () => {
    const mockRemovePhoto = jest.fn();
    jest
      .spyOn(require("react-native").Alert, "alert")
      .mockImplementation((title, message, buttons) => {
        buttons.find((button) => button.text === "Delete").onPress();
      });

    const { getByTestId } = render(
      <UserContext.Provider
        value={{
          userData: { photos: ["photo-uri-1"] },
          addPhoto: jest.fn(),
          removePhoto: mockRemovePhoto,
        }}
      >
        <ProfileScreen />
      </UserContext.Provider>
    );
    fireEvent.press(getByTestId("photo-touchable-0"));

    await waitFor(() => {
      expect(mockRemovePhoto).toHaveBeenCalledWith("photo-uri-1");
    });
  });
  //9.Render photos in list
  it("renders photos in FlatList", () => {
    const { getAllByTestId } = render(
      <UserContext.Provider
        value={{
          userData: { photos: ["photo-uri-1", "photo-uri-2"] },
          addPhoto: jest.fn(),
          removePhoto: jest.fn(),
        }}
      >
        <ProfileScreen />
      </UserContext.Provider>
    );
    const images = getAllByTestId(/profile-photo-/);
    expect(images).toHaveLength(2);
  });
});
