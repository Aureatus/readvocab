import type { RouteProp } from "@react-navigation/native";
import type { ComponentProps } from "react";
import type { TabParamList } from "../../../types/navigationTypes";

import { Ionicons } from "@expo/vector-icons";
import HeaderTitle from "../../../components/Header/HeaderTitle";
import HeaderRight from "../../../components/Header/HeaderRight";

const screenOptions = ({
  route,
}: {
  route: RouteProp<TabParamList, keyof TabParamList>;
}) => ({
  tabBarIcon: ({
    focused,
    color,
    size,
  }: {
    focused: boolean;
    color: string;
    size: number;
  }) => {
    type IonIconName = ComponentProps<typeof Ionicons>["name"];

    let iconName: IonIconName = "bug";

    if (route.name === "Home") {
      iconName = focused ? "home" : "home-outline";
    } else if (route.name === "WordList") {
      iconName = focused ? "book" : "book-outline";
    } else if (route.name === "SavedList") {
      iconName = focused ? "heart" : "heart-outline";
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  },
  headerTitle: () => <HeaderTitle color={"black"} size={32} />,
  headerRight: () => <HeaderRight />,
});

export default screenOptions;
