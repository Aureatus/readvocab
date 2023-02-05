import Pdf from "../models/pdf.js";
import type { DefinitionWord } from "../types.js";

const getCachedResult = async (
  title: string,
  creator: string[]
): Promise<DefinitionWord[] | null> => {
  const test = await Pdf.findOne({ title, creator }, "data").exec();

  const data = test?.data ?? null;

  return data;
};

export default getCachedResult;
