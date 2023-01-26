const removeDuplicates = (wordList: string[]): string[] => {
  return [...new Set(wordList)];
};

export default removeDuplicates;
