import { getDocumentAsync } from "expo-document-picker";
import { Platform } from "react-native";

const getFile = async (): Promise<
  File | { uri: string; type: string; name: string } | undefined
> => {
  const fileUpload = await getDocumentAsync({
    type: "application/pdf",
    copyToCacheDirectory: true,
  });

  if (fileUpload.type === "cancel") return;

  if (fileUpload.mimeType === undefined) return;

  if (Platform.OS === "web") return fileUpload.file;

  return {
    uri: fileUpload.uri,
    type: fileUpload.mimeType,
    name: fileUpload.name,
  };
};

export default getFile;
