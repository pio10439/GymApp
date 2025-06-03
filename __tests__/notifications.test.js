import * as Notifications from "expo-notifications";
import { Alert, Linking, Platform } from "react-native";
import {
  requestNotificationPermission,
  sendTrainingsNotification,
} from "../src/utils/notifications";

describe("Notifications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //1.Permission granted
  it("returns true when permission is granted", async () => {
    Notifications.requestPermissionsAsync.mockResolvedValueOnce({
      status: "granted",
    });

    const result = await requestNotificationPermission();

    expect(result).toBe(true);
    expect(Alert.alert).not.toHaveBeenCalled();
  });
  //2.IOS settings
  it("on iOS shows alert and opens iOS settings", async () => {
    Platform.OS = "ios";
    Notifications.requestPermissionsAsync.mockResolvedValueOnce({
      status: "denied",
    });

    await requestNotificationPermission();

    expect(Alert.alert).toHaveBeenCalled();

    const [, , buttons] = Alert.alert.mock.calls[0];
    const openSettingsButton = buttons.find(
      (btn) => btn.text === "Open Settings"
    );
    openSettingsButton.onPress();

    expect(Linking.openURL).toHaveBeenCalledWith("app-settings:");
  });
  //3.Android settings
  it("on Android shows alert and opens Android settings", async () => {
    Platform.OS = "android";
    Notifications.requestPermissionsAsync.mockResolvedValueOnce({
      status: "denied",
    });

    await requestNotificationPermission();

    expect(Alert.alert).toHaveBeenCalled();
    const [, , buttons] = Alert.alert.mock.calls[0];
    const openSettingsButton = buttons.find(
      (btn) => btn.text === "Open Settings"
    );
    openSettingsButton.onPress();

    expect(Linking.openSettings).toHaveBeenCalled();
  });
  //4.Request error
  it("shows error alert when request throws error", async () => {
    Notifications.requestPermissionsAsync.mockRejectedValueOnce(
      new Error("fail")
    );

    const result = await requestNotificationPermission();

    expect(result).toBe(false);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Unexpected Error",
      expect.stringContaining("Something went wrong")
    );
  });
  //5.Correct notification
  it("schedules a notification with correct content", async () => {
    const training = { title: "Push Day", exercises: ["Bench", "Fly"] };

    await sendTrainingsNotification(training);

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
      content: {
        title: "Training saved, good job 💪🏻",
        body: "Push Day (2 exercises) have been saved",
      },
      trigger: null,
    });
  });
  //6.Alert error
  it("shows alert on notification send error", async () => {
    Notifications.scheduleNotificationAsync.mockRejectedValueOnce(
      new Error("fail")
    );

    await sendTrainingsNotification({ title: "Push", exercises: [] });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Notification Error",
      expect.stringContaining("Unable to send")
    );
  });
});
