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
