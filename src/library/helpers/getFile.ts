import { getDocumentAsync } from "expo-document-picker";

const getFile = async (): Promise<string | File | undefined> => {
  const fileUpload = await getDocumentAsync({
    type: "application/pdf",
    copyToCacheDirectory: true,
  });

  if (fileUpload.type === "cancel") return;

  if (fileUpload.mimeType === undefined) return;

  if (fileUpload.file) return fileUpload.file;

  return fileUpload.uri;
};

export default getFile;
