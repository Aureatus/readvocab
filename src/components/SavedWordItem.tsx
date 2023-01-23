import { useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Text, IconButton } from "react-native-paper";

const SavedWordItem = ({
  word,
  definition,
  wordClass,
  onPress,
}: {
  word: string;
  definition: string;
  wordClass: string;
  onPress: () => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
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
        {loading ? (
          <ActivityIndicator color="#f3213d" size={52} />
        ) : (
          <IconButton
            icon={"remove-circle-outline"}
            size={24}
            iconColor={"#f3213d"}
            onPress={async () => {
              setLoading(true);
              await onPress();
              setLoading(true);
            }}
          />
        )}
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

export default SavedWordItem;
