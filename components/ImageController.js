import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

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
    marginHorizontal: 20,
  },
  imageControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: wp("5%"),
  },
});
