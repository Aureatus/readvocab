import Pdf from "../models/pdf.js";
import type { DefinitionWord } from "../types.js";

const getRandomResult = async (): Promise<DefinitionWord[] | null> => {
  const documentCount = await Pdf.count();
  const amountToSkip = Math.floor(Math.random() * documentCount);
  const randomResult = await Pdf.findOne({}, "data").skip(amountToSkip).exec();

  return randomResult?.data ?? null;
};
export default getRandomResult;
