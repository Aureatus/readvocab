import type { DefinitionWord } from "../types.js";

import type { Db } from "mongodb";

const getRandomResult = async (db: Db): Promise<DefinitionWord[] | null> => {
  const pdfCollection = db.collection<{ data: DefinitionWord[] }>("pdfs");
  const cursor = pdfCollection.aggregate([{ $sample: { size: 1 } }]);
  const randomResult = await cursor
    .project<{ data: DefinitionWord[] }>({ data: 1 })
    .next();

  return randomResult?.data ?? null;
};
export default getRandomResult;
