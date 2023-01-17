import { API_URL } from "@env";

const getSavedWords = async (user: string) => {
  const url = `${API_URL}/words/saved`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${user}`,
    },
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

export default getSavedWords;
