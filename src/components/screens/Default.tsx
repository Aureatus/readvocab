import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState } from "react";

import type { DefinitionWord } from "../../types/dataTypes";
import type { TabParamList } from "../../types/navigationTypes";

import Home from "./Home";
import WordList from "./WordList";
import screenOptions from "../../library/helpers/navigation/screenOptions";
import SavedWordsContext from "../../library/context/SavedWordsContext";

const { Navigator, Screen } = createBottomTabNavigator<TabParamList>();

const Default = () => {
  const [savedWords, setSavedWords] = useState<DefinitionWord[]>([]);

  return (
    <SavedWordsContext.Provider value={{ savedWords, setSavedWords }}>
      <Navigator initialRouteName="Home" screenOptions={screenOptions}>
        <Screen name="Home" component={Home} />
        <Screen name="WordList" component={WordList} />
      </Navigator>
    </SavedWordsContext.Provider>
  );
};

export default Default;
