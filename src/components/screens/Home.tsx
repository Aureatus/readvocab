import { Button, View, Text, StyleSheet, Dimensions } from "react-native";
import { ProgressBar } from "react-native-paper";

import type { HomeProps } from "../../types/navigationTypes";

import getFile from "../../library/helpers/getFile";
import getWords from "../../library/helpers/getWords";
import useWordDataContext from "../../library/hooks/useWordDataContext";
import getRandomWords from "../../library/helpers/network/getRandomWords";

const Home = ({ navigation: { navigate } }: HomeProps) => {
  const {
    wordData,
    setWordData,
    wordDataLoading: { loading, message },
    setWordDataLoading,
    setWordDataError,
  } = useWordDataContext();

  if (loading)
    return (
      <View style={styles.container}>
        <ProgressBar indeterminate style={styles.loadingBar} />
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
              const file = await getFile();
              if (file === undefined) return;

              getWords(file, setWordData, setWordDataLoading, setWordDataError);
            } catch (err) {
              if (err instanceof Error) setWordDataError(err);
            }
          })();
        }}
      />
      <Button
        title={"Random PDF"}
        onPress={() => {
          (async () => {
            try {
              getRandomWords(setWordData, setWordDataLoading, setWordDataError);
            } catch (err) {
              if (err instanceof Error) setWordDataError(err);
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

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingBar: {
    height: 20,
    width: Dimensions.get("window").width / 1.5,
  },
});

export default Home;
