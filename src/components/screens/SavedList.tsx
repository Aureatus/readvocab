import { View, Text, FlatList, StyleSheet } from "react-native";

import type { DefinitionWord } from "../../types/dataTypes";

import WordItem from "../WordItem";
import saveWord from "../../library/helpers/saveWord";
import useUserContext from "../../library/hooks/useUserContext";
import useSavedWordsContext from "../../library/hooks/useSavedWordsContext";
import deleteWord from "../../library/helpers/deleteWord";

const SavedList = () => {
  const { user } = useUserContext();
  const { savedWords, setSavedWords } = useSavedWordsContext();

  const renderItem = ({ item }: { item: DefinitionWord }) => {
    const getSaved = () => {
      return !!savedWords.find(
        (element) => JSON.stringify(element) === JSON.stringify(item)
      );
    };
    return (
      <WordItem
        word={item.word}
        definition={item.definition}
        wordClass={item.wordClass}
        saved={getSaved()}
        onPress={() => {
          getSaved()
            ? deleteWord(user, item, savedWords, setSavedWords)
            : saveWord(user, item, savedWords, setSavedWords);
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

  return savedWords.length === 0 ? (
    <View style={styles.container}>
      <Text style={styles.title}>Save some words to see them here!</Text>
    </View>
  ) : (
    <FlatList
      data={savedWords}
      renderItem={renderItem}
      keyExtractor={(item) => item.word}
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
});

export default SavedList;
