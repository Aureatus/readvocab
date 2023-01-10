/* eslint-disable no-unreachable */
import type { PDFDocumentProxy } from "pdfjs-dist";
import type { DefinitionWord } from "../types.js";

import type { Db } from "mongodb";

const createCachedResult = async (
  docProxy: PDFDocumentProxy,
  db: Db,
  rareWordObjects: DefinitionWord[]
): Promise<void> => {
  try {
    const pdfCollection = db.collection("pdfs");
    const { metadata } = await docProxy.getMetadata();
    const title = metadata.get("dc:title");
    const creator = metadata.get("dc:creator");

    const document = {
      creator,
      title,
      data: rareWordObjects,
    };

    const filter = { creator, title };
    const updateDocument = {
      $set: document,
    };
    await pdfCollection.updateOne(filter, updateDocument, { upsert: true });
  } catch (err) {
    console.error(err);
  }
};

export default createCachedResult;
