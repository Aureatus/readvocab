import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const { Navigator, Screen } = createNativeStackNavigator();

const Placeholder1 = () => {
  return (
    <View>
      <Text>Placeholder 1</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const Placeholder2 = () => {
  return (
    <View>
      <Text>Placeholder 2</Text>
      <StatusBar style="auto" />
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Navigator initialRouteName="Placeholder1">
        <Screen name="Placeholder1" component={Placeholder1} />
        <Screen name="Placeholder2" component={Placeholder2} />
      </Navigator>
    </NavigationContainer>
  );
}
