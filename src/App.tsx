import { NavigationContainer } from "@react-navigation/native";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { DefinitionWord, LoadingData } from "./types/dataTypes";

import WordDataContext from "./library/context/WordDataContext";
import Login from "./components/screens/Login";
import Signup from "./components/screens/Signup";
import Default from "./components/screens/Default";
import type { StackParamList } from "./types/navigationTypes";

const { Navigator, Screen } = createNativeStackNavigator<StackParamList>();

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
          <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="Default" component={Default} />
            <Screen name="Login" component={Login} />
            <Screen name="Signup" component={Signup} />
          </Navigator>
        </WordDataContext.Provider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
