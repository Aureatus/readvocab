import { useContext } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";

import type { DefinitionWord } from "../../types/dataTypes";

import WordDataContext from "../../library/context/WordDataContext";
import WordItem from "../WordItem";

const WordList = () => {
  const context = useContext(WordDataContext);
  if (context === null)
    return (
      <View>
        <Text>Unknown Error</Text>
      </View>
    );
  const {
    wordData,
    wordDataLoading: { loading, message },
    wordDataError,
  } = context;

  const renderItem = ({ item }: { item: DefinitionWord }) => (
    <WordItem
      word={item.word}
      definition={item.definition}
      wordClass={item.wordClass}
    />
  );

  if (loading)
    return (
      <View>
        <ActivityIndicator size={"large"} />
        <Text>{message}</Text>
      </View>
    );

  if (wordDataError)
    return (
      <View>
        <Text>{wordDataError.message}</Text>
      </View>
    );

  return (
    <View>
      <FlatList
        data={wordData}
        renderItem={renderItem}
        keyExtractor={(item) => item.word}
      />
    </View>
  );
};

export default WordList;
