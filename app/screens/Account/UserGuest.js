import React from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import { Button } from "react-native-elements";
import { withNavigation } from "react-navigation";

function UserGuest(props) {
  const { navigation } = props;
  return (
    <ScrollView style={style.viewBody} centerContent={true}>
      <Image
        source={require("../../../assets/images/login.jpg")}
        style={style.image}
        resizeMode="contain"
      ></Image>
      <Text style={style.title}>Consulta tu perfil</Text>
      <Text style={style.description}>
        Busca y visualiza las mejores discos de Madrit, MG y COMMENT people
      </Text>
      <View style={style.viewButton}>
        <Button
          buttonStyle={style.buttonStyle}
          containerStyle={style.container}
          title="Ver tu perfil"
          onPress={() => navigation.navigate("Login")}
        ></Button>
      </View>
    </ScrollView>
  );
}

export default withNavigation(UserGuest);

const style = StyleSheet.create({
  viewBody: {
    marginLeft: 30,
    marginRight: 30
  },
  image: {
    height: 300,
    width: "100%",
    marginBottom: 40
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 10,
    textAlign: "center"
  },
  description: {
    fontSize: 13,
    marginBottom: 20,
    textAlign: "center"
  },
  viewButton: {
    flex: 1,
    alignItems: "center"
  },
  buttonStyle: {
    backgroundColor: "#00a680"
  },
  container: {
    width: "70%"
  }
});
