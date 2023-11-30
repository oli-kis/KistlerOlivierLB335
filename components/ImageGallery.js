import {
    StyleSheet,
    View,
    ScrollView,
    Image,
    Text,
    Dimensions,
    Button,
    TouchableOpacity
  } from "react-native";
  import React, { useState, useEffect } from 'react';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { Audio } from 'expo-av';
  import ImageModal from "./ImageModal";

  const dimensions = Dimensions.get('window');
  const imageHeight = Math.round(dimensions.width * 9 / 16);
  const imageWidth = dimensions.width*0.9;
  const infoMargin = dimensions.width-imageWidth; 
  
export default function ImageGallery(){
    const [images, setImages] = useState([]);
    const [audios, setAudios] = useState([]);
    const [locations, setLocations] = useState([]);
    const [convertedLocations, setConvertedLocations] = useState([]);
    const [dates, setDates] = useState([]);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

const handleImagePress = (index) => {
  setSelectedImageIndex(index);
  toggleImageModal();
};

  useEffect(() => {
    async function fetchData() {
      await Promise.all([fetchImages(), fetchAudios(), fetchLocations()]);
      setIsDataLoaded(true);
    }

    fetchData();
  }, []);
  useEffect(() => {
  }, [images, audios, locations, convertedLocations, dates]);

   async function fetchImages () {
    try {
      const storedImages = await AsyncStorage.getItem('images');
      const parsedImages = storedImages ? JSON.parse(storedImages) : [];
      setImages(parsedImages);
    } catch (e) {
      console.error('Failed to fetch images:', e);
    }
  };

  async function fetchAudios() {
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

  async function fetchLocations ()  {
    try {
      const storedLocations = await AsyncStorage.getItem('locations');
      const parsedLocations = storedLocations ? JSON.parse(storedLocations) : [];
      setLocations(parsedLocations);

      const timestamps = await AsyncStorage.getItem("timestamps");
      const parsedTimestamps = timestamps ? JSON.parse(timestamps) : [];
      const datesArray = parsedTimestamps.map(timestamp => {
        return timestamp;
      });
      setDates(datesArray);

      const newConvertedLocations = await Promise.all(parsedLocations.map(async location => {
        try {
          const response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${location.latitude}&lon=${location.longitude}&apiKey=ef258a4f141b44d9adad0793a35c674a`);
          const result = await response.json();
          const properties = result.features[0].properties;
          return { address: properties.address_line1, place: properties.address_line2 };
        } catch (error) {
          console.error('Error fetching location:', error);
          return { address: 'Unknown', place: 'Unknown' };
        }
      }));
      setConvertedLocations(newConvertedLocations);
    } catch (e) {
      console.error('Failed to fetch locations:', e);
    }
  };

  function toggleImageModal(){
    setImageModalVisible(!imageModalVisible);
  }

async function ClearImages(){ AsyncStorage.removeItem("images")};
async function ClearAudios(){ AsyncStorage.removeItem("audios")};
async function ClearLocations(){ AsyncStorage.removeItem("locations")};
{/*
ClearImages();
ClearAudios();
ClearLocations();*/}

if (!isDataLoaded) {
  return <View style={styles.container}>
           <Text>Loading daa...</Text>
         </View>;
}

  return (
    <View style={styles.container}> 
    <ScrollView contentContainerStyle={styles.galleryContainer}>
      {images.map((image, index) => (
        <View key={`item-${index}`} style={styles.imageContainer}>
          <TouchableOpacity key={`opacity-${index}`} onPress={() => handleImagePress(index)}>
            <Image style={styles.info} source={require("../assets/info.png")}></Image>
          </TouchableOpacity>
          <Image key={`image-${index}`} source={{ uri: image }} style={styles.image} />
          <Button key={`audio-${index}`} onPress={() => audios[index].sound.playAsync()} title="Play Audio"></Button>
          {selectedImageIndex !== null && (
          <ImageModal
            imageModalVisible={imageModalVisible}
            toggleImageModal={toggleImageModal}
            time={dates[selectedImageIndex]}
            address={convertedLocations[selectedImageIndex].address}
            place={convertedLocations[selectedImageIndex].place}
          />
        )}
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
      imageContainer:{
        marginVertical: 20,
      },
      image: {
       width: imageWidth,
        height: imageHeight,
        resizeMode: "contain"
      },
      info:{
        tintColor: "#fff",
        width: 40,
        height: 40,
        marginLeft: infoMargin,
      }
    });
    