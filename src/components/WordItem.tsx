import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";

const WordItem = ({
  word,
  definition,
  wordClass,
  onPress,
}: {
  word: string;
  definition: string;
  wordClass: string;
  onPress: () => void;
}) => {
  const [saved, setSaved] = useState(true);
  return (
    <View style={styles.container}>
      <View style={styles.wordContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{word}</Text>
          <Text style={styles.subtitle}>{wordClass}</Text>
        </View>
        <Text>{definition}</Text>
      </View>
      <View>
        <IconButton
          icon={saved ? "heart-outline" : "heart"}
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
    justifyContent: "space-between",
  },
  wordContainer: {
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
