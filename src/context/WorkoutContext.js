import React, { Alert, Platform, Linking } from "react-native";
import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import {
  sendTrainingsNotification,
  requestNotificationPermission,
} from "../utils/notifications";

export const WorkoutContext = createContext();

export function WorkoutProvider({ children, currentUser }) {
  const [trainings, setTrainings] = useState([]);

  const loadTrainings = async () => {
    if (!currentUser) {
      console.warn("No currentUser - resetting trainings");
      setTrainings([]);
      return;
    }
    try {
      const users = JSON.parse((await AsyncStorage.getItem("users")) || "{}");
      const userTrainings = users[currentUser]?.trainings || [];
      setTrainings(userTrainings);
      console.log("Trainings loaded", userTrainings.length);
    } catch (error) {
      console.log("Error loading trainings", error);
      setTrainings([]);
    }
  };

  const saveToStorage = async (updatedTrainings) => {
    if (!currentUser) {
      console.warn("No currentUser - trainings not saved");
      return;
    }
    try {
      const users = JSON.parse((await AsyncStorage.getItem("users")) || "{}");
      if (!users[currentUser]) {
        users[currentUser] = { password: "", trainings: [] };
      }
      users[currentUser].trainings = updatedTrainings;
      await AsyncStorage.setItem("users", JSON.stringify(users));
      setTrainings(updatedTrainings);
      console.log("Trainings saved", updatedTrainings.length);
    } catch (erorr) {
      console.error("Error saving trainings", erorr);
    }
  };
  const addTraining = async (newTraining) => {
    let location = null;

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location is required to show your training location",
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
      } else {
        const position = await Location.getCurrentPositionAsync({});
        console.log("📍 Coords:", position.coords);
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      }
    } catch (error) {
      console.error("Location Error:", error);
    }

    const finalTraining = {
      ...newTraining,
      date: new Date().toISOString(),
      location,
    };

    console.log("Location being saved:", finalTraining.location);
    const updatedTrainings = [...trainings, finalTraining];
    await sendTrainingsNotification(finalTraining);
    setTrainings(updatedTrainings);
    saveToStorage(updatedTrainings);
  };

  const editTraining = (index, updatedTraining) => {
    const updatedTrainings = trainings.map((training, i) =>
      i === index
        ? {
            ...training,
            title: updatedTraining.title,
            exercises: updatedTraining.exercises,
          }
        : training
    );
    saveToStorage(updatedTrainings);
  };

  const deleteTraining = (index) => {
    const updatedTrainings = trainings.filter((_, i) => i !== index);
    saveToStorage(updatedTrainings);
  };

  useEffect(() => {
    loadTrainings();
    requestNotificationPermission();
  }, [currentUser]);

  return (
    <WorkoutContext.Provider
      value={{ trainings, addTraining, editTraining, deleteTraining }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}
