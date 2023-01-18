import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper";
import type { HomeScreenNavigationProp } from "../../types/navigationTypes";
import useUserContext from "../../library/hooks/useUserContext";

const HeaderRight = () => {
  const { navigate } = useNavigation<HomeScreenNavigationProp>();
  const { user, setUser } = useUserContext();

  return (
    <View>
      {user ? (
        <View style={styles.container}>
          <Button
            mode="contained"
            onPress={() => {
              setUser(null);
            }}
            color={"#f3213d"}
          >
            logout
          </Button>
        </View>
      ) : (
        <View style={styles.container}>
          <Button
            mode="contained"
            onPress={() => {
              navigate("Login");
            }}
          >
            login
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              navigate("Signup");
            }}
          >
            signup
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    gap: 30,
  },
});

export default HeaderRight;
