import {
    StyleSheet,
    View,
    ScrollView,
    Image,
    Text
  } from "react-native";
  import React, { useState, useEffect } from 'react';
  import AsyncStorage from '@react-native-async-storage/async-storage';

  
export default function ImageGallery(){
    const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const storedImages = await AsyncStorage.getItem('images');
      const parsedImages = storedImages ? JSON.parse(storedImages) : [];
      setImages(parsedImages);
    } catch (e) {
      console.error('Failed to fetch images:', e);
    }
  };

  return (
    <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.galleryContainer}>
      {images.map((image, index) => (
        <Image key={index} source={{ uri: image }} style={styles.image} />
      ))}
    </ScrollView>
    </View>
  );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000",
      alignItems: "center",
      justifyContent: "center",
    },
    galleryContainer: {
        height: "auto",
      },
      image: {
        width: 200,
        height: 200,
        marginVertical: 10,
      },
    });
    