import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity
} from "react-native";
import { Camera } from "expo-camera";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraContainer from "./CameraContainer";
import ButtonContainer from "./ButtonContainer";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function HomeScreen({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [photoUri, setPhotoUri] = useState(null); 
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
      setPhotoUri(photo.uri); 
      console.log("photo", photo.uri);
      
      try {
        const storedImages = await AsyncStorage.getItem('images');
        const imageList = storedImages ? JSON.parse(storedImages) : [];
  
        imageList.push(photo.uri);
  
        await AsyncStorage.setItem('images', JSON.stringify(imageList));
      } catch (e) {
        console.error('Failed to save image:', e);
      }
    }
    navigation.navigate("Audio Recording");
  };

  const toggleFlash = () => {
    setFlashMode(
      flashMode === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.torch
        : Camera.Constants.FlashMode.off
    );
  };

  const toggleCameraType = () =>{
    setType(type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back)
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  return (
    <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.galleryButtonContainer} onPress={() => navigation.navigate('Gallery')}>
            <Image style={styles.galleryButton} source={require("../assets/gallery.png")}></Image>
        </TouchableOpacity>
        <CameraContainer
          type={type}
          reference={cameraRef}
          flashMode={flashMode}
        />
        <ButtonContainer toggleType={toggleCameraType} cameraProp={Camera.Constants.FlashMode.off} toggleFlash={toggleFlash} flashMode={flashMode} takePicture={takePicture}></ButtonContainer>
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
  galleryButton:{
    width: 40,
      height: 40,
      tintColor: "#fff",
  },
  galleryButtonContainer:{
    flexDirection: "row",
    width: "100%",
    justifyContent:"flex-end",
    marginBottom: 50,
    paddingRight: 50
  }
});
