import React from "react";
import { View } from "react-native";

const MapView = (props) => <View {...props} testID="MapView" />;
const Marker = (props) => <View {...props} testID="Marker" />;

export default MapView;
export { Marker };
