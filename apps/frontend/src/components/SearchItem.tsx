import { View, StyleSheet, Dimensions } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";

const SearchItem = ({
  creator,
  title,
  onPress,
}: {
  creator: string[];
  title: string;
  onPress: () => Promise<void>;
}) => {
  return (
    <TouchableRipple onPress={onPress} style={styles.touchableRipple}>
      <View style={styles.container}>
        <Text variant="headlineMedium">{title}</Text>
        <Text variant="titleLarge">
          {creator.length > 1
            ? creator.map((e, index) =>
                !(index === creator.length - 1) ? `${e}, ` : e
              )
            : creator}
        </Text>
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    width: Dimensions.get("window").width,
  },
  touchableRipple: {
    paddingHorizontal: Dimensions.get("window").width / 60,
  },
});

export default SearchItem;
