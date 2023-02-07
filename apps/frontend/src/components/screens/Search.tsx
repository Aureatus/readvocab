import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Button, Searchbar, Text } from "react-native-paper";
import getSearchedPDF from "../../library/helpers/network/getSearchedPDF";
import type { SearchResult } from "../../types/dataTypes";
const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

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
    (async () => setSearchResults(await getSearchedPDF(searchQuery)))();
  }, [searchQuery]);

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
});

export default Search;
