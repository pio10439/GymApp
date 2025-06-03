import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { UserContext } from "../context/UserContext";
import { AuthContext } from "../context/AuthContext";

export default function SettingScreen() {
  const { logout } = useContext(AuthContext);
  const { userData, saveUserData } = useContext(UserContext);
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();

  const containerPadding = screenWidth > 400 ? 24 : 12;
  const marginTop = screenHeight > 700 ? 55 : 30;
  const containerStyle = {
    marginTop,
    flex: 1,
    padding: containerPadding,
    backgroundColor: "#f2f4f7",
  };
  const logoutWrapperStyle = {
    position: "absolute",
    top: screenHeight > 700 ? 5 : 2,
    right: screenWidth > 350 ? 20 : 10,
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading user data...</Text>
      </View>
    );
  }

  const [height, setHeight] = useState(userData.height);
  const [weight, setWeight] = useState(userData.weight);
  const [age, setAge] = useState(userData.age);
  const [goal, setGoal] = useState(userData.goal);

  useEffect(() => {
    setHeight(userData?.height || "");
    setWeight(userData?.weight || "");
    setAge(userData?.age || "");
    setGoal(userData?.goal || "");
  }, [userData]);

  const isNumeric = (value) => /^(\d+(\.\d{1,2})?)$/.test(value);

  const saveProfile = () => {
    if (
      !isNumeric(height) ||
      parseFloat(height) < 80 ||
      parseFloat(height) > 250
    ) {
      return Alert.alert("Enter the correct height in cm (80-250)");
    }
    if (
      !isNumeric(weight) ||
      parseFloat(weight) < 30 ||
      parseFloat(weight) > 300
    ) {
      return Alert.alert("Enter the correct weight in kg (30-300)");
    }
    if (!isNumeric(age) || parseInt(age) < 10 || parseInt(age) > 120) {
      return Alert.alert("Please enter correct age (10-120 years)");
    }
    if (!goal.trim()) {
      return Alert.alert("Goal cannot be empty");
    }
    try {
      saveUserData({
        ...userData,
        height,
        weight,
        age,
        goal,
      });
      Alert.alert("Data has been saved 😄");
    } catch (error) {
      console.error("Save error", error);
      Alert.alert("Error", "Failed to save user data");
    }
  };

  return (
    <ScrollView contentContainerStyle={containerStyle}>
      <Text style={styles.title}>Settings ⚙️</Text>
      <View style={logoutWrapperStyle}>
        <Button onPress={logout} compact>
          <Text style={styles.logoutText}>Logout</Text>
        </Button>
      </View>
      <Text style={styles.subtitle}>User data:</Text>
      <TextInput
        label="Height (cm)"
        style={styles.input}
        mode="outlined"
        value={height}
        onChangeText={setHeight}
        keyboardType="decimal-pad"
        testID="height-input"
      />
      <TextInput
        style={styles.input}
        label="Weight (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="decimal-pad"
        mode="outlined"
        testID="weight-input"
      />
      <TextInput
        style={styles.input}
        label="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        mode="outlined"
        testID="age-input"
      />
      <TextInput
        style={styles.input}
        label="Goal"
        value={goal}
        onChangeText={setGoal}
        mode="outlined"
        testID="goal-input"
      />
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={saveProfile} style={styles.button}>
          Save
        </Button>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  labelUnits: {
    marginTop: 20,
    fontSize: 16,
    color: "#333",
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 16,
    color: "#666",
  },
  input: {
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 7,
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 10,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "red",
  },
});
