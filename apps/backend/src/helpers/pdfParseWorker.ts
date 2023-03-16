import { parentPort, workerData } from "worker_threads";
import getDocProxy from "./getDocProxy.js";

const { firstPage, lastPage, file } = workerData;
let array: string[] = [];
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

// Below lies the sacred code that allows me to run this code via eval in a worker thread.
// (async () => {
//   const pkg = require("pdfjs-dist");
//   const { getDocument } = pkg;
//   const { parentPort } = require("worker_threads");

//   const getDocProxy = async (file) => {
//     const doc = await getDocument({
//       data: file,
//       useSystemFonts: true,
//     }).promise;
//     return doc;
//   };

//   const { firstPage, lastPage, file } =
//     require("node:worker_threads").workerData;
//   let array = [];
//   const docProxy = await getDocProxy(file);
//   for (let i = firstPage; i <= lastPage; i++) {
//     const page = await docProxy.getPage(i);
//     const pageInfo = await page.getTextContent();
//     const pageText = pageInfo.items.map((item) => {
//       if ("str" in item) return item.str;
//       else return "";
//     });
//     array = array.concat(pageText);
//   }

//   parentPort?.postMessage(array);
// })();
