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
}

export interface JwtUser {
  _id: string;
  email: string;
  password: string;
  iat: number;
  exp: number;
}
