import { Share } from "react-native";

export const shareTraining = async (training) => {
  try {
    const message = `🏋️ Training: ${
      training.title
    }\n\nExercises:\n${training.exercises
      .map((ex, index) => `${index + 1}. ${ex}`)
      .join("\n")}`;

    const result = await Share.share({
      message,
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log("Shared via:", result.activityType);
      } else {
        console.log("Training has been shared.");
      }
    } else if (result.action === Share.dismissedAction) {
      console.log("Sharing was cancelled.");
    }
  } catch (error) {
    console.error("Error while sharing the training:", error);
  }
};
