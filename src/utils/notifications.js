import * as Notifications from "expo-notifications";
import { Alert, Linking, Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestNotificationPermission = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Notifications Disabled",
        "To receive training notifications, please enable notifications in your settings.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Open Settings",
            onPress: () => {
              if (Platform.OS === "ios") {
                Linking.openURL("app-settings:");
              } else {
                Linking.openSettings();
              }
            },
          },
        ]
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error requesting notifications permission", error);
    Alert.alert(
      "Unexpected Error",
      "Something went wrong while requesting notification permissions. Please try again later."
    );
    return false;
  }
};

export const sendTrainingsNotification = async (training) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Training saved, good job 💪🏻",
        body: `${training.title}(${training.exercises.length} exercises) have been saved`,
      },
      trigger: null,
    });
  } catch (error) {
    console.error("Error while sending notification", error);
    Alert.alert(
      "Notification Error",
      "Unable to send training notification. Please check your settings or try again later."
    );
  }
};
