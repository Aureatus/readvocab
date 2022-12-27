import { API_URL } from "@env";
import EventSource from "react-native-sse";

import type { Dispatch, SetStateAction } from "react";
import type { DefinitionWord, LoadingData } from "../../types/dataTypes";
import type { WordFetchEvents } from "../../types/eventTypes";

const getWords = async (
  file: File,
  dataSetter: Dispatch<SetStateAction<DefinitionWord[]>>,
  loadingSetter: Dispatch<SetStateAction<LoadingData>>,
  errorSetter: Dispatch<SetStateAction<Error | undefined>>
) => {
  try {
    const formData = new FormData();
    formData.append("pdf", file);

    const url = `${API_URL}/words`;

    const es = new EventSource<WordFetchEvents>(url, {
      method: "POST",
      body: formData,
    });

    loadingSetter({ loading: true, message: "Calling API" });
    es.addEventListener("loading", (e) => {
      if (e.type !== "loading") return;
      if (e.data === null) return;
      loadingSetter({ loading: true, message: e.data });
    });
    es.addEventListener("result", (e) => {
      if (e.type !== "result") return;
      if (e.data === null) return;
      dataSetter(JSON.parse(e.data));
      es.close();
    });
    es.addEventListener("close", () => {
      loadingSetter({ loading: false });
      es.removeAllEventListeners();
    });
    errorSetter(undefined);
  } catch (err) {
    if (err instanceof Error) errorSetter(err);
  }
};

export default getWords;
