import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { Camera } from "expo-camera";
import AsyncStorage from "@react-native-community/async-storage";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log("photo", photo);
    }
  };

  const toggleFlash = () => {
    setFlashMode(
      flashMode === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.torch
        : Camera.Constants.FlashMode.off
    );
  };

  const saveImage = async (base64Image) => {
    try {
      await AsyncStorage.setItem("image", base64Image);
    } catch (error) {
      console.log(error);
    }
  };

  const loadImage = async () => {
    try {
      const base64Image = await AsyncStorage.getItem("image");
      if (base64Image !== null) {
        return base64Image;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          type={type}
          ref={cameraRef}
          flashMode={flashMode}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={toggleFlash}>
          <Image
            style={[
              styles.cameraControls,
              {
                tintColor:
                  flashMode === Camera.Constants.FlashMode.off
                    ? "#fff"
                    : "#ffff00",
              },
            ]}
            source={require("./assets/lightning.png")}
          ></Image>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={takePicture}
        ></TouchableOpacity>
        <Image
          style={styles.cameraControls}
          source={require("./assets/retry.png")}
        ></Image>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraContainer: {
    width: "80%",
    height: "70%",
    borderRadius: 20,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 50,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    paddingRight: "20%",
    paddingLeft: "20%",
  },
  button: {
    backgroundColor: "#000",
    paddingHorizontal: 33,
    paddingVertical: 33,
    borderRadius: "50%",
    borderWidth: 8,
    borderColor: "#fff",
  },
  text: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },
  cameraControls: {
    width: 40,
    height: 40,
    tintColor: "#fff",
  },
});
