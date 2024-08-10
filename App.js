import { View } from "react-native";
import Main from "./src/components/Main";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "Warning: TextElement: Support for defaultProps will be removed from function components in a future major release.",
]);

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <Main />
    </View>
  );
}
