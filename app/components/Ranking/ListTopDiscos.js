import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, FlatList, TouchableOpacity} from 'react-native';
import {Card, Image, Icon, Rating} from 'react-native-elements';
import * as firebase from 'firebase';



export default function ListTopDiscos(props){
  const {discos, navigation} = props;
  return(
      <FlatList
        data={discos}
        renderItem={disco => <Disco disco={disco} navigation={navigation}/>}
        keyExtractor={(item,index) => index.toString()}
      />
  )
}

function Disco(props){
  const {disco, navigation} = props;
  const {name, description, images, rating} = disco.item;
  const [imageDisco, setImageDisco] = useState(null);
  const [iconColor, setIconColor] = useState("#000");

  useEffect(() => {
    const image = images[0];

    firebase.storage().ref(`disco-images/${image}`).getDownloadURL().then(response => {
      setImageDisco(response)
    })
  }, []);

  useEffect(() => {
    if(disco.index === 0){
      setIconColor("#efb819")
    } else if (disco.index === 1){
      setIconColor("#e3e4e5")
    } else if (disco.index === 2) {
      setIconColor("#cd7f32")
    }
  })

  return(
    <TouchableOpacity onPress={() => navigation.navigate("Disco", {disco: disco.item})} >
      <Card containerStyle={styles.card}>
        <Icon
          type="material-community"
          name="chess-queen"
          color={iconColor}
          size={40}
          containerStyle={styles.containerIcon}
        />
        <Image
          style={styles.discoImage}
          resizeMode="cover"
          source={{uri: imageDisco}}
        />
        <View style={styles.titleRanking}>
          <Text style={styles.title}> {name} </Text>
          <Rating
            imageSize={20}
            startingValue={rating}
            readonly
            style={styles.rating}
          />
        </View>
      <Text style={styles.description}> {description} </Text>
      </Card>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card:{
    marginBottom:30,
    borderWidth:0,
    backgroundColor: "#f2f2f2"
  },
  discoImage:{
    width: "100%",
    height: 200
  },
  titleRanking:{
    flexDirection:"row",
    marginTop:10
  },
  title:{
    fontSize: 20,
    fontWeight: "bold"
  },
  rating:{
    position: "absolute",
    right: 0
  },
  description:{
    textAlign:"justify",
    marginTop:0,
    color:"grey"
  },
  containerIcon:{
    position: "absolute",
    top: -30,
    left: -30,
    zIndex: 1
  }
});
