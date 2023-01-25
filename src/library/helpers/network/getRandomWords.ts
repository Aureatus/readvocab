import { API_URL } from "@env";

import type { Dispatch, SetStateAction } from "react";
import type { DefinitionWord, LoadingData } from "../../../types/dataTypes";
import parseSseTextToJSON from "../../utils/parseSseTextToJSON";

const getRandomWords = async (
  dataSetter: Dispatch<SetStateAction<DefinitionWord[]>>,
  loadingSetter: Dispatch<SetStateAction<LoadingData>>,
  errorSetter: Dispatch<SetStateAction<Error | undefined>>
) => {
  try {
    const url = `${API_URL}/words/random`;

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

    stream.open("GET", url);

    stream.send();
  } catch (err) {
    if (err instanceof Error) errorSetter(err);
  }
};

export default getRandomWords;
