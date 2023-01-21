import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import type { DefinitionWord } from "../../types/dataTypes";
import type { TabParamList } from "../../types/navigationTypes";

import Home from "./Home";
import WordList from "./WordList";
import useUserContext from "../../library/hooks/useUserContext";
import SavedWordsContext from "../../library/context/SavedWordsContext";
import getSavedWords from "../../library/helpers/network/getSavedWords";
import SavedList from "./SavedList";
import HeaderTitle from "../Header/HeaderTitle";
import HeaderRight from "../Header/HeaderRight";

const { Navigator, Screen } = createBottomTabNavigator<TabParamList>();

const Default = () => {
  const { user } = useUserContext();
  const [savedWords, setSavedWords] = useState<DefinitionWord[]>([]);

  useEffect(() => {
    (async () => {
      if (user === null) setSavedWords([]);
      else {
        const response = await getSavedWords(user);
        setSavedWords(response);
      }
    })();
  }, [user]);

  return (
    <SavedWordsContext.Provider value={{ savedWords, setSavedWords }}>
      <Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTitle: () => <HeaderTitle color={"black"} size={42} />,
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
