import { createContext, Dispatch, SetStateAction } from "react";

import type { DefinitionWord } from "../../types/dataTypes";

const SavedWordsContext = createContext<
  | {
      savedWords: DefinitionWord[];
      setSavedWords: Dispatch<SetStateAction<DefinitionWord[]>>;
    }
  | undefined
>(undefined);

export default SavedWordsContext;
