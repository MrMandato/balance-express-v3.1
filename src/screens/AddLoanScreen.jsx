import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Button,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import AppBar from "../components/AppBar";
import firebase from "../database/Firebase"; // Asegúrate de que este sea el camino correcto a tu configuración de Firebase

const AddLoanScreen = () => {
  const [amount, setAmount] = useState("");
  const [interest, setInterest] = useState("");
  const [installments, setInstallments] = useState("");
  const [paymentFrequency, setPaymentFrequency] = useState("mensual");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation(); // Hook para la navegación
  const route = useRoute();
  const { userId } = route.params; // Recibir userId de los parámetros de navegación

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const calculateSimulation = () => {
    const principal = parseFloat(amount);
    const rate = parseFloat(interest) / 100;
    const periods = parseInt(installments);

    if (isNaN(principal) || isNaN(rate) || isNaN(periods)) {
      return null;
    }

    const totalAmount = principal * (1 + rate);
    const installmentAmount = totalAmount / periods;

    return {
      totalAmount,
      installmentAmount,
    };
  };

  const handleViewSimulation = () => {
    const simulation = calculateSimulation();
    if (!simulation) {
      Alert.alert(
        "Error",
        "Por favor, completa todos los campos correctamente."
      );
    } else {
      setModalVisible(true);
    }
  };

  const handleSaveLoan = async () => {
    if (!amount || !interest || !installments || !paymentFrequency || !date) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    try {
      const loanRef = await firebase.db.collection("loans").add({
        amount: parseFloat(amount),
        interest: parseFloat(interest),
        installments: parseInt(installments),
        paymentFrequency,
        date: date.toISOString(),
      });

      // Update the user with the loan ID
      await firebase.db.collection("users").doc(userId).update({
        loan: loanRef.id, // Store the loan ID in the user document
      });

      Alert.alert("Éxito", "Préstamo guardado exitosamente.");
      navigation.navigate("UserLists"); // Navegar a la pantalla 'UserList' después de guardar
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al guardar el préstamo.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <AppBar barName="Añadir Préstamo" />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="Monto"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={interest}
            onChangeText={setInterest}
            placeholder="Intereses (%)"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={installments}
            onChangeText={setInstallments}
            placeholder="Número de cuotas"
          />
        </View>

        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.input}>Fecha: {date.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        <View style={styles.selectionContainer}>
          <Text style={styles.label}>Frecuencia de Pago:</Text>
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={[
                styles.pickerOption,
                paymentFrequency === "diario" && styles.pickerSelected,
              ]}
              onPress={() => setPaymentFrequency("diario")}
            >
              <Text>Diario</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pickerOption,
                paymentFrequency === "semanal" && styles.pickerSelected,
              ]}
              onPress={() => setPaymentFrequency("semanal")}
            >
              <Text>Semanal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pickerOption,
                paymentFrequency === "quincenal" && styles.pickerSelected,
              ]}
              onPress={() => setPaymentFrequency("quincenal")}
            >
              <Text>Quincenal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pickerOption,
                paymentFrequency === "mensual" && styles.pickerSelected,
              ]}
              onPress={() => setPaymentFrequency("mensual")}
            >
              <Text>Mensual</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveLoan}>
            <Text style={styles.buttonText}>Guardar Préstamo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.simulateButton}
            onPress={handleViewSimulation}
          >
            <Text style={styles.buttonText}>Ver Simulación</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Simulación del Préstamo</Text>
              {calculateSimulation() && (
                <>
                  <Text>
                    Total a Pagar:{" "}
                    {calculateSimulation().totalAmount.toFixed(2)}
                  </Text>
                  <Text>
                    Cuota: {calculateSimulation().installmentAmount.toFixed(2)}
                  </Text>
                  <Text>Frecuencia: {paymentFrequency}</Text>
                  <Text>Fecha de Inicio: {date.toDateString()}</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#aed6f1",
  },
  scrollContainer: {
    flex: 1,
    margin: 15,
  },
  label: {
    fontSize: 16,
    alignSelf: "center",
    marginTop: 20,
  },
  inputContainer: {
    alignSelf: "center",
  },
  input: {
    borderWidth: 1.2,
    borderColor: "#000",
    padding: 12,
    borderRadius: 5,
    backgroundColor: "#fff",
    width: 280,
    marginTop: 5,
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  pickerOption: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  pickerSelected: {
    borderColor: "#007BFF",
    backgroundColor: "#cce5ff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  saveButton: {
    padding: 15,
    backgroundColor: "#28a745",
    borderRadius: 5,
  },
  simulateButton: {
    padding: 15,
    backgroundColor: "#2980b9",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
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

export default AddLoanScreen;
