import { createContext, Dispatch, SetStateAction } from "react";

import type { DefinitionWord } from "../../types/dataTypes";

const SavedWordsContext = createContext<
  | {
      savedWords: DefinitionWord[];
      setSavedWords: Dispatch<SetStateAction<DefinitionWord[]>>;
      savedWordsError: Error | null;
      setSavedWordsError: Dispatch<SetStateAction<Error | null>>;
    }
  | undefined
>(undefined);

export default SavedWordsContext;
