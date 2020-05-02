import { createStackNavigator } from "react-navigation-stack";
import SearchScreen from "../screens/SearchScreen";

const SearchScreenStacks = createStackNavigator({
  TopDiscos: {
    screen: SearchScreen,
    navigationOptions: () => ({
      title: "Busca tu discoteca"
    })
  }
});

export default SearchScreenStacks;
