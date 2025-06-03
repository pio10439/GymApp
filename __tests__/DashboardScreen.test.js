import React from "react";
import { render } from "@testing-library/react-native";
import DashboardScreen from "../src/screens/DashboardScreen";
import { WorkoutContext } from "../src/context/WorkoutContext";

describe("DashboardScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //1.Title
  it("render title", () => {
    const { getByText } = render(
      <WorkoutContext.Provider value={{ trainings: [] }}>
        <DashboardScreen />
      </WorkoutContext.Provider>
    );
    expect(getByText("Dashboard 📊")).toBeTruthy();
  });
  //2.No trainings
  it("shows message when there are no trainings", () => {
    const { getByText } = render(
      <WorkoutContext.Provider value={{ trainings: [] }}>
        <DashboardScreen />
      </WorkoutContext.Provider>
    );
    expect(getByText("No trainings yet")).toBeTruthy();
  });
  //3.Last training
  it("render last training with map", () => {
    const training = {
      title: "Push Day",
      exercises: ["Bench press", "Lateral rises", "Triceps pushdown"],
      date: "2025-05-29T10:00:00Z",
      location: { latitude: 50.061, longitude: 19.936 },
    };
    const { getByText, getByTestId } = render(
      <WorkoutContext.Provider value={{ trainings: [training] }}>
        <DashboardScreen />
      </WorkoutContext.Provider>
    );
    expect(getByText("🏋️Last training: Push Day")).toBeTruthy();
    expect(getByTestId("MapView")).toBeTruthy();
    expect(getByTestId("Marker")).toBeTruthy();
  });
  //4.Shows ...
  it("shows 'and X more' when there are more than 3 exercises", () => {
    const training = {
      title: "Push Day",
      exercises: [
        "Bench press",
        "Lateral rises",
        "Triceps pushdown",
        "Pec-deck",
      ],
      date: "2025-05-29T10:00:00Z",
      location: { latitude: 50.061, longitude: 19.936 },
    };
    const { getByText } = render(
      <WorkoutContext.Provider value={{ trainings: [training] }}>
        <DashboardScreen />
      </WorkoutContext.Provider>
    );
    expect(getByText("and 1 more...")).toBeTruthy();
  });
  //5.No location
  it("renders 'No location data' if location is missing", () => {
    const training = {
      title: "Push Day",
      exercises: ["Bench press", "Lateral rises", "Triceps pushdown"],
      date: "2025-05-29T10:00:00Z",
      location: null,
    };
    const { getByText } = render(
      <WorkoutContext.Provider value={{ trainings: [training] }}>
        <DashboardScreen />
      </WorkoutContext.Provider>
    );
    expect(getByText("No location data")).toBeTruthy();
  });
  //6. No date
  it("shows 'No date' if trainigs date is missing", () => {
    const training = {
      title: "Push Day",
      exercises: ["Bench press", "Lateral rises", "Triceps pushdown"],

      location: { latitude: 50.061, longitude: 19.936 },
    };
    const { getByText } = render(
      <WorkoutContext.Provider value={{ trainings: [training] }}>
        <DashboardScreen />
      </WorkoutContext.Provider>
    );
    expect(getByText(/No date/)).toBeTruthy();
  });
});
