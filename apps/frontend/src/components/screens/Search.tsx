import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";
import { Searchbar, Text, useTheme } from "react-native-paper";

import type { SearchResult } from "../../types/dataTypes";

import SearchItem from "../SearchItem";
import getSearchedPDFs from "../../library/helpers/network/getSearchedPDFs";
import getWordsById from "../../library/helpers/network/getWordsById";
import useWordDataContext from "../../library/hooks/useWordDataContext";
import displayError from "../../library/helpers/displayError";
import LoadingScreen from "../LoadingScreen";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<Error | undefined>(undefined);
  const [noResults, setNoResults] = useState(false);

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
      <SearchItem
        title={item.title}
        creator={item.creator}
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
      />
    );
  };

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults([]);
      return setNoResults(false);
    }
    (async () => {
      try {
        const result = getSearchedPDFs(searchQuery);
        setSearchLoading(true);
        if ((await result).length === 0) setNoResults(true);
        if ((await result).length !== 0) setNoResults(false);
        setSearchResults(await result);
      } catch (err) {
        if (err instanceof Error) setSearchError(err);
        else return;
      } finally {
        setSearchLoading(false);
      }
    })();
  }, [searchQuery]);

  useEffect(() => {
    if (wordDataError instanceof Error) displayError(colors, wordDataError);
  }, [colors, wordDataError]);

  useEffect(() => {
    if (searchError instanceof Error) displayError(colors, searchError);
  }, [colors, searchError]);

  if (loading) return <LoadingScreen message={message} />;

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search PDFs"
        value={searchQuery}
        onChangeText={(query) => setSearchQuery(query)}
        loading={searchLoading}
        style={styles.searchBar}
      />
      {noResults ? (
        <View style={styles.container}>
          <Text variant="displaySmall" style={styles.noResultsText}>
            No results found.
          </Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
  },
  searchBar: {
    margin: Dimensions.get("window").width / 60,
  },
  noResultsText: {
    alignSelf: "center",
  },
});

export default Search;
