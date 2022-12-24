import { getDocumentAsync } from "expo-document-picker";

const getFile = async (): Promise<File | undefined> => {
  const fileUpload = await getDocumentAsync({
    type: "application/pdf",
    copyToCacheDirectory: true,
  });

  if (fileUpload.type === "cancel") return;

  if (fileUpload.mimeType === undefined) return;

  const { lastModified } = fileUpload;

  const fileResponse = await fetch(fileUpload.uri);
  const fileBlob = await fileResponse.blob();
  const file = new File([fileBlob], fileUpload.name, {
    lastModified: lastModified || Date.now(),
    type: fileUpload.mimeType,
  });

  return file;
};

export default getFile;
