import type { PDFDocumentProxy } from "pdfjs-dist";
import punctuationFilter from "../utils/punctuationFilter.js";
import removeDuplicates from "../utils/removeDuplicates.js";

const wordsFromPDF = async (docProxy: PDFDocumentProxy): Promise<string[]> => {
  const docPages = docProxy.numPages;
  let array: string[] = [];
  for (let i = 1; i <= docPages; i++) {
    const page = await docProxy.getPage(i);
    const pageInfo = await page.getTextContent();
    const pageText = pageInfo.items.map((item) => {
      if ("str" in item) return item.str;
      else return "";
    });
    array = array.concat(pageText);
  }
  const text = array.toString();

  const normalizedText = punctuationFilter(text).trim().replaceAll(/  +/g, " ");
  const words = normalizedText.split(" ");

  const trimmedWords = words.map((word: string) => word.trim());
  const uniqueWords = removeDuplicates(trimmedWords);
  return uniqueWords;
};

export default wordsFromPDF;
