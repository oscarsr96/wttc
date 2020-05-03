import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Alert, Dimensions} from 'react-native';
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import Modal from '../Modal';
import * as Random from "expo-random";
import 'react-native-get-random-values';


import { firebaseApp } from '../../utils/FireBase';
import firebase from 'firebase/app';
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

const WidthScreen = Dimensions.get("window").width;

export default function AddDiscoForm(props){
  const { toastRef, setIsLoading, navigation, setIsReloadDiscos } = props;
  const [imagesSelected, setImagesSelected] = useState([])
  const [eventName, setEventName] = useState("");
  const [eventAddress, setEventAddress] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventPhone, setEventPhone] = useState("")
  const [eventPrice, setEventPrice] = useState("")
  const [eventCity, setEventCity] = useState("")
  const [eventStartDate, setEventStartDate] = useState("")
  const [eventEndDate, setEventEndDate] = useState("")
  const [eventCapacity, setEventCapacity] = useState("")
  const [eventEmail, setEventEmail] = useState("")
  const [isVisibleMap, setIsVisibleMap] = useState(false);
  const [locationEvent, setLocationEvent] = useState(null);

  const addDisco = () => {
    if(!eventName || !eventAddress || !eventDescription || !eventPhone || !eventPrice){
      toastRef.current.show("Add fields are mandatory", 1500);
    } else if (imagesSelected.length === 0){
      toastRef.current.show("You must upload at least one picture", 1500);
    } else if (!locationEvent){
      toastRef.current.show("You must add the location in the map", 1500);
    } else {
      setIsLoading(true);
      uploadImagesStorage(imagesSelected).then(arrayImages => {
        db.collection("events").add({
          name: eventName,
          idCompany: 1,
          startDate: new Date().toUTCString(),
          endDate: new Date().toUTCString(),
          city: eventCity,
          emailCompany: [eventEmail],
          description: eventDescription,
          phones: [eventPhone],
          rules: ["dress code", "mayores de 18"],
          price: eventPrice,
          location: locationEvent,
          images: arrayImages,
          rating:4.5,
          createAt: new Date(),
          createBy: firebase.auth().currentUser.uid
        }).then(() =>{
          setIsLoading(false);
          setIsReloadDiscos(true);
          navigation.navigate("Events");
        }).catch(() => {
          setIsLoading(false);
          toastRef.current.show("Error when uploading disco, try later", 1500);
        })
      })


    }
  }


  const uploadImagesStorage = async imageArray => {
    const imagesBlob = [];
    await Promise.all(
      imageArray.map(async image => {
        const response = await fetch(image);
        const blob = await response.blob();
        const uuid = await Random.getRandomBytesAsync(16)
        const ref = firebase.storage().ref("disco-images").child(uuid.toString());
        await ref.put(blob).then(result => {
          imagesBlob.push(result.metadata.name)
        })

      })
    );
    return imagesBlob;
  }

  return(
    <ScrollView>
      <MainImage imageDisco={imagesSelected[0]}/>
      <FormAdd
        setEventName={setEventName}
        setEventAddress={setEventAddress}
        setEventDescription={setEventDescription}
        setEventPhone={setEventPhone}
        setEventPrice={setEventPrice}
        setIsVisibleMap={setIsVisibleMap}
        setEventCity={setEventCity}
        setEventStartDate={setEventStartDate}
        setEventEndDate={setEventEndDate}
        setEventCapacity={setEventCapacity}
        setEventEmail={setEventEmail}
        locationEvent={locationEvent}
        />
      <UploadImage
        imagesSelected = {imagesSelected}
        setImagesSelected = {setImagesSelected}
        toastRef = {toastRef}
      />
      <Button
        title="Create disco"
        onPress={addDisco}
        buttonStyle={styles.btnAddDisco}
      />
      <Map
        isVisibleMap={isVisibleMap}
        setIsVisibleMap={setIsVisibleMap}
        setLocationEvent={setLocationEvent}
        toastRef={toastRef}
      />
    </ScrollView>
  )
}

function MainImage(props){
  const {imageDisco} = props;

  return (
    <View style={styles.viewPhoto}>
      {imageDisco ? (
        <Image
          source={{uri: imageDisco}}
          style={{width: WidthScreen, height:200 }}
        /> ):(
          <Image
            source={require("../../../assets/images/login.jpg")}
            style={{width: WidthScreen, height:200 }}
          />
        )
      }

    </View>
  )
}


function UploadImage(props){
  const { imagesSelected, setImagesSelected, toastRef } = props;

  const imageSelected = async () => {
    const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const resultPermissionCamera = resultPermission.permissions.cameraRoll.status;

    if(resultPermissionCamera === "denied"){
      toastRef.current.show("Es necesario aceptar permisos", 3000);
    } else{
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4,3]
      })


    if(result.cancelled){
      toastRef.current.show("Has cerrado la galería sin seleccionar imagen", 3000);
    } else {
      setImagesSelected([...imagesSelected, result.uri]);
    }
  }
}

  const removeImage = image => {
    const arrayImages = imagesSelected;

    Alert.alert(
      "Remove image",
      "Are you sure you want to remove the image?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          onPress: () => setImagesSelected(arrayImages.filter(imageUrl => imageUrl !== image))
        },
        { cancellable: false}
      ]
    )
  }

  return(
    <View style={styles.viewImage}>

      {imagesSelected.length < 5 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={imageSelected}
        />
      )}

      {imagesSelected.map((imageDisco, index) => (
        <Avatar
          key={index}
          onPress={() => removeImage(imageDisco)}
          style={styles.miniatureStyle}
          source={{uri: imageDisco}}
        />
      ))}

    </View>
  )
}

