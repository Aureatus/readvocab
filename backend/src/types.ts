export interface CorpusWord {
  word: string;
  PoS: string;
  freq: string;
}

export interface DefinitionWord {
  word: string;
  wordClass: string;
  definition: string;
}

export interface corpusInstance {
  getWordFrequency: (word: string) => number | undefined;
  getMatchedWords: (wordList: string[], desiredMatches: number) => CorpusWord[];
}

export interface User {
  email: string;
  password: string;
  savedWords: DefinitionWord[];
}

export interface JwtUser {
  _id: string;
  email: string;
  password: string;
  savedWords: DefinitionWord[];
  iat: number;
  exp: number;
}

export interface PDFInfoType {
  [x: string]: string | undefined;
}
