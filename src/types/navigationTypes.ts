import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

export type RootStackParamList = {
  Home: undefined;
  Placeholder2: undefined;
};

export type HomeProps = BottomTabScreenProps<RootStackParamList, "Home">;

export type Placeholder2Props = BottomTabScreenProps<
  RootStackParamList,
  "Placeholder2"
>;
