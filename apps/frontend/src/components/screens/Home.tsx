import { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import {
  Button,
  Surface,
  Text,
  Dialog,
  Portal,
  useTheme,
} from "react-native-paper";
import Toast from "react-native-root-toast";

import type { HomeProps } from "../../types/navigationTypes";

import getFile from "../../library/helpers/getFile";
import getWords from "../../library/helpers/getWords";
import useWordDataContext from "../../library/hooks/useWordDataContext";
import getRandomWords from "../../library/helpers/network/getRandomWords";
import LoadingScreen from "../LoadingScreen";

const Home = ({ navigation: { navigate } }: HomeProps) => {
  const {
    wordData,
    setWordData,
    wordDataLoading: { loading, message },
    setWordDataLoading,
    wordDataError,
    setWordDataError,
  } = useWordDataContext();

  const [dialogVisible, setDialogVisible] = useState(false);

  const { colors } = useTheme();

  useEffect(() => {
    if (wordData.length !== 0) {
      setDialogVisible(true);
    }
  }, [wordData]);

  useEffect(() => {
    if (wordDataError instanceof Error) {
      Toast.show(wordDataError?.message, {
        position: Toast.positions.TOP,
        containerStyle: {
          borderColor: colors.error,
          borderWidth: 2,
          backgroundColor: colors.errorContainer,
          paddingHorizontal: 20,
        },
        textColor: colors.inverseSurface,
      });
    }
  }, [wordDataError, colors]);

  if (loading) return <LoadingScreen message={message} />;

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
