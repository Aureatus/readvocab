import pkg from "pdfjs-dist";
import punctuationFilter from "../utils/punctuationFilter.js";
import removeDuplicates from "../utils/removeDuplicates.js";

const { getDocument } = pkg;

const wordsFromPDF = async (file: ArrayBuffer): Promise<string[]> => {
  const doc = await getDocument({
    data: file,
    useSystemFonts: true,
  }).promise;
  const docPages = doc.numPages;
  let array: string[] = [];
  for (let i = 1; i <= docPages; i++) {
    const page = await doc.getPage(i);
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
