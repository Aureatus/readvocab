import { corpusObject } from "corpus-word-freq";
import fp from "fastify-plugin";

import type { FastifyPluginAsync } from "fastify";
import type { corpusInstance } from "../types.js";

declare module "fastify" {
  interface FastifyInstance {
    corpus: corpusInstance;
  }
}

export interface Options {
  grammarClasstoRemove: string[];
}

const corpus: FastifyPluginAsync<Options> = async (instance, options) => {
  const corpus = corpusObject(options.grammarClasstoRemove);

  instance.decorate("corpus", corpus);
};

export default fp(corpus);
