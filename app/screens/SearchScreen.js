import React, {useState, useEffect} from "react";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";
import { SearchBar, ListItem, Item, Icon } from 'react-native-elements';
import { useDebouncedCallback } from 'use-debounce';


import {FireSQL} from 'firesql';
import firebase from "firebase/app"

const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" });

export default function SearchScreen(props) {
  const { navigation } = props;
  const [discos, setDiscos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    onSearch();
  }, [search])

  const [onSearch] = useDebouncedCallback(() => {
    if(search){
      fireSQL
      .query(`SELECT * FROM discos WHERE name LIKE '${search}'`)
      .then(response => {
        setDiscos(response);
      })
    }
  }, 300)

  return (
    <View>
      <SearchBar
        placeholder = "Search your disco"
        onChangeText={e => setSearch(e)}
        value={search}
        containerStyle={styles.searchBar}
      />
      {discos.length === 0 ? (
        <NotFoundDiscos />
      ) : (
        <FlatList
          data={discos}
          renderItem={disco => <Disco disco={disco} navigation={navigation} />}
          keyExtractor = {(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

function Disco(props){
  const {disco, navigation} = props;
  const {name, images} = disco.item;
  const [imageDisco, setImagesDisco] = useState(null);

  useEffect(() => {
    const image = images[0];
    firebase.storage().ref(`disco-images/${image}`).getDownloadURL().then(response => {
      setImagesDisco(response);
    });
  }, [])

  return(
    <ListItem
      title={name}
      leftAvatar={{source: {uri:imageDisco}}}
      rightIcon ={<Icon type="material-community" name="chevron-right" />}
      onPress={() => navigation.navigate("Disco", {disco: disco.item})}
    />
  )
}

function NotFoundDiscos(){
  return(
    <View style={{flex: 1, alignItems: "center"}}>
      <Image
        source={require("../../assets/images/search.png")}
        resizeMode="cover"
        style={{width: 200, height: 200}}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 20
  }
})
