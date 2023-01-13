import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import screenOptions from "../../library/helpers/navigation/screenOptions";
import type { RootStackParamList } from "../../types/navigationTypes";
import Home from "./Home";
import WordList from "./WordList";

const { Navigator, Screen } = createBottomTabNavigator<RootStackParamList>();

const Default = () => {
  return (
    <Navigator initialRouteName="Home" screenOptions={screenOptions}>
      <Screen name="Home" component={Home} />
      <Screen name="WordList" component={WordList} />
    </Navigator>
  );
};

export default Default;
