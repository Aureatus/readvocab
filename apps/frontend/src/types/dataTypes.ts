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

export type SearchResult = {
  _id: string;
  creator: string[];
  title: string;
};

export type LoadingData = {
  loading: boolean;
  message?: string;
};

export type FileInfo = {
  uri: string;
  type: string;
  name: string;
};
