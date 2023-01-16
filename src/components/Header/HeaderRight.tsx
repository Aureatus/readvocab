import { Text, View, SafeAreaView } from "react-native";
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
    <SafeAreaView>
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

export default HeaderRight;
