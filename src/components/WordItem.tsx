import { View, Text, StyleSheet } from "react-native";

const WordItem = ({
  word,
  definition,
  wordClass,
}: {
  word: string;
  definition: string;
  wordClass: string;
}) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.title}>{word}</Text>
      <Text style={styles.subtitle}>{wordClass}</Text>
    </View>
    <Text>{definition}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    paddingVertical: 2,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
  },
  title: {
    fontSize: 22,
    marginRight: 14,
  },
  subtitle: {
    fontSize: 14,
  },
});

export default WordItem;
