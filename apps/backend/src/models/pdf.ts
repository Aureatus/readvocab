import { Schema, model } from "mongoose";
import type { DefinitionWord } from "../types.js";

interface IPdf {
  creator: string[];
  title: string;
  data: DefinitionWord[];
}

const wordDataSchema = new Schema<DefinitionWord>(
  {
    word: String,
    wordClass: String,
    definition: String,
  },
  { _id: false }
);

const pdfSchema = new Schema<IPdf>({
  creator: { type: [String], required: true },
  title: { type: String, required: true },
  data: {
    type: [wordDataSchema],
    required: true,
  },
});

pdfSchema.index({ creator: "text", title: "text" });

const Pdf = model<IPdf>("Pdf", pdfSchema);

export default Pdf;
