import React, { useState, useEffect } from "react";
//import { StyleSheet, Text, View } from "react-native";
//import { Button, Icon } from "react-native-elements";
//no puedo importar el Button de react pq no puede haber dos elementos con mismo nombre
import Navigation from "./app/navigations/Navigation";
import { firebaseApp } from "./app/utils/FireBase";

export default function App() {
  return <Navigation />;
}
