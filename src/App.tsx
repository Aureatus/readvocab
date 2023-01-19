import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootSiblingParent } from "react-native-root-siblings";

import type { DefinitionWord, LoadingData } from "./types/dataTypes";

import WordDataContext from "./library/context/WordDataContext";
import UserContext from "./library/context/UserContext";
import Login from "./components/screens/Login";
import Signup from "./components/screens/Signup";
import Default from "./components/screens/Default";
import type { StackParamList } from "./types/navigationTypes";

const { Navigator, Screen } = createNativeStackNavigator<StackParamList>();

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
        <NavigationContainer>
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
              <PaperProvider>
                <Navigator>
                  <Screen
                    name="Default"
                    component={Default}
                    options={{ headerShown: false }}
                  />
                  <Screen name="Login" component={Login} />
                  <Screen name="Signup" component={Signup} />
                </Navigator>
              </PaperProvider>
            </WordDataContext.Provider>
          </UserContext.Provider>
        </NavigationContainer>
      </SafeAreaProvider>
    </RootSiblingParent>
  );
}
