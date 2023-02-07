import Constants from "expo-constants";

const getSearchedPDFs = async (searchQuery: string) => {
  const apiUrl = Constants.expoConfig?.extra?.["apiUrl"];
  const url = `${apiUrl}/words/search${
    "?" + new URLSearchParams({ searchTerm: searchQuery })
  }`;
  const response = await fetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    const responseText = await response.text();
    let error;
    try {
      error = JSON.parse(responseText);
    } catch (err) {
      error = responseText;
    }
    const errorMessage = error.message ?? responseText;
    throw Error(errorMessage);
  }

  return await response.json();
};

export default getSearchedPDFs;
