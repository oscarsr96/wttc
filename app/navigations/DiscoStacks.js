import { createStackNavigator } from "react-navigation-stack";
import DiscosScreen from "../screens/Discos/DiscosScreen";
import AddDiscoScreen from "../screens/Discos/AddDisco";
import Disco from "../screens/Discos/Disco";
import AddReviewDiscoScreen from "../screens/Discos/AddReviewDisco";
import Fiesta from "../screens/Discos/Fiesta";

const DiscosScreenStacks = createStackNavigator({
  Events: {
    screen: DiscosScreen,
    navigationOptions: () => ({
      title: "Events"
    })
  },
  AddDisco: {
    screen: AddDiscoScreen,
    navigationOptions: () => ({
      title: "New Disco"
    })
  },
  Disco: {
    screen: Disco,
    navigationOptions: (props) => ({
      title: props.navigation.state.params.disco.name
    })
  },
  AddReviewDisco: {
    screen: AddReviewDiscoScreen,
    navigationOptions: (props) => ({
      title: "New review"
    })
  },
  Fiesta: {
    screen: Fiesta,
    navigationOptions: (props) => ({
      //TODO: sacar el company Name de la base de datos
      title: "Ir a " + (props.navigation.state.params.idCompany).toString()
    })
  }

});

export default DiscosScreenStacks;
