import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import type { TabParamList } from "../../types/navigationTypes";

import Home from "./Home";
import WordList from "./WordList";
import SavedList from "./SavedList";
import Search from "./Search";
import HeaderTitle from "../Header/HeaderTitle";
import HeaderRight from "../Header/HeaderRight";
import useUserContext from "../../library/hooks/context/useUserContext";
import SavedWordsContext from "../../library/context/SavedWordsContext";
import useSavedWordsData from "../../library/hooks/useSavedWordsData";

const { Navigator, Screen } = createBottomTabNavigator<TabParamList>();

const Default = () => {
  const { user } = useUserContext();
  const { savedWords, setSavedWords, savedWordsError, setSavedWordsError } =
    useSavedWordsData(user);

  return (
    <SavedWordsContext.Provider
      value={{ savedWords, setSavedWords, savedWordsError, setSavedWordsError }}
    >
      <Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTitle: () => <HeaderTitle size={42} />,
          headerRight: () => <HeaderRight />,
        }}
      >
        <Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Screen
          name="Search"
          component={Search}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? "search" : "search-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Screen
          name="WordList"
          component={WordList}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? "book" : "book-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Screen
          name="SavedList"
          component={SavedList}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? "bookmark" : "bookmark-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Navigator>
    </SavedWordsContext.Provider>
  );
};

export default Default;
