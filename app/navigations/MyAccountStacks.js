import { createStackNavigator } from "react-navigation-stack";
import MyAccountScreen from "../screens/Account/MyAccountScreen";
import LoginScreen from "../screens/Account/LoginScreen";
import RegisterScreen from "../screens/Account/RegisterScreen";

const MyAccountScreenStacks = createStackNavigator({
  MyAccount: {
    screen: MyAccountScreen,
    navigationOptions: () => ({
      title: "My account page"
    })
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: () => ({
      title: "Login"
    })
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: () => ({
      title: "Registro"
    })
  }
});

export default MyAccountScreenStacks;
