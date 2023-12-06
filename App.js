import React, { useState } from "react";
import {
  StyleSheet,
} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "./components/HomeScreen";
import ImageGallery from "./components/ImageGallery";
import AudioRecorder from "./components/AudioRecorder";


const Stack = createNativeStackNavigator();
export default function App() {
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BeFake" screenOptions={{
          headerStyle: {
            backgroundColor: '#000',
            
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 40,
          },
        }}>
        <Stack.Screen name="BeFake" component={HomeScreen}/>
        <Stack.Screen name="Gallery" component={ImageGallery} />
        <Stack.Screen name="Audio Recording" component={AudioRecorder}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
