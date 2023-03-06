import { useEffect, useState } from "react";

import type { DefinitionWord } from "../../types/dataTypes";

import getSavedWords from "../helpers/network/getSavedWords";

const useHandledSavedWords = (user: string | null) => {
  const [savedWords, setSavedWords] = useState<DefinitionWord[]>([]);
  const [savedWordsError, setSavedWordsError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      if (user === null) setSavedWords([]);
      else {
        try {
          const response = await getSavedWords(user);
          setSavedWords(response);
          setSavedWordsError(null);
        } catch (err) {
          if (err instanceof Error) setSavedWordsError(err);
        }
      }
    })();
  }, [user]);

  return {
    savedWords,
    setSavedWords,
    savedWordsError,
    setSavedWordsError,
  };
};

export default useHandledSavedWords;
