import Pdf from "../models/pdf.js";
import type { DefinitionWord } from "../types.js";

const createCachedResult = async (
  title: string,
  creator: string[],
  rareWordObjects: DefinitionWord[]
): Promise<void> => {
  try {
    await Pdf.updateOne(
      { creator, title },
      { data: rareWordObjects },
      { upsert: true }
    );
  } catch (err) {
    console.error(err);
  }
};

export default createCachedResult;
