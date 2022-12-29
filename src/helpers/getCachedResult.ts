import type { PDFDocumentProxy } from "pdfjs-dist";
import type { DefinitionWord } from "../types.js";

import type { Db } from "mongodb";

const getCachedResult = async (
  docProxy: PDFDocumentProxy,
  db: Db
): Promise<DefinitionWord[] | null> => {
  const { metadata } = await docProxy.getMetadata();
  const title = metadata.get("dc:title");
  const creator = metadata.get("dc:creator");

  const pdfCollection = db.collection<{ data: DefinitionWord[] }>("pdfs");
  const response = await pdfCollection.findOne(
    { title, creator },
    { projection: { data: 1 } }
  );

  const data = response?.data ?? null;

  return data;
};

export default getCachedResult;
