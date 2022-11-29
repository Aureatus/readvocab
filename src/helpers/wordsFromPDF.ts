import { join } from "path";
import { getDocument } from "pdfjs-dist";
import punctuationFilter from "../utils/punctuationFilter";
import removeDuplicates from "../utils/removeDuplicates";

const wordsFromPDF = async (dir: string): Promise<string[]> => {
  const doc = await getDocument(join(__dirname, dir)).promise;
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
