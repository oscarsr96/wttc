import React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Overlay } from "react-native-elements";

export default function Loading(props) {
  const { isVisible, text } = props;

  return (
    <Overlay
      isVisible={isVisible}
      windowBackgroundColor="rgba(0,0,0,0.5)"
      overlayBackgroundColor="transparent"
      overlayStyle={style.overlay}
    >
      <View style={style.view}>
        {/*<ActivityIndicator size="small" color="#00a680">
          {text && <Text style={style.text}>{text}</Text>}
  </ActivityIndicator>*/}
        <Text>{text}</Text>
      </View>
    </Overlay>
  );
}

const style = StyleSheet.create({
  overlay: {
    height: 100,
    width: 200,
    backgroundColor: "#fff",
    borderColor: "#00a680",
    borderWidth: 2,
    borderRadius: 10
  },
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },
  text: {
    color: "#00a680",
    textTransform: "uppercase",
    marginTop: 10
  }
});
