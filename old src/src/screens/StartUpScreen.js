import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, } from "react-native";
import { COLORS } from "../assets/theme";

const StartUpScreen = ({ navigation }) => {

    useEffect(() => {
        setTimeout(()=>{
            navigation.navigate("Auth")
        },100)
     
    }, []);

    return (
        <View style={styles.window}>
            <ActivityIndicator size="large" color={COLORS.primaryBackgroundColor} />
        </View>
    );
};

const styles = StyleSheet.create({
    window: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default StartUpScreen;

