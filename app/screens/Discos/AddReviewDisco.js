import React, {useState, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import { AirbnbRating, Button, Input} from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import Loading from '../../components/Loading';
import { firebaseApp } from '../../utils/FireBase';
import firebase from 'firebase/app';
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function AddReviewDisco(props){
  const { navigation } = props;
  const {idDisco, setReviewsReload} = navigation.state.params;
  const [rating, setRating] = useState(null);
  const [title, setTitle] = useState("")
  const [review, setReview] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const toastRef = useRef()

  const addReview = () => {
    if(rating === null){
      toastRef.current.show("Rating not given");
    } else if (!title){
      toastRef.current.show("Title is mandatory");
    } else if (!review){
      toastRef.current.show("Review is mandatory");
    }else{
      setIsLoading(true);
      const user = firebase.auth().currentUser;
      const payload = {
        idUser: user.uid,
        avatarUser: user.photoURL,
        idDisco: idDisco,
        title: title,
        review: review,
        rating: rating,
        createAt: new Date()
      };

      db.collection("reviews").add(payload).then(() => {
        updateDisco();
      }).catch(() => {
        toastRef.current.show("Error when sending review, try later");
        setIsLoading(false);
      })
    }
  }

  const updateDisco = () => {
    const discoRef = db.collection("events").doc(idDisco);

    discoRef.get().then(response => {
      const discoData = response.data();
      const ratingTotal = discoData.ratingTotal + rating;
      const quantityVoting = discoData.quantityVoting + 1;
      const ratingResult = ratingTotal / quantityVoting;

      discoRef.update({rating: ratingResult, ratingTotal, quantityVoting}).then(() => {
        setIsLoading(false);
        setReviewsReload(true);
        navigation.goBack();
      })
    })
  }

  return(
    <View style={styles.viewBody}>
      <View style={styles.viewRating}>
        <AirbnbRating
          count={5}
          reviews={["Awful", "Deficient", "Normal", "Very good", "Excellent"]}
          defaultRating={0}
          size={35}
          onFinishRating={ value => setRating(value) }
        />
      </View>
      <View style={styles.formReview}>
        <Input
          placeholder="Title"
          containerStyle={styles.input}
          onChange={e => setTitle(e.nativeEvent.text)}
        />
        <Input
          placeholder="Review"
          multiline={true}
          inputContainerStyle={styles.textArea}
          onChange={e => setReview(e.nativeEvent.text)}
        />
        <Button
          title="Send review"
          onPress={addReview}
          containerStyle={styles.btnContainer}
          buttonStyle={styles.btn}
        />
        <Toast ref={toastRef} position="center" opacity={0.5}/>
        <Loading isVisible={isLoading} text="Sending review"/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  viewBody:{
    flex: 1
  },
  viewRating:{
    height: 110,
    backgroundColor: "#f2f2f2"
  },
  formReview:{
    margin: 10,
    marginTop: 40,
    flex: 1,
    alignItems: "center"
  },
  input:{
    marginBottom:10
  },
  textArea:{
    height: 150,
    width: "100%",
    padding: 0,
    margin: 0
  },
  btnContainer:{
    justifyContent: "flex-end",
    flex: 1,
    marginTop: 20,
    marginBottom: 10,
    width: "95%"
  },
  btn:{
    backgroundColor: "#00a680"
  }
})
