import { API_URL } from "@env";
import type { DefinitionWord } from "../../../types/dataTypes";

const postSaveWord = async (user: string, word: DefinitionWord) => {
  const url = `${API_URL}/words/save`;
  const response = await fetch(url, {
    body: JSON.stringify(word),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user}`,
    },
  });

  if (!response.ok) {
    const responseText = await response.text();
    let error;
    try {
      error = JSON.parse(responseText);
    } catch (err) {
      error = responseText;
    }
    const errorMessage = error.message ?? responseText;
    throw Error(errorMessage);
  }

  return await response.text();
};

export default postSaveWord;
