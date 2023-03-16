/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import { cpus } from "os";
import { Worker, parentPort, workerData } from "worker_threads";
import getDocProxy from "./getDocProxy.js";

import punctuationFilter from "../utils/punctuationFilter.js";
import removeDuplicates from "../utils/removeDuplicates.js";
import type { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api.js";

// const dirName = new URL(".", import.meta.url).pathname;

let result: string[] = [];

const wordsFromPDFThreaded = async (
  docProxy: PDFDocumentProxy,
  file: any
): Promise<string[]> => {
  return await new Promise((resolve) => {
    const availableThreads = cpus().length - 1;

    const docPages = docProxy.numPages;
    const desiredThreads =
      docPages < 400 ? 4 : 4 + Math.floor((docPages - 400) / 250);
    const threadCount =
      availableThreads >= desiredThreads ? desiredThreads : availableThreads;

    const threads: Set<Worker> = new Set();

    const pageDistribution = Math.floor(docPages / threadCount);
    const pageRemainder = docPages % threadCount;

    let firstPage = 1;
    let lastPage = pageDistribution;

    for (let i = 1; i <= threadCount; i++) {
      threads.add(
        // Using eval is FAR FROM IDEAL, but I was having issues passing the my typescript file to the worker, so it will do for now.
        new Worker(
          `(async () => {
            const pkg = require("pdfjs-dist");
            const { getDocument } = pkg;
            const { parentPort } = require("worker_threads");
          
            const getDocProxy = async (file) => {
              const doc = await getDocument({
                data: file,
                useSystemFonts: true,
              }).promise;
              return doc;
            };
          
            const { firstPage, lastPage, file } =
              require("node:worker_threads").workerData;
            let array = [];
            const docProxy = await getDocProxy(file);
            for (let i = firstPage; i <= lastPage; i++) {
              const page = await docProxy.getPage(i);
              const pageInfo = await page.getTextContent();
              const pageText = pageInfo.items.map((item) => {
                if ("str" in item) return item.str;
                else return "";
              });
              array = array.concat(pageText);
            }
          
            parentPort?.postMessage(array);
          })();
          `,
          {
            eval: true,
            workerData: { firstPage, lastPage, file },
          }
        )
      );
      firstPage = lastPage + 1;
      lastPage = firstPage + pageDistribution - 1;
      if (threadCount - i === 0) lastPage = lastPage + pageRemainder;
    }

    for (const worker of threads) {
      worker.on("error", (err) => {
        throw err;
      });
      worker.on("exit", () => {
        threads.delete(worker);
        if (threads.size === 0) {
          const text = result.toString();
          const normalizedText = punctuationFilter(text)
            .trim()
            .replaceAll(/  +/g, " ");

          const words = normalizedText.split(" ");
          const trimmedWords = words.map((word) => word.trim());
          const uniqueWords = removeDuplicates(trimmedWords);
          result = uniqueWords;
          resolve(result);
        }
      });
      worker.on("message", (msg) => {
        result = result.concat(msg);
      });
    }
  });
};

export default wordsFromPDFThreaded;
