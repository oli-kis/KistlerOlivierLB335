import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
  } from "react-native";
  import React, { useState, useEffect } from "react";

export default function ImageController(props){
    const index = props.index;
return(
    <View style={styles.imageControlls}>
              <TouchableOpacity
                key={`opacity-${index}`}
                onPress={() => props.handleImagePress(index)}
              >
                <Image
                  style={styles.info}
                  source={require("../assets/info.png")}
                ></Image>
              </TouchableOpacity>
              <TouchableOpacity
                key={`delete-${index}`}
                onPress={() => props.handleImageDelete(index)}
              >
                <Image
                  style={styles.delete}
                  source={require("../assets/delete.png")}
                ></Image>
              </TouchableOpacity>
            </View>
)
}

const styles = StyleSheet.create({
    info: {
      tintColor: "#fff",
      width: 40,
      height: 40,
    },
    delete: {
      tintColor: "#fff",
      width: 40,
      height: 40,
    },
    imageControlls: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 10,
    },
  });