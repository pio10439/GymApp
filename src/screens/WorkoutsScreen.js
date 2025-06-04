import React, { useState, useContext } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { Button, TextInput, Card, IconButton, Text } from "react-native-paper";
import { WorkoutContext } from "../context/WorkoutContext";
import { shareTraining } from "../utils/shareTraining";

export default function WorkoutsScreen() {
  const { trainings, addTraining, editTraining, deleteTraining } =
    useContext(WorkoutContext);
  const [trainingTitle, setTrainingTitle] = useState("");
  const [exercise, setExercise] = useState("");
  const [exercises, setExercises] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState("");

  const { height, width } = useWindowDimensions();
  const dynamicStyles = StyleSheet.create({
    container: {
      marginTop: height > 700 ? 55 : 30,
      flex: 1,
      padding: width > 400 ? 24 : 12,
      backgroundColor: "#f2f4f7",
    },
  });
  const inputTheme = {
    roundness: 8,
    colors: {
      text: "#000",
      placeholder: "#BDBDBD",
      primary: "black",
      outline: "rgb(88, 87, 87)",
      background: "#fff",
    },
  };

  const valideInput = () => {
    if (!trainingTitle.trim()) {
      setError("Please enter a training name");
      return false;
    }
    if (exercises.length === 0) {
      setError("Please add at least one exercise");
      return false;
    }
    setError("");
    return true;
  };

  const addExercise = () => {
    if (exercise.trim().length >= 3) {
      setExercises([...exercises, exercise]);
      setExercise("");
      setError("");
    } else {
      setError("Exercise cant be shorter than 3 marks");
    }
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const saveTraining = () => {
    if (!valideInput()) return;

    const newTraining = { title: trainingTitle, exercises: [...exercises] };

    if (editMode) {
      editTraining(editIndex, newTraining);
      setEditMode(false);
      setEditIndex(null);
    } else {
      addTraining(newTraining);
    }
    resetForm();
  };

  const editExistingTraining = (index) => {
    const training = trainings[index];
    setTrainingTitle(training.title);
    setExercises(training.exercises);
    setEditMode(true);
    setEditIndex(index);
  };

  const deleteWholeTraining = (index) => {
    Alert.alert(
      "Delete training",
      "Are you sure you want to delete this training?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => deleteTraining(index),
          style: "destructive",
        },
      ]
    );
  };

  const resetForm = () => {
    setTrainingTitle("");
    setExercises([]);
    setExercise("");
    setError("");
    setEditMode(false);
    setEditIndex(null);
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.title}>
          Your workouts 💪
        </Text>
      </View>
      <Text variant="labelLarge" style={styles.label}>
        Training title:
      </Text>
      <TextInput
        mode="outlined"
        style={{ marginBottom: 10 }}
        value={trainingTitle}
        onChangeText={setTrainingTitle}
        label="Write training title"
        keyboardType="default"
        testID="Write_training_title"
        theme={inputTheme}
      />
      <Text variant="labelLarge" style={styles.label}>
        Add exercise:
      </Text>
      <View style={styles.exerciseInputContainer}>
        <TextInput
          mode="outlined"
          style={{ flex: 1 }}
          value={exercise}
          onChangeText={setExercise}
          label="Enter exercise"
          keyboardType="default"
          testID="Enter_exercise"
          theme={inputTheme}
        />
        <Button
          mode="contained"
          onPress={addExercise}
          style={{ marginLeft: 8, backgroundColor: "rgba(0, 0, 0, 0.43)" }}
          testID="Add"
        >
          Add
        </Button>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {exercises.length > 0 && (
        <ScrollView
          style={{ maxHeight: 150 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text variant="titleMedium" style={{ marginTop: 10 }}>
            {trainingTitle}:
          </Text>
          {exercises.map((item, index) => (
            <View key={index} style={styles.exerciseRow}>
              <Text>- {item}</Text>
              <IconButton
                icon="delete"
                iconColor="red"
                size={20}
                onPress={() => removeExercise(index)}
              />
            </View>
          ))}
        </ScrollView>
      )}
      {editMode && (
        <Button
          mode="outlined"
          onPress={resetForm}
          textColor="gray"
          style={{ marginTop: 8 }}
        >
          Cancel editing
        </Button>
      )}
      <Button
        mode="contained"
        onPress={saveTraining}
        style={{ marginVertical: 10, backgroundColor: "rgba(0, 0, 0, 0.43)" }}
      >
        {" "}
        {editMode ? "Save changes" : "Save training"}
      </Button>

      <FlatList
        data={trainings}
        renderItem={({ item, index }) => (
          <Card style={styles.trainingItem}>
            <Card.Title
              title={item.title}
              right={() => (
                <View style={{ flexDirection: "row" }}>
                  <IconButton
                    icon="share-variant"
                    iconColor="green"
                    onPress={() => shareTraining(item)}
                  />
                  <IconButton
                    icon="pencil"
                    onPress={() => editExistingTraining(index)}
                  />
                  <IconButton
                    icon="delete"
                    iconColor="red"
                    onPress={() => deleteWholeTraining(index)}
                  />
                </View>
              )}
            />
            <Card.Content>
              {item.exercises.map((exercise, i) => (
                <Text key={i} style={styles.exerciseItem}>
                  {i + 1}. {exercise}
                </Text>
              ))}
            </Card.Content>
          </Card>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 55,
    flex: 1,
    padding: 24,
    backgroundColor: "#f2f4f7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  label: {
    marginTop: 8,
    marginBottom: 4,
  },
  exerciseInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  exerciseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e8e8e8",
    padding: 8,
    borderRadius: 12,
    marginVertical: 4,
  },
  trainingItem: {
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    paddingBottom: 4,
  },
  exerciseItem: {
    marginLeft: 8,
    marginVertical: 2,
  },
  error: {
    color: "red",
    marginVertical: 5,
  },
});
