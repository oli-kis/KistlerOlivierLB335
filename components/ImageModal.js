import React from "react";
import { View, StyleSheet, Modal, Pressable, Text, KeyboardAvoidingView, Platform } from "react-native";

export default function ImageModal({ imageModalVisible, toggleImageModal, time, place, address, weather }) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={imageModalVisible}
            onRequestClose={toggleImageModal}
        >
            <KeyboardAvoidingView
                style={styles.centeredView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                enabled
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Image Info</Text>
                    <Text>Time: {time}</Text>
                    <Text>Place: {place}</Text>
                    <Text>Address: {address}</Text>
                    <Text>Weather: {weather}</Text>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={toggleImageModal}
                    >
                        <Text style={styles.textStyle}>Hide Modal</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "90%",
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginVertical: 10,
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontWeight: "600",
        fontSize: 20,
    },
});
