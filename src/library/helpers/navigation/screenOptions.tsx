import type { RouteProp } from "@react-navigation/native";
import type { ComponentProps } from "react";
import type { TabParamList } from "../../../types/navigationTypes";

import { Ionicons } from "@expo/vector-icons";
import Header from "../../../components/Header";

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
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  },
  headerTitle: () => <Header color={"black"} size={32} />,
});

export default screenOptions;
