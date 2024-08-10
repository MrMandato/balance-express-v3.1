import { View, StyleSheet, Text } from "react-native";
import Constants from "expo-constants";

const AppBar = ({ barName }) => {
  return (
    <View style={styles.appBar}>
      <Text style={styles.appBarText}>{barName} </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: "#222",
    paddingTop: Constants.statusBarHeight + 8,
    paddingLeft: 10,
    paddingBottom: 10,
  },
  appBarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default AppBar;
