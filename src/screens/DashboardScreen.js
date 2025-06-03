import React, { useContext } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Card, Text } from "react-native-paper";
import MapView, { Marker } from "react-native-maps";
import { WorkoutContext } from "../context/WorkoutContext";

export default function DashboardScreen() {
  const { trainings } = useContext(WorkoutContext);
  const { width } = useWindowDimensions();

  const dynamicStyles = StyleSheet.create({
    title: {
      fontSize: width > 400 ? 28 : 22,
    },
    cardTitle: {
      fontSize: width > 400 ? 20 : 16,
    },
    exerciseItem: {
      fontSize: width > 400 ? 16 : 14,
    },
    moreInfo: {
      fontSize: width > 400 ? 14 : 12,
    },
    noTraining: {
      fontSize: width > 400 ? 18 : 14,
    },
  });

  const lastTraining =
    Array.isArray(trainings) && trainings.length > 0
      ? trainings[trainings.length - 1]
      : null;

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={[styles.title, dynamicStyles.title]}>
        Dashboard 📊
      </Text>
      {lastTraining ? (
        <Card style={styles.card}>
          <Card.Content>
            <Text
              variant="titleLarge"
              style={[styles.cardTitle, dynamicStyles.cardTitle]}
            >
              🏋️Last training: {lastTraining.title}
            </Text>
            {lastTraining.exercises?.length > 0 && (
              <>
                <Text style={styles.label}>💪 Exercises:</Text>
                {lastTraining.exercises.slice(0, 3).map((exercise, index) => (
                  <Text
                    key={index}
                    style={[styles.exerciseItem, dynamicStyles.exerciseItem]}
                  >
                    • {exercise}
                  </Text>
                ))}
                {lastTraining.exercises.length > 3 && (
                  <Text style={[styles.moreInfo, dynamicStyles.moreInfo]}>
                    and {lastTraining.exercises.length - 3} more...
                  </Text>
                )}
              </>
            )}
            <Text variant="bodyMedium" style={styles.row}>
              📅 Date: {""}
              {lastTraining.date
                ? new Date(lastTraining.date).toLocaleDateString()
                : "No date"}
            </Text>
            <Text variant="bodyMedium" style={styles.label}>
              📍 Location:
            </Text>
            {lastTraining.location ? (
              <View style={styles.mapWrapper}>
                {(() => {
                  try {
                    return (
                      <MapView
                        style={StyleSheet.absoluteFillObject}
                        initialRegion={{
                          latitude: lastTraining.location?.latitude || 0,
                          longitude: lastTraining.location?.longitude || 0,
                          latitudeDelta: 0.01,
                          longitudeDelta: 0.01,
                        }}
                      >
                        <Marker
                          coordinate={{
                            latitude: lastTraining.location.latitude,
                            longitude: lastTraining.location.longitude,
                          }}
                          title="Training Location"
                        />
                      </MapView>
                    );
                  } catch (error) {
                    return (
                      <Text style={styles.noLocation}>
                        Failed to load map - please check location permissions.
                      </Text>
                    );
                  }
                })()}
              </View>
            ) : (
              <Text style={styles.noLocation}>No location data</Text>
            )}
          </Card.Content>
        </Card>
      ) : (
        <Text style={styles.noTraining}>No trainings yet</Text>
      )}
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
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  card: {
    marginTop: 15,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 3,
    overflow: "hidden",
  },
  cardTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  row: {
    marginBottom: 8,
  },
  mapWrapper: {
    height: 250,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 10,
  },
  noLocation: {
    textAlign: "center",
    fontSize: 18,
    color: "gray",
  },
  noTraining: {
    textAlign: "center",
    fontSize: 18,
    color: "gray",
  },
  exerciseItem: {
    fontSize: 16,
    marginBottom: 4,
    color: "#444",
  },
  moreInfo: {
    fontStyle: "italic",
    color: "gray",
    marginTop: 4,
  },
});
