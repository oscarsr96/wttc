import React, {useRef, useState} from 'react';
import {View, Text} from 'react-native';
import Toast from 'react-native-easy-toast';
import Loading from '../../components/Loading';
import AddDiscoForm from '../../components/Discos/AddDiscoForm';

export default function AddDisco(props){
  const { navigation } = props;
  const { setIsReloadDiscos } = navigation.state.params;
  const toastRef = useRef();
  const [isLoading, setIsLoading] = useState(false)
  return(
    <View>
      <AddDiscoForm
        toastRef={toastRef}
        setIsLoading={setIsLoading}
        navigation={navigation}
        setIsReloadDiscos={setIsReloadDiscos}/>
      <Toast ref={toastRef} position="center" opacity={0.5}/>
      <Loading isVisible={isLoading} text="Creando Disco"/>
    </View>
  )
}
