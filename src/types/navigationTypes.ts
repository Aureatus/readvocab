import type {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

export type TabParamList = {
  Home: undefined;
  WordList: undefined;
  Saved: undefined;
};

export type HomeProps = BottomTabScreenProps<TabParamList, "Home">;

export type WordListProps = BottomTabScreenProps<TabParamList, "WordList">;

export type StackParamList = {
  Default: undefined;
  Login: undefined;
  Signup: undefined;
};

export type LoginProps = NativeStackScreenProps<StackParamList, "Login">;

export type SignupProps = NativeStackScreenProps<StackParamList, "Signup">;

// Used to annotate useNavigation type for Home page.
export type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "Home">,
  NativeStackNavigationProp<StackParamList>
>;
