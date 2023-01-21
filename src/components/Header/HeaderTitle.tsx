import { View, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";

const HeaderTitle = ({ size }: { size: number }) => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Entypo name="book" size={size} color={theme.colors.inverseSurface} />
      <Text variant="displaySmall" style={styles.title}>
        Readvocab
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    marginLeft: 14,
  },
});

export default HeaderTitle;
