import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";
import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons";

import type { HomeScreenNavigationProp } from "../../types/navigationTypes";

import useUserContext from "../../library/hooks/useUserContext";

const HeaderRight = () => {
  const { navigate } = useNavigation<HomeScreenNavigationProp>();
  const { user, setUser } = useUserContext();

  return (
    <View>
      {user ? (
        <View style={styles.container}>
          <IconButton
            icon={({ size, color }) => (
              <MaterialCommunityIcon name="logout" size={size} color={color} />
            )}
            iconColor="#f3213d"
            onPress={() => {
              setUser(null);
            }}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <IconButton
            icon={({ size, color }) => (
              <MaterialCommunityIcon name="login" size={size} color={color} />
            )}
            iconColor="#3EB489"
            onPress={() => {
              navigate("Login");
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
