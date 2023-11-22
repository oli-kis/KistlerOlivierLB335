import {
    StyleSheet,
    View,
    ScrollView,
    Image,
    Text,
    Dimensions,
    Button
  } from "react-native";
  import React, { useState, useEffect } from 'react';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { Audio } from 'expo-av';

  const dimensions = Dimensions.get('window');
  const imageHeight = Math.round(dimensions.width * 9 / 16);
  const imageWidth = dimensions.width*0.9;
  
export default function ImageGallery(){
    const [images, setImages] = useState([]);
    const [audios, setAudios] = React.useState([]);

  useEffect(() => {
    fetchImages();
    fetchAudios();
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

  const fetchAudios = async () => {
    try {
      const storedAudios = await AsyncStorage.getItem('audios');
      if (storedAudios) {
        const parsedAudios = JSON.parse(storedAudios);
        const updatedAudios = await Promise.all(parsedAudios.map(async (audio) => {
          const { sound } = await Audio.Sound.createAsync({ uri: audio.file });
          return { ...audio, sound };
        }));
        setAudios(updatedAudios);
      } else {
        setAudios([]);
      }
    } catch (e) {
      console.error('Failed to fetch audios:', e);
    }
  };

  function getRecordingLines() {
    return audios.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          {/*<Text style={styles.fill}>
            Recording #{index + 1} | {recordingLine.duration}
      </Text>*/}
          <Button onPress={() => recordingLine.sound.replayAsync()} title="Play Audio"></Button>
        </View>
      );
    });
  }
async function ClearImages(){ AsyncStorage.setItem("images", "")};
async function ClearAudios(){ AsyncStorage.setItem("audios", "")};
  return (
    <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.galleryContainer}>
      {images.map((image, index) => (
        <View>
        <Image key={`image-${index}`}source={{ uri: image }} style={styles.image} />
        <Button key={`audio-${index}`} onPress={() => audios[index].sound.replayAsync()} title="Play Audio"></Button>
        </View>
      ))}
    </ScrollView>
    </View>
  );
  }
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: "#000",
      alignItems: "center",
      height: "100%"
    },
    galleryContainer: {
        height: "auto",
        width: "100%",
        marginVertical: 20,
      },
      image: {
       width: imageWidth,
        height: imageHeight,
        marginVertical: 10,
        resizeMode: "contain"
      },
    });
    