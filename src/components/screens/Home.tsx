import { useContext } from "react";
import { Button, View, Text } from "react-native";

import type { HomeProps } from "../../types/navigationTypes";

import WordDataContext from "../../library/context/WordDataContext";
import getFile from "../../library/helpers/getFile";
import getWordsFromPDF from "../../library/helpers/getWordsFromPDF";
import getRareWords from "../../library/helpers/getRareWords";
import getWordsAndDefinitions from "../../library/helpers/getWordsAndDefinitions";

const Home = ({ navigation: { navigate } }: HomeProps) => {
  const context = useContext(WordDataContext);
  if (context === null)
    return (
      <View>
        <Text>Error</Text>
      </View>
    );
  const { setWordData, setWordDataLoading, setWordDataError } = context;

  return (
    <View>
      <Button
        title="Upload PDF"
        onPress={() => {
          (async () => {
            try {
              const fileUri = await getFile();
              if (fileUri === undefined) return;

              setWordDataLoading(true);

              const wordList = await getWordsFromPDF(fileUri);
              const rareWords = await getRareWords(wordList);
              const wordsWithDefinitions = await getWordsAndDefinitions(
                rareWords
              );
              setWordData(wordsWithDefinitions);
              setWordDataError(undefined);
            } catch (err) {
              if (err instanceof Error) setWordDataError(err);
            } finally {
              setWordDataLoading(false);
            }
          })();
        }}
      />
      <Button title="Go to Words" onPress={() => navigate("WordList")} />
    </View>
  );
};

export default Home;
