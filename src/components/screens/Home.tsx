import { View, StyleSheet, Dimensions } from "react-native";
import {
  ProgressBar,
  Button,
  Surface,
  Text,
  Dialog,
  Portal,
} from "react-native-paper";

import type { HomeProps } from "../../types/navigationTypes";

import getFile from "../../library/helpers/getFile";
import getWords from "../../library/helpers/getWords";
import useWordDataContext from "../../library/hooks/useWordDataContext";
import getRandomWords from "../../library/helpers/network/getRandomWords";
import { useEffect, useState } from "react";

const Home = ({ navigation: { navigate } }: HomeProps) => {
  const {
    wordData,
    setWordData,
    wordDataLoading: { loading, message },
    setWordDataLoading,
    setWordDataError,
  } = useWordDataContext();

  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    if (wordData.length !== 0) {
      setDialogVisible(true);
    }
  }, [wordData]);

  if (loading)
    return (
      <View style={styles.container}>
        <ProgressBar indeterminate style={styles.loadingBar} />
        <Text>{message}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Surface style={styles.surface}>
        <Button
          mode="contained"
          onPress={() => {
            (async () => {
              try {
                const file = await getFile();
                if (file === undefined) return;
                getWords(
                  file,
                  setWordData,
                  setWordDataLoading,
                  setWordDataError
                );
              } catch (err) {
                if (err instanceof Error) setWordDataError(err);
              }
            })();
          }}
        >
          {wordData.length === 0 ? "Upload a PDF" : "Upload another PDF"}
        </Button>
        <Text variant="bodyLarge" style={styles.orText}>
          Or
        </Text>
        <Button
          mode="contained"
          onPress={() => {
            (async () => {
              try {
                getRandomWords(
                  setWordData,
                  setWordDataLoading,
                  setWordDataError
                );
              } catch (err) {
                if (err instanceof Error) setWordDataError(err);
              }
            })();
          }}
        >
          {"Get a random PDF"}
        </Button>
      </Surface>
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Content>
            <Text variant="bodyMedium">Rare Words are ready!</Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button
              onPress={() => {
                setDialogVisible(false);
                navigate("WordList");
              }}
            >
              Go to words
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  surface: {
    display: "flex",
    justifyContent: "center",
    padding: Dimensions.get("window").width / 6,

    borderRadius: 20,
  },
  loadingBar: {
    height: 20,
    width: Dimensions.get("window").width / 1.5,
  },
  orText: {
    alignSelf: "center",
    marginVertical: 5,
  },
  dialog: {
    maxWidth: "50%",
    maxHeight: "20%",
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  dialogActions: {
    alignSelf: "center",
  },
});

export default Home;
