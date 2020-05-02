import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, ScrollView, Text, Dimensions} from 'react-native';
import Carousel from "../../components/Carousel";
import { Rating, Icon, ListItem } from "react-native-elements";
import Map from '../../components/Map';
import ListReviews from '../../components/Discos/ListReviews';
import Toast from 'react-native-easy-toast';

import { firebaseApp } from '../../utils/FireBase';
import firebase from 'firebase/app';
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

const screenWidth = Dimensions.get("window").width;


export default function Disco(props){
  const { navigation } = props;
  const { disco } = navigation.state.params;
  const [imagesDisco, setImagesDisco] = useState([]);
  const [rating, setRating] = useState(disco.rating);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const toastRef = useRef();

  firebase.auth().onAuthStateChanged(user => {
    user ? setUserLogged(true) : setUserLogged(false);
  })


  useEffect(() => {
    const arrayUrls = [];
    (async () => {
      await Promise.all(
        disco.images.map(async idImage => {
          await firebase
                .storage()
                .ref(`disco-images/${idImage}`)
                .getDownloadURL()
                .then(imageUrl => {
                  arrayUrls.push(imageUrl);
                });
        })
      );
      setImagesDisco(arrayUrls);
    })();
  }, []);

  useEffect(() => {
    if(userLogged){
      db.collection("favorites")
        .where("idDisco", "==", disco.id)
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .get()
        .then(response => {
          if(response.docs.length === 1){
            setIsFavorite(true);
          }
        });
    }
  }, [])

  const addFavorite = () => {
    if(!userLogged){
      toastRef.current.show("You must be logged to use favorites system", 2000)
    }else {
      const payload = {
        idUser: firebase.auth().currentUser.uid,
        idDisco: disco.id
      };

      db.collection("favorites").add(payload).then(() => {
        setIsFavorite(true);
        toastRef.current.show("Disco added to favorites")
      }).catch(() => {
        toastRef.current.show("Error when adding disco to favorites, try later")
      })
    }
  };

  const removeFavorite = () => {
    db.collection("favorites")
      .where("idDisco", "==", disco.id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then(response => {
        response.forEach(doc => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsFavorite(false);
              toastRef.current.show("Disco removed from favorites")
            }).catch(() => {
              toastRef.current.show("Error when deleting disco from favorites, try later")
            })
        });

      });
  };



  return(
    <ScrollView style={styles.viewBody}>
      <View style={styles.viewFavorites}>
        <Icon
          type="material-community"
          name={isFavorite ? "heart" : "heart-outline"}
          onPress={isFavorite ? removeFavorite : addFavorite}
          size={35}
          color={isFavorite ? "#00a680" : "#000"}
          underlayColor="transparent"
         />
      </View>
      <Carousel
        arrayImages={imagesDisco}
        width={screenWidth}
        height={200}

      />
      <TitleDisco
        name={disco.name}
        description={disco.description}
        rating={rating}
      />
      <DiscoInfo
        location={disco.location}
        name={disco.name}
        address={disco.address}
        phone={disco.phone}
        price={disco.price}
      />
      <ListReviews
        navigation={navigation}
        idDisco={disco.id}
        setRating={setRating}
      />
      <Toast ref={toastRef} position="center" opacity={0.5}/>
    </ScrollView>
  )
}

function TitleDisco(props){
  const { name, description, rating } = props;

  return(
    <View style={styles.viewDiscoTile}>
      <View style={{ flexDirection: "row" }} >
        <Text style={styles.nameDisco}> {name} </Text>
        <Rating
          style={styles.rating}
          imageSize={20}
          readonly
          startingValue={parseFloat(rating)}
        />
      </View>
      <Text style={styles.descriptionDisco}> {description} </Text>
    </View>

  )
}

function DiscoInfo(props){
  const { location, name, address, phone, price } = props;

  const listInfo = [
    {
      text: address,
      iconName: "map-marker",
      iconType: "material-community",
      action: null
    },
    {
      text: phone,
      iconName: "phone",
      iconType: "material-community",
      action: null
    },
    {
      text: price,
      iconName: "currency-eur",
      iconType: "material-community",
      action: null
    }
  ];

  return(
    <View style={styles.viewDiscoInfo}>
      <Text style={styles.discoInfoText}>  Disco info </Text>
      <Map
        location={location}
        name={name}
        height={100}
       />
       {listInfo.map((item, index) => (
         <ListItem
            key={index}
            title={item.text}
            leftIcon={{name: item.iconName, type: item.iconType, color: "#00a680"}}
            containerStyle={styles.containerListItem}
         />
       ))}
    </View>
  )

}


const styles = StyleSheet.create({
  viewBody:{
    flex:1
  },
  viewDiscoTile:{
    margin: 15
  },
  nameDisco:{
    fontSize: 20,
    fontWeight: "bold"
  },
  rating:{
    position: "absolute",
    right: 0,
  },
  descriptionDisco:{
    marginTop: 5,
    color: "grey"
  },
  viewDiscoInfo: {
    margin: 15,
    marginTop: 25
  },
  discoInfoText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  containerListItem:{
    borderBottomColor: "#d8d8d8",
    borderBottomWidth: 1
  },
  viewFavorites:{
    position:"absolute",
    top:0,
    right: 0,
    zIndex:2,
    backgroundColor: "#fff",
    borderBottomLeftRadius:100,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 5
  }
})
