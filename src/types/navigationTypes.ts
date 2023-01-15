import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type TabParamList = {
  Home: undefined;
  WordList: undefined;
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
