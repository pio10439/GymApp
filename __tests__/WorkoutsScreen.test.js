import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { WorkoutContext } from "../src/context/WorkoutContext";
import WorkoutsScreen from "../src/screens/WorkoutsScreen";
import { Alert } from "react-native";
import { formatElement } from "@testing-library/react-native/build/helpers/format-element";

describe("WorkoutScreen", () => {
  jest.mock("../src/utils/shareTraining", () => ({
    shareTraining: jest.fn(),
  }));

  const mockTraining = [
    {
      title: "Push Day",
      exercises: ["Bench press", "Lateral rises"],
    },
  ];

  const mockContext = {
    trainings: mockTraining,
    addTraining: jest.fn(),
    editTraining: jest.fn(),
    deleteTraining: jest.fn(),
  };

  const renderWithContext = (context = mockContext) => {
    return render(
      <WorkoutContext.Provider value={context}>
        <WorkoutsScreen />
      </WorkoutContext.Provider>
    );
  };

  //1.Render training
  it("renders correctly", () => {
    const { getByText } = renderWithContext();
    expect(getByText("Push Day")).toBeTruthy();
    expect(getByText("1. Bench press")).toBeTruthy();
    expect(getByText("2. Lateral rises")).toBeTruthy();
  });
  //2.Render empty state
  it("renders empty state when no trainings", () => {
    const { queryByText } = renderWithContext({
      ...mockContext,
      trainings: [],
    });
    expect(queryByText("Push Day")).toBeNull();
  });
  //3.To short exercise
  it("shows error if exercise is too short", async () => {
    const { getByTestId, getByText } = renderWithContext();

    fireEvent.changeText(getByTestId("Enter_exercise"), "aa");
    fireEvent.press(getByText("Add"));

    await waitFor(() => {
      expect(getByText("Exercise cant be shorter than 3 marks")).toBeTruthy();
    });
  });
  //4.No title error
  it("shows error if training title is empty", async () => {
    const { getByTestId, getByText } = renderWithContext();
    fireEvent.changeText(getByTestId("Enter_exercise"), "Bench Press");
    fireEvent.press(getByText("Add"));
    fireEvent.press(getByText("Save training"));
    await waitFor(() => {
      expect(getByText("Please enter a training name")).toBeTruthy();
    });
  });
  //5. Edit training
  it("edits existing training", async () => {
    const { getByTestId, getByText } = renderWithContext();
    fireEvent.press(getByText("pencil"));
    fireEvent.changeText(
      getByTestId("Write_training_title"),
      "Edited Training"
    );
    fireEvent.changeText(getByTestId("Enter_exercise"), "Push-up");
    fireEvent.press(getByText("Add"));
    fireEvent.press(getByText("Save changes"));
    await waitFor(() => {
      expect(mockContext.editTraining).toHaveBeenCalledWith(0, {
        title: "Edited Training",
        exercises: ["Bench press", "Lateral rises", "Push-up"],
      });
    });
  });
  //6. Cancel editing
  it("cancels editing training", async () => {
    const { getByTestId, getByText, queryByText } = renderWithContext();
    fireEvent.press(getByText("pencil"));
    fireEvent.changeText(getByTestId("Enter_exercise"), "Push-up");
    fireEvent.press(getByText("Add"));
    fireEvent.press(getByText("Cancel editing"));
    await waitFor(() => {
      expect(queryByText("- Push-up")).toBeNull();
      expect(getByTestId("Write_training_title").props.value).toBe("");
    });
  });
  //7.Deleting alert
  it("shows alert when deleting training", async () => {
    const { getByText } = renderWithContext();
    fireEvent.press(getByText("delete"));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Delete training",
        "Are you sure you want to delete this training?",
        expect.any(Array)
      );
    });
  });
});
