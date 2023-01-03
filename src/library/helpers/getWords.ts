import { API_URL } from "@env";

import type { Dispatch, SetStateAction } from "react";
import type {
  DefinitionWord,
  FileInfo,
  LoadingData,
} from "../../types/dataTypes";

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

    const url = `${API_URL}/words`;

    loadingSetter({ loading: true, message: "Calling API" });
    const stream = new XMLHttpRequest();

    let test: undefined | string;

    stream.addEventListener("progress", (e) => {
      const { response } = e.currentTarget as XMLHttpRequest;

      const newData =
        test === undefined ? response : response.replace(test, "");

      const responseArray = newData
        .trim()
        .split(/\n\n/)
        .filter((str: string) => str);

      const responseObjectArray = responseArray.map((data: string) => {
        return data.split(/\n/).map((a) => {
          const splitArray = a.split(/(?<=^[^:]*):/);
          const key = splitArray[0]?.trim();
          const value = splitArray[1]?.trim();

          if (key === undefined) return;

          const object = { [key]: value };
          return object;
        });
      });

      const usefulData = responseObjectArray.filter(
        (
          b: {
            [key: string]: string;
          }[]
        ) => {
          // eslint-disable-next-line dot-notation
          const retryCheck = b.find((obj) => !obj["retry"]); // Eslint disabled as currently there is an ESlint typescript config regarding array accessing.
          const endCheck = !b.find((obj) => Object.values(obj).includes("end"));
          if (retryCheck && endCheck) return true;
          else return false;
        }
      );

      const flattenedData = usefulData.flat();
      const obj1 = flattenedData[0];
      const obj2 = flattenedData[1];
      const formattedData = { ...obj1, ...obj2 };
      test = response;

      if (formattedData.event === "loading") {
        loadingSetter({ loading: true, message: formattedData.data });
      }
      if (formattedData.event === "result") {
        dataSetter(JSON.parse(formattedData.data));
        stream.abort();
      }
    });

    stream.addEventListener("error", (e) => {
      throw e;
    });

    stream.addEventListener("loadend", () => loadingSetter({ loading: false }));

    stream.open("POST", url);

    stream.send(formData);
  } catch (err) {
    if (err instanceof Error) errorSetter(err);
  }
};

export default getWords;
