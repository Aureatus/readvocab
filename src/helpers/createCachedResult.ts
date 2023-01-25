import type { DefinitionWord } from "../types.js";

import type { Db } from "mongodb";

const createCachedResult = async (
  title: string,
  creator: string[],
  db: Db,
  rareWordObjects: DefinitionWord[]
): Promise<void> => {
  try {
    const pdfCollection = db.collection("pdfs");

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
