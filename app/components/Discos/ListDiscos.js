import React, {useState, useEffect} from "react";
import {View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity} from "react-native";
import { Image } from "react-native-elements";
import * as firebase from "firebase";

export default function ListDiscos(props){
  const { discos, isLoading, handlerLoadMore, navigation } = props;
  return(
    <View>
      {discos ? (
        <FlatList
          data={discos}
          renderItem={disco => <Disco disco={disco} navigation={navigation}/>}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={handlerLoadMore}
          onEndReachedThreshold={0}
          ListFooterComponent={<FooterList isLoading={isLoading}/>}
        />
      ) : (
        <View style={styles.loaderDiscos}>
          <ActivityIndicator size="large" />
          <Text> Loading </Text>
        </View>
      )}
    </View>
  )
}

function Disco(props){
  const {disco, navigation} = props;
  const {name, address, description, images} = disco.item.disco;
  const [imageDisco, setImageDisco] = useState(null);

useEffect(() =>{
  const image = images[0];
  firebase.storage().ref(`disco-images/${image}`).getDownloadURL().then(result => {
    setImageDisco(result)
  })
})

  return(
    <TouchableOpacity onPress={() => navigation.navigate("Disco", {disco: disco.item.disco})}>
      <View style={styles.viewDisco}>
        <View style={styles.viewDiscoImage}>
          <Image
            resizeMode="cover"
            source={{uri: imageDisco}}
            style={styles.imageDisco}
            PlaceholderContent={<ActivityIndicator color="fff"/>}
            />
        </View>
        <View>
          <Text style={styles.discoName}>{name}</Text>
          <Text style={styles.discoAddress}>{address}</Text>
          <Text style={styles.discoDescription}>{description.substr(0, 60)}...</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function FooterList(props){
  const {isLoading} = props;

  if(isLoading){
    return(
      <View style={styles.loadingDiscos}>
        <ActivityIndicator size="large"/>
      </View>
    );
  } else {
    return(
      <View style={styles.notFoundDiscos}>
        <Text> No discos left to get </Text>
      </View>
  );
  }

}

const styles = StyleSheet.create({
  loadingDiscos:{
    marginTop: 20,
    alignItems:"center"
  },
  viewDisco:{
    flexDirection: "row",
    margin: 10
  },
  viewDiscoImage:{
    marginRight: 15
  },
  imageDisco:{
    width:80,
    height:80
  },
  discoName:{
    fontWeight:"bold"
  },
  discoAddress:{
    paddingTop:2,
    color: "grey"
  },
  discoDescription:{
    paddingTop: 2,
    color: "grey",
    width: 300
  },
  notFoundDiscos:{
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center"
  },
  loaderDiscos:{
    marginTop: 10,
    marginBottom: 10
  }
})
