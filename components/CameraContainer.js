import React from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import { Camera } from "expo-camera";


export default function CameraContainer(props){
    return(
    <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          type={props.type}
          ref={props.reference}
          flashMode={props.flashMode}
        />
      </View>)
}

const styles = StyleSheet.create({
    cameraContainer: {
      width: "80%",
      height: "70%",
      borderRadius: 20,
      overflow: "hidden",
    },
    camera: {
      flex: 1,
    },
  });
  