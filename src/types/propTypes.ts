import type { Dispatch, SetStateAction } from "react";
import type { DefinitionWord } from "./dataTypes";

export type HomeDataProps = {
  setWordData: Dispatch<SetStateAction<DefinitionWord[]>>;
  setWordDataLoading: Dispatch<SetStateAction<boolean>>;
  setWordDataError: Dispatch<SetStateAction<Error | undefined>>;
};
