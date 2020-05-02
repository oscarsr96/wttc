import React, {useState} from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as firebase from 'firebase';
import {reauthenticate} from '../../utils/Api';

export default function ChangeDisplayNameForm(props){
  const { setIsVisibleModal, toastRef } = props;
  const [password, setPassword] = useState({});
  const [newPassword, setNewPassword] =useState({});
  const [newPasswordRepeat, setNewPasswordRepeat] = useState({});
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideNewPasswordRepeat, setHideNewPasswordRepeat] =useState(true);

  const updatePassword = () => {
    setError({});

    if(!password || !newPassword || !newPasswordRepeat){
      let objError = {};
      !password && (objError.password = "Contraseña vacia");
      !newPassword && (objError.newPassword = "Nueva contraseña vacia");
      !newPasswordRepeat && (objError.newPasswordRepeat = "Contraseña repetida vacia");
      setError(objError);
    } else{
      if(newPassword !== newPasswordRepeat){
        setError({
          newPassword: "La nueva contraseña tiene que ser igual",
          newPasswordRepeat: "La nueva contraseña tiene que ser igual"
        })
      } else {
        setIsLoading(true);
        reauthenticate(password).then(() => {
          firebase.auth().currentUser.updatePassword(newPassword).then(() => {
            setIsLoading(false);
            toastRef.current.show("Contraseña actualizada correctamente");
            setIsVisibleModal(false);
            firebase.auth().signOut();
          }).catch(() => {
            setError({general: "Error con el servidor"});
            setIsLoading(false);
          })
        }).catch(() => {
          setError({
            password: "La contraseña no es correcta"
          });
          setIsLoading(false);
        })
      }
    }
  }



  return(
    <View style={styles.view}>
      <Input
        placeholder="Contraseña actual"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={hidePassword}
        rightIcon={{
          type: "material-community",
          name: hidePassword ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHidePassword(!hidePassword)
        }}
        errorMessage = {error.password}
        onChange={e => setPassword(e.nativeEvent.text)}
      />
      <Input
        placeholder="Nueva contraseña"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={hideNewPassword}
        rightIcon={{
          type: "material-community",
          name: hideNewPassword ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHideNewPassword(!hideNewPassword)
        }}
        errorMessage = {error.newPassword}
        onChange={e => setNewPassword(e.nativeEvent.text)}
      />
      <Input
        placeholder="Repetir nueva contraseña"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={hideNewPasswordRepeat}
        rightIcon={{
          type: "material-community",
          name: hideNewPasswordRepeat ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHideNewPasswordRepeat(!hideNewPasswordRepeat)
        }}
        errorMessage = {error.newPasswordRepeat}
        onChange={e => setNewPasswordRepeat(e.nativeEvent.text)}
      />
      <Button
        title="Cambiar contraseña"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={updatePassword}
        loading={isLoading}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10
  },
  input:{
    marginBottom: 10
  },
  btnContainer:{
    marginTop:20,
    width: "95%"
  },
  btn:{
    backgroundColor: "#00a680"
  }
})
