import { FileSystemUploadType, uploadAsync } from "expo-file-system";

const getWordsFromPDF = async (fileData: string | File): Promise<string[]> => {
  const URL = "https://readvocab-api.up.railway.app/wordsFromPDF";
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
export default getWordsFromPDF;
