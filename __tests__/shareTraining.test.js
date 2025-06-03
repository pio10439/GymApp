import { shareTraining } from "../src/utils/shareTraining";
import { Share } from "react-native";

jest
  .spyOn(Share, "share")
  .mockImplementation(() => Promise.resolve({ action: Share.sharedAction }));

describe("shareTraining", () => {
  const mockTraining = {
    title: "Push Day",
    exercises: ["Bench Press", "Shoulder Press", "Triceps Pushdown"],
  };
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  const message =
    "🏋️ Training: Push Day\n\nExercises:\n1. Bench Press\n2. Shoulder Press\n3. Triceps Pushdown";

  //1.Shares training wth activ
  it("shares training successfully with activityType", async () => {
    Share.share.mockResolvedValue({
      action: Share.sharedAction,
      activityType: "com.apple.mail",
    });
    await shareTraining(mockTraining);

    expect(Share.share).toHaveBeenCalledWith({
      message: message,
    });
    expect(console.log).toHaveBeenCalledWith("Shared via:", "com.apple.mail");
    expect(console.error).not.toHaveBeenCalledWith();
  });
  //2.Shares training wtho activ
  it("shares training successfully without activityType", async () => {
    Share.share.mockResolvedValue({
      action: Share.sharedAction,
      activityType: undefined,
    });
    await shareTraining(mockTraining);

    expect(Share.share).toHaveBeenCalledWith({
      message: message,
    });
    expect(console.log).toHaveBeenCalledWith("Training has been shared.");
    expect(console.error).not.toHaveBeenCalledWith();
  });
  //3.Share cancell
  it("handles sharing cancellation", async () => {
    Share.share.mockResolvedValue({
      action: Share.dismissedAction,
    });
    await shareTraining(mockTraining);

    expect(Share.share).toHaveBeenCalledWith({
      message: message,
    });
    expect(console.log).toHaveBeenCalledWith("Sharing was cancelled.");
    expect(console.error).not.toHaveBeenCalledWith();
  });
  //4.Sharing error
  it("handles error during sharing ", async () => {
    const error = new Error("Share failed");
    Share.share.mockRejectedValue(error);
    await shareTraining(mockTraining);

    expect(Share.share).toHaveBeenCalledWith({
      message: message,
    });
    expect(console.error).toHaveBeenCalledWith(
      "Error while sharing the training:",
      error
    );
    expect(console.log).not.toHaveBeenCalledWith();
  });
});
