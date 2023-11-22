import React, { useState, useEffect, } from "react";
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AudioRecorder({navigation}) {
  const [recording, setRecording] = React.useState();
  const [audios, setAudios] = React.useState([]);

  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        setRecording(recording);
      }
    } catch (err) {}
  }

  async function stopRecording() {
    setRecording(undefined);
  
    await recording.stopAndUnloadAsync();
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    const newRecording = {
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI()
    };
  
    try {
      const storedAudios = await AsyncStorage.getItem('audios');
      let audioList = storedAudios ? JSON.parse(storedAudios) : [];
  
      audioList.push(newRecording);
      await AsyncStorage.setItem('audios', JSON.stringify(audioList));
  
      setAudios([...audios, newRecording]);

      navigation.navigate("Gallery");
    } catch (e) {
      console.error('Failed to save audio:', e);
    }
  }
  

  function getDurationFormatted(milliseconds) {
    const minutes = milliseconds / 1000 / 60;
    const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
    return seconds < 10 ? `${Math.floor(minutes)}:0${seconds}` : `${Math.floor(minutes)}:${seconds}`
  }

  useEffect(() => {
    const startAutoRecording = async () => {
      await startRecording();
    };

    startAutoRecording();
  }, []);

  useEffect(() => {
    let timer;
    if (recording) {
      timer = setTimeout(() => {
        stopRecording();
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [recording]);
  
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
          <Text style={styles.fill}>
            Recording #{index + 1} | {recordingLine.duration}
          </Text>
          <Button onPress={() => recordingLine.sound.replayAsync()} title="Play"></Button>
        </View>
      );
    });
  }

  async function clearRecordings() {
    return (
        await AsyncStorage.setItem("audios", "").then(
        setAudios([])))
  }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/mic.png")} style={styles.mic}></Image>
      <Text style={styles.recordingText}>Audio is recording...</Text>
      {/*
      <Button title={recording ? 'Stop Recording' : 'Start Recording\n\n\n'} onPress={recording ? stopRecording : startRecording} />
      {getRecordingLines()}
  <Button title={audios.length > 0 ? '\n\n\nClear Recordings' : ''} onPress={clearRecordings} />*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 40
  },
  fill: {
    flex: 1,
    margin: 15,
    color: "#fff"
  },
  mic:{
    width: 80,
    height: 80,
    tintColor: "#fff",
  },
  recordingText:{
    color: "#fff",
    fontSize: 25,
    marginTop: 30,
  }

});