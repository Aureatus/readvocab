import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme as DefaultThemeDark,
} from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import ThemeContext from "./library/context/ThemeContext";
import useThemePreference from "./library/hooks/useThemePreference";

const { Navigator, Screen } = createNativeStackNavigator<StackParamList>();

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: DefaultTheme,
  reactNavigationDark: DefaultThemeDark,
});

export default function App() {
  const [user, setUser] = useState<string | null>(null);
  const { isThemeDark, setIsThemeDark } = useThemePreference();
  const [wordData, setWordData] = useState<DefinitionWord[]>([]);
  const [wordDataLoading, setWordDataLoading] = useState<LoadingData>({
    loading: false,
  });
  const [wordDataError, setWordDataError] = useState<Error | undefined>();

  const toggleTheme = useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark, setIsThemeDark]);

  const themeMemo = useMemo(
    () => ({ toggleTheme, isThemeDark }),
    [toggleTheme, isThemeDark]
  );

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

  useEffect(() => {
    AsyncStorage.setItem("themePreference", isThemeDark ? "dark" : "light");
  }, [isThemeDark]);

  return (
    <RootSiblingParent>
      <SafeAreaProvider>
        <PaperProvider
          settings={{ icon: (props) => <Ionicons {...props} /> }}
          theme={
            isThemeDark
              ? (MD3DarkTheme as ThemeProp)
              : (MD3LightTheme as ThemeProp)
          }
        >
          <NavigationContainer theme={isThemeDark ? DarkTheme : LightTheme}>
            <UserContext.Provider value={{ user, setUser }}>
              <ThemeContext.Provider value={themeMemo}>
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
                  <Navigator screenOptions={{ animation: "none" }}>
                    <Screen
                      name="Default"
                      component={Default}
                      options={{ headerShown: false }}
                    />
                    <Screen name="Login" component={Login} />
                    <Screen name="Signup" component={Signup} />
                  </Navigator>
                </WordDataContext.Provider>
              </ThemeContext.Provider>
            </UserContext.Provider>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </RootSiblingParent>
  );
}
