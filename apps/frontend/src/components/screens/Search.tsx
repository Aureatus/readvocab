import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";
import {
  Button,
  Dialog,
  Portal,
  ProgressBar,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";
import Toast from "react-native-root-toast";

import getSearchedPDFs from "../../library/helpers/network/getSearchedPDFs";
import useWordDataContext from "../../library/hooks/useWordDataContext";

import type { SearchResult } from "../../types/dataTypes";
import type { SearchProps } from "../../types/navigationTypes";

const Search = ({ navigation: { navigate } }: SearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);

  const {
    wordData,
    setWordData,
    wordDataLoading: { loading, message },
    setWordDataLoading,
    wordDataError,
    setWordDataError,
  } = useWordDataContext();

  const { colors } = useTheme();

  const renderItem = ({ item }: { item: SearchResult }) => {
    return (
      <Button onPress={() => console.log(item._id)}>
        <View>
          <Text>{item._id}</Text>
          <Text>{item.title}</Text>
          <Text>
            {item.creator.length > 1
              ? item.creator.map((e, index) =>
                  !(index === item.creator.length - 1) ? `${e} & ` : e
                )
              : item.creator}
          </Text>
        </View>
      </Button>
    );
  };

  useEffect(() => {
    if (searchQuery === "") return;
    (async () => setSearchResults(await getSearchedPDFs(searchQuery)))();
  }, [searchQuery]);

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

  if (loading)
    return (
      <View style={styles.container}>
        <ProgressBar indeterminate style={styles.loadingBar} />
        <Text>{message}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search PDFs"
        value={searchQuery}
        onChangeText={(query) => setSearchQuery(query)}
      />
      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
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
  loadingBar: {
    height: 20,
    width: Dimensions.get("window").width / 1.5,
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

export default Search;
