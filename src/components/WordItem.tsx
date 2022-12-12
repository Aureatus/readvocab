import { View, Text } from "react-native";

const WordItem = ({
  word,
  definition,
  wordClass,
}: {
  word: string;
  definition: string;
  wordClass: string;
}) => (
  <View>
    <View>
      <Text>{word}</Text>
      <Text>{wordClass}</Text>
    </View>
    <Text>{definition}</Text>
  </View>
);

export default WordItem;
