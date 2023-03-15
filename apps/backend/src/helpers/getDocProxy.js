import pkg from "pdfjs-dist";

const { getDocument } = pkg;

// @ts-ignore
const getDocProxy = async (file) => {
  const doc = await getDocument({
    data: file,
    useSystemFonts: true,
  }).promise;
  return doc;
};

export default getDocProxy;
