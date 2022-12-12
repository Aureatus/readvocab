import { createContext, Dispatch, SetStateAction } from "react";
import type { DefinitionWord } from "../../types/dataTypes";

const WordDataContext = createContext<{
  wordData: DefinitionWord[];
  setWordData: Dispatch<SetStateAction<DefinitionWord[]>>;
  wordDataLoading: boolean;
  setWordDataLoading: Dispatch<SetStateAction<boolean>>;
  wordDataError: Error | undefined;
  setWordDataError: Dispatch<SetStateAction<Error | undefined>>;
} | null>(null);

export default WordDataContext;
