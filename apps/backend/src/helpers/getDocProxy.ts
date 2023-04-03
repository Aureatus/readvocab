import pkg, { PDFDocumentProxy } from "pdfjs-dist";

const { getDocument } = pkg;

const getDocProxy = async (file: ArrayBuffer): Promise<PDFDocumentProxy> => {
  const doc = await getDocument({
    data: file,
    useSystemFonts: true,
  }).promise;
  return doc;
};

export default getDocProxy;
