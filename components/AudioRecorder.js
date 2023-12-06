import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, Image } from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from "@react-native-async-storage/async-storage";

function getDurationFormatted(milliseconds) {
  const minutes = milliseconds / 1000 / 60;
  const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
  return seconds < 10 ? `${Math.floor(minutes)}:0${seconds}` : `${Math.floor(minutes)}:${seconds}`;
}

export default function AudioRecorder({ navigation }) {
  const [recording, setRecording] = useState();
  const [audios, setAudios] = useState([]);

  const startRecording = useCallback(async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        setRecording(recording);
      }
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    try {
      setRecording(undefined);

      await recording.stopAndUnloadAsync();
      const { sound, status } = await recording.createNewLoadedSoundAsync();
      const newRecording = {
        sound: sound,
        duration: getDurationFormatted(status.durationMillis),
        file: recording.getURI(),
      };

      const storedAudios = await AsyncStorage.getItem('audios');
      let audioList = storedAudios ? JSON.parse(storedAudios) : [];
      audioList.push(newRecording);
      await AsyncStorage.setItem('audios', JSON.stringify(audioList));
      setAudios([...audios, newRecording]);

      navigation.replace('Gallery');
    } catch (e) {
      console.error('Failed to stop recording:', e);
    }
  }, [audios, navigation, recording]);

  useEffect(() => {
    startRecording();
  }, [startRecording]);

  useEffect(() => {
    let timer;
    if (recording) {
      timer = setTimeout(() => {
        stopRecording();
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [recording, stopRecording]);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/mic.png")} style={styles.mic} />
      <Text style={styles.recordingText}>Audio is recording...</Text>
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
  mic: {
    width: 80,
    height: 80,
    tintColor: "#fff",
  },
  recordingText: {
    color: "#fff",
    fontSize: 25,
    marginTop: 30,
  },
});
