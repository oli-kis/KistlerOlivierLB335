import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default function AudioController(props) {
  const index = props.index;
  const playbackStatuses = props.playbackStatuses;
  const audios = props.audios;
  return (
    <View style={styles.audioControlls}>
      <TouchableOpacity onPress={() => props.handlePlayPause(index)}>
        <Image
          style={styles.playControlls}
          source={
            playbackStatuses[index]?.playing
              ? require("../assets/pause.png")
              : require("../assets/play.png")
          }
        ></Image>
      </TouchableOpacity>

      <Slider
        style={{ width: wp("60%"), height: 40 }}
        minimumValue={0}
        maximumValue={playbackStatuses[index]?.duration || 0}
        value={
          playbackStatuses[index]?.position == playbackStatuses[index]?.duration
            ? 0
            : playbackStatuses[index]?.position
        }
        onSlidingComplete={async (value) => {
          try {
            if (audios[index].sound) {
              await audios[index].sound.setPositionAsync(value);
            }
            if (
              audios[index].sound &&
              value == playbackStatuses[index]?.duration
            ) {
              await audios[index].sound.setPositionAsync(0);
            }
          } catch (error) {
            console.error("Error while setting audio position:", error);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  playControlls: {
    tintColor: "#fff",
    width: 50,
    height: 50,
    alignItems: "center",
  },
  audioControlls: {
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
});
