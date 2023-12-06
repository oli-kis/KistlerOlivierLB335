import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";

export default function ImageController({ index, handleImagePress, handleImageDelete }) {
  return (
    <View style={styles.imageControls}>
      <TouchableOpacity onPress={() => handleImagePress(index)}>
        <Image style={styles.icon} source={require("../assets/info.png")} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleImageDelete(index)}>
        <Image style={styles.icon} source={require("../assets/delete.png")} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    tintColor: "#fff",
    width: 40,
    height: 40,
  },
  imageControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
});
