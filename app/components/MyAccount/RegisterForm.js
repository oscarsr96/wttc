import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { validateEmail } from "../../utils/Validation";
import * as firebase from "firebase";
import Loading from "../Loading";
import { withNavigation } from "react-navigation";

function RegisterForm(props) {
  const { toastRef, navigation } = props;
  const [hidePassword, setHidePassword] = useState(true);
  const [hideRepeatedPassword, setHideRepeatedPassword] = useState(true);
  const [isVisibleLoading, setIsVisibleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");

  const register = async () => {
    setIsVisibleLoading(true);
    if (!email && !password && !repeatedPassword) {
      toastRef.current.show("Todos los campos son obligatorios");
    } else {
      if (!validateEmail(email)) {
        toastRef.current.show("No es correcto el email");
      } else {
        if (password != repeatedPassword) {
          toastRef.current.show("las contraseñas no coinciden");
        } else {
          await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
              navigation.navigate("MyAccount");
            })
            .catch(() => toastRef.current.show("Error al crear la cuenta"));
        }
      }
    }

    const resultEmailValidation = validateEmail(email);
    console.log("validacion del email: " + resultEmailValidation);
    setIsVisibleLoading(false);
  };

  return (
    <View style={style.form} behaviour="padding" enabled>
      <Input
        placeholder="Correo electrónico"
        containerStyle={style.input}
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
        password={true}
        secureTextEntry={hidePassword}
        containerStyle={style.input}
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
      <Input
        placeholder="Repetir contraseña"
        password={true}
        secureTextEntry={hideRepeatedPassword}
        containerStyle={style.input}
        onChange={e => setRepeatedPassword(e.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name={hideRepeatedPassword ? "eye-outline" : "eye-off-outline"}
            iconStyle={style.iconRight}
            onPress={() => setHideRepeatedPassword(!hidePassword)}
          ></Icon>
        }
      ></Input>
      <Button
        title="Unirse"
        containerStyle={style.buttonContainerRegister}
        buttonStyle={style.buttonRegister}
        onPress={register}
      ></Button>
      <Loading text="Creando cuenta" isVisible={isVisibleLoading}></Loading>
    </View>
  );
}
export default withNavigation(RegisterForm);

const style = StyleSheet.create({
  form: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30
  },
  input: {
    width: "100%",
    marginTop: 20
  },
  iconRight: {
    color: "#c1c1c1"
  },
  buttonContainerRegister: {
    width: "95%",
    marginTop: 20
  },
  buttonRegister: {
    backgroundColor: "#00a680"
  }
});
