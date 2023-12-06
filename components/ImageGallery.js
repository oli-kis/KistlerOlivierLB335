import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  Dimensions,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import ImageModal from "./ImageModal";
import Slider from "@react-native-community/slider";
import AudioController from "./AudioController";

const dimensions = Dimensions.get("window");
const imageHeight = Math.round((dimensions.width * 9) / 16);
const imageWidth = dimensions.width * 0.9;

export default function ImageGallery() {
  const [images, setImages] = useState([]);
  const [audios, setAudios] = useState([]);
  const [locations, setLocations] = useState([]);
  const [convertedLocations, setConvertedLocations] = useState([]);
  const [dates, setDates] = useState([]);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [weatherList, setWeatherList] = useState([]);
  const [playbackStatuses, setPlaybackStatuses] = useState({});

  const handleImagePress = (index) => {
    setSelectedImageIndex(index);
    toggleImageModal();
  };
  const handleImageDelete = async (index) => {
    if (audios[index] && audios[index].sound) {
      await audios[index].sound.unloadAsync();
    }
  
    const newImages = [...images];
  newImages.splice(index, 1);
  setImages(newImages);

  const newAudios = [...audios];
  newAudios.splice(index, 1);
  setAudios(newAudios);

  let newPlaybackStatuses = { ...playbackStatuses };
  delete newPlaybackStatuses[index];
  newPlaybackStatuses = Object.keys(newPlaybackStatuses).reduce((acc, key) => {
    const newIndex = parseInt(key) > index ? parseInt(key) - 1 : parseInt(key);
    acc[newIndex] = newPlaybackStatuses[key];
    return acc;
  }, {});
  setPlaybackStatuses(newPlaybackStatuses);

    const storedImages = await AsyncStorage.getItem("images");
    const imagesDelete = storedImages ? JSON.parse(storedImages) : [];
    imagesDelete.splice(index, 1);
    await AsyncStorage.setItem("images", JSON.stringify(imagesDelete));

    const storedAudios = await AsyncStorage.getItem("audios");
    const audiosDelete = storedAudios ? JSON.parse(storedAudios) : [];
    audiosDelete.splice(index, 1);
    await AsyncStorage.setItem("audios", JSON.stringify(audiosDelete));

    const storedTimestamps = await AsyncStorage.getItem("timestamps");
    const timestamps = storedTimestamps ? JSON.parse(storedTimestamps) : [];
    timestamps.splice(index, 1);
    await AsyncStorage.setItem("timestamps", JSON.stringify(timestamps));

    const storedLocations = await AsyncStorage.getItem("locations");
    const locations = storedLocations ? JSON.parse(storedLocations) : [];
    locations.splice(index, 1);
    await AsyncStorage.setItem("locations", JSON.stringify(locations));

    const storedWeather = await AsyncStorage.getItem("weather");
    const weather = storedWeather ? JSON.parse(storedWeather) : [];
    weather.splice(index, 1);
    await AsyncStorage.setItem("weather", JSON.stringify(weather));
  };

  useEffect(() => {
    async function fetchData() {
      await Promise.all([
        fetchImages(),
        fetchAudios(),
        fetchLocations(),
        fetchWeather(),
      ]);
      setIsDataLoaded(true);
    }

    fetchData();
  }, []);
  useEffect(() => {}, [images, audios, locations, convertedLocations, dates, playbackStatuses]);

  async function fetchImages() {
    try {
      const storedImages = await AsyncStorage.getItem("images");
      const parsedImages = storedImages ? JSON.parse(storedImages) : [];
      setImages(parsedImages);
    } catch (e) {
      console.error("Failed to fetch images:", e);
    }
  }

  async function fetchWeather() {
    try {
      const storedWeather = await AsyncStorage.getItem("weather");
      if (storedWeather) {
        const parsedWeather = JSON.parse(storedWeather);
        setWeatherList(parsedWeather);
      } else {
        setWeatherList([]);
      }
    } catch (e) {
      console.error("Failed to fetch Weather:", e);
    }
  }

  async function fetchAudios() {
    const updatedStatuses = {};
    try {
      const storedAudios = await AsyncStorage.getItem("audios");
      if (storedAudios) {
        const parsedAudios = JSON.parse(storedAudios);
        const updatedAudios = await Promise.all(
          parsedAudios.map(async (audio, index) => {
            try {
              await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
              });
              const { sound } = await Audio.Sound.createAsync({
                uri: audio.file,
              });
              sound.setOnPlaybackStatusUpdate((status) =>
                handlePlaybackStatusUpdate(index, status)
              );

              return { ...audio, sound };
            } catch (error) {
              console.error("Error loading audio:", error);
              return { ...audio, sound: null };
            }
          })
        );
        setAudios(updatedAudios);
        updatedAudios.forEach((audio, index) => {
          updatedStatuses[index] = { playing: false, position: 0, duration: 0 };
        });
        setPlaybackStatuses(updatedStatuses);
      } else {
        setAudios([]);
      }
    } catch (e) {
      console.error("Failed to fetch audios:", e);
    }
  }

  const handlePlayPause = async (index) => {
    try {
      let status;
      if (playbackStatuses[index] && playbackStatuses[index].playing) {
        status = await audios[index].sound.pauseAsync();
      } else if (playbackStatuses[index] && playbackStatuses[index].position >= 3005) {
        status = await audios[index].sound.replayAsync();
      } else {
        status = await audios[index].sound.playAsync();
      }
      updatePlaybackStatus(index, status);
    } catch (error) {
      console.error("Error during play/pause:", error);
    }
  };

  const handlePlaybackStatusUpdate = (index, status) => {
    try{
    if (status.didJustFinish) {
      const updatedStatuses = { ...playbackStatuses };
      updatedStatuses[index] = {
        playing: false,
        position: 0,
        duration: status.durationMillis,
      };
      setPlaybackStatuses(updatedStatuses);
    } else {
      updatePlaybackStatus(index, status);
    }}
    catch(error){
      console.error("Error during handle Playback status" + error)
    }
  };

  const updatePlaybackStatus = (index, status) => {
    try{
    if (status.isLoaded) {
      const updatedStatuses = { ...playbackStatuses };
      updatedStatuses[index] = {
        playing: status.isPlaying,
        position: status.positionMillis,
        duration: status.durationMillis,
      };
      setPlaybackStatuses(updatedStatuses);
    }}
    catch(error){
      console.error("Error during update Playback status" + error)
    }
  };

  async function fetchLocations() {
    try {
      const storedLocations = await AsyncStorage.getItem("locations");
      const parsedLocations = storedLocations
        ? JSON.parse(storedLocations)
        : [];
      setLocations(parsedLocations);

      const timestamps = await AsyncStorage.getItem("timestamps");
      const parsedTimestamps = timestamps ? JSON.parse(timestamps) : [];
      const datesArray = parsedTimestamps.map((timestamp) => {
        return timestamp;
      });
      setDates(datesArray);

      const newConvertedLocations = await Promise.all(
        parsedLocations.map(async (location) => {
          try {
            const response = await fetch(
              `https://api.geoapify.com/v1/geocode/reverse?lat=${location.latitude}&lon=${location.longitude}&apiKey=ef258a4f141b44d9adad0793a35c674a`
            );
            const result = await response.json();
            const properties = result.features[0].properties;
            return {
              address: properties.address_line1,
              place: properties.address_line2,
            };
          } catch (error) {
            console.error("Error fetching location:", error);
            return { address: "Unknown", place: "Unknown" };
          }
        })
      );
      setConvertedLocations(newConvertedLocations);
    } catch (e) {
      console.error("Failed to fetch locations:", e);
    }
  }

  function toggleImageModal() {
    setImageModalVisible(!imageModalVisible);
  }

  async function ClearImages() {
    AsyncStorage.removeItem("images");
  }
  async function ClearAudios() {
    AsyncStorage.removeItem("audios");
  }
  async function ClearLocations() {
    AsyncStorage.removeItem("locations");
  }
  async function ClearTimestamps() {
    AsyncStorage.removeItem("timestamps");
  }
  async function ClearWeather() {
    AsyncStorage.removeItem("weather");
  }
  {
    /*
ClearImages();
ClearAudios();
ClearLocations();
ClearTimestamps();
ClearWeather();*/
  }

  if (!isDataLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.galleryContainer}>
        {images.map((image, index) => (
          <View key={`item-${index}`} style={styles.imageContainer}>
            <View style={styles.imageControlls}>
              <TouchableOpacity
                key={`opacity-${index}`}
                onPress={() => handleImagePress(index)}
              >
                <Image
                  style={styles.info}
                  source={require("../assets/info.png")}
                ></Image>
              </TouchableOpacity>
              <TouchableOpacity
                key={`delete-${index}`}
                onPress={() => handleImageDelete(index)}
              >
                <Image
                  style={styles.delete}
                  source={require("../assets/delete.png")}
                ></Image>
              </TouchableOpacity>
            </View>
            <Image
              key={`image-${index}`}
              source={{ uri: image }}
              style={styles.image}
            />
            <AudioController
            index={index}
            playbackStatuses={playbackStatuses}
            audios={audios}
            handlePlayPause={handlePlayPause}>
            </AudioController>
            {selectedImageIndex !== null && (
              <ImageModal
                imageModalVisible={imageModalVisible}
                toggleImageModal={toggleImageModal}
                time={dates[selectedImageIndex]}
                address={convertedLocations[selectedImageIndex].address}
                place={convertedLocations[selectedImageIndex].place}
                weather={weatherList[selectedImageIndex]}
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
    height: "100%",
  },
  galleryContainer: {
    height: "auto",
    width: "100%",
    marginVertical: 20,
  },
  imageContainer: {
    marginVertical: 20,
  },
  image: {
    width: imageWidth,
    height: imageHeight,
    resizeMode: "contain",
  },
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
  playControlls:{
    tintColor: "#fff",
    width: 50,
    height: 50,
    alignItems: "center"
  },
  audioControlls:{
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  }
});
