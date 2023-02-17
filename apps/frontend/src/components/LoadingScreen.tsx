import { View, StyleSheet, Dimensions } from "react-native";
import { ProgressBar, Text } from "react-native-paper";

const LoadingScreen = ({ message }: { message: string | undefined }) => {
  return (
    <View style={styles.loadingContainer}>
      <ProgressBar indeterminate style={styles.loadingBar} />
      <Text variant="headlineMedium">{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
  },
  searchBar: {
    margin: 20,
  },
  loadingContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingBar: {
    height: 20,
    width: Dimensions.get("window").width / 1.5,
  },
  noResultsText: {
    alignSelf: "center",
  },
});

export default LoadingScreen;
