import { View, StyleSheet } from "react-native";
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
    <View style={styles.container}>
      <Button onPress={onPress}>
        <View style={styles.wordContainer}>
          <View style={styles.header}>
            <Text style={styles.title} variant="titleLarge">
              {title}
            </Text>
          </View>
          <Text variant="bodyLarge">
            {creator.length > 1
              ? creator.map((e, index) =>
                  !(index === creator.length - 1) ? `${e} & ` : e
                )
              : creator}
          </Text>
        </View>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  wordContainer: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 2,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
  },
  title: {
    marginRight: 14,
  },
});

export default SearchItem;
