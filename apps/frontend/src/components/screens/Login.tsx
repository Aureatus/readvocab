import { View, StyleSheet, Dimensions } from "react-native";
import {
  Button,
  HelperText,
  TextInput,
  Text,
  Surface,
  Divider,
} from "react-native-paper";

import type { LoginProps } from "../../types/navigationTypes";

import login from "../../library/helpers/login";
import useUserContext from "../../library/hooks/context/useUserContext";
import useLoginData from "../../library/hooks/useLoginData";

const Login = ({ navigation: { goBack, navigate } }: LoginProps) => {
  const {
    email,
    setEmail,
    emailError,
    setEmailError,
    password,
    setPassword,
    passwordError,
    setPasswordError,
    setOtherError,
    loading,
    setLoading,
  } = useLoginData();

  const { setUser } = useUserContext();

  return (
    <View style={styles.container}>
      <Surface style={styles.formContainer}>
        <View style={styles.bottomMargin}>
          <TextInput
            mode="outlined"
            label="*Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError(null);
              if (
                !text.match(
                  // Use RFC 5322 Official Standard for email regex
                  // eslint-disable-next-line no-control-regex
                  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
                ) &&
                text.length > 0
              )
                setEmailError(new Error("Invalid email format"));
            }}
            autoComplete="email"
            placeholder="example@gmail.com"
            error={emailError instanceof Error}
          />
          <HelperText
            type="error"
            visible={emailError instanceof Error}
            style={styles.errorMessages}
          >
            {emailError?.message}
          </HelperText>
        </View>

        <View style={styles.bottomMargin}>
          <TextInput
            mode="outlined"
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
          <HelperText
            type="error"
            visible={passwordError instanceof Error}
            style={styles.errorMessages}
          >
            {passwordError?.message}
          </HelperText>
        </View>

        <Button
          mode="contained"
          loading={loading}
          disabled={
            !email || !password || !!emailError || !!passwordError || loading
          }
          onPress={() => {
            login(
              email,
              password,
              setEmailError,
              setPasswordError,
              setOtherError,
              setLoading,
              setUser,
              goBack
            );
          }}
          style={styles.bottomMargin}
        >
          Login
        </Button>
        <HelperText
          type="info"
          visible={!email || !password}
          style={styles.bottomMargin}
        >
          *These fields are required.
        </HelperText>
        <View style={[styles.orContainer, styles.bottomMargin]}>
          <Divider bold style={styles.divider} />
          <Text variant="headlineMedium" style={styles.orText}>
            Or
          </Text>
          <Divider bold style={styles.divider} />
        </View>
        <Button
          mode="text"
          uppercase
          onPress={() => navigate("Signup")}
          style={styles.signupLink}
        >
          Sign up
        </Button>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    display: "flex",
    width: "100%",
    maxWidth: 800,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  errorMessages: {
    minHeight: 28,
  },
  orContainer: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  orText: {
    paddingHorizontal: 10,
  },
  divider: {
    width: Dimensions.get("window").width / 6,
  },
  signupLink: {
    width: "30%",
    alignSelf: "center",
  },
  bottomMargin: {
    marginBottom: 20,
  },
});

export default Login;
