import { useContext } from "react";
import { Button, View, Text } from "react-native";
import { Bar } from "react-native-progress";

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
  const {
    wordData,
    setWordData,
    wordDataLoading: { loading, message, progress },
    setWordDataLoading,
    setWordDataError,
  } = context;

  if (loading)
    return (
      <View>
        <Bar progress={progress ? progress : 0} />
        <Text>{message}</Text>
      </View>
    );

  return (
    <View>
      <Button
        title={wordData.length === 0 ? "Upload PDF" : "Upload another PDF"}
        onPress={() => {
          (async () => {
            try {
              const fileUri = await getFile();
              if (fileUri === undefined) return;

              setWordDataLoading({
                loading: true,
              });

              const wordList = getWordsFromPDF(fileUri);
              setWordDataLoading({
                loading: true,
                message: "Getting words from pdf",
                progress: 0,
              });

              const rareWords = getRareWords(await wordList);
              setWordDataLoading({
                loading: true,
                message: "Getting rare words",
                progress: 0.5,
              });
              const wordsWithDefinitions = getWordsAndDefinitions(
                await rareWords
              );
              setWordDataLoading({
                loading: true,
                message: "Getting word definitions",
                progress: 0.8,
              });
              setWordData(await wordsWithDefinitions);
              setWordDataError(undefined);
            } catch (err) {
              if (err instanceof Error) setWordDataError(err);
            } finally {
              setWordDataLoading({ loading: false });
            }
          })();
        }}
      />
      {wordData.length !== 0 && (
        <Button title="Go to Words" onPress={() => navigate("WordList")} />
      )}
    </View>
  );
};

export default Home;
