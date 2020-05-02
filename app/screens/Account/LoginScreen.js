import React, { useRef } from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Divider } from "react-native-elements";
import LoginForm from "../../components/MyAccount/LoginForm";
import Toast from "react-native-easy-toast";
import LoginFacebook from "../../components/MyAccount/LoginFacebook";

export default function LoginScreen(props) {
  const { navigation } = props;
  const toastRef = useRef();

  return (
    <ScrollView>
      <Image
        source={require("../../../assets/images/login.jpg")}
        style={style.logo}
        resizeMode="contain"
      />
      <View style={style.view}>
        <LoginForm toastRef={toastRef} />
        <CreateAccount navigation={navigation} />
      </View>
      <Divider style={style.divider} />
      <View style={style.view}>
        <LoginFacebook toastRef={toastRef} navigation={navigation} />
      </View>
      <Toast ref={toastRef} position="center" opacity={0.5}></Toast>
    </ScrollView>
  );
}

function CreateAccount(props) {
  const { navigation } = props;

  return (
    <Text style={style.register}>
      ¿Aun no tienes una cuenta?{" "}
      <Text
        style={style.buttonRegister}
        onPress={() => navigation.navigate("Register")}
      >
        Registrate
      </Text>
    </Text>
  );
}

const style = StyleSheet.create({
  logo: {
    width: "100%",
    height: 150,
    marginTop: 20,
    justifyContent: "center"
  },
  view: {
    marginRight: 40,
    marginLeft: 40
  },
  divider: {
    backgroundColor: "#00a680",
    margin: 40
  },
  register: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10
  },
  buttonRegister: {
    color: "#00a680",
    fontWeight: "bold"
  }
});
