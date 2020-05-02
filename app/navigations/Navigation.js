import React from "react";
import { Icon } from "react-native-elements";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import DiscosScreenStacks from "./DiscoStacks";
import TopListsScreenStacks from "./TopListsStacks";
import SearchScreenStacks from "./SearchStacks";
import MyAccountScreenStacks from "./MyAccountStacks";
import FavoritesScreenStacks from './FavoritesStacks';

const NavigationStacks = createBottomTabNavigator(
  {
    Discos: {
      screen: DiscosScreenStacks,
      navigationOptions: () => ({
        tabBarLabel: "Discos",
        tabBarIcon: ({ tintColor }) => (
          <Icon
            type="material-community"
            name="album"
            size={15}
            color={tintColor}
          ></Icon>
        )
      })
    },
    Favorites: {
      screen: FavoritesScreenStacks,
      navigationOptions: () => ({
        tabBarLabel: "Favorites",
        tabBarIcon: ({ tintColor }) => (
          <Icon
            type="material-community"
            name="heart-outline"
            size={15}
            color={tintColor}
          ></Icon>
        )
      })
    },
    TopLists: {
      screen: TopListsScreenStacks,
      navigationOptions: () => ({
        tabBarLabel: "Ranking",
        tabBarIcon: ({ tintColor }) => (
          <Icon
            type="material-community"
            name="star-outline"
            size={15}
            color={tintColor}
          ></Icon>
        )
      })
    },
    Search: {
      screen: SearchScreenStacks,
      navigationOptions: () => ({
        tabBarLabel: "Search",
        tabBarIcon: ({ tintColor }) => (
          <Icon
            type="material-community"
            name="magnify"
            size={15}
            color={tintColor}
          ></Icon>
        )
      })
    },
    MyAccount: {
      screen: MyAccountScreenStacks,
      navigationOptions: () => ({
        tabBarLabel: "MyAccount",
        tabBarIcon: ({ tintColor }) => (
          <Icon
            type="material-community"
            name="magnify"
            size={15}
            color={tintColor}
          ></Icon>
        )
      })
    }
  },
  {
    initialRouteName: "Discos",
    order: ["Discos", "Favorites", "TopLists", "Search", "MyAccount"],
    tabBarOptions: {
      inactiveTintColor: "#646464",
      activeTintColor: "#00a680"
    }
  }
);

export default createAppContainer(NavigationStacks);
