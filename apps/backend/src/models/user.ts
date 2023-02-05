import { Schema, model } from "mongoose";
import type { DefinitionWord } from "../types.js";

interface IUser {
  email: string;
  password: string;
  savedWords: DefinitionWord[];
}

const wordDataSchema = new Schema<DefinitionWord>({
  word: String,
  wordClass: String,
  definition: String,
});

const userSchema = new Schema<IUser>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  savedWords: {
    type: [wordDataSchema],
    required: true,
  },
});

const User = model<IUser>("User", userSchema);

export default User;
