import { View, StyleSheet } from "react-native";
import { Text, IconButton } from "react-native-paper";

const WordItem = ({
  word,
  definition,
  wordClass,
  saved,
  onPress,
}: {
  word: string;
  definition: string;
  wordClass: string;
  saved: boolean;
  onPress: () => void;
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.wordContainer}>
        <View style={styles.header}>
          <Text style={styles.title} variant="titleLarge">
            {word}
          </Text>
          <Text variant="labelLarge">{wordClass}</Text>
        </View>
        <Text variant="bodyLarge">{definition}</Text>
      </View>
      <View>
        <IconButton
          icon={saved ? "bookmark" : "bookmark-outline"}
          size={24}
          iconColor={"#3EB489"}
          onPress={onPress}
        />
      </View>
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

export default WordItem;
