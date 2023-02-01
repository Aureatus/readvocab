import { getDocumentAsync } from "expo-document-picker";
import { Platform } from "react-native";

import type { FileInfo } from "../../types/dataTypes";

const getFile = async (): Promise<File | FileInfo | undefined> => {
  const fileUpload = await getDocumentAsync({
    type: "application/pdf",
    copyToCacheDirectory: true,
  });

  if (fileUpload.type === "cancel") return;

  if (fileUpload.mimeType === undefined) return;

  if (Platform.OS === "web") return fileUpload.file;

  const fileInfo = {
    uri: fileUpload.uri,
    type: fileUpload.mimeType,
    name: fileUpload.name,
  };

  return fileInfo;
};

export default getFile;
