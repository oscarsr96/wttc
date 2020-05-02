import { createStackNavigator } from "react-navigation-stack";
import DiscosScreen from "../screens/Discos/DiscosScreen";
import AddDiscoScreen from "../screens/Discos/AddDisco";
import Disco from "../screens/Discos/Disco";
import AddReviewDiscoScreen from "../screens/Discos/AddReviewDisco";

const DiscosScreenStacks = createStackNavigator({
  Discos: {
    screen: DiscosScreen,
    navigationOptions: () => ({
      title: "Discos"
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
  }

});

export default DiscosScreenStacks;
