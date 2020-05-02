import React, {useState, useRef, useEffect} from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { Card, Image, Rating} from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import ListTopDiscos from '../components/Ranking/ListTopDiscos';

import { firebaseApp } from "../utils/FireBase";
import firebase from 'firebase/app';
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function TopDiscosScreen(props) {
  const {navigation} = props;
  const [discos, setDisos] = useState([]);
  const toastRef = useRef();

  useEffect(() =>{
    (async () =>{
      db.collection("discos")
        .orderBy("rating", "desc")
        .limit(5)
        .get()
        .then(response => {
          const arrayResult = [];
          response.forEach(doc => {
            let disco = doc.data();
            disco.id = doc.id;
            arrayResult.push(disco);
          });
          setDisos(arrayResult)
        }).catch(() => {
          toastRef.current.show("Error while getting the ranking, try later", 2000);
        });
    })();
  }, []);

  return (
    <View>
      <ListTopDiscos discos={discos} navigation={navigation}/>
      <Toast ref={toastRef} position="center" opacity={1} />
    </View>
  );
}
