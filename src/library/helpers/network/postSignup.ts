import { API_URL } from "@env";

const postSignup = async (
  email: string,
  password: string,
  confirmPassword: string
) => {
  const url = `${API_URL}/auth/signup`;
  const searchParams = new URLSearchParams();
  searchParams.append("email", email);
  searchParams.append("password", password);
  searchParams.append("confirmPassword", confirmPassword);
  const response = await fetch(url, { body: searchParams, method: "POST" });

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

export default postSignup;
