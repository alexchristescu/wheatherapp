import React, { useState, useEffect } from "react";
import { Platform, Text, Image, View, StyleSheet } from "react-native";
import axios from "axios";
import * as Location from "expo-location";
// import { getWeatherInfo } from "./apiCalls";

const APIkey = "aa7e6029c04898d5269743696c86b119";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weatherInfo, setWeatherInfo] = useState(null);

  async function getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    console.log("location func", location);
  }

  async function getWeatherInfo() {
    console.log(location);
    let weather = await axios.post(
      `http://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=metric&appid=${APIkey}`
    );

    console.log(weather);

    setWeatherInfo(weather);
  }

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    getWeatherInfo();
  }, [location]);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  let textWeather = "Waiting..";
  let textWeatherLocation;
  let textWeatherTemp;

  if (errorMsg) {
    textWeather = errorMsg;
  } else if (weatherInfo) {
    textWeatherLocation = JSON.stringify(weatherInfo.data.name);
    textWeatherTemp = JSON.stringify(weatherInfo.data.main.temp);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
      <Image source={require("./sun.png")} />
      {/* <Text style={styles.paragraph}>{textWeatherLocation}</Text> */}
      <Text style={styles.paragraph}>{textWeatherTemp}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
