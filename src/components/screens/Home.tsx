import { Button, View, Text, StyleSheet, Platform } from "react-native";
import { Bar } from "react-native-progress";

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
        <Bar
          width={300}
          height={20}
          useNativeDriver={Platform.OS === "web" ? false : true}
          indeterminate
        />
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
});

export default Home;
