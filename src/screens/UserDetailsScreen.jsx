import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Button,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Firebase from "../database/Firebase";
import AppBar from "../components/AppBar";

const UserDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params; // Recibir userId de los parámetros de navegación

  const initialState = {
    id: "",
    ci: "",
    nombre: "",
    apellido: "",
    ruta: "",
  };
  const [user, setUser] = useState();
  const [loanDetails, setLoanDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const getUserById = async (id) => {
    const dbRef = Firebase.db.collection("users").doc(id);
    const doc = await dbRef.get();
    const user = doc.data();
    setUser({
      ...user,
      id: doc.id,
    });

    // Fetch loan details if loan ID exists
    if (user.loan) {
      const loanRef = Firebase.db.collection("loans").doc(user.loan);
      const loanDoc = await loanRef.get();
      setLoanDetails(loanDoc.data());
    }

    setLoading(false);
  };

  useEffect(() => {
    getUserById(userId);
  }, [userId]);

  const handleChangeText = (nombre, value) => {
    setUser({ ...user, [nombre]: value });
  };

  const deleteUser = async () => {
    const dbRef = Firebase.db.collection("users").doc(userId);
    await dbRef.delete();
    navigation.navigate("UserLists");
  };

  const updateUser = async () => {
    const dbRef = Firebase.db.collection("users").doc(user.id);
    await dbRef.set({
      ci: user.ci,
      nombre: user.nombre,
      apellido: user.apellido,
      ruta: user.ruta,
    });
    setUser(initialState);
    navigation.navigate("UserLists");
  };

  const openConfirmationAlert = () => {
    Alert.alert("Eliminar Usuario", "Estas Seguro?", [
      { text: "Si", onPress: () => deleteUser() },
      { text: "No", onPress: () => [] },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size="large" color="#9e9e9e" />
      </View>
    );
  }

  return (
    <View style={styles.principal}>
      <AppBar barName="Detalles de Usuario" />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.itemContainer}>
          <TextInput
            style={styles.item}
            placeholder="CI"
            value={user.ci}
            onChangeText={(value) => handleChangeText("ci", value)}
          />
        </View>
        <View style={styles.itemContainer}>
          <TextInput
            style={styles.item}
            placeholder="Nombre"
            value={user.nombre}
            onChangeText={(value) => handleChangeText("nombre", value)}
          />
        </View>
        <View style={styles.itemContainer}>
          <TextInput
            style={styles.item}
            placeholder="Apellido"
            value={user.apellido}
            onChangeText={(value) => handleChangeText("apellido", value)}
          />
        </View>
        <View style={styles.itemContainer}>
          <TextInput
            style={styles.item}
            placeholder="Ruta"
            value={user.ruta}
            onChangeText={(value) => handleChangeText("ruta", value)}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonItemU}
            onPress={() => updateUser()}
          >
            <Text style={styles.buttonText}>Actualizar Usuario</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonItemD}
            onPress={() => openConfirmationAlert()}
          >
            <Text style={styles.buttonText}>Eliminar Usuario</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.addLoanContainer}>
          <TouchableOpacity
            style={styles.addLoanButton}
            onPress={() => navigation.navigate("AddLoan", { userId })}
          >
            <Text style={styles.buttonText}>Agregar Préstamo</Text>
          </TouchableOpacity>
          {loanDetails && (
            <TouchableOpacity
              a
              style={styles.addLoanButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonText}>Ver Préstamo</Text>
            </TouchableOpacity>
          )}
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Detalles del Préstamo</Text>
              {loanDetails && (
                <>
                  <Text>Monto: {loanDetails.amount}</Text>
                  <Text>Intereses: {loanDetails.interest}%</Text>
                  <Text>Cuotas: {loanDetails.installments}</Text>
                  <Text>Frecuencia: {loanDetails.paymentFrequency}</Text>
                  <Text>
                    Fecha de Inicio: {new Date(loanDetails.date).toDateString()}
                  </Text>
                </>
              )}
              <Button title="Cerrar" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  principal: {
    flex: 1,
    backgroundColor: "#aed6f1",
  },
  scrollContainer: {
    flex: 1,
    marginTop: 35,
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
  indicatorContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: "#aed6f1",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 25,
    justifyContent: "center",
    marginTop: 25,
  },
  buttonItemU: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: "#45b39d",
  },
  buttonItemD: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: "#e74c3c",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  addLoanContainer: {
    marginTop: 25,
    alignSelf: "center",
  },
  addLoanButton: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: "#2980b9",
    marginTop: 15,
    marginBottom: 15,
    alignSelf: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default UserDetailsScreen;
