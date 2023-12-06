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
import * as Location from 'expo-location';
import moment from 'moment'; 

export default function HomeScreen({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [photoUri, setPhotoUri] = useState(null); 
  const cameraRef = useRef(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const saveUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }
      const UserLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced});
      setLocation(UserLocation);
      const storedLocations = await AsyncStorage.getItem("locations");
      const locationList = storedLocations ? JSON.parse(storedLocations) : [];
      locationList.push({longitude: UserLocation.coords.longitude, latitude: UserLocation.coords.latitude, timestamp: UserLocation.timestamp});
      await AsyncStorage.setItem('locations', JSON.stringify(locationList));
      console.log("Location saved");
      return UserLocation;
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  const getCurrentWeather = async (location) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=451d6c7864bb7b9046cbfec14e7ea0bc`);
      const result = await response.json();
      const weatherList = JSON.parse(await AsyncStorage.getItem("weather")) || [];
      weatherList.push(result.weather[0].description);
      await AsyncStorage.setItem("weather", JSON.stringify(weatherList));
    } catch (error) {
      console.error('Error fetching Weather:', error);
    }
  }

  const saveTimestamp = async () => {
    try {
      const currentDate = moment().format("DD/MM/YYYY, h:mm:ss");
      const storedTimestamps = await AsyncStorage.getItem("timestamps");
      const timestampList = storedTimestamps ? JSON.parse(storedTimestamps) : [];
      timestampList.push(currentDate);
      await AsyncStorage.setItem('timestamps', JSON.stringify(timestampList));
      console.log("Timestamp saved");
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri); 
      
      try {
        const storedImages = await AsyncStorage.getItem('images');
        const imageList = storedImages ? JSON.parse(storedImages) : [];
  
        imageList.push(photo.uri);
        await AsyncStorage.setItem('images', JSON.stringify(imageList));
        await saveTimestamp();
        await getCurrentWeather(await saveUserLocation());
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
