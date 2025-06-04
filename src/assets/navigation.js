import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import WorkoutsScreen from "../screens/WorkoutsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import DashboardScreen from "../screens/DashboardScreen";
import AuthScreen from "../screens/AuthScreen";
import SettingScreen from "../screens/SettingsScreen";
import { WorkoutProvider } from "../context/WorkoutContext";
import { UserProvider } from "../context/UserContext";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import { ErrorBoundary } from "../components/ErrorBoundary";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Welcome") {
            iconName = "view-dashboard";
          } else if (route.name === "Workouts") {
            iconName = "dumbbell";
          } else if (route.name === "Profile") {
            iconName = "account-circle";
          } else if (route.name === "Settings") {
            iconName = "cog";
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "rgb(0, 0, 0)",
        tabBarInactiveTintColor: "rgba(159, 158, 158, 0.8)",
      })}
    >
      <Tab.Screen
        name="Welcome"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Workouts" options={{ headerShown: false }}>
        {() => <WorkoutsScreen />}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingScreen}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

function Navigation() {
  const { isLoggedIn, currentUser } = useContext(AuthContext);

  return (
    <WorkoutProvider currentUser={currentUser}>
      <UserProvider currentUser={currentUser}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isLoggedIn ? (
              <Stack.Screen name="Main" component={MainTabs} />
            ) : (
              <Stack.Screen name="Auth" component={AuthScreen} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </WorkoutProvider>
  );
}

export default function AppNavigation() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Navigation />
      </ErrorBoundary>
    </AuthProvider>
  );
}
