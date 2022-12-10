import { StatusBar } from "expo-status-bar";
import { Button, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  Placeholder1: undefined;
  Placeholder2: undefined;
};

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

type Placeholder1Props = NativeStackScreenProps<
  RootStackParamList,
  "Placeholder1"
>;
const Placeholder1 = ({
  navigation: { navigate },
}: Placeholder1Props): JSX.Element => {
  return (
    <View>
      <Text>Placeholder 1</Text>
      <Button
        title="Go to Placeholder2"
        onPress={() => navigate("Placeholder2")}
      />
      <StatusBar style="auto" />
    </View>
  );
};

type Placeholder2Props = NativeStackScreenProps<
  RootStackParamList,
  "Placeholder2"
>;

const Placeholder2 = ({ navigation: { navigate } }: Placeholder2Props) => {
  return (
    <View>
      <Text>Placeholder 2</Text>
      <Button
        title="Go to Placeholder1"
        onPress={() => navigate("Placeholder1")}
      />
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
