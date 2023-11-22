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

  useEffect(() => {
    fetchImages();
    fetchAudios();
    fetchLocations();
  }, []);

  function toggleImageModal(){
    setImageModalVisible(!imageModalVisible);
  }
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

  const fetchLocations = async () => {
    try {
      const storedLocations = await AsyncStorage.getItem('locations');
      const parsedLocations = storedLocations ? JSON.parse(storedLocations) : [];
      setLocations(parsedLocations);

      const datesArray = locations.map(location => {
        const imageDate = new Date(location.timestamp);

        const day = String(imageDate.getDate()).padStart(2, '0');
        const month = String(imageDate.getMonth() + 1).padStart(2, '0');
        const year = imageDate.getFullYear();
      
        const hours = String(imageDate.getHours()).padStart(2, '0');
        const minutes = String(imageDate.getMinutes()).padStart(2, '0');
        const seconds = String(imageDate.getSeconds()).padStart(2, '0');
      
        const formattedImageDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        return formattedImageDate;
      });
      setDates(datesArray);

      const fetchPromises = locations.map(location =>
        fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${location.coords.latitude}&lon=${location.coords.longitude}&apiKey=ef258a4f141b44d9adad0793a35c674a`)
          .then(response => response.json())
          .then(result => {
            console.log("result");
            console.log("result");
            console.log("result");
            console.log(result.features[0].properties);
            const ImageAddress = result.features[0].properties.address_line1;
            const ImagePlace = result.features[0].properties.address_line2;
            return  {address: ImageAddress, place: ImagePlace};
          })
          .catch(error => console.log('error', error))
      );

      const newConvertedLocations = await Promise.all(fetchPromises);
      setConvertedLocations(newConvertedLocations);
      console.log("Location");
      console.log("Location");
      console.log(newConvertedLocations);
    } catch (e) {
      console.error('Failed to fetch locations:', e);
    }
  };
async function ClearImages(){ AsyncStorage.setItem("images", "")};
async function ClearAudios(){ AsyncStorage.setItem("audios", "")};
async function ClearLocations(){ AsyncStorage.setItem("locations", "")};

  return (
    <View style={styles.container}>
    {/*<ScrollView contentContainerStyle={styles.galleryContainer}>
      {images.map((image, index) => (
        console.log("Image", image, "Audio", audios[index], "Date", dates[index], "Location", convertedLocations[index]),
        <View key={`item-${index}`} style={styles.imageContainer}>
          <TouchableOpacity key={`opacity-${index}`} onPress={toggleImageModal}>
            <Image style={styles.info} source={require("../assets/info.png")}></Image>
          </TouchableOpacity>
          <Image key={`image-${index}`} source={{ uri: image }} style={styles.image} />
          <Button key={`audio-${index}`} onPress={() => audios[index].sound.replayAsync()} title="Play Audio"></Button>
          <ImageModal imageModalVisible={imageModalVisible} toggleImageModal={toggleImageModal} time={dates[index]} address={convertedLocations[index].address} place={convertedLocations[index].place}></ImageModal>
        </View>
      ))}
      </ScrollView>*/}
      <Text>Dies ist ein Test</Text>
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
    