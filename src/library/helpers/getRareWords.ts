import { FileSystemUploadType, uploadAsync } from "expo-file-system";

import type { DefinitionWord } from "../../types/dataTypes";

const getRareWords = async (
  fileData: string | File
): Promise<DefinitionWord[]> => {
  const URL = "https://readvocab-backend-production.up.railway.app/words";
  if (fileData instanceof File) {
    const formData = new FormData();
    formData.append("pdf", fileData);
    const response = await fetch(URL, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data;
  } else {
    const response = await uploadAsync(URL, fileData, {
      fieldName: "pdf",
      httpMethod: "POST",
      uploadType: FileSystemUploadType.MULTIPART,
    });
    const data = JSON.parse(response.body);
    return data;
  }
};
export default getRareWords;
