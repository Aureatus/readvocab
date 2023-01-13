import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

export type TabParamList = {
  Home: undefined;
  WordList: undefined;
};

export type HomeProps = BottomTabScreenProps<TabParamList, "Home">;

export type WordListProps = BottomTabScreenProps<TabParamList, "WordList">;
