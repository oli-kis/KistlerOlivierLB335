import React from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";

export default function ButtonContainer({ toggleFlash, flashMode, cameraProp, takePicture, toggleType }) {
  const FlashButton = () => (
    <TouchableOpacity onPress={toggleFlash}>
      <Image
        style={[
          styles.cameraControls,
          { tintColor: flashMode === cameraProp ? "#fff" : "#ffff00" },
        ]}
        source={require("../assets/lightning.png")}
      />
    </TouchableOpacity>
  );

  const CaptureButton = () => (
    <TouchableOpacity style={styles.button} onPress={takePicture} />
  );

  const TypeToggleButton = () => (
    <TouchableOpacity onPress={toggleType}>
      <Image style={styles.cameraControls} source={require("../assets/retry.png")} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.buttonContainer}>
      <FlashButton />
      <CaptureButton />
      <TypeToggleButton />
    </View>
  );
}

const styles = StyleSheet.create({
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
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 8,
    borderColor: "#fff",
  },
  cameraControls: {
    width: 40,
    height: 40,
    tintColor: "#fff",
  },
});
