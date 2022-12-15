import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState } from "react";

import type { RootStackParamList } from "./types/navigationTypes";
import type { DefinitionWord, LoadingData } from "./types/dataTypes";

import WordDataContext from "./library/context/WordDataContext";
import screenOptions from "./library/helpers/navigation/screenOptions";
import Home from "./components/screens/Home";
import WordList from "./components/screens/WordList";
import { SafeAreaProvider } from "react-native-safe-area-context";

const { Navigator, Screen } = createBottomTabNavigator<RootStackParamList>();

export default function App() {
  const [wordData, setWordData] = useState<DefinitionWord[]>([]);
  const [wordDataLoading, setWordDataLoading] = useState<LoadingData>({
    loading: false,
  });
  const [wordDataError, setWordDataError] = useState<Error | undefined>();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <WordDataContext.Provider
          value={{
            wordData,
            setWordData,
            wordDataLoading,
            setWordDataLoading,
            wordDataError,
            setWordDataError,
          }}
        >
          <Navigator initialRouteName="Home" screenOptions={screenOptions}>
            <Screen name="Home" component={Home} />
            <Screen name="WordList" component={WordList} />
          </Navigator>
        </WordDataContext.Provider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
