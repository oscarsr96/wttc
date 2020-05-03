import React, {useState} from "react";
import {View, Text} from "react-native";


export default function Fiesta(props){
  const rules = props.navigation.state.params.rules;

  function myFunction(value, index, array) {
    return <Text key={index}> {value} </Text>
  }
  return (
    <View>
      {rules.map(myFunction)}
    </View>
  )
}
