import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { validateEmail } from "../../utils/Validation";
import * as firebase from "firebase";
import Loading from "../Loading";
import { withNavigation } from "react-navigation";

function LoginForm(props) {
  const { toastRef, navigation } = props;
  const [hidePassword, setHidePassword] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisibleLoading, setIsVisibleLoading] = useState(false);

  const login = async () => {
    setIsVisibleLoading(true);
    if (!email && !password) {
      toastRef.current.show("Todos los campos son obligatorios");
    } else {
      if (!validateEmail(email)) {
        toastRef.current.show("Email is not correct");
      } else {
        //TO DO: revisar bug al iniciar sesión (salta catch cuando es correcto)
        await firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            navigation.navigate("MyAccount");
          }).catch((error) => toastRef.current.show("Error, try later"));
      }
    }



    setIsVisibleLoading(false);
  };

  return (
    <View style={style.formContainer}>
      <Input
        placeholder="Correo electrónico"
        containerStyle={style.inputForm}
        onChange={e => setEmail(e.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name="at"
            iconStyle={style.iconRight}
          ></Icon>
        }
      ></Input>

      <Input
        placeholder="Contraseña"
        containerStyle={style.inputForm}
        password={true}
        secureTextEntry={hidePassword}
        onChange={e => setPassword(e.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name={hidePassword ? "eye-outline" : "eye-off-outline"}
            iconStyle={style.iconRight}
            onPress={() => setHidePassword(!hidePassword)}
          ></Icon>
        }
      ></Input>
      <Button
        title="Iniciar sesión"
        containerStyle={style.buttonContainer}
        buttonStyle={style.button}
        onPress={login}
      ></Button>
      <Loading isVisible={isVisibleLoading} text="Iniciando sesión"></Loading>
    </View>
  );
}

export default withNavigation(LoginForm);

const style = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30
  },
  inputForm: {
    width: "100%",
    marginTop: 20
  },
  iconRight: {
    color: "#c1c1c1"
  },
  buttonContainer: {
    marginTop: 20,
    width: "95%"
  },
  button: {
    backgroundColor: "#00a680"
  }
});
