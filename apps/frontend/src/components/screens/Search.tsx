import { View, StyleSheet, FlatList, Dimensions } from "react-native";
import { Searchbar, Text } from "react-native-paper";

import type { SearchResult } from "../../types/dataTypes";

import getWordsById from "../../library/helpers/network/getWordsById";
import useWordDataContext from "../../library/hooks/useWordDataContext";
import useHandledSearchData from "../../library/hooks/useHandledSearchData";
import LoadingScreen from "../LoadingScreen";
import SearchItem from "../SearchItem";

const Search = () => {
  const {
    setWordData,
    wordDataLoading: { loading, message },
    setWordDataLoading,
    setWordDataError,
  } = useWordDataContext();

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchLoading,
    noResults,
  } = useHandledSearchData();

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
