import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";

import type { DefinitionWord } from "../../types/dataTypes";
import type { TabParamList } from "../../types/navigationTypes";

import Home from "./Home";
import WordList from "./WordList";
import screenOptions from "../../library/helpers/navigation/screenOptions";
import useUserContext from "../../library/hooks/useUserContext";
import SavedWordsContext from "../../library/context/SavedWordsContext";
import getSavedWords from "../../library/helpers/network/getSavedWords";
import SavedList from "./SavedList";

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
      <Navigator initialRouteName="Home" screenOptions={screenOptions}>
        <Screen name="Home" component={Home} />
        <Screen name="WordList" component={WordList} />
        <Screen name="SavedList" component={SavedList} />
      </Navigator>
    </SavedWordsContext.Provider>
  );
};

export default Default;
