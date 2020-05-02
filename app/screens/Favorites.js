import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert} from 'react-native';
import { Image, Icon, Button } from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import Loading from '../components/Loading';
import { NavigationEvents } from 'react-navigation';

import { firebaseApp } from '../utils/FireBase';
import firebase from 'firebase/app';
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);


export default function Favorites(props){
  const { navigation } = props;
  const [discos, setDiscos] = useState([]);
  const [reloadDiscos, setReloadDiscos] = useState(false);
  const [isVisibleLoading, setIsVisibleLoading] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const toastRef = useRef();

  firebase.auth().onAuthStateChanged(user => {
    user ? setUserLogged(true) : setUserLogged(false)
  });


  useEffect(() => {
    if(userLogged){
      const idUser = firebase.auth().currentUser.uid;
      db.collection("favorites")
        .where("idUser", "==", idUser)
        .get()
        .then(response => {
          const idDiscosArray = [];
          response.forEach(doc => {
            idDiscosArray.push(doc.data().idDisco)
          });
      getDataDiscos(idDiscosArray).then(response => {
        const discos = [];
        response.forEach(doc => {
          let disco = doc.data();
          disco.id = doc.id;
          discos.push(disco);
        });
      setDiscos(discos);
      });
    });
  }
  setReloadDiscos(false);
}, [reloadDiscos]);

  if(!userLogged){
    return(<UserNotLogged setReloadDiscos={setReloadDiscos} navigation={navigation}/>)
  }

  if(discos.length === 0) return <NotFoundDiscos setReloadDiscos={setReloadDiscos}/>;

  return(
    <View style={styles.viewBody}>
      <NavigationEvents onWillFocus={() => setReloadDiscos(true)}/>
      {discos ? (
        <FlatList
          data={discos}
          renderItem={disco =>
            <Disco
              disco={disco}
              navigation={navigation}
              setIsVisibleLoading={setIsVisibleLoading}
              setReloadDiscos={setReloadDiscos}
              toastRef={toastRef}
              />}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.loaderDiscos}>
          <ActivityIndicator size="large"/>
          <Text> Loading discos </Text>
        </View>
      )}
      <Toast ref={toastRef} position="center" opacity={1} />
      <Loading text="Deleting disco from favorites" isVisible={isVisibleLoading}/>
    </View>
  )
}

const getDataDiscos = idDiscosArray => {
  const arrayDiscos = [];

  idDiscosArray.forEach(idDisco => {
    const result = db.collection("discos").doc(idDisco).get();
    arrayDiscos.push(result)
  });

  return Promise.all(arrayDiscos);

}

function Disco(props){
  const { disco, navigation, setIsVisibleLoading, setReloadDiscos, toastRef} = props;
  const { id, name, images } = disco.item;
  const [imageDisco, setImageDisco] = useState(null);

  useEffect(() => {
    const image = images[0];

    firebase.storage().ref(`disco-images/${image}`).getDownloadURL().then(response => {
      setImageDisco(response);
    });

  }, []);

  const confirmRemoveFavorite = () => {
    Alert.alert(
      "Remove disco from favorites",
      "Are you sure you want to remove it from favorites?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          onPress: removeFavorite
        }
      ],
      {cancelable: false}
    )
  };

  const removeFavorite = () => {
    setIsVisibleLoading(true);

    db.collection("favorites")
      .where("idDisco", "==", id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then(response => {
        response.forEach(doc => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsVisibleLoading(false);
              setReloadDiscos(true);
              toastRef.current.show("Disco removed from favorites")
            }).catch(() => {
              toastRef.current.show("Error when deleting disco from favorites, try later")
            })
        });

      });
  };

  return(
    <View style={styles.disco}>
      <TouchableOpacity onPress={() => navigation.navigate("Disco", {disco: disco.item})}>
        <Image
          resizeMode="cover"
          source={{uri: imageDisco}}
          style={styles.image}
          PlaceholderContent={<ActivityIndicator color="#fff"/>}
        />
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={styles.name}> {name} </Text>
        <Icon
          type="material-community"
          name="heart"
          color="#00a680"
          containerStyle={styles.favorite}
          onPress={confirmRemoveFavorite}
          size={40}
          underlayColor="transparent"
        />
      </View>
    </View>
  )
}

function NotFoundDiscos(props){
  const {setReloadDiscos} = props;
  return(
    <View style={{flex: 1, alignItems:"center", justifyContent:"center"}}>
      <NavigationEvents onWillFocus={() => setReloadDiscos(true)}/>
      <Icon
        type="material-community"
        name="alert-outline"
        size={50}
      />
      <Text style={{fontSize: 20, fontWeight: "bold"}}> No discos in favorites list </Text>
    </View>
  )
}

function UserNotLogged(props){
  const {setReloadDiscos, navigation} = props;
  return(
    <View style={{flex: 1, alignItems:"center", justifyContent:"center"}}>
      <NavigationEvents onWillFocus={() => setReloadDiscos(true)}/>
      <Icon
        type="material-community"
        name="alert-outline"
        size={50}
      />
      <Text style={{fontSize: 20, fontWeight: "bold", textAlign:"center"}}> You need to be logged to see favorites </Text>
      <Button
        title="Log in"
        onPress={() => navigation.navigate("Login")}
        containerStyle={{marginTop: 20, width: "80%"}}
        buttonStyle={{backgroundColor: "#00a680"}}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  loaderDiscos:{
    marginTop: 10,
    marginBottom: 10
  },
  viewBody:{
    flex: 1,
    backgroundColor: "#f2f2f2"
  },
  disco:{
    margin: 10,
  },
  image:{
    width: "100%",
    height: 180
  },
  info:{
    flex:1,
    alignItems: "center",
    justifyContent:"space-between",
    flexDirection:"row",
    paddingLeft:20,
    paddingRight:20,
    paddingTop:10,
    paddingBottom:10,
    marginTop: -30,
    backgroundColor: "#fff"
  },
  name:{
    fontWeight: "bold",
    fontSize:20
  },
  favorite:{
    marginTop: -35,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius:100
  }
})
