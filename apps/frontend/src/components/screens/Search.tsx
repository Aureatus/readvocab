import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";
import {
  Button,
  ProgressBar,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";
import Toast from "react-native-root-toast";

import getSearchedPDFs from "../../library/helpers/network/getSearchedPDFs";
import getWordsById from "../../library/helpers/network/getWordsById";
import useWordDataContext from "../../library/hooks/useWordDataContext";

import type { SearchResult } from "../../types/dataTypes";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const {
    setWordData,
    wordDataLoading: { loading, message },
    setWordDataLoading,
    wordDataError,
    setWordDataError,
  } = useWordDataContext();

  const { colors } = useTheme();

  const renderItem = ({ item }: { item: SearchResult }) => {
    return (
      <Button
        onPress={async () => {
          try {
            setWordDataLoading({ loading: true, message: "Getting words" });
            setWordData(await getWordsById(item._id));
          } catch (err) {
            if (!(err instanceof Error)) return;
            setWordDataError(err);
          } finally {
            setWordDataLoading({ loading: false });
          }
        }}
      >
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

export default Search;
