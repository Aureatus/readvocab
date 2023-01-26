import Constants from "expo-constants";

const postLogin = async (email: string, password: string) => {
  const apiUrl = Constants.expoConfig?.extra?.["apiUrl"];
  const url = `${apiUrl}/auth/login`;
  const searchParams = new URLSearchParams();
  searchParams.append("email", email);
  searchParams.append("password", password);
  const response = await fetch(url, {
    body: new URLSearchParams({
      email,
      password,
    }).toString(),
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
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

  return await response.text();
};

export default postLogin;
