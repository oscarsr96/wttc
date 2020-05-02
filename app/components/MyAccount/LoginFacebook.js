import React, { useState } from "react";
import { SocialIcon } from "react-native-elements";
import * as firebase from "firebase";
import * as Facebook from "expo-facebook";
import { FacebookApi } from "../../utils/Social";
import Loading from "../Loading";

export default function LoginFacebook(props) {
  const { toastRef, navigation } = props;
  const { isLoading, setIsLoading } = useState(false);
  const login = async () => {
    await Facebook.initializeAsync(FacebookApi.application_id);
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(
      //FacebookApi.application_id,
      { permissions: FacebookApi.permissions }
    );

    if (type === "success") {
      const credentials = firebase.auth.FacebookAuthProvider.credential(token);
      await firebase
        .auth()
        .signInWithCredential(credentials)
        .then(() => {
          console.log("Login correcto");
        })
        .catch(() => {
          console.log("Error");
          toastRef.current.show("Error. Inténtelo más tarde");
        });
    } else if (type === "cancel") {
      console.log("Inicio de sesión cancelado");
      toastRef.current.show("Inicio de sesión cancelado");
    } else {
      console.log("Error desconocido");
      toastRef.current.show("Error desconocido");
    }
  };
  return (
    <SocialIcon
      title="Iniciar sesión con Facebook"
      type="facebook"
      button
      onPress={login}
    ></SocialIcon>
  );
}
