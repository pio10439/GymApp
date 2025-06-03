import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ErrorBoundary } from "../src/components/ErrorBoundary";
import { Text, View } from "react-native";

describe("ErrorBoundary", () => {
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });
  //1.No error
  it("renders children when no error occurs", () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Text>Child Component</Text>
      </ErrorBoundary>
    );
    expect(getByText("Child Component")).toBeTruthy();
  });
  //2.Error and try again
  it("displays error message and try again button when error occurs", () => {
    const ErrorComponent = () => {
      throw new Error("Test Error");
    };
    const { getByText } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );
    expect(getByText("Something went wrong.")).toBeTruthy();
    expect(getByText("Error: Test Error")).toBeTruthy();
    expect(getByText("Try again")).toBeTruthy();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Caught by ErrorBoundary",
      expect.any(Error),
      expect.any(Object)
    );
  });
  //3. Reset error state
  it("resets error state when try again is pressed", () => {
    let shouldThrow = true;
    const ToggleErrorComponent = () => {
      if (shouldThrow) throw new Error("Test Error");
      return <Text>Child Component</Text>;
    };

    const { getByText, queryByText } = render(
      <ErrorBoundary>
        <ToggleErrorComponent />
      </ErrorBoundary>
    );

    expect(getByText("Something went wrong.")).toBeTruthy();
    expect(getByText("Error: Test Error")).toBeTruthy();

    shouldThrow = false;
    fireEvent.press(getByText("Try again"));

    expect(queryByText("Something went wrong.")).toBeNull();
    expect(getByText("Child Component")).toBeTruthy();
  });
});
