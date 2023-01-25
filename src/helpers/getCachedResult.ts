import type { DefinitionWord } from "../types.js";

import type { Db } from "mongodb";

const getCachedResult = async (
  title: string,
  creator: string[],
  db: Db
): Promise<DefinitionWord[] | null> => {
  const pdfCollection = db.collection<{ data: DefinitionWord[] }>("pdfs");
  const response = await pdfCollection.findOne(
    { title, creator },
    { projection: { data: 1 } }
  );

  const data = response?.data ?? null;

  return data;
};

export default getCachedResult;
