module.exports = {
  preset: "jest-expo",
  setupFiles: ["./jest.setup.js"],
  moduleNameMapper: {
    "^@react-native-async-storage/async-storage$":
      "@react-native-async-storage/async-storage/jest/async-storage-mock",
    "^expo-blur$": "<rootDir>/__mocks__/expo-blur.js",
    "^react-native-maps$": "<rootDir>/__mocks__/react-native-maps.js",
  },
};
