export type CorpusWord = {
  word: string;
  freq: number;
  PoS: string;
};

export type DefinitionWord = {
  word: string;
  wordClass: string;
  definition: string;
};

export type LoadingData = {
  loading: boolean;
  message?: string;
};