import type { RequestGenericInterface } from "fastify";
import type { Types } from "mongoose";

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

export interface UserData {
  _id: Types.ObjectId;
  email: string;
  password: string;
  savedWords: DefinitionWord[];
}

export interface JwtUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  savedWords: DefinitionWord[];
  iat: number;
  exp: number;
}

export interface PDFInfoType {
  [x: string]: string | undefined;
}

export interface LoginGeneric extends RequestGenericInterface {
  Body: {
    email: string;
    password: string;
  };
}

export interface SignupGeneric extends RequestGenericInterface {
  Body: {
    email: string;
    password: string;
    confirmPassword: string;
  };
}

export interface WordGeneric extends RequestGenericInterface {
  Body: DefinitionWord;
}

export interface WordQueryGeneric extends RequestGenericInterface {
  Querystring: {
    id: string;
  };
}

export interface SearchGeneric extends RequestGenericInterface {
  Querystring: {
    searchTerm: string;
  };
}
