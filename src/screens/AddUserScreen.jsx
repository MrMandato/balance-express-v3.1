import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AppBar from "../components/AppBar";
import { useState } from "react";
import firebase from "../database/Firebase";
import { useNavigation } from "@react-navigation/native";

export default function AddUserScreen() {
  const navigation = useNavigation();

  const [state, setState] = useState({
    ci: "",
    nombre: "",
    apellido: "",
    ruta: "",
  });

  const handleChangeText = (nombre, value) => {
    setState({ ...state, [nombre]: value });
  };

  const SaveNewUser = async () => {
    if (state.nombre === "") {
      alert("Porfavor Introduzca los datos");
    } else {
      await firebase.db.collection("users").add({
        ci: state.ci,
        nombre: state.nombre,
        apellido: state.apellido,
        ruta: state.ruta,
      });
      navigation.navigate("UserListStack");
    }
  };

  return (
    <View style={styles.container}>
      <AppBar barName="Añadir Usuario" />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.itemContainer}>
          <TextInput
            style={styles.item}
            placeholder="CI"
            onChangeText={(value) => handleChangeText("ci", value)}
          />
        </View>
        <View style={styles.itemContainer}>
          <TextInput
            style={styles.item}
            placeholder="Nombre"
            onChangeText={(value) => handleChangeText("nombre", value)}
          />
        </View>
        <View style={styles.itemContainer}>
          <TextInput
            style={styles.item}
            placeholder="Apellido"
            onChangeText={(value) => handleChangeText("apellido", value)}
          />
        </View>
        <View style={styles.itemContainer}>
          <TextInput
            style={styles.item}
            placeholder="Ruta"
            onChangeText={(value) => handleChangeText("ruta", value)}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonItem}
            onPress={() => SaveNewUser()}
          >
            <Text style={styles.buttonText}>Guardar Usuario</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#aed6f1",
  },
  scrollContainer: {
    flex: 1,
    marginTop: 15,
  },
  itemContainer: {
    borderWidth: 1.5,
    borderColor: "#000",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginHorizontal: 35,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  item: {
    height: 50,
    fontSize: 18,
  },
  buttonContainer: {
    marginTop: 15,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: "#299dd6",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 1,
    fontSize: 18,
  },
});
