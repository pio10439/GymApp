import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  useWindowDimensions,
} from "react-native";
import { TextInput, Button, Card, Text } from "react-native-paper";
import { AuthContext } from "../context/AuthContext";
import { BlurView } from "expo-blur";

export default function AuthScreen() {
  const { login, register } = useContext(AuthContext);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { width } = useWindowDimensions();

  const handleAuth = async () => {
    setMessage("");
    const result = isRegistering
      ? await register(username, password)
      : await login(username, password);

    if (result.success) {
      if (isRegistering) {
        setMessage(result.message);
        setIsRegistering(false);
        setPassword("");
        setUsername("");
      }
    } else {
      setMessage(result.error);
    }
  };
  const inputTheme = {
    roundness: 8,
    colors: {
      text: "#fff",
      placeholder: "#BDBDBD",
      primary: "9E9E9E",
      outline: "rgba(255, 255, 255, 0.4)",
      background: "transarent",
    },
  };
  const dynamicStyles = StyleSheet.create({
    title: {
      fontSize: width > 400 ? 28 : 24,
      marginBottom: width > 400 ? 24 : 16,
    },
    card: {
      maxWidth: 600,
      width: "90%",
      alignSelf: "center",
    },
  });

  return (
    <ImageBackground
      source={require("../assets/AuthBackg.jpg")}
      resizeMode="cover"
      style={styles.background}
      imageStyle={{ opacity: 0.9 }}
    >
      <View style={styles.container}>
        <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
          <Card style={styles.card}>
            <Card.Content>
              <Text
                variant="titleLarge"
                style={[styles.title, dynamicStyles.title]}
              >
                {isRegistering ? "Register" : "Login"}
              </Text>
              <TextInput
                mode="outlined"
                testID="loginInput"
                label="Login"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                theme={inputTheme}
              />
              <TextInput
                mode="outlined"
                testID="passwordInput"
                label="Password"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                theme={inputTheme}
                secureTextEntry
              />
              {message ? <Text style={styles.message}>{message}</Text> : null}
              <Button
                mode="outlined"
                onPress={handleAuth}
                style={styles.button}
                labelStyle={styles.buttonLabel}
                theme={{
                  colors: {
                    primary: "rgba(97,97,97,0.7)",
                    onPrimary: "#fff",
                    rippleColor: "rgba(255,255,255, 0.1)",
                  },
                }}
              >
                {isRegistering ? "Sign up" : "Sign in"}
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  setIsRegistering(!isRegistering);
                  setMessage("");
                  setUsername("");
                  setPassword("");
                }}
                style={[styles.button, styles.secondaryButton]}
                labelStyle={styles.secondaryButtonLabel}
                theme={{
                  colors: {
                    primary: "rgba(97,97,97,0.7)",
                    onPrimary: "#fff",
                    rippleColor: "rgba(255,255,255, 0.1)",
                  },
                }}
              >
                {isRegistering ? "I have an account" : "Create an account"}
              </Button>
            </Card.Content>
          </Card>
        </BlurView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "rgba(40, 40, 40, 0.8)",
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    marginTop: 55,
    justifyContent: "center",
  },
  blurContainer: {
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 10,
    elevation: 5,
  },
  card: {
    backgroundColor: "rgba(133, 133, 133, 0.4)",
    borderRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 18,
    color: "rgba(0, 0, 0, 0.8)",
  },
  input: {
    marginVertical: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  message: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    marginVertical: 8,
    borderRadius: 8,
    paddingVertical: 4,
    backgroundColor: "rgba(17, 17, 18, 0.5)",
  },
  secondaryButton: {
    backgroundColor: "rgba(66, 66, 66, 0.5)",
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FAFAFA",
  },
  secondaryButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
