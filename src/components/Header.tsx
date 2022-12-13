import { Text, View, SafeAreaView, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";

const Header = ({ color, size }: { color: string; size: number }) => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Entypo name="book" size={size} color={color} />
        <Text style={styles.title}>Readvocab</Text>
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
