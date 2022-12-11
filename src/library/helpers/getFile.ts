import { getDocumentAsync } from "expo-document-picker";

const getFile = async (): Promise<string | undefined> => {
  const fileUpload = await getDocumentAsync({
    type: "application/pdf",
    copyToCacheDirectory: true,
  });

  if (fileUpload.type === "cancel") return;

  if (fileUpload.mimeType === undefined) return;

  return fileUpload.uri;
};

export default getFile;
