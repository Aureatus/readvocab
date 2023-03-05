import { useEffect, useState } from "react";
import { useTheme } from "react-native-paper";

import type { DefinitionWord, LoadingData } from "../../types/dataTypes";

import displayError from "../helpers/displayError";

const useHandledWordData = () => {
  const { colors } = useTheme();

  const [wordData, setWordData] = useState<DefinitionWord[]>([]);
  const [wordDataLoading, setWordDataLoading] = useState<LoadingData>({
    loading: false,
  });
  const [wordDataError, setWordDataError] = useState<Error | undefined>();

  useEffect(() => {
    if (wordDataError instanceof Error) displayError(colors, wordDataError);
  }, [colors, wordDataError]);

  return {
    wordData,
    setWordData,
    wordDataLoading,
    setWordDataLoading,
    wordDataError,
    setWordDataError,
  };
};

export default useHandledWordData;
