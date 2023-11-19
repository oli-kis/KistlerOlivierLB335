import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image
  } from "react-native";
import React from "react";

export default function ButtonContainer(props){
    return(
    <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={props.toggleFlash}>
          <Image
            style={[
              styles.cameraControls,
              {
                tintColor:
                  props.flashMode === props.cameraProp
                    ? "#fff"
                    : "#ffff00",
              },
            ]}
            source={require("../assets/lightning.png")}
          ></Image>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={props.takePicture}
        ></TouchableOpacity>
        <TouchableOpacity onPress={props.toggleType}>
        <Image
          style={styles.cameraControls}
          source={require("../assets/retry.png")}
        ></Image>
        </TouchableOpacity>
      </View>
      )
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
      paddingHorizontal: 33,
      paddingVertical: 33,
      borderRadius: "50%",
      borderWidth: 8,
      borderColor: "#fff",
    },
    cameraControls: {
      width: 40,
      height: 40,
      tintColor: "#fff",
    },
  });
  