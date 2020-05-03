import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet } from "react-native";
import ActionButton from 'react-native-action-button';
import ListDiscos from "../../components/Discos/ListDiscos";

import { firebaseApp } from "../../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function DiscosScren(props) {
  const { navigation } = props;
  const [user, setUser] = useState(null);
  const [discos, setDiscos] = useState([]);
  const [startDisco, setStartDisco] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalDiscos, setTotalDiscos] = useState(0);
  const [isReloadDiscos, setIsReloadDiscos] = useState(false);
  const limitDiscos = 8;

  useEffect(() => {
    firebase.auth().onAuthStateChanged(userInfo => {
      setUser(userInfo)
    })
  }, []);

  useEffect(() => {
    db.collection("events").get().then((snap) => {
      setTotalDiscos(snap.size);
    });

    (async () => {
      const resultDiscos = [];
      const events = db.collection("events").orderBy("createAt", "desc").limit(limitDiscos);

      await events.get().then(response => {
        setStartDisco(response.docs[response.docs.length - 1]);

        response.forEach(doc => {
          let disco = doc.data();
          disco.id = doc.id;
          resultDiscos.push({disco});
        });
        setDiscos(resultDiscos);

      });
    })();
    setIsReloadDiscos(false)
  }, [isReloadDiscos]);

  const handlerLoadMore = async () => {
    const resultDiscos = [];
    discos.length < totalDiscos && setIsLoading(true);

    const eventsDB = db
                     .collection("events")
                     .orderBy("createAt", "desc")
                     .startAfter(startDisco.data().createAt)
                     .limit(limitDiscos);

    await eventsDB.get().then(response => {
      if(response.docs.lenght > 0){
        setStartDisco(response.docs[response.docs.length - 1])
      } else {
        setIsLoading(false)
      }
    response.forEach(doc => {
      let disco = doc.data;
      disco.id = doc.id;
      resultDiscos.push(disco)
    });

    setDiscos([...discos, ...resultDiscos]);

    })
  }

  return (
    <View style={styles.viewBody}>
      <ListDiscos
          discos={discos}
          isLoading={isLoading}
          handlerLoadMore={handlerLoadMore}
          navigation={navigation}
          />
      {user && <AddDiscoButton navigation={navigation} setIsReloadDiscos={setIsReloadDiscos}/>}
    </View>
  );
}

function AddDiscoButton(props){
  const { navigation, setIsReloadDiscos } = props;
  return(
    <ActionButton
      buttonColor="#00a680"
      onPress={() => navigation.navigate("AddDisco", {setIsReloadDiscos})}
    />
  )
}

const styles = StyleSheet.create({
  viewBody:{
    flex: 1
  }
})
