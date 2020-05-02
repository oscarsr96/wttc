import React, { useRef } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
//import { KeyboardAwareView } from "react-native-keyboard-aware-view";
import RegisterForm from "../../components/MyAccount/RegisterForm";
import Toast from "react-native-easy-toast";

export default function RegisterScreen() {
  const toastRef = useRef();
  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      enableAutomaticScroll={Platform.OS === "ios"}
    >
      <Image
        source={require("../../../assets/images/login.jpg")}
        style={style.logo}
        resizeMode="contain"
      />
      <View style={style.form}>
        <RegisterForm toastRef={toastRef} />
      </View>
      <Toast ref={toastRef} opacity={0.8} position="center" />
    </KeyboardAwareScrollView>
  );
}

const style = StyleSheet.create({
  logo: {
    width: "100%",
    height: 150,
    marginTop: 20
  },
  form: {
    marginLeft: 40,
    marginRight: 40
  }
});
