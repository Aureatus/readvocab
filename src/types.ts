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
  email: String;
  password: String;
}
