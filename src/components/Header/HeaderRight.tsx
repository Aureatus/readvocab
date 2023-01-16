import { Text, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { Button } from "react-native";
import type { HomeScreenNavigationProp } from "../../types/navigationTypes";
import UserContext from "../../library/context/UserContext";

const HeaderRight = () => {
  const { navigate } = useNavigation<HomeScreenNavigationProp>();
  const context = useContext(UserContext);
  if (context === null)
    return (
      <View>
        <Text>Error</Text>
      </View>
    );

  const { user, setUser } = context;

  return (
    <View>
      {user ? (
        <View style={styles.container}>
          <Button
            title="logout"
            onPress={() => {
              setUser(null);
            }}
            color={"#f3213d"}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <Button
            title="login"
            onPress={() => {
              navigate("Login");
            }}
          />
          <Button
            title="signup"
            onPress={() => {
              navigate("Signup");
            }}
          />
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
