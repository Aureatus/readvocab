import { Text, View, SafeAreaView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { useContext } from "react";
import { Button } from "react-native";

import UserContext from "../library/context/UserContext";
import type { HomeScreenNavigationProp } from "../types/navigationTypes";

const Header = ({ color, size }: { color: string; size: number }) => {
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
    <SafeAreaView>
      <View style={styles.container}>
        <Entypo name="book" size={size} color={color} />
        <Text style={styles.title}>Readvocab</Text>
      </View>
      <View>
        {user ? (
          <Button
            title="logout"
            onPress={() => {
              setUser(null);
            }}
          />
        ) : (
          <>
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
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    marginLeft: 14,
  },
});

export default Header;
