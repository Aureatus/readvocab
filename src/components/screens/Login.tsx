import { useContext, useState } from "react";
import { View, Text } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import UserContext from "../../library/context/UserContext";
import login from "../../library/helpers/login";
import type { LoginProps } from "../../types/navigationTypes";

const Login = ({ navigation: { goBack } }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<Error | null>(null);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<Error | null>(null);

  const [otherError, setOtherError] = useState<Error | null>(null);

  const context = useContext(UserContext);
  if (context === null)
    return (
      <View>
        <Text>Error</Text>
      </View>
    );

  const { setUser } = context;

  return (
    <View>
      <View>
        <TextInput
          label="*Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);

            setEmailError(null);
            if (
              !text.match(
                // Use RFC 5322 Official Standard for email regex
                // eslint-disable-next-line no-control-regex
                /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
              ) &&
              text.length > 0
            )
              setEmailError(new Error("Invalid email format"));
          }}
          autoComplete="email"
          placeholder="example@gmail.com"
          error={emailError instanceof Error}
        />
        <HelperText type="error" visible={emailError instanceof Error}>
          {emailError?.message}
        </HelperText>
      </View>

      <View>
        <TextInput
          label="*Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);

            setPasswordError(null);
            if (text.length < 8 && text.length > 0)
              setPasswordError(
                new Error("Password must have at least 8 characters.")
              );
          }}
          autoComplete="password"
          placeholder="securePassword123"
          error={passwordError instanceof Error}
          secureTextEntry
        />
        <HelperText type="error" visible={passwordError instanceof Error}>
          {passwordError?.message}
        </HelperText>
      </View>
      <Button
        mode="contained"
        disabled={!email || !password || !!emailError || !!passwordError}
        onPress={() => {
          login(email, password, setEmailError, setPasswordError, setUser)
            .then(() => goBack())
            .catch((err) => setOtherError(err));
        }}
      >
        Login
      </Button>
      <HelperText type="info" visible={!email || !password}>
        *Both fields are required.
      </HelperText>
      <HelperText type="error" visible={otherError instanceof Error}>
        Unexpected Error : {otherError?.message}
      </HelperText>
    </View>
  );
};

export default Login;
