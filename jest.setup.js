// jest.setup.js
import * as ImagePicker from "expo-image-picker";
import { Alert, View, Text, TextInput } from "react-native";

jest.mock("expo-blur", () => ({
  BlurView: ({ children }) => children,
}));

jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");
  RN.ImageBackground = ({ children }) => <RN.View>{children}</RN.View>;
  return RN;
});

jest.mock("react-native-paper", () => {
  const React = require("react");
  const { Text, View, TextInput } = require("react-native");

  const Card = ({ children }) => <View>{children}</View>;
  Card.Title = ({ title, right }) => (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text>{title}</Text>
      {right && right()}
    </View>
  );
  Card.Content = ({ children }) => <View>{children}</View>;

  return {
    Button: ({ children, onPress }) => (
      <Text onPress={onPress}>{children}</Text>
    ),
    TextInput: (props) => <TextInput {...props} />,
    Card,
    IconButton: ({ icon, onPress }) => (
      <View onClick={onPress}>
        <Text>{icon}</Text>
      </View>
    ),
    Text: ({ children }) => <Text>{children}</Text>,
  };
});

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("expo-camera", () => ({
  __esModule: true,
  Camera: {
    requestCameraPermissionsAsync: jest.fn(() =>
      Promise.resolve({ status: "granted" })
    ),
  },
  launchCameraAsync: jest.fn(() =>
    Promise.resolve({ cancelled: false, assets: [{ uri: "camera-uri" }] })
  ),
}));

jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  MediaTypeOptions: {
    Images: "Images",
  },
}));

jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  requestPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted" })
  ),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve()),
}));

jest.spyOn(Alert, "alert").mockImplementation(() => {});
