import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

export type RootStackParamList = {
  Home: undefined;
  WordList: undefined;
};

export type HomeProps = BottomTabScreenProps<RootStackParamList, "Home">;

export type WordListProps = BottomTabScreenProps<
  RootStackParamList,
  "WordList"
>;
