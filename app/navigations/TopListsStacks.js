import { createStackNavigator } from "react-navigation-stack";
import TopDiscosScreen from "../screens/TopDiscosScreen";

const TopListsScreenStacks = createStackNavigator({
  TopDiscos: {
    screen: TopDiscosScreen,
    navigationOptions: () => ({
      title: "Las mejores discos"
    })
  }
});

export default TopListsScreenStacks;
