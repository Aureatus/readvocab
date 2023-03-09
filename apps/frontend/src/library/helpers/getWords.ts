import Constants from "expo-constants";

import type { FileInfo } from "../../types/dataTypes";

// If platform is web, a File object is supplied, otherwise, an object containing file details is supplied.

const getWords = async (file: File | FileInfo) => {
  const formData = new FormData();
  // @ts-expect-error Ignore this error, since it's caused by a lack of type definitions for the react native FormData polyfill.
  formData.append("pdf", file);

  const apiUrl = Constants.expoConfig?.extra?.["apiUrl"];
  const url = `${apiUrl}/words`;

  const response = await fetch(url, {
    method: "POST",
    body: formData,
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

  return await response.json();
};

export default getWords;
