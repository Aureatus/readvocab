import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme as DefaultThemeDark,
} from "@react-navigation/native";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Provider as PaperProvider,
  MD3LightTheme,
  adaptNavigationTheme,
  MD3DarkTheme,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootSiblingParent } from "react-native-root-siblings";
import Ionicons from "react-native-vector-icons/Ionicons";

import type { DefinitionWord, LoadingData } from "./types/dataTypes";

import WordDataContext from "./library/context/WordDataContext";
import UserContext from "./library/context/UserContext";
import Login from "./components/screens/Login";
import Signup from "./components/screens/Signup";
import Default from "./components/screens/Default";
import type { StackParamList } from "./types/navigationTypes";
import type { ThemeProp } from "react-native-paper/lib/typescript/types";

const { Navigator, Screen } = createNativeStackNavigator<StackParamList>();

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: DefaultTheme,
  reactNavigationDark: DefaultThemeDark,
});

export default function App() {
  const [user, setUser] = useState<string | null>(null);
  const [wordData, setWordData] = useState<DefinitionWord[]>([]);
  const [wordDataLoading, setWordDataLoading] = useState<LoadingData>({
    loading: false,
  });
  const [wordDataError, setWordDataError] = useState<Error | undefined>();

  useEffect(() => {
    (async () => {
      setUser(await AsyncStorage.getItem("bearerToken"));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (user === null) {
        await AsyncStorage.removeItem("bearerToken");
      } else await AsyncStorage.setItem("bearerToken", user);
    })();
  }, [user]);

  return (
    <RootSiblingParent>
      <SafeAreaProvider>
        <PaperProvider
          settings={{ icon: (props) => <Ionicons {...props} /> }}
          theme={MD3LightTheme as ThemeProp}
        >
          <NavigationContainer theme={LightTheme}>
            <UserContext.Provider value={{ user, setUser }}>
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
                <Navigator>
                  <Screen
                    name="Default"
                    component={Default}
                    options={{ headerShown: false }}
                  />
                  <Screen name="Login" component={Login} />
                  <Screen name="Signup" component={Signup} />
                </Navigator>
              </WordDataContext.Provider>
            </UserContext.Provider>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </RootSiblingParent>
  );
}
