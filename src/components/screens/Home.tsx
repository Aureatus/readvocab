import { useContext } from "react";
import { Button, View, Text, StyleSheet, Platform } from "react-native";
import { Bar } from "react-native-progress";
import { FileSystemUploadType, uploadAsync } from "expo-file-system";

import type { HomeProps } from "../../types/navigationTypes";

import WordDataContext from "../../library/context/WordDataContext";
import getFile from "../../library/helpers/getFile";
import getWords from "../../library/helpers/getWords";

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
    wordDataLoading: { loading, message },
    setWordDataLoading,
    setWordDataError,
  } = context;

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
              const fileUri = await getFile();
              if (fileUri === undefined) return;

              if (fileUri instanceof File) {
                getWords(
                  fileUri,
                  setWordData,
                  setWordDataLoading,
                  setWordDataError
                );
              } else {
                const response = await uploadAsync(
                  "http://0.0.0.0:3000/words",
                  fileUri,
                  {
                    fieldName: "pdf",
                    httpMethod: "POST",
                    uploadType: FileSystemUploadType.MULTIPART,
                  }
                );
                const data = response.body;
                setWordData(JSON.parse(data));
                setWordDataLoading({ loading: false });
              }

              setWordDataError(undefined);
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
