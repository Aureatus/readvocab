import { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Button, HelperText, TextInput, Text } from "react-native-paper";
import signup from "../../library/helpers/signup";
import useUserContext from "../../library/hooks/useUserContext";
import type { SignupProps } from "../../types/navigationTypes";

const Signup = ({ navigation: { goBack, navigate } }: SignupProps) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<Error | null>(null);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<Error | null>(null);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] =
    useState<Error | null>(null);

  const [otherError, setOtherError] = useState<Error | null>(null);

  const { setUser } = useUserContext();

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
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
              setConfirmPasswordError(null);
              if (text.length < 8 && text.length > 0)
                setPasswordError(
                  new Error("Password must have at least 8 characters.")
                );
              if (text !== confirmPassword && confirmPassword.length > 0)
                setConfirmPasswordError(new Error("Passwords don't match."));
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
        <View>
          <TextInput
            label="*Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);

              setConfirmPasswordError(null);
              if (text !== password && text.length > 0)
                setConfirmPasswordError(new Error("Passwords don't match."));
            }}
            autoComplete="password"
            placeholder="securePassword123"
            error={confirmPasswordError instanceof Error}
            secureTextEntry
          />
          <HelperText
            type="error"
            visible={confirmPasswordError instanceof Error}
          >
            {confirmPasswordError?.message}
          </HelperText>
        </View>
        <Button
          mode="contained"
          disabled={!email || !password || !!emailError || !!passwordError}
          onPress={() => {
            signup(
              email,
              password,
              confirmPassword,
              setEmailError,
              setPasswordError,
              setConfirmPasswordError,
              setOtherError,
              setUser,
              goBack
            );
          }}
        >
          Signup
        </Button>
        <HelperText type="info" visible={!email || !password}>
          *These fields are required.
        </HelperText>
        <HelperText type="error" visible={otherError instanceof Error}>
          Unexpected Error : {otherError?.message}
        </HelperText>
      </View>
      <Text variant="headlineMedium">Or</Text>
      <Button mode="contained" uppercase onPress={() => navigate("Login")}>
        Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  inputContainer: {
    maxWidth: 700,
    width: "100%",
    marginTop: Dimensions.get("window").height / 3.5,
  },
});

export default Signup;
