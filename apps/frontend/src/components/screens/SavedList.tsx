import { View, FlatList, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";

import type { DefinitionWord } from "../../types/dataTypes";

import SavedWordItem from "../SavedWordItem";
import useUserContext from "../../library/hooks/useUserContext";
import useSavedWordsContext from "../../library/hooks/useSavedWordsContext";
import deleteWord from "../../library/helpers/deleteWord";
import getSavedWords from "../../library/helpers/network/getSavedWords";

const SavedList = () => {
  const { user } = useUserContext();
  const { savedWords, setSavedWords, savedWordsError, setSavedWordsError } =
    useSavedWordsContext();

  const renderItem = ({ item }: { item: DefinitionWord }) => {
    return (
      <SavedWordItem
        word={item.word}
        definition={item.definition}
        wordClass={item.wordClass}
        onPress={async () => {
          await deleteWord(user, item, savedWords, setSavedWords);
        }}
      />
    );
  };

  if (user === null)
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Log in to see saved words!</Text>
      </View>
    );

  if (savedWordsError)
    return (
      <View style={styles.container}>
        <Text variant="displayMedium" style={styles.errorText}>
          Failed to get saved words.
        </Text>
        <Button
          mode="contained"
          onPress={async () => {
            try {
              const response = await getSavedWords(user);
              setSavedWords(response);
              setSavedWordsError(null);
            } catch (err) {
              if (err instanceof Error) setSavedWordsError(err);
            }
          }}
        >
          Retry
        </Button>
      </View>
    );

  return savedWords.length === 0 ? (
    <View style={styles.container}>
      <Text style={styles.title}>Save some words to see them here!</Text>
    </View>
  ) : (
    <FlatList
      data={savedWords}
      renderItem={renderItem}
      keyExtractor={(item) => item.word}
      ListHeaderComponent={<Text variant="displaySmall">Saved words</Text>}
      ListHeaderComponentStyle={styles.header}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 42,
  },
  header: {
    marginHorizontal: 4,
    marginVertical: 12,
  },
  errorText: {
    textAlign: "center",
    marginBottom: 20,
  },
});

export default SavedList;
