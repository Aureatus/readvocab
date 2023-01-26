const punctuationFilter = (wordList: string): string => {
  const invalidCharRegex = /([^\s\w])/g;

  return wordList.replaceAll(invalidCharRegex, " ");
};

export default punctuationFilter;
