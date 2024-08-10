import { View, StyleSheet } from "react-native";
import Navigation from "../Navigation";

const Main = () => {
  return (
    <View style={styles.mainContainer}>
      <Navigation />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});

export default Main;
