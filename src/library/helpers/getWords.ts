import Constants from "expo-constants";

import type { Dispatch, SetStateAction } from "react";
import type {
  DefinitionWord,
  FileInfo,
  LoadingData,
} from "../../types/dataTypes";

import parseSseTextToJSON from "../utils/parseSseTextToJSON";

// If platform is web, a File object is supplied, otherwise, an object containing file details is supplied.

const getWords = async (
  file: File | FileInfo,
  dataSetter: Dispatch<SetStateAction<DefinitionWord[]>>,
  loadingSetter: Dispatch<SetStateAction<LoadingData>>,
  errorSetter: Dispatch<SetStateAction<Error | undefined>>
) => {
  try {
    const formData = new FormData();
    // @ts-expect-error Ignore this error, since it's caused by a lack of type definitions for the react native FormData polyfill.
    formData.append("pdf", file);

    const apiUrl = Constants.expoConfig?.extra?.["apiUrl"];
    const url = `${apiUrl}/words`;

    loadingSetter({ loading: true, message: "Calling API" });
    const stream = new XMLHttpRequest();

    let test: undefined | string;

    stream.addEventListener("progress", (e) => {
      const { response } = e.currentTarget as XMLHttpRequest;

      const newData =
        test === undefined ? response : response.replace(test, "");

      const formattedData = parseSseTextToJSON(newData);

      test = response;

      if (formattedData["event"] === "loading") {
        loadingSetter({
          loading: true,
          message: formattedData["data"] ?? "Loading",
        });
      }
      if (formattedData["event"] === "result") {
        if (formattedData["data"])
          dataSetter(JSON.parse(formattedData["data"]));
        loadingSetter({ loading: false });
        stream.abort();
      }
    });

    stream.addEventListener("error", (e) => {
      throw e;
    });

    stream.open("POST", url);

    stream.send(formData);
  } catch (err) {
    if (err instanceof Error) {
      loadingSetter({ loading: false });
      errorSetter(err);
    }
  }
};

export default getWords;
