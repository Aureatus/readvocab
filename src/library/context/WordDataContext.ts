import { createContext, Dispatch, SetStateAction } from "react";
import type { DefinitionWord, LoadingData } from "../../types/dataTypes";

const WordDataContext = createContext<
  | {
      wordData: DefinitionWord[];
      setWordData: Dispatch<SetStateAction<DefinitionWord[]>>;
      wordDataLoading: LoadingData;
      setWordDataLoading: Dispatch<SetStateAction<LoadingData>>;
      wordDataError: Error | undefined;
      setWordDataError: Dispatch<SetStateAction<Error | undefined>>;
    }
  | undefined
>(undefined);

export default WordDataContext;