function Map(props){
  const { isVisibleMap, setIsVisibleMap, setLocationEvent, toastRef} = props;
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async ()=> {
      let resultPermissions = await Permissions.askAsync(Permissions.LOCATION);
      const statusPermissions = resultPermissions.permissions.location.status;

      if(statusPermissions !== "granted"){
        toastRef.current.show("Location permission denied, you must permit it in your phone settings", 2000)
      }else{
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          longitudeDelta: 0.001,
          latitudeDelta: 0.001,
          capacity: 200,
          address: "aaa"
        })
      }
    })();
  }, []);

  const confirmLocation = () => {
    setLocationEvent(location);
    toastRef.current.show("Location successfully added", 2000);
    setIsVisibleMap(false)
  }

  return(
    <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
      <View>
        {location && (
          <MapView
            style={styles.mapStyle}
            initialRegion={location}
            showUserLocation={true}
            onRegionChange={region => setLocation(region)}
          >
            <MapView.Marker
              coordinate={{
                latitude:location.latitude,
                longitude: location.longitude
              }}
              draggable
              />

          </MapView>
        )}
        <View style={styles.viewMapBtn}>
          <Button
            title="Save location"
            onPress={confirmLocation}
            containerStyle={styles.viewMapBtnContainerSave}
            buttonStyle={styles.viewMapBtnSave}
          />
          <Button
            title="Cancel"
            onPress={() => setIsVisibleMap(false)}
            containerStyle={styles.viewMapBtnContainerCancel}
            buttonStyle={styles.viewMapBtnCancel}
          />
        </View>
      </View>
    </Modal>
  )
}

function FormAdd(props){
  const { setEventName,setEventAddress,setEventDescription,setIsVisibleMap, setEventPhone, setEventPrice,
          setEventCity, setEventStartDate, setEventEndDate,
          setEventEmail, locationEvent } = props;

  return(
    <View style={styles.viewForm}>
      <Input
        placeholder="Event name"
        containerStyle={styles.input}
        onChange={e => setEventName(e.nativeEvent.text)}
       />
       <Input
         placeholder="Capacity"
         multiline={false}
         rightIcon={{
           type: "material-community",
           name: "currency-eur",
           color: "#00a680"
         }}
         containerStyle={styles.input}
         onChange={e => setEventCapacity(e.nativeEvent.text)}
        />
       <Input
         placeholder="Adress"
         containerStyle={styles.input}
         rightIcon={{
           type: "material-community",
           name: "google-maps",
           color: locationEvent ? "#00a680" : "#c2c2c2",
           onPress: () => setIsVisibleMap(true)
         }}
         onChange={e => setEventAddress(e.nativeEvent.text)}
        />
      <Input
        placeholder="Description"
        multiline={true}
        inputContainerStyle={styles.textArea}
        onChange={e => setEventDescription(e.nativeEvent.text)}
       />
       <Input
         placeholder="Phone"
         multiline={false}
         rightIcon={{
           type: "material-community",
           name: "phone",
           color: "#00a680"
         }}
         containerStyle={styles.input}
         onChange={e => setEventPhone(e.nativeEvent.text)}
        />
        <Input
          placeholder="Drink price"
          multiline={false}
          rightIcon={{
            type: "material-community",
            name: "currency-eur",
            color: "#00a680"
          }}
          containerStyle={styles.input}
          onChange={e => setEventPrice(e.nativeEvent.text)}
         />
         <Input
           placeholder="City"
           multiline={false}
           rightIcon={{
             type: "material-community",
             name: "currency-eur",
             color: "#00a680"
           }}
           containerStyle={styles.input}
           onChange={e => setEventCity(e.nativeEvent.text)}
          />
          <Input
            placeholder="Email"
            multiline={false}
            rightIcon={{
              type: "material-community",
              name: "currency-eur",
              color: "#00a680"
            }}
            containerStyle={styles.input}
            onChange={e => setEventEmail(e.nativeEvent.text)}
           />
    </View>
  )
}

const styles = StyleSheet.create({
  viewImage:{
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30
  },
  containerIcon:{
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3"
  },
  miniatureStyle:{
    width: 70,
    height: 70,
    marginRight: 10
  },
  viewPhoto:{
    alignItems: "center",
    height: 200,
    marginBottom: 20
  },
  viewForm:{
    marginLeft: 10,
    marginRight: 10
  },
  input:{
    marginBottom: 10
  },
  textArea:{
    height: 100,
    width: "100%",
    padding: 0,
    margin: 0
  },
  mapStyle:{
    width:"100%",
    height:150
  },
  viewMapBtn:{
    flexDirection: "row",
    justifyContent:"center",
    marginTop:10
  },
  viewMapBtnContainerSave:{
    paddingRight: 5
  },
  viewMapBtnSave:{
    backgroundColor: "#00a680"
  },
  viewMapBtnContainerCancel:{
    paddingLeft: 5
  },
  viewMapBtnCancel:{
    backgroundColor: "#a60d0d"
  },
  btnAddDisco:{
    backgroundColor: "#00a680",
    margin: 20
  }
})
