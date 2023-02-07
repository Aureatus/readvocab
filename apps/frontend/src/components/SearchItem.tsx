import { View, StyleSheet, Dimensions } from "react-native";
import { Button, Text } from "react-native-paper";

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
    <Button onPress={onPress} mode="text">
      <View style={styles.container}>
        <Text variant="headlineMedium">{title}</Text>
        <Text variant="titleLarge">
          {creator.length > 1
            ? creator.map((e, index) =>
                !(index === creator.length - 1) ? `${e} & ` : e
              )
            : creator}
        </Text>
      </View>
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    width: Dimensions.get("window").width,
  },
});

export default SearchItem;
