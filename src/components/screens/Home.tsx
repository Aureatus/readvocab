import { useContext } from "react";
import { Button, View, Text, StyleSheet, Platform } from "react-native";
import { Bar } from "react-native-progress";
import { FileSystemUploadType, uploadAsync } from "expo-file-system";
import EventSource from "react-native-sse";

import type { HomeProps } from "../../types/navigationTypes";
import type { WordFetchEvents } from "../../types/eventTypes";

import WordDataContext from "../../library/context/WordDataContext";
import getFile from "../../library/helpers/getFile";

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
                const formData = new FormData();
                formData.append("pdf", fileUri);
                const es = new EventSource<WordFetchEvents>(
                  "http://0.0.0.0:3000/words",
                  {
                    method: "POST",
                    body: formData,
                  }
                );
                setWordDataLoading({ loading: true, message: "Calling API" });
                es.addEventListener("loading", (e) => {
                  if (e.type !== "loading") return;
                  if (e.data === null) return;
                  setWordDataLoading({ loading: true, message: e.data });
                });
                es.addEventListener("result", (e) => {
                  if (e.type !== "result") return;
                  if (e.data === null) return;
                  setWordData(JSON.parse(e.data));
                  es.close();
                });
                es.addEventListener("close", () => {
                  setWordDataLoading({ loading: false });
                  es.removeAllEventListeners();
                });
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
