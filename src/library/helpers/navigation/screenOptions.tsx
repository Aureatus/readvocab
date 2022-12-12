import type { RouteProp } from "@react-navigation/native";
import type { ComponentProps } from "react";
import type { RootStackParamList } from "../../../types/navigationTypes";

import { Ionicons } from "@expo/vector-icons";

const screenOptions = ({
  route,
}: {
  route: RouteProp<RootStackParamList, keyof RootStackParamList>;
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
    } else if (route.name === "Placeholder2") {
      iconName = focused ? "chevron-up-circle" : "chevron-up-circle-outline";
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  },
});

export default screenOptions;
