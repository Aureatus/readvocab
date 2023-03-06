import { useEffect, useState } from "react";
import { useTheme } from "react-native-paper";

import type { SearchResult } from "../../types/dataTypes";

import displayError from "../helpers/displayError";
import getSearchedPDFs from "../helpers/network/getSearchedPDFs";

const useSearchData = () => {
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<Error | undefined>(undefined);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    if (searchError instanceof Error) displayError(colors, searchError);
  }, [colors, searchError]);

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

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    searchLoading,
    setSearchLoading,
    searchError,
    setSearchError,
    noResults,
    setNoResults,
  };
};

export default useSearchData;
