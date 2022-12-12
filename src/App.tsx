import { StatusBar } from "expo-status-bar";
import { Button, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState } from "react";

import type {
  Placeholder2Props,
  RootStackParamList,
} from "./types/navigationTypes";
import type { DefinitionWord } from "./types/dataTypes";

import WordDataContext from "./library/context/WordDataContext";
import screenOptions from "./library/helpers/navigation/screenOptions";
import Home from "./components/screens/Home";

const { Navigator, Screen } = createBottomTabNavigator<RootStackParamList>();

const Placeholder2 = ({ navigation: { navigate } }: Placeholder2Props) => {
  return (
    <View>
      <Text>Placeholder 2</Text>
      <Button title="Go to Home" onPress={() => navigate("Home")} />
      <StatusBar style="auto" />
    </View>
  );
};

export default function App() {
  const [wordData, setWordData] = useState<DefinitionWord[]>([]);
  const [wordDataLoading, setWordDataLoading] = useState<boolean>(false);
  const [wordDataError, setWordDataError] = useState<Error | undefined>();

  return (
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
          <Screen name="Placeholder2" component={Placeholder2} />
        </Navigator>
      </WordDataContext.Provider>
    </NavigationContainer>
  );
}
