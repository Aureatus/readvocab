// @ts-nocheck
import { cpus } from "os";
import { Worker, isMainThread, workerData, parentPort } from "worker_threads";

import { URL } from "url"; // in Browser, the URL in native accessible on window

import getDocProxy from "./getDocProxy.js";

// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = new URL("", import.meta.url).pathname;

const punctuationFilter = (wordList) => {
  const invalidCharRegex = /([^\s\w])/g;

  return wordList.replaceAll(invalidCharRegex, " ");
};

const removeDuplicates = (wordList) => {
  return [...new Set(wordList)];
};

export let wordsFromPDFThreaded;

let result = [];

if (isMainThread) {
  wordsFromPDFThreaded = async (docProxy, file) => {
    return new Promise((resolve, reject) => {
      const availableThreads = cpus().length - 1;

      const docPages = docProxy.numPages;
      const desiredThreads =
        docPages < 400 ? 4 : 4 + Math.floor((docPages - 400) / 250);
      const threadCount =
        availableThreads >= desiredThreads ? desiredThreads : availableThreads;

      const threads = new Set();

      const pageDistribution = Math.floor(docPages / threadCount);
      const pageRemainder = docPages % threadCount;

      let firstPage = 1;
      let lastPage = pageDistribution;

      for (let i = 1; i <= threadCount; i++) {
        threads.add(
          new Worker(__filename, {
            workerData: { firstPage, lastPage, file },
          })
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
} else {
  const { firstPage, lastPage, file } = workerData;
  let array = [];
  const docProxy = await getDocProxy(file);
  for (let i = firstPage; i <= lastPage; i++) {
    try {
      const page = await docProxy.getPage(i);
      const pageInfo = await page.getTextContent();
      const pageText = pageInfo.items.map((item) => {
        if ("str" in item) return item.str;
        else return "";
      });
      array = array.concat(pageText);
    } catch (err) {
      console.log(`${err} pages: ${firstPage} - ${lastPage}`);
    }
  }

  parentPort?.postMessage(array);
}
